"""
Search API Endpoint

Pipeline:
1. Google Places API — find restaurants, get reviews, photos, website, address
2. Claude API — analyze reviews in parallel for all restaurants at once
3. Return merged result: Google data + Claude insights
"""

import asyncio
import logging
from fastapi import APIRouter, HTTPException, Query
from typing import List
from math import radians, cos, sin, asin, sqrt

from app.models.restaurant import RestaurantResponse
from app.services.google_places import GooglePlacesService
from app.services.review_scraper import ReviewScraper
from app.services.claude_analyzer import analyze_restaurant

router = APIRouter()
google_places = GooglePlacesService()
review_scraper = ReviewScraper()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> str:
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    distance_miles = 2 * asin(sqrt(a)) * 3956
    if distance_miles < 0.1:
        return f"{int(distance_miles * 5280)} ft"
    elif distance_miles < 10:
        return f"{distance_miles:.1f} mi"
    return f"{int(distance_miles)} mi"


def detect_restaurant_name_query(query: str) -> bool:
    query_lower = query.lower().strip()
    query_words = query_lower.split()

    restaurant_indicators = [
        "'s " in query_lower,
        query.startswith("The "),
        query.startswith("Papa "),
        query.startswith("Mama "),
        "restaurant" in query_lower,
        "cafe" in query_lower,
        "bistro" in query_lower,
        "kitchen" in query_lower,
        "grill" in query_lower,
        "tavern" in query_lower,
        "house" in query_lower and len(query_words) > 1,
        "inn" in query_lower,
        "diner" in query_lower,
        "pizzeria" in query_lower,
        "trattoria" in query_lower,
        "steakhouse" in query_lower,
    ]
    location_indicators = [
        " in " in query_lower,
        " near " in query_lower,
        " at " in query_lower,
        " around " in query_lower,
        query_lower.startswith("pizza "),
        query_lower.startswith("sushi "),
        query_lower.startswith("burger "),
        query_lower.startswith("italian "),
        query_lower.startswith("chinese "),
        query_lower.startswith("mexican "),
        query_lower.startswith("thai "),
        query_lower.startswith("indian "),
        query_lower.startswith("japanese "),
        query_lower.startswith("coffee "),
    ]

    restaurant_score = sum(restaurant_indicators)
    location_score = sum(location_indicators)

    if query.istitle() and 2 <= len(query_words) <= 4 and location_score == 0:
        restaurant_score += 2

    if restaurant_score > location_score:
        return True
    if location_score > restaurant_score:
        return False
    return query.istitle() and len(query_words) <= 5


async def enrich_restaurant(resto: dict, user_lat: float, user_lng: float) -> RestaurantResponse:
    """
    Fetch reviews then call Claude to analyze — all in one async task per restaurant.
    These run concurrently for all restaurants via asyncio.gather().
    """
    # Get reviews
    reviews = await review_scraper.scrape_reviews(resto["place_id"])
    review_texts = [r.text for r in reviews if r.text]

    # Claude analysis (or fallback if no API key)
    insights = await analyze_restaurant(
        name=resto["name"],
        address=resto.get("address", ""),
        rating=resto.get("rating", 0.0),
        reviews=review_texts,
    )

    # Distance calculation
    distance = None
    if user_lat and user_lng and resto.get("lat") and resto.get("lng"):
        distance = calculate_distance(user_lat, user_lng, resto["lat"], resto["lng"])

    return RestaurantResponse(
        name=resto["name"],
        rating=resto.get("rating", 0.0),
        trueSentiment=insights.get("trueSentiment", "N/A"),
        vibeCheck=[],
        vibeDescription=insights.get("vibeDescription"),
        bestFor=insights.get("bestFor", []),
        skipIf=insights.get("skipIf", []),
        mustTryDishes=insights.get("mustTryDishes", []),
        commonComplaints=insights.get("commonComplaints", []),
        neighborhoodNote=insights.get("neighborhoodNote"),
        address=resto.get("address"),
        place_id=resto.get("place_id"),
        distance=distance,
        lat=resto.get("lat"),
        lng=resto.get("lng"),
        photo_url=resto.get("photo_url"),
        photos=resto.get("photos", []),
        website=resto.get("website"),
    )


@router.get("/search", response_model=List[RestaurantResponse])
async def search_restaurants(
    location: str = Query(..., min_length=2),
    max_results: int = Query(10, ge=1, le=20),
    user_lat: float = Query(None),
    user_lng: float = Query(None),
):
    try:
        logger.info("Search: '%s'", location)
        is_name_search = detect_restaurant_name_query(location)

        # Step 1: Google Places — get restaurants with photos, website, address
        try:
            if is_name_search:
                basic_restaurants = await google_places.search_by_name(location, max_results)
                if not basic_restaurants:
                    basic_restaurants = await google_places.find_restaurants(location, max_results)
            else:
                basic_restaurants = await google_places.find_restaurants(location, max_results)
        except Exception as e:
            logger.error("Google Places error: %s", e)
            raise HTTPException(status_code=502, detail="Could not reach Google Places API")

        if not basic_restaurants:
            return []

        # Step 2: Fire all Claude analyses in parallel
        tasks = [
            enrich_restaurant(resto, user_lat, user_lng)
            for resto in basic_restaurants
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        enriched = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                logger.error("Failed to enrich %s: %s", basic_restaurants[i]["name"], result)
            else:
                enriched.append(result)

        if not enriched:
            raise HTTPException(status_code=404, detail="No restaurants found")

        logger.info("Returning %d restaurants", len(enriched))
        return enriched

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Search error: %s", e)
        raise HTTPException(status_code=500, detail=str(e))
