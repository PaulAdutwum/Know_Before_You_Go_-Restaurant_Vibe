"""
Scraping Admin API

Admin endpoints for managing scraping jobs and monitoring status.
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import logging

from app.models.database import get_db, Restaurant, Review, ScrapingJob
from app.services.background_jobs import scrape_restaurant_task
from pydantic import BaseModel

router = APIRouter()
logger = logging.getLogger(__name__)


class ScrapingTriggerResponse(BaseModel):
    """Response model for scraping trigger"""
    message: str
    job_id: int
    place_id: str
    restaurant_id: int


class ScrapingJobStatus(BaseModel):
    """Response model for scraping job status"""
    job_id: int
    place_id: str
    status: str
    reviews_scraped: int
    created_at: str
    completed_at: str = None
    error_message: str = None


class ScrapingStats(BaseModel):
    """Response model for scraping statistics"""
    total_restaurants: int
    total_reviews: int
    google_maps_reviews: int
    reddit_reviews: int
    pending_jobs: int
    running_jobs: int
    completed_jobs: int
    failed_jobs: int


@router.post("/trigger/{place_id}", response_model=ScrapingTriggerResponse)
async def trigger_scraping(place_id: str, db: Session = Depends(get_db)):
    """
    Manually trigger scraping for a specific restaurant
    
    Args:
        place_id: Google Places ID
        db: Database session
        
    Returns:
        Scraping job details
    """
    try:
        # Check if restaurant exists in database
        restaurant = db.query(Restaurant).filter(Restaurant.place_id == place_id).first()
        
        if not restaurant:
            # Create new restaurant entry
            restaurant = Restaurant(
                place_id=place_id,
                name=f"Restaurant_{place_id[:8]}"  # Temporary name
            )
            db.add(restaurant)
            db.commit()
            db.refresh(restaurant)
            logger.info(f"Created new restaurant entry for place_id: {place_id}")
        
        # Check if there's already a pending/running job
        existing_job = db.query(ScrapingJob).filter(
            ScrapingJob.place_id == place_id,
            ScrapingJob.status.in_(['pending', 'running'])
        ).first()
        
        if existing_job:
            raise HTTPException(
                status_code=409,
                detail=f"Scraping job already in progress (job_id: {existing_job.id})"
            )
        
        # Create scraping job
        job = ScrapingJob(
            restaurant_id=restaurant.id,
            place_id=place_id,
            status='pending'
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Queue background task
        scrape_restaurant_task.delay(place_id=place_id, restaurant_id=restaurant.id)
        
        logger.info(f"Triggered scraping job {job.id} for place_id: {place_id}")
        
        return ScrapingTriggerResponse(
            message="Scraping job queued successfully",
            job_id=job.id,
            place_id=place_id,
            restaurant_id=restaurant.id
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error triggering scraping: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status/{job_id}", response_model=ScrapingJobStatus)
async def get_job_status(job_id: int, db: Session = Depends(get_db)):
    """
    Get status of a scraping job
    
    Args:
        job_id: Scraping job ID
        db: Database session
        
    Returns:
        Job status details
    """
    job = db.query(ScrapingJob).filter(ScrapingJob.id == job_id).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return ScrapingJobStatus(
        job_id=job.id,
        place_id=job.place_id,
        status=job.status,
        reviews_scraped=job.reviews_scraped,
        created_at=job.created_at.isoformat(),
        completed_at=job.completed_at.isoformat() if job.completed_at else None,
        error_message=job.error_message
    )


@router.get("/stats", response_model=ScrapingStats)
async def get_scraping_stats(db: Session = Depends(get_db)):
    """
    Get overall scraping statistics
    
    Args:
        db: Database session
        
    Returns:
        Scraping statistics
    """
    try:
        stats = ScrapingStats(
            total_restaurants=db.query(Restaurant).count(),
            total_reviews=db.query(Review).count(),
            google_maps_reviews=db.query(Review).filter(Review.source == 'google_maps').count(),
            reddit_reviews=db.query(Review).filter(Review.source == 'reddit').count(),
            pending_jobs=db.query(ScrapingJob).filter(ScrapingJob.status == 'pending').count(),
            running_jobs=db.query(ScrapingJob).filter(ScrapingJob.status == 'running').count(),
            completed_jobs=db.query(ScrapingJob).filter(ScrapingJob.status == 'completed').count(),
            failed_jobs=db.query(ScrapingJob).filter(ScrapingJob.status == 'failed').count()
        )
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/jobs", response_model=List[ScrapingJobStatus])
async def list_jobs(
    limit: int = 20,
    status: str = None,
    db: Session = Depends(get_db)
):
    """
    List recent scraping jobs
    
    Args:
        limit: Maximum number of jobs to return
        status: Filter by status (optional)
        db: Database session
        
    Returns:
        List of scraping jobs
    """
    query = db.query(ScrapingJob)
    
    if status:
        query = query.filter(ScrapingJob.status == status)
    
    jobs = query.order_by(ScrapingJob.created_at.desc()).limit(limit).all()
    
    return [
        ScrapingJobStatus(
            job_id=job.id,
            place_id=job.place_id,
            status=job.status,
            reviews_scraped=job.reviews_scraped,
            created_at=job.created_at.isoformat(),
            completed_at=job.completed_at.isoformat() if job.completed_at else None,
            error_message=job.error_message
        )
        for job in jobs
    ]

