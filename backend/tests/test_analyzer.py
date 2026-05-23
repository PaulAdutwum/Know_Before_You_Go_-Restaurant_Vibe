"""
Unit tests for claude_analyzer.py

These tests never hit the real OpenAI API.
The OpenAI client is mocked so tests are free, fast, and deterministic.
"""

import json
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.claude_analyzer import analyze_restaurant, _fallback


# --- Fallback tests (no mocking needed) ---

def test_fallback_very_positive():
    result = _fallback("Joe's Pizza", 4.6)
    assert result["trueSentiment"] == "92% Very Positive"
    assert result["vibeDescription"] is None
    assert result["bestFor"] == []
    assert result["skipIf"] == []
    assert result["mustTryDishes"] == []
    assert result["commonComplaints"] == []
    assert result["neighborhoodNote"] is None


def test_fallback_positive():
    result = _fallback("Corner Bistro", 3.5)
    assert "Positive" in result["trueSentiment"]


def test_fallback_mixed():
    result = _fallback("Meh Diner", 2.2)
    assert "Mixed" in result["trueSentiment"]


def test_fallback_negative():
    result = _fallback("Bad Burgers", 1.5)
    assert "Negative" in result["trueSentiment"]


def test_fallback_caps_at_100():
    result = _fallback("Perfect Place", 5.0)
    score = int(result["trueSentiment"].split("%")[0])
    assert score <= 100


# --- Unit tests with mocked OpenAI ---

MOCK_OPENAI_RESPONSE = {
    "trueSentiment": "88% Very Positive",
    "vibeDescription": "Lively and energetic with dim lighting and a buzzy crowd.",
    "bestFor": ["Date Night", "Groups 4+"],
    "skipIf": ["Quiet Conversation"],
    "mustTryDishes": ["Lobster Roll", "Clam Chowder"],
    "commonComplaints": ["Service slow on weekends"],
    "neighborhoodNote": "South End — trendy, walkable, safe at night near SoWa market.",
}


def _make_mock_response(content: dict):
    """Build a fake OpenAI response object."""
    message = MagicMock()
    message.content = json.dumps(content)
    choice = MagicMock()
    choice.message = message
    response = MagicMock()
    response.choices = [choice]
    return response


@pytest.mark.asyncio
async def test_analyze_restaurant_success():
    mock_response = _make_mock_response(MOCK_OPENAI_RESPONSE)

    with patch("app.services.claude_analyzer.get_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create = AsyncMock(return_value=mock_response)
        mock_get_client.return_value = mock_client

        result = await analyze_restaurant(
            name="Test Restaurant",
            address="123 Main St, Boston MA",
            rating=4.4,
            reviews=["Amazing food!", "Great vibe, loved the lobster roll."],
        )

    assert result["trueSentiment"] == "88% Very Positive"
    assert result["vibeDescription"] == "Lively and energetic with dim lighting and a buzzy crowd."
    assert "Date Night" in result["bestFor"]
    assert "Lobster Roll" in result["mustTryDishes"]
    assert result["neighborhoodNote"] is not None


@pytest.mark.asyncio
async def test_analyze_falls_back_when_no_client():
    with patch("app.services.claude_analyzer.get_client", return_value=None):
        result = await analyze_restaurant(
            name="No Key Restaurant",
            address="456 Oak Ave",
            rating=4.0,
            reviews=["Good food."],
        )

    assert "Positive" in result["trueSentiment"]
    assert result["vibeDescription"] is None


@pytest.mark.asyncio
async def test_analyze_falls_back_with_no_reviews():
    with patch("app.services.claude_analyzer.get_client") as mock_get_client:
        mock_get_client.return_value = MagicMock()

        result = await analyze_restaurant(
            name="Empty Reviews Place",
            address="789 Elm St",
            rating=3.8,
            reviews=[],
        )

    assert "Positive" in result["trueSentiment"]
    assert result["vibeDescription"] is None


@pytest.mark.asyncio
async def test_analyze_falls_back_on_invalid_json():
    with patch("app.services.claude_analyzer.get_client") as mock_get_client:
        mock_client = MagicMock()
        bad_response = MagicMock()
        bad_response.choices = [MagicMock()]
        bad_response.choices[0].message.content = "not valid json at all"
        mock_client.chat.completions.create = AsyncMock(return_value=bad_response)
        mock_get_client.return_value = mock_client

        result = await analyze_restaurant(
            name="Bad JSON Place",
            address="999 Test Rd",
            rating=4.1,
            reviews=["Some review text."],
        )

    assert "Positive" in result["trueSentiment"]
    assert result["vibeDescription"] is None


@pytest.mark.asyncio
async def test_analyze_falls_back_on_api_error():
    with patch("app.services.claude_analyzer.get_client") as mock_get_client:
        mock_client = MagicMock()
        mock_client.chat.completions.create = AsyncMock(
            side_effect=Exception("API timeout")
        )
        mock_get_client.return_value = mock_client

        result = await analyze_restaurant(
            name="Timeout Place",
            address="1 Error St",
            rating=3.5,
            reviews=["Nice spot."],
        )

    assert "Positive" in result["trueSentiment"]
