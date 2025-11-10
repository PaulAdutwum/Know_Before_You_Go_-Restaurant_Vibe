"""
Search API Endpoint

Main endpoint for restaurant search with AI-powered insights.
This orchestrates the entire pipeline:
1. Google Places API search
2. Review scraping
3. ML analysis (sentiment, topics, keywords)
4. Response assembly
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List
import logging

from app.models.restaurant import RestaurantResponse
from app.services.google_places import GooglePlacesService
from app.services.review_scraper import ReviewScraper
from app.ml.sentiment_analyzer import SentimentAnalyzer
from app.ml.topic_modeler import TopicModeler
from app.ml.keyword_extractor import KeywordExtractor
from app.services.ml_generator import generate_ml_insights, calculate_distance

# Initialize router
router = APIRouter()

# Initialize services (these will be implemented in the services module)
google_places = GooglePlacesService()
review_scraper = ReviewScraper()
sentiment_analyzer = SentimentAnalyzer()
topic_modeler = TopicModeler()
keyword_extractor = KeywordExtractor()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def detect_restaurant_name_query(query: str) -> bool:
    """
    Intelligently detect if a query is a restaurant name or a location search.
    
    Restaurant name indicators:
    - Contains possessive ('s)
    - Starts with "The", "Papa", "Mama", etc.
    - Contains common restaurant words like "restaurant", "cafe", "bistro"
    - Is capitalized (Title Case)
    - Doesn't contain location indicators
    
    Location search indicators:
    - Contains "pizza", "sushi", "burger" + location
    - Contains "in", "near", "at"
    - Contains city/state names
    
    Args:
        query: The search query string
        
    Returns:
        True if likely a restaurant name, False if likely a location search
    """
    query_lower = query.lower().strip()
    query_words = query_lower.split()
    
    # Strong restaurant name indicators
    restaurant_indicators = [
        "'s " in query_lower,  # Joe's Pizza, Papa's Kitchen
        query.startswith("The "),  # The Cheesecake Factory
        query.startswith("Papa "),
        query.startswith("Mama "),
        query.startswith("Uncle "),
        "restaurant" in query_lower,
        "cafe" in query_lower,
        "bistro" in query_lower,
        "kitchen" in query_lower,
        "grill" in query_lower,
        "tavern" in query_lower,
        "bar" in query_lower and "bar" not in ["bar", "bars"],  # "Sushi Bar" but not just "bar"
        "house" in query_lower and len(query_words) > 1,  # "Steak House"
        "inn" in query_lower,
        "diner" in query_lower,
        "eatery" in query_lower,
        "pizzeria" in query_lower,
        "trattoria" in query_lower,
        "steakhouse" in query_lower,
    ]
    
    # Location search indicators
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
    
    # Count indicators
    restaurant_score = sum(restaurant_indicators)
    location_score = sum(location_indicators)
    
    # If query is Title Case and short (2-4 words), likely a restaurant name
    if query.istitle() and 2 <= len(query_words) <= 4 and location_score == 0:
        restaurant_score += 2
    
    # Decision logic
    if restaurant_score > location_score:
        return True
    elif location_score > restaurant_score:
        return False
    else:
        # Tie-breaker: if it's capitalized and not too long, treat as restaurant name
        return query.istitle() and len(query_words) <= 5


@router.get("/search", response_model=List[RestaurantResponse])
async def search_restaurants(
    location: str = Query(..., min_length=2, description="Location or restaurant name to search"),
    max_results: int = Query(10, ge=1, le=20, description="Maximum number of results"),
    user_lat: float = Query(None, description="User's latitude for distance calculation"),
    user_lng: float = Query(None, description="User's longitude for distance calculation")
):
    """
    Search for restaurants by location and return AI-powered insights.
    
    This endpoint:
    1. Searches Google Places for restaurants
    2. Scrapes reviews for each restaurant
    3. Runs ML models to extract insights
    4. Returns enriched restaurant data
    
    **Note**: For demo purposes, this may use mock data if APIs are not configured.
    """
    
    try:
        logger.info(f"Search query received: '{location}'")
        
        # Step 1: Intelligent search detection
        # Determine if this is a restaurant name search or location search
        is_restaurant_name = detect_restaurant_name_query(location)
        
        basic_restaurants = []
        
        try:
            if is_restaurant_name:
                # Search by restaurant name (e.g., "Joe's Pizza", "The Cheesecake Factory")
                logger.info(f"Detected restaurant name search: '{location}'")
                basic_restaurants = await google_places.search_by_name(location, max_results)
                logger.info(f"Found {len(basic_restaurants)} restaurants by name")
            else:
                # Search by location (e.g., "Pizza Boston", "Sushi NYC")
                logger.info(f"Detected location search: '{location}'")
                basic_restaurants = await google_places.find_restaurants(location, max_results)
                logger.info(f"Found {len(basic_restaurants)} restaurants by location")
            
            # If name search returns no results, try location-based search as fallback
            if not basic_restaurants and is_restaurant_name:
                logger.info(f"No results from name search, trying location-based search")
                basic_restaurants = await google_places.find_restaurants(location, max_results)
                
        except Exception as e:
            logger.warning(f"Google Places API error: {e}. Using mock data.")
            # Return mock data if API fails
            return get_mock_data()
        
        # Step 2: Process each restaurant
        enriched_restaurants = []
        
        for resto in basic_restaurants:
            try:
                logger.info(f"Processing restaurant: {resto['name']}")
                
                # Step 3: Scrape reviews
                reviews = await review_scraper.scrape_reviews(resto['place_id'])
                
                # Hybrid Approach: Use ML if we have enough reviews, otherwise generate insights
                if not reviews or len(reviews) < 5:
                    logger.info(f"Limited reviews for {resto['name']}, generating hybrid insights")
                    
                    # Generate ML insights based on restaurant data
                    ml_insights = generate_ml_insights({
                        'name': resto['name'],
                        'rating': resto['rating']
                    })
                    
                    # Calculate distance if user location provided
                    distance = None
                    if user_lat and user_lng and resto.get('lat') and resto.get('lng'):
                        distance = calculate_distance(user_lat, user_lng, resto['lat'], resto['lng'])
                    
                    enriched_restaurants.append(
                        RestaurantResponse(
                            name=resto['name'],
                            rating=resto['rating'],
                            trueSentiment=ml_insights['trueSentiment'],
                            vibeCheck=ml_insights['vibeCheck'],
                            mustTryDishes=ml_insights['mustTryDishes'],
                            commonComplaints=ml_insights['commonComplaints'],
                            address=resto.get('address'),
                            place_id=resto['place_id'],
                            distance=distance
                        )
                    )
                    continue
                
                # Step 4: Run ML Pipeline
                review_texts = [r.text for r in reviews]
                
                # 4a. Sentiment Analysis
                true_sentiment = sentiment_analyzer.analyze(review_texts)
                
                # 4b. Topic Modeling (Vibe Check)
                vibes = topic_modeler.extract_vibes(review_texts)
                
                # 4c. Keyword Extraction (Dishes)
                dishes = keyword_extractor.extract_dishes(review_texts)
                
                # 4d. Complaint Detection
                complaints = keyword_extractor.extract_complaints(review_texts)
                
                # Calculate distance if user location provided
                distance = None
                if user_lat and user_lng and resto.get('lat') and resto.get('lng'):
                    distance = calculate_distance(user_lat, user_lng, resto['lat'], resto['lng'])
                
                # Step 5: Assemble final data
                enriched_restaurant = RestaurantResponse(
                    name=resto['name'],
                    rating=resto['rating'],
                    trueSentiment=true_sentiment,
                    vibeCheck=vibes,
                    mustTryDishes=dishes,
                    commonComplaints=complaints,
                    address=resto.get('address'),
                    place_id=resto['place_id'],
                    distance=distance
                )
                
                enriched_restaurants.append(enriched_restaurant)
                logger.info(f"Successfully processed: {resto['name']}")
                
            except Exception as e:
                logger.error(f"Error processing restaurant {resto['name']}: {e}")
                # Continue with next restaurant
                continue
        
        if not enriched_restaurants:
            raise HTTPException(
                status_code=404,
                detail="No restaurants found for the given location"
            )
        
        logger.info(f"Returning {len(enriched_restaurants)} enriched restaurants")
        return enriched_restaurants
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )


def get_mock_data() -> List[RestaurantResponse]:
    """
    Returns mock data for testing when APIs are not available.
    This should be removed in production.
    """
    return [
        RestaurantResponse(
            name="Joe's Pizza",
            rating=4.5,
            trueSentiment="82% Positive",
            vibeCheck=["#Loud", "#GoodForGroups", "#Casual"],
            mustTryDishes=["Spicy Rigatoni", "Garlic Knots", "Margherita Pizza"],
            commonComplaints=["Slow service on weekends", "Can get very crowded"],
            address="123 Main St, Lewiston, ME",
            place_id="mock_place_id_1"
        ),
        RestaurantResponse(
            name="The Riverside Bistro",
            rating=4.8,
            trueSentiment="91% Positive",
            vibeCheck=["#Romantic", "#Quiet", "#DateNight"],
            mustTryDishes=["Pan-Seared Salmon", "Lobster Risotto", "Chocolate Soufflé"],
            commonComplaints=["Pricey", "Limited parking"],
            address="456 River Rd, Lewiston, ME",
            place_id="mock_place_id_2"
        ),
        RestaurantResponse(
            name="Mama's Kitchen",
            rating=4.3,
            trueSentiment="76% Positive",
            vibeCheck=["#FamilyFriendly", "#Comfort", "#HomeStyle"],
            mustTryDishes=["Chicken Pot Pie", "Meatloaf", "Apple Pie"],
            commonComplaints=["Long wait times", "Small portions"],
            address="789 Oak Ave, Lewiston, ME",
            place_id="mock_place_id_3"
        ),
        RestaurantResponse(
            name="Sakura Sushi Bar",
            rating=4.7,
            trueSentiment="88% Positive",
            vibeCheck=["#Fresh", "#Modern", "#HealthyOptions"],
            mustTryDishes=["Dragon Roll", "Salmon Sashimi", "Miso Soup"],
            commonComplaints=["Expensive", "Limited seating"],
            address="321 Cherry Ln, Lewiston, ME",
            place_id="mock_place_id_4"
        )
    ]

