"""
Review Scraper Service

Scrapes restaurant reviews from various sources.
For Phase 1, we'll use Google Places reviews. In production, this would
be extended to scrape from Yelp, TripAdvisor, etc.
"""

import logging
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.restaurant import Review
from app.services.google_places import GooglePlacesService

logger = logging.getLogger(__name__)


class ReviewScraper:
    """Service for scraping restaurant reviews"""
    
    def __init__(self):
        self.google_places = GooglePlacesService()
    
    def get_reviews_from_db(self, place_id: str, db_session, max_age_days: int = 7) -> Optional[List]:
        """
        Get reviews from database cache
        
        Args:
            place_id: Google Places ID
            db_session: Database session
            max_age_days: Maximum age of cached reviews in days
            
        Returns:
            List of Review objects from database, or None if cache is stale/missing
        """
        from app.models.database import Restaurant, Review as DBReview
        
        try:
            # Find restaurant by place_id
            restaurant = db_session.query(Restaurant).filter(
                Restaurant.place_id == place_id
            ).first()
            
            if not restaurant:
                logger.info(f"Restaurant not found in database for place_id: {place_id}")
                return None
            
            # Check if we have cached reviews
            if restaurant.last_scraped:
                age = datetime.utcnow() - restaurant.last_scraped
                
                if age.days > max_age_days:
                    logger.info(f"Cached reviews are {age.days} days old (stale)")
                    return None
            else:
                logger.info("Restaurant has never been scraped")
                return None
            
            # Get reviews from database
            reviews = db_session.query(DBReview).filter(
                DBReview.restaurant_id == restaurant.id
            ).all()
            
            if not reviews:
                logger.info("No reviews found in database")
                return None
            
            logger.info(f"Found {len(reviews)} cached reviews for place_id: {place_id}")
            
            # Convert DB reviews to Review model objects
            review_objects = []
            for db_review in reviews:
                review_objects.append(Review(
                    text=db_review.review_text,
                    rating=db_review.rating,
                    author=db_review.author,
                    date=db_review.review_date
                ))
            
            return review_objects
            
        except Exception as e:
            logger.error(f"Error getting reviews from database: {e}")
            return None
    
    async def scrape_reviews(self, place_id: str, max_reviews: int = 100) -> List[Review]:
        """
        Scrape reviews for a restaurant.
        
        Args:
            place_id: Google Places ID
            max_reviews: Maximum number of reviews to scrape
            
        Returns:
            List of Review objects
        """
        
        try:
            # For now, use Google Places reviews
            # In production, this would scrape from multiple sources
            reviews = await self._scrape_google_reviews(place_id, max_reviews)
            logger.info(f"Scraped {len(reviews)} reviews for place_id: {place_id}")
            return reviews
            
        except Exception as e:
            logger.error(f"Error scraping reviews for {place_id}: {e}")
            return []
    
    async def _scrape_google_reviews(self, place_id: str, max_reviews: int) -> List[Review]:
        """
        Scrape reviews from Google Places.
        
        Args:
            place_id: Google Places ID
            max_reviews: Maximum number of reviews to scrape
            
        Returns:
            List of Review objects
        """
        
        try:
            place_details = await self.google_places.get_place_details(place_id)
            google_reviews = place_details.get('reviews', [])
            
            reviews = []
            for review_data in google_reviews[:max_reviews]:
                review = Review(
                    text=review_data.get('text', ''),
                    rating=review_data.get('rating'),
                    author=review_data.get('author_name'),
                    date=review_data.get('time')
                )
                reviews.append(review)
            
            return reviews
            
        except Exception as e:
            logger.error(f"Error scraping Google reviews: {e}")
            return []
    
    async def _scrape_yelp_reviews(self, business_id: str, max_reviews: int) -> List[Review]:
        """
        Scrape reviews from Yelp (to be implemented).
        
        This is a placeholder for future implementation.
        """
        # TODO: Implement Yelp scraping
        logger.warning("Yelp scraping not yet implemented")
        return []
    
    async def _scrape_tripadvisor_reviews(self, location_id: str, max_reviews: int) -> List[Review]:
        """
        Scrape reviews from TripAdvisor (to be implemented).
        
        This is a placeholder for future implementation.
        """
        # TODO: Implement TripAdvisor scraping
        logger.warning("TripAdvisor scraping not yet implemented")
        return []

