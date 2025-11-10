"""
Keyword Extraction Module

Extracts key phrases from reviews to identify:
1. Must-try dishes (food items mentioned frequently)
2. Common complaints (negative phrases)

Uses TF-IDF and basic NLP techniques.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from typing import List, Dict, Tuple
import logging
import re
from collections import Counter

logger = logging.getLogger(__name__)


class KeywordExtractor:
    """Extract keywords and phrases from reviews"""
    
    def __init__(self):
        """Initialize keyword extractor"""
        
        # Common food-related words
        self.food_indicators = [
            'pizza', 'burger', 'pasta', 'salad', 'sandwich', 'steak', 'chicken',
            'fish', 'salmon', 'tuna', 'shrimp', 'lobster', 'crab', 'soup',
            'dessert', 'cake', 'pie', 'ice cream', 'appetizer', 'entree',
            'sushi', 'roll', 'rice', 'noodle', 'taco', 'burrito', 'wings',
            'ribs', 'bbq', 'fries', 'nachos', 'quesadilla', 'wrap', 'panini'
        ]
        
        # Complaint keywords
        self.complaint_keywords = [
            'slow', 'wait', 'cold', 'expensive', 'pricey', 'small', 'tiny',
            'rude', 'bad', 'terrible', 'awful', 'disappointing', 'disappointed',
            'dirty', 'loud', 'crowded', 'overpriced', 'burnt', 'undercooked',
            'bland', 'flavorless', 'tasteless', 'stale', 'soggy', 'greasy'
        ]
        
        logger.info("Keyword extractor initialized")
    
    def extract_dishes(self, reviews: List[str], top_n: int = 5) -> List[str]:
        """
        Extract must-try dishes from reviews.
        
        Args:
            reviews: List of review texts
            top_n: Number of top dishes to return
            
        Returns:
            List of dish names
        """
        
        if not reviews or len(reviews) == 0:
            return []
        
        try:
            # Method 1: TF-IDF for finding important food terms
            dishes_tfidf = self._extract_dishes_tfidf(reviews, top_n * 2)
            
            # Method 2: Pattern matching for food phrases
            dishes_pattern = self._extract_dishes_patterns(reviews, top_n * 2)
            
            # Combine and rank
            all_dishes = dishes_tfidf + dishes_pattern
            dish_counts = Counter(all_dishes)
            
            # Get top dishes
            top_dishes = [dish for dish, count in dish_counts.most_common(top_n)]
            
            logger.info(f"Extracted dishes: {top_dishes}")
            return top_dishes
            
        except Exception as e:
            logger.error(f"Error extracting dishes: {e}")
            return []
    
    def extract_complaints(self, reviews: List[str], top_n: int = 3) -> List[str]:
        """
        Extract common complaints from reviews.
        
        Args:
            reviews: List of review texts
            top_n: Number of top complaints to return
            
        Returns:
            List of complaint phrases
        """
        
        if not reviews or len(reviews) == 0:
            return []
        
        try:
            complaints = []
            
            for review in reviews:
                # Look for complaint patterns
                review_lower = review.lower()
                
                # Find sentences with complaint keywords
                sentences = re.split(r'[.!?]', review_lower)
                
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue
                    
                    # Check if sentence contains complaint keywords
                    if any(keyword in sentence for keyword in self.complaint_keywords):
                        # Clean and format the complaint
                        complaint = self._format_complaint(sentence)
                        if complaint and len(complaint.split()) >= 2:
                            complaints.append(complaint)
            
            # Count and rank complaints
            if not complaints:
                return []
            
            complaint_counts = Counter(complaints)
            top_complaints = [complaint for complaint, count in complaint_counts.most_common(top_n)]
            
            logger.info(f"Extracted complaints: {top_complaints}")
            return top_complaints
            
        except Exception as e:
            logger.error(f"Error extracting complaints: {e}")
            return []
    
    def _extract_dishes_tfidf(self, reviews: List[str], top_n: int) -> List[str]:
        """Extract dishes using TF-IDF"""
        
        try:
            # Focus on n-grams (2-3 words) which are likely dish names
            vectorizer = TfidfVectorizer(
                ngram_range=(1, 3),
                max_features=100,
                stop_words='english',
                min_df=2
            )
            
            tfidf_matrix = vectorizer.fit_transform(reviews)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get average TF-IDF scores
            avg_scores = tfidf_matrix.mean(axis=0).A1
            top_indices = avg_scores.argsort()[-top_n * 2:][::-1]
            
            # Filter for food-related terms
            dishes = []
            for idx in top_indices:
                term = feature_names[idx]
                # Check if it's likely a dish (contains food indicator or is capitalized in reviews)
                if any(food in term for food in self.food_indicators) or self._is_likely_dish(term):
                    dishes.append(self._format_dish_name(term))
            
            return dishes[:top_n]
            
        except Exception as e:
            logger.error(f"TF-IDF extraction failed: {e}")
            return []
    
    def _extract_dishes_patterns(self, reviews: List[str], top_n: int) -> List[str]:
        """Extract dishes using pattern matching"""
        
        dishes = []
        
        # Patterns that indicate a dish mention
        patterns = [
            r'the ([a-z\s]{3,30}?) (?:is|was|were) (?:delicious|amazing|great|excellent|fantastic|perfect|outstanding)',
            r'(?:try|tried|recommend|order|get) the ([a-z\s]{3,30})',
            r'([a-z\s]{3,30}?) (?:is|was) (?:must try|must-try|a must)',
            r'best ([a-z\s]{3,30})',
            r'love(?:d)? the ([a-z\s]{3,30})'
        ]
        
        for review in reviews:
            review_lower = review.lower()
            
            for pattern in patterns:
                matches = re.findall(pattern, review_lower)
                for match in matches:
                    match = match.strip()
                    # Filter out very long or very short matches
                    if 3 <= len(match) <= 30 and self._is_likely_dish(match):
                        dishes.append(self._format_dish_name(match))
        
        return dishes
    
    def _is_likely_dish(self, term: str) -> bool:
        """Check if a term is likely a dish name"""
        # Check if it contains food indicators
        if any(food in term.lower() for food in self.food_indicators):
            return True
        
        # Check if it's a proper noun phrase (2-3 words, some capitalized)
        words = term.split()
        if 1 <= len(words) <= 4:
            return True
        
        return False
    
    def _format_dish_name(self, dish: str) -> str:
        """Format dish name properly (title case)"""
        # Remove extra whitespace
        dish = ' '.join(dish.split())
        # Title case
        dish = dish.title()
        return dish
    
    def _format_complaint(self, sentence: str) -> str:
        """Format complaint sentence"""
        # Remove extra whitespace
        sentence = ' '.join(sentence.split())
        # Capitalize first letter
        if sentence:
            sentence = sentence[0].upper() + sentence[1:]
        # Limit length
        if len(sentence) > 60:
            sentence = sentence[:60] + '...'
        return sentence

