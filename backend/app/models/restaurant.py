"""
Restaurant Data Models

Pydantic models for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class RestaurantResponse(BaseModel):
    """
    Response model for a single restaurant with AI-powered insights
    """
    name: str = Field(..., description="Restaurant name")
    rating: float = Field(..., ge=0, le=5, description="Google rating (0-5)")
    trueSentiment: str = Field(..., description="AI-calculated sentiment (e.g., '82% Positive')")
    vibeCheck: List[str] = Field(..., description="AI-detected vibe tags (e.g., ['#Loud', '#GoodForGroups'])")
    mustTryDishes: List[str] = Field(..., description="Top dishes extracted from reviews")
    commonComplaints: List[str] = Field(..., description="Common negative points from reviews")
    address: Optional[str] = Field(None, description="Restaurant address")
    place_id: Optional[str] = Field(None, description="Google Places ID")
    distance: Optional[str] = Field(None, description="Distance from user (e.g., '2.3 mi')")
    lat: Optional[float] = Field(None, description="Latitude")
    lng: Optional[float] = Field(None, description="Longitude")
    photo_url: Optional[str] = Field(None, description="URL of the restaurant's primary photo")

    class Config:
        json_schema_extra = {
            "example": {
                "name": "Joe's Pizza",
                "rating": 4.5,
                "trueSentiment": "82% Positive",
                "vibeCheck": ["#Loud", "#GoodForGroups", "#Casual"],
                "mustTryDishes": ["Spicy Rigatoni", "Garlic Knots", "Margherita Pizza"],
                "commonComplaints": ["Slow service on weekends", "Can get very crowded"],
                "address": "123 Main St, Lewiston, ME",
                "place_id": "ChIJ..."
            }
        }


class SearchRequest(BaseModel):
    """Request model for location-based search"""
    location: str = Field(..., min_length=2, description="Location to search (city, state, or address)")
    radius: Optional[int] = Field(5000, ge=100, le=50000, description="Search radius in meters")
    max_results: Optional[int] = Field(10, ge=1, le=20, description="Maximum number of results")


class Review(BaseModel):
    """Model for a single restaurant review"""
    text: str
    rating: Optional[float] = None
    author: Optional[str] = None
    date: Optional[str] = None

