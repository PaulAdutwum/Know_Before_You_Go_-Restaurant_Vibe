"""
Background Jobs

Celery tasks for asynchronous scraping and ML processing.
"""

from celery import shared_task
import logging
from typing import Optional
from datetime import datetime

logger = logging.getLogger(__name__)


@shared_task(bind=True, name='app.services.background_jobs.scrape_restaurant_task')
def scrape_restaurant_task(self, place_id: str, restaurant_id: Optional[int] = None):
    """
    Background task to scrape restaurant reviews
    
    Args:
        place_id: Google Places ID
        restaurant_id: Database restaurant ID (optional)
        
    Returns:
        Dict with scraping results
    """
    from app.services.google_maps_scraper import GoogleMapsScraper
    from app.services.reddit_scraper import RedditScraper
    from app.models.database import get_session_local, Restaurant, Review, ScrapingJob
    from app.core.config import settings
    
    logger.info(f"Starting scraping task for place_id: {place_id}")
    
    # Create database session
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    # Create or update scraping job
    job = None
    if restaurant_id:
        job = ScrapingJob(
            restaurant_id=restaurant_id,
            place_id=place_id,
            status='running'
        )
        db.add(job)
        db.commit()
        db.refresh(job)
    
    try:
        reviews_scraped = 0
        
        # 1. Scrape Google Maps reviews
        logger.info("Scraping Google Maps...")
        google_scraper = GoogleMapsScraper(delay_seconds=settings.SCRAPING_DELAY_SECONDS)
        
        google_reviews = google_scraper.scrape_restaurant_reviews(
            place_id=place_id,
            max_reviews=settings.MAX_REVIEWS_PER_RESTAURANT
        )
        
        logger.info(f"Scraped {len(google_reviews)} reviews from Google Maps")
        
        # 2. Save Google reviews to database
        if restaurant_id and google_reviews:
            for review_data in google_reviews:
                if review_data.get('text'):  # Only save reviews with text
                    review = Review(
                        restaurant_id=restaurant_id,
                        review_text=review_data['text'],
                        rating=review_data.get('rating'),
                        author=review_data.get('author'),
                        review_date=review_data.get('date'),
                        source='google_maps',
                        scraped_at=datetime.utcnow(),
                        is_processed=False
                    )
                    db.add(review)
                    reviews_scraped += 1
            
            db.commit()
            logger.info(f"Saved {reviews_scraped} Google reviews to database")
        
        # 3. Try Reddit scraping (supplementary)
        try:
            logger.info("Attempting Reddit scraping...")
            reddit_scraper = RedditScraper()
            
            # Get restaurant name from database
            if restaurant_id:
                restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
                if restaurant:
                    reddit_reviews = reddit_scraper.search_restaurant_mentions(
                        restaurant_name=restaurant.name,
                        location=restaurant.address
                    )
                    
                    # Save Reddit mentions
                    for review_data in reddit_reviews[:20]:  # Limit Reddit reviews
                        if review_data.get('text'):
                            review = Review(
                                restaurant_id=restaurant_id,
                                review_text=review_data['text'],
                                author=review_data.get('author'),
                                review_date=review_data.get('date'),
                                source='reddit',
                                scraped_at=datetime.utcnow(),
                                is_processed=False
                            )
                            db.add(review)
                            reviews_scraped += 1
                    
                    db.commit()
                    logger.info(f"Saved {len(reddit_reviews)} Reddit mentions to database")
        
        except Exception as e:
            logger.warning(f"Reddit scraping failed (non-critical): {e}")
        
        # 4. Update restaurant last_scraped timestamp
        if restaurant_id:
            restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
            if restaurant:
                restaurant.last_scraped = datetime.utcnow()
                db.commit()
        
        # 5. Update scraping job status
        if job:
            job.status = 'completed'
            job.reviews_scraped = reviews_scraped
            job.completed_at = datetime.utcnow()
            db.commit()
        
        # 6. Trigger ML processing
        if reviews_scraped > 0 and restaurant_id:
            process_ml_task.delay(restaurant_id)
        
        logger.info(f"Scraping task completed successfully. Total reviews: {reviews_scraped}")
        
        return {
            'status': 'success',
            'place_id': place_id,
            'reviews_scraped': reviews_scraped
        }
        
    except Exception as e:
        logger.error(f"Error in scraping task: {e}", exc_info=True)
        
        # Update job status to failed
        if job:
            job.status = 'failed'
            job.error_message = str(e)
            job.completed_at = datetime.utcnow()
            db.commit()
        
        # Retry the task
        raise self.retry(exc=e, countdown=60, max_retries=3)
    
    finally:
        google_scraper.close()
        db.close()


@shared_task(name='app.services.background_jobs.process_ml_task')
def process_ml_task(restaurant_id: int):
    """
    Background task to process ML analysis on scraped reviews
    
    Args:
        restaurant_id: Database restaurant ID
        
    Returns:
        Dict with ML results
    """
    from app.ml.sentiment_analyzer import SentimentAnalyzer
    from app.ml.topic_modeler import TopicModeler
    from app.ml.keyword_extractor import KeywordExtractor
    from app.models.database import get_session_local, Restaurant, Review
    
    logger.info(f"Starting ML processing for restaurant_id: {restaurant_id}")
    
    SessionLocal = get_session_local()
    db = SessionLocal()
    
    try:
        # Get unprocessed reviews
        reviews = db.query(Review).filter(
            Review.restaurant_id == restaurant_id,
            Review.is_processed == False
        ).all()
        
        if not reviews:
            logger.warning(f"No unprocessed reviews found for restaurant_id: {restaurant_id}")
            return {'status': 'no_reviews'}
        
        review_texts = [r.review_text for r in reviews]
        
        # Run ML models
        sentiment_analyzer = SentimentAnalyzer()
        topic_modeler = TopicModeler()
        keyword_extractor = KeywordExtractor()
        
        # Sentiment analysis
        for review in reviews:
            sentiment_scores = sentiment_analyzer.analyze_single_review(review.review_text)
            review.sentiment_score = sentiment_scores['compound']
            review.is_processed = True
        
        db.commit()
        
        logger.info(f"ML processing completed for {len(reviews)} reviews")
        
        return {
            'status': 'success',
            'restaurant_id': restaurant_id,
            'reviews_processed': len(reviews)
        }
        
    except Exception as e:
        logger.error(f"Error in ML processing task: {e}", exc_info=True)
        return {'status': 'error', 'message': str(e)}
    
    finally:
        db.close()

