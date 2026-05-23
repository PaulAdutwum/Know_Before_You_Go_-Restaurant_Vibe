"""
Review Scraper — fetches Google Places reviews for a restaurant.
"""

import logging
from typing import List
from app.models.restaurant import Review
from app.services.google_places import GooglePlacesService

logger = logging.getLogger(__name__)


class ReviewScraper:
    def __init__(self):
        self.google_places = GooglePlacesService()

    async def scrape_reviews(self, place_id: str, max_reviews: int = 5) -> List[Review]:
        """Fetch up to 5 Google Places reviews for a restaurant."""
        try:
            place_details = await self.google_places.get_place_details(place_id)
            google_reviews = place_details.get("reviews", [])

            reviews = []
            for review_data in google_reviews[:max_reviews]:
                raw_date = review_data.get("time")
                reviews.append(Review(
                    text=review_data.get("text", ""),
                    rating=review_data.get("rating"),
                    author=review_data.get("author_name"),
                    date=str(raw_date) if raw_date is not None else None,
                ))

            logger.info("Scraped %d reviews for place_id: %s", len(reviews), place_id)
            return reviews

        except Exception as e:
            logger.error("Error scraping reviews for %s: %s", place_id, e)
            return []
