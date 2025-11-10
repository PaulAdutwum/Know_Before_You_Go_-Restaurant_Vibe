"""
Application Configuration

Loads environment variables and defines application settings.
"""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    PROJECT_NAME: str = "VibeFinder API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # CORS Configuration - Allow requests from these origins
    # In production, set ALLOWED_ORIGINS environment variable with comma-separated URLs
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # React default
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*",  # Allow all origins (for demo/portfolio - restrict in production if needed)
    ]
    
    # Database Configuration
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://vibefinder:vibefinder@localhost:5432/vibefinder"
    )
    
    # Google Places API
    GOOGLE_PLACES_API_KEY: str = ""
    
    # Scraping Configuration
    SCRAPING_ENABLED: bool = os.getenv("SCRAPING_ENABLED", "true").lower() == "true"
    MAX_REVIEWS_PER_RESTAURANT: int = int(os.getenv("MAX_REVIEWS_PER_RESTAURANT", "100"))
    SCRAPING_DELAY_SECONDS: int = int(os.getenv("SCRAPING_DELAY_SECONDS", "2"))
    
    # Redis/Celery Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Reddit API Configuration
    REDDIT_CLIENT_ID: str = os.getenv("REDDIT_CLIENT_ID", "")
    REDDIT_CLIENT_SECRET: str = os.getenv("REDDIT_CLIENT_SECRET", "")
    REDDIT_USER_AGENT: str = os.getenv("REDDIT_USER_AGENT", "VibeFinder/1.0")
    
    # ML Configuration
    REVIEW_SAMPLE_SIZE: int = 100  # Number of reviews to analyze per restaurant
    MIN_SENTIMENT_THRESHOLD: float = 0.6  # Minimum sentiment score
    VIBE_TOPIC_COUNT: int = 3  # Number of topics for LDA
    TOP_DISHES_COUNT: int = 5  # Number of top dishes to extract
    TOP_COMPLAINTS_COUNT: int = 3  # Number of complaints to show
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()

