"""
AI Analyzer — powered by OpenAI gpt-4o-mini

Replaces the NLP pipeline. One call per restaurant, all fired in parallel.
Returns structured JSON: sentiment, vibe, situation chips, dishes, complaints, neighborhood.
"""

import json
import logging
from typing import List, Dict, Optional
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

_client: Optional[AsyncOpenAI] = None


def get_client() -> Optional[AsyncOpenAI]:
    global _client
    if _client is None and settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key_here":
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


SYSTEM_PROMPT = """You are a sharp, opinionated food and travel writer analyzing restaurant reviews.
Your job: give people the real picture so they know exactly what to expect before walking in.
Return accurate JSON only — vivid, specific, and grounded in what reviewers actually said.
Never use filler phrases like 'great atmosphere', 'nice place', or 'wonderful experience'."""

USER_PROMPT = """Restaurant: {name}
Address: {address}
Google Rating: {rating}/5.0

Reviews:
{reviews}

Return ONLY this JSON — no extra text:
{{
  "trueSentiment": "82% Positive",
  "vibeDescription": "Describe what it actually feels like to be inside — 2 to 3 sentences covering the energy, noise level, lighting, crowd type, and overall feel. Be specific and vivid. Pull real details from the reviews.",
  "bestFor": ["Date Night", "Groups 4+"],
  "skipIf": ["Quiet Conversation"],
  "mustTryDishes": ["Lobster Roll", "Clam Chowder"],
  "commonComplaints": ["Service slow on weekends", "Limited parking"],
  "neighborhoodNote": "Describe the neighborhood in 2 sentences. Mention what the area feels like (lively, quiet, touristy, local), whether it is safe to walk at night, and name 1 or 2 real nearby landmarks or streets worth knowing."
}}

Rules:
- trueSentiment: compute a realistic % from the actual review content. Labels: Very Positive (85%+), Positive (65-84%), Mixed (40-64%), Negative (<40%)
- vibeDescription: 2-3 sentences, vivid and specific — describe noise level, lighting, crowd energy, whether it feels intimate or open. Must reference what reviewers experienced, not generic restaurant descriptions
- bestFor: 2-3 short chips (e.g. "Date Night", "Groups 6+", "Business Lunch", "Quick Bite", "Family Dinner", "Solo Dining", "Late Night")
- skipIf: 1-2 honest chips for when this place is a bad fit
- mustTryDishes: only real food or drink items explicitly named in the reviews — empty [] if none mentioned by name
- commonComplaints: specific issues directly from the reviews — empty [] if overwhelmingly positive
- neighborhoodNote: 2 sentences — neighborhood character, nighttime feel, and 1-2 real nearby landmarks or cross streets"""


async def analyze_restaurant(
    name: str,
    address: str,
    rating: float,
    reviews: List[str],
) -> Dict:
    """
    Analyze one restaurant. Called in parallel for all restaurants via asyncio.gather().
    Falls back gracefully if no API key is configured.
    """
    client = get_client()
    if not client:
        logger.warning("OpenAI not configured — fallback for %s", name)
        return _fallback(name, rating)

    if not reviews:
        logger.info("No reviews for %s — fallback", name)
        return _fallback(name, rating)

    reviews_text = "\n".join(f'{i + 1}. "{r}"' for i, r in enumerate(reviews[:5]))

    prompt = USER_PROMPT.format(
        name=name,
        address=address or "Unknown",
        rating=rating,
        reviews=reviews_text,
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            max_tokens=600,
            temperature=0.3,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content.strip()
        data = json.loads(raw)
        logger.info("AI analysis done: %s", name)
        return data

    except json.JSONDecodeError as e:
        logger.error("Bad JSON from OpenAI for %s: %s", name, e)
        return _fallback(name, rating)
    except Exception as e:
        logger.error("OpenAI error for %s: %s", name, e)
        return _fallback(name, rating)


def _fallback(name: str, rating: float) -> Dict:
    """Used when OpenAI is not configured or fails. App stays functional."""
    score = min(100, int(rating / 5.0 * 100))
    label = (
        "Very Positive" if score >= 85
        else "Positive" if score >= 65
        else "Mixed" if score >= 40
        else "Negative"
    )
    return {
        "trueSentiment": f"{score}% {label}",
        "vibeDescription": None,
        "bestFor": [],
        "skipIf": [],
        "mustTryDishes": [],
        "commonComplaints": [],
        "neighborhoodNote": None,
    }
