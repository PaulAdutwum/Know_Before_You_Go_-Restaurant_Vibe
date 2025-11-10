"""
Google Places API Service

Handles interaction with Google Places API to find restaurants.
"""

import googlemaps
from typing import List, Dict, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class GooglePlacesService:
    """Service for interacting with Google Places API"""
    
    def __init__(self):
        """Initialize Google Places client"""
        self.api_key = settings.GOOGLE_PLACES_API_KEY
        self.client = None
        
        if self.api_key and self.api_key != "":
            try:
                self.client = googlemaps.Client(key=self.api_key)
                logger.info("Google Places API client initialized")
            except Exception as e:
                logger.warning(f"Failed to initialize Google Places client: {e}")
        else:
            logger.warning("Google Places API key not configured")
    
    async def find_restaurants(
        self,
        location: str,
        max_results: int = 10,
        radius: int = 5000
    ) -> List[Dict]:
        """
        Find restaurants near a location using Google Places API.
        
        Args:
            location: Location string (e.g., "Lewiston, Maine")
            max_results: Maximum number of results to return
            radius: Search radius in meters
            
        Returns:
            List of restaurant dictionaries with basic info
        """
        
        if not self.client:
            logger.warning("Google Places client not available, returning mock data")
            raise Exception("Google Places API not configured")
        
        try:
            # First, geocode the location to get coordinates
            geocode_result = self.client.geocode(location)
            
            if not geocode_result:
                raise Exception(f"Location not found: {location}")
            
            lat = geocode_result[0]['geometry']['location']['lat']
            lng = geocode_result[0]['geometry']['location']['lng']
            
            logger.info(f"Location coordinates: {lat}, {lng}")
            
            # Search for restaurants using Places API
            places_result = self.client.places_nearby(
                location=(lat, lng),
                radius=radius,
                type='restaurant',
                rank_by=None
            )
            
            restaurants = []
            results = places_result.get('results', [])[:max_results]
            
            for place in results:
                # Get more details about the place
                place_details = self.client.place(
                    place_id=place['place_id'],
                    fields=['name', 'rating', 'formatted_address', 'place_id', 'user_ratings_total', 'photo']
                )
                
                details = place_details.get('result', {})
                
                # Get coordinates
                geometry = place.get('geometry', {})
                location_coords = geometry.get('location', {})
                
                # Get photo URL if available
                photo_url = None
                photos = details.get('photos', [])
                if photos and len(photos) > 0:
                    # Get the first photo reference
                    photo_reference = photos[0].get('photo_reference')
                    if photo_reference:
                        # Construct photo URL (maxwidth 800 for good quality)
                        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference={photo_reference}&key={self.api_key}"
                
                restaurant = {
                    'name': details.get('name', 'Unknown'),
                    'rating': details.get('rating', 0.0),
                    'address': details.get('formatted_address', ''),
                    'place_id': details.get('place_id', ''),
                    'total_ratings': details.get('user_ratings_total', 0),
                    'lat': location_coords.get('lat'),
                    'lng': location_coords.get('lng'),
                    'photo_url': photo_url
                }
                
                restaurants.append(restaurant)
                logger.info(f"Found restaurant: {restaurant['name']} (photo: {'Yes' if photo_url else 'No'})")
            
            return restaurants
            
        except Exception as e:
            logger.error(f"Error finding restaurants: {e}")
            raise
    
    async def search_by_name(
        self,
        query: str,
        max_results: int = 10
    ) -> List[Dict]:
        """
        Search for restaurants by name using Google Places Text Search.
        This is better for finding specific restaurants.
        
        Args:
            query: Restaurant name or query (e.g., "Joe's Pizza" or "Cheesecake Factory Boston")
            max_results: Maximum number of results to return
            
        Returns:
            List of restaurant dictionaries with basic info
        """
        
        if not self.client:
            logger.warning("Google Places client not available")
            raise Exception("Google Places API not configured")
        
        try:
            logger.info(f"Searching by name/text: {query}")
            
            # Use text search for finding specific restaurants
            places_result = self.client.places(
                query=query,
                type='restaurant'
            )
            
            restaurants = []
            results = places_result.get('results', [])[:max_results]
            
            for place in results:
                # Get more details about the place
                try:
                    place_details = self.client.place(
                        place_id=place['place_id'],
                        fields=['name', 'rating', 'formatted_address', 'place_id', 'user_ratings_total', 'geometry', 'photo']
                    )
                    
                    details = place_details.get('result', {})
                    
                    # Get coordinates
                    geometry = details.get('geometry', {})
                    location_coords = geometry.get('location', {})
                    
                    # Get photo URL if available
                    photo_url = None
                    photos = details.get('photos', [])
                    if photos and len(photos) > 0:
                        photo_reference = photos[0].get('photo_reference')
                        if photo_reference:
                            photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference={photo_reference}&key={self.api_key}"
                    
                    restaurant = {
                        'name': details.get('name', 'Unknown'),
                        'rating': details.get('rating', 0.0),
                        'address': details.get('formatted_address', ''),
                        'place_id': details.get('place_id', ''),
                        'total_ratings': details.get('user_ratings_total', 0),
                        'lat': location_coords.get('lat'),
                        'lng': location_coords.get('lng'),
                        'photo_url': photo_url
                    }
                    
                    restaurants.append(restaurant)
                    logger.info(f"Found restaurant: {restaurant['name']} (photo: {'Yes' if photo_url else 'No'})")
                    
                except Exception as e:
                    logger.warning(f"Error getting details for place: {e}")
                    continue
            
            return restaurants
            
        except Exception as e:
            logger.error(f"Error searching by name: {e}")
            raise
    
    async def get_place_details(self, place_id: str) -> Dict:
        """
        Get detailed information about a specific place.
        
        Args:
            place_id: Google Places ID
            
        Returns:
            Dictionary with place details
        """
        
        if not self.client:
            raise Exception("Google Places API not configured")
        
        try:
            place_details = self.client.place(
                place_id=place_id,
                fields=['name', 'rating', 'formatted_address', 'reviews', 'photo']
            )
            
            return place_details.get('result', {})
            
        except Exception as e:
            logger.error(f"Error getting place details: {e}")
            raise

