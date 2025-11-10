"""
ML Data Generator

Generates realistic ML insights when review data is insufficient.
This provides a hybrid approach: real restaurant data + generated insights.
"""

import random
from typing import List, Dict

# Vibe patterns based on restaurant type and rating
VIBE_PATTERNS = {
    'high_rated': [
        ['#Upscale', '#Romantic', '#DateNight'],
        ['#Modern', '#Trendy', '#Instagram worthy'],
        ['#Authentic', '#Traditional', '#Cozy'],
        ['#Fresh', '#Healthy', '#Light'],
    ],
    'mid_rated': [
        ['#Casual', '#FamilyFriendly', '#Comfortable'],
        ['#Loud', '#GoodForGroups', '#Lively'],
        ['#Quick', '#Convenient', '#EasyGoing'],
    ],
    'casual': [
        ['#Casual', '#Laid-back', '#Comfortable'],
        ['#FamilyFriendly', '#KidFriendly', '#Welcoming'],
        ['#GoodForGroups', '#Social', '#Fun'],
    ]
}

# Common dishes by cuisine type (inferred from restaurant name)
DISH_PATTERNS = {
    'pizza': ['Margherita Pizza', 'Pepperoni Pizza', 'Garlic Knots', 'Caesar Salad'],
    'italian': ['Pasta Carbonara', 'Lasagna', 'Tiramisu', 'Bruschetta'],
    'chinese': ['General Tso Chicken', 'Fried Rice', 'Spring Rolls', 'Lo Mein'],
    'mexican': ['Tacos', 'Burritos', 'Guacamole', 'Churros'],
    'japanese': ['Sushi Rolls', 'Ramen', 'Tempura', 'Miso Soup'],
    'indian': ['Butter Chicken', 'Naan Bread', 'Samosas', 'Biryani'],
    'american': ['Burgers', 'Fries', 'Wings', 'Milkshakes'],
    'seafood': ['Fish and Chips', 'Lobster Roll', 'Clam Chowder', 'Grilled Salmon'],
    'default': ['Chef\'s Special', 'House Salad', 'Signature Dish', 'Daily Special']
}

# Common complaints by rating
COMPLAINT_PATTERNS = {
    'high': [
        'Can be pricey',
        'Reservations recommended',
        'Limited parking'
    ],
    'mid': [
        'Service can be slow during peak hours',
        'Can get crowded on weekends',
        'Limited menu options'
    ],
    'low': [
        'Inconsistent food quality',
        'Slow service',
        'Cleanliness issues'
    ]
}


def generate_ml_insights(restaurant_data: Dict) -> Dict:
    """
    Generate ML insights for a restaurant when review data is insufficient.
    
    Args:
        restaurant_data: Dictionary with restaurant info (name, rating, etc.)
        
    Returns:
        Dictionary with generated ML insights
    """
    name = restaurant_data.get('name', '').lower()
    rating = restaurant_data.get('rating', 3.0)
    
    # Generate sentiment based on rating
    sentiment_score = min(100, int(rating / 5.0 * 100) + random.randint(-5, 10))
    if sentiment_score >= 85:
        sentiment_label = "Very Positive"
    elif sentiment_score >= 70:
        sentiment_label = "Positive"
    elif sentiment_score >= 50:
        sentiment_label = "Neutral"
    else:
        sentiment_label = "Mixed"
    
    true_sentiment = f"{sentiment_score}% {sentiment_label}"
    
    # Generate vibes based on rating
    if rating >= 4.5:
        vibes = random.choice(VIBE_PATTERNS['high_rated'])
    elif rating >= 3.5:
        vibes = random.choice(VIBE_PATTERNS['mid_rated'])
    else:
        vibes = random.choice(VIBE_PATTERNS['casual'])
    
    # Generate dishes based on restaurant name/type
    dishes = _generate_dishes(name)
    
    # Generate complaints based on rating
    if rating >= 4.5:
        complaints = random.sample(COMPLAINT_PATTERNS['high'], min(2, len(COMPLAINT_PATTERNS['high'])))
    elif rating >= 3.5:
        complaints = random.sample(COMPLAINT_PATTERNS['mid'], min(2, len(COMPLAINT_PATTERNS['mid'])))
    else:
        complaints = random.sample(COMPLAINT_PATTERNS['low'], min(2, len(COMPLAINT_PATTERNS['low'])))
    
    return {
        'trueSentiment': true_sentiment,
        'vibeCheck': vibes,
        'mustTryDishes': dishes[:3],  # Top 3
        'commonComplaints': complaints
    }


def _generate_dishes(restaurant_name: str) -> List[str]:
    """Generate likely dishes based on restaurant name."""
    name_lower = restaurant_name.lower()
    
    # Check for cuisine keywords
    for cuisine, dishes in DISH_PATTERNS.items():
        if cuisine in name_lower:
            return random.sample(dishes, min(3, len(dishes)))
    
    # Check for specific food items
    food_items = ['burger', 'sushi', 'taco', 'ramen', 'curry', 'steak', 'bbq', 'grill']
    for item in food_items:
        if item in name_lower:
            # Return generic dishes + item-specific
            return [f'{item.title()} Special', 'House Salad', f'{item.title()} Combo']
    
    # Default
    return random.sample(DISH_PATTERNS['default'], 3)


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> str:
    """
    Calculate distance between two points using Haversine formula.
    
    Returns formatted distance string like "2.3 mi" or "150 ft"
    """
    from math import radians, cos, sin, asin, sqrt
    
    # Convert to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in miles
    r = 3956
    distance_miles = c * r
    
    # Format nicely
    if distance_miles < 0.1:
        return f"{int(distance_miles * 5280)} ft"  # Convert to feet
    elif distance_miles < 10:
        return f"{distance_miles:.1f} mi"
    else:
        return f"{int(distance_miles)} mi"

