"""
VibeFinder API - Main Application Entry Point

This is the core FastAPI application that orchestrates:
- Restaurant search via Google Places API
- Review scraping and processing
- ML-powered sentiment analysis, topic modeling, and keyword extraction
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from dotenv import load_dotenv

from app.core.config import settings
from app.api import search
from app.models.restaurant import RestaurantResponse

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Powered Restaurant Discovery Platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search.router, prefix=settings.API_V1_PREFIX, tags=["search"])

# Import scraping router
from app.api import scraping
app.include_router(scraping.router, prefix=f"{settings.API_V1_PREFIX}/scraping", tags=["scraping"])


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Welcome to VibeFinder API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "VibeFinder API"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

