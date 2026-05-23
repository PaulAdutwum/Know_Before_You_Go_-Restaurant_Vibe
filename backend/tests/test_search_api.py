"""
Integration tests for the /api/v1/search endpoint.

No real API calls are made — Google Places and OpenAI are both mocked.
This is exactly how CI/CD should run: free, fast, no external dependencies.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock
from app.main import app


# Reusable mock restaurant from Google Places
MOCK_PLACE = {
    "name": "Test Sushi Boston",
    "rating": 4.5,
    "address": "10 Test St, Boston, MA 02101",
    "place_id": "test_place_123",
    "total_ratings": 200,
    "lat": 42.3601,
    "lng": -71.0589,
    "photo_url": "https://example.com/photo1.jpg",
    "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
    "website": "https://testsushi.com",
}

# Reusable mock OpenAI analysis
MOCK_ANALYSIS = {
    "trueSentiment": "90% Very Positive",
    "vibeDescription": "Intimate and modern with soft lighting and a relaxed crowd.",
    "bestFor": ["Date Night", "Solo Dining"],
    "skipIf": ["Large Groups"],
    "mustTryDishes": ["Dragon Roll", "Miso Soup"],
    "commonComplaints": ["Can get busy on weekends"],
    "neighborhoodNote": "Downtown Boston — busy, well-lit, safe to walk at night near Faneuil Hall.",
}


@pytest.mark.asyncio
async def test_search_returns_200_with_results():
    with patch("app.api.search.google_places") as mock_gp, \
         patch("app.api.search.review_scraper") as mock_rs, \
         patch("app.services.claude_analyzer.get_client", return_value=None):

        mock_gp.find_restaurants = AsyncMock(return_value=[MOCK_PLACE])
        mock_rs.scrape_reviews = AsyncMock(return_value=[])

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/v1/search?location=sushi+in+Boston")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1


@pytest.mark.asyncio
async def test_search_result_has_required_fields():
    with patch("app.api.search.google_places") as mock_gp, \
         patch("app.api.search.review_scraper") as mock_rs, \
         patch("app.services.claude_analyzer.get_client", return_value=None):

        mock_gp.find_restaurants = AsyncMock(return_value=[MOCK_PLACE])
        mock_rs.scrape_reviews = AsyncMock(return_value=[])

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/v1/search?location=sushi+in+Boston")

    restaurant = response.json()[0]
    required_fields = [
        "name", "rating", "trueSentiment", "address",
        "place_id", "photos", "website", "bestFor", "skipIf",
        "mustTryDishes", "commonComplaints",
    ]
    for field in required_fields:
        assert field in restaurant, f"Missing field: {field}"


@pytest.mark.asyncio
async def test_search_passes_through_google_data():
    with patch("app.api.search.google_places") as mock_gp, \
         patch("app.api.search.review_scraper") as mock_rs, \
         patch("app.services.claude_analyzer.get_client", return_value=None):

        mock_gp.find_restaurants = AsyncMock(return_value=[MOCK_PLACE])
        mock_rs.scrape_reviews = AsyncMock(return_value=[])

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/v1/search?location=sushi+in+Boston")

    r = response.json()[0]
    assert r["name"] == "Test Sushi Boston"
    assert r["rating"] == 4.5
    assert r["address"] == "10 Test St, Boston, MA 02101"
    assert r["website"] == "https://testsushi.com"
    assert len(r["photos"]) == 2


@pytest.mark.asyncio
async def test_search_returns_empty_list_for_no_results():
    with patch("app.api.search.google_places") as mock_gp:
        mock_gp.find_restaurants = AsyncMock(return_value=[])
        mock_gp.search_by_name = AsyncMock(return_value=[])

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/v1/search?location=xyznonexistentplace")

    assert response.status_code == 200
    assert response.json() == []


@pytest.mark.asyncio
async def test_search_requires_location_param():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/api/v1/search")

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_search_handles_multiple_restaurants():
    places = [dict(MOCK_PLACE, name=f"Restaurant {i}", place_id=f"id_{i}") for i in range(5)]

    with patch("app.api.search.google_places") as mock_gp, \
         patch("app.api.search.review_scraper") as mock_rs, \
         patch("app.services.claude_analyzer.get_client", return_value=None):

        mock_gp.find_restaurants = AsyncMock(return_value=places)
        mock_gp.search_by_name = AsyncMock(return_value=places)
        mock_rs.scrape_reviews = AsyncMock(return_value=[])

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.get("/api/v1/search?location=sushi+in+Boston&max_results=5")

    assert response.status_code == 200
    assert len(response.json()) == 5
