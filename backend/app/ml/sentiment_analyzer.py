"""
Sentiment Analysis Module

Uses VADER (Valence Aware Dictionary and sEntiment Reasoner) to analyze
the sentiment of restaurant reviews and calculate "True Sentiment" scores.

VADER is perfect for social media and review text because it:
- Understands slang, emoticons, and informal language
- Handles negation and intensifiers well
- Is fast and doesn't require training
"""

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from typing import List
import logging

logger = logging.getLogger(__name__)


class SentimentAnalyzer:
    """Sentiment analysis using VADER"""
    
    def __init__(self):
        """Initialize VADER sentiment analyzer"""
        try:
            self.analyzer = SentimentIntensityAnalyzer()
            logger.info("VADER sentiment analyzer initialized")
        except Exception as e:
            logger.error(f"Failed to initialize VADER: {e}")
            self.analyzer = None
    
    def analyze(self, reviews: List[str]) -> str:
        """
        Analyze sentiment of a list of reviews and return overall sentiment.
        
        Args:
            reviews: List of review texts
            
        Returns:
            Sentiment string like "82% Positive"
        """
        
        if not self.analyzer:
            logger.warning("VADER not initialized, returning default sentiment")
            return "N/A"
        
        if not reviews or len(reviews) == 0:
            return "No reviews"
        
        try:
            # Analyze each review
            sentiments = []
            for review in reviews:
                # Get compound score (ranges from -1 to 1)
                scores = self.analyzer.polarity_scores(review)
                compound = scores['compound']
                sentiments.append(compound)
            
            # Calculate average sentiment
            avg_sentiment = sum(sentiments) / len(sentiments)
            
            # Convert to percentage and categorize
            # VADER compound scores:
            # - positive sentiment: compound >= 0.05
            # - neutral sentiment: -0.05 < compound < 0.05
            # - negative sentiment: compound <= -0.05
            
            # Convert from [-1, 1] to [0, 100] percentage
            # We'll consider 0.5 as neutral and scale accordingly
            percentage = int((avg_sentiment + 1) / 2 * 100)
            
            # Categorize
            if avg_sentiment >= 0.5:
                category = "Very Positive"
            elif avg_sentiment >= 0.05:
                category = "Positive"
            elif avg_sentiment >= -0.05:
                category = "Neutral"
            elif avg_sentiment >= -0.5:
                category = "Negative"
            else:
                category = "Very Negative"
            
            result = f"{percentage}% {category}"
            logger.info(f"Sentiment analysis result: {result}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return "Analysis Error"
    
    def analyze_single_review(self, review: str) -> dict:
        """
        Analyze sentiment of a single review.
        
        Args:
            review: Review text
            
        Returns:
            Dictionary with sentiment scores
        """
        
        if not self.analyzer:
            return {'compound': 0, 'pos': 0, 'neu': 0, 'neg': 0}
        
        try:
            scores = self.analyzer.polarity_scores(review)
            return scores
        except Exception as e:
            logger.error(f"Error analyzing single review: {e}")
            return {'compound': 0, 'pos': 0, 'neu': 0, 'neg': 0}
    
    def get_positive_reviews(self, reviews: List[str], threshold: float = 0.05) -> List[str]:
        """
        Filter and return only positive reviews.
        
        Args:
            reviews: List of review texts
            threshold: Minimum compound score to be considered positive
            
        Returns:
            List of positive reviews
        """
        
        positive = []
        for review in reviews:
            scores = self.analyze_single_review(review)
            if scores['compound'] >= threshold:
                positive.append(review)
        
        return positive
    
    def get_negative_reviews(self, reviews: List[str], threshold: float = -0.05) -> List[str]:
        """
        Filter and return only negative reviews.
        
        Args:
            reviews: List of review texts
            threshold: Maximum compound score to be considered negative
            
        Returns:
            List of negative reviews
        """
        
        negative = []
        for review in reviews:
            scores = self.analyze_single_review(review)
            if scores['compound'] <= threshold:
                negative.append(review)
        
        return negative

