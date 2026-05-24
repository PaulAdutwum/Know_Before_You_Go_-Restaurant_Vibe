"""
Application Configuration

Loads environment variables and defines application settings.
"""

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Configuration
    PROJECT_NAME: str = "VibeFinder API"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    
    # CORS Configuration - Allow requests from these origins
    # In production, set ALLOWED_ORIGINS environment variable with comma-separated URLs
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000",
        "https://know-before-you-go-restaurant-vibe.vercel.app",
        "https://*.vercel.app",
    ]
    
    # Google Places API
    GOOGLE_PLACES_API_KEY: str = ""

    # OpenAI API
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()

