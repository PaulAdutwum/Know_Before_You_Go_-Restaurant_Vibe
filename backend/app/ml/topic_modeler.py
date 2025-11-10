"""
Topic Modeling Module

Uses Latent Dirichlet Allocation (LDA) to discover hidden topics in reviews
and maps them to "vibe" tags like #Romantic, #Loud, #FamilyFriendly, etc.

This is the core of the "Vibe Check" feature.
"""

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from typing import List, Dict, Set
import logging
import re

logger = logging.getLogger(__name__)


class TopicModeler:
    """Topic modeling for vibe detection using LDA"""
    
    def __init__(self, n_topics: int = 3, n_top_words: int = 10):
        """
        Initialize topic modeler.
        
        Args:
            n_topics: Number of topics to extract
            n_top_words: Number of top words per topic
        """
        self.n_topics = n_topics
        self.n_top_words = n_top_words
        
        # Define vibe mappings: keywords -> vibe tags
        self.vibe_mappings = {
            'romantic': {
                'keywords': ['date', 'romantic', 'quiet', 'intimate', 'cozy', 'wine', 'candle', 'couple', 'anniversary', 'special'],
                'tag': '#Romantic'
            },
            'loud': {
                'keywords': ['loud', 'noisy', 'busy', 'crowded', 'energetic', 'lively', 'bar', 'music', 'upbeat'],
                'tag': '#Loud'
            },
            'family': {
                'keywords': ['family', 'kids', 'children', 'highchair', 'friendly', 'casual', 'comfortable', 'welcoming'],
                'tag': '#FamilyFriendly'
            },
            'groups': {
                'keywords': ['group', 'friends', 'party', 'large', 'social', 'fun', 'gathering', 'celebration'],
                'tag': '#GoodForGroups'
            },
            'quiet': {
                'keywords': ['quiet', 'peaceful', 'calm', 'relaxed', 'serene', 'tranquil', 'intimate'],
                'tag': '#Quiet'
            },
            'upscale': {
                'keywords': ['upscale', 'fancy', 'elegant', 'sophisticated', 'fine', 'expensive', 'classy', 'luxury'],
                'tag': '#Upscale'
            },
            'casual': {
                'keywords': ['casual', 'relaxed', 'laid-back', 'informal', 'easy', 'simple', 'comfortable'],
                'tag': '#Casual'
            },
            'fresh': {
                'keywords': ['fresh', 'healthy', 'organic', 'natural', 'clean', 'light', 'quality'],
                'tag': '#Fresh'
            },
            'authentic': {
                'keywords': ['authentic', 'traditional', 'genuine', 'real', 'original', 'classic'],
                'tag': '#Authentic'
            },
            'modern': {
                'keywords': ['modern', 'contemporary', 'innovative', 'creative', 'unique', 'trendy'],
                'tag': '#Modern'
            },
            'cozy': {
                'keywords': ['cozy', 'warm', 'comfortable', 'homey', 'welcoming', 'inviting'],
                'tag': '#Cozy'
            },
            'outdoor': {
                'keywords': ['outdoor', 'patio', 'terrace', 'garden', 'outside', 'alfresco'],
                'tag': '#OutdoorSeating'
            }
        }
        
        logger.info(f"Topic modeler initialized with {n_topics} topics")
    
    def extract_vibes(self, reviews: List[str], max_vibes: int = 5) -> List[str]:
        """
        Extract vibe tags from reviews using topic modeling.
        
        Args:
            reviews: List of review texts
            max_vibes: Maximum number of vibe tags to return
            
        Returns:
            List of vibe tags (e.g., ['#Romantic', '#Quiet'])
        """
        
        if not reviews or len(reviews) < 3:
            logger.warning("Not enough reviews for topic modeling")
            return ["#NotEnoughData"]
        
        try:
            # Preprocess reviews
            cleaned_reviews = [self._preprocess_text(review) for review in reviews]
            
            # Method 1: Direct keyword matching (fast and reliable)
            keyword_vibes = self._extract_vibes_by_keywords(cleaned_reviews)
            
            # Method 2: Topic modeling with LDA (more sophisticated)
            # Only run if we have enough data
            if len(reviews) >= 10:
                try:
                    lda_vibes = self._extract_vibes_by_lda(cleaned_reviews)
                    # Combine both methods
                    all_vibes = list(set(keyword_vibes + lda_vibes))
                except Exception as e:
                    logger.warning(f"LDA failed, using keyword method only: {e}")
                    all_vibes = keyword_vibes
            else:
                all_vibes = keyword_vibes
            
            # Return top vibes
            result = all_vibes[:max_vibes] if all_vibes else ["#NoVibeDetected"]
            logger.info(f"Extracted vibes: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error extracting vibes: {e}")
            return ["#AnalysisError"]
    
    def _preprocess_text(self, text: str) -> str:
        """Clean and preprocess review text"""
        # Convert to lowercase
        text = text.lower()
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-z\s]', ' ', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text
    
    def _extract_vibes_by_keywords(self, reviews: List[str]) -> List[str]:
        """
        Extract vibes by counting keyword occurrences.
        This is a simple but effective method.
        """
        
        vibe_scores = {}
        combined_text = ' '.join(reviews).lower()
        
        for vibe_name, vibe_data in self.vibe_mappings.items():
            score = 0
            for keyword in vibe_data['keywords']:
                # Count occurrences of each keyword
                count = combined_text.count(keyword)
                score += count
            
            if score > 0:
                vibe_scores[vibe_data['tag']] = score
        
        # Sort by score and return tags
        sorted_vibes = sorted(vibe_scores.items(), key=lambda x: x[1], reverse=True)
        return [vibe[0] for vibe in sorted_vibes]
    
    def _extract_vibes_by_lda(self, reviews: List[str]) -> List[str]:
        """
        Extract vibes using LDA topic modeling.
        More sophisticated but requires more data.
        """
        
        try:
            # Create document-term matrix
            vectorizer = CountVectorizer(
                max_features=100,
                stop_words='english',
                min_df=2,
                max_df=0.8
            )
            
            doc_term_matrix = vectorizer.fit_transform(reviews)
            
            # Run LDA
            lda = LatentDirichletAllocation(
                n_components=self.n_topics,
                random_state=42,
                max_iter=20
            )
            
            lda.fit(doc_term_matrix)
            
            # Get feature names (words)
            feature_names = vectorizer.get_feature_names_out()
            
            # Extract top words for each topic
            topic_words = []
            for topic_idx, topic in enumerate(lda.components_):
                top_indices = topic.argsort()[-self.n_top_words:][::-1]
                top_words = [feature_names[i] for i in top_indices]
                topic_words.extend(top_words)
            
            # Map topic words to vibes
            detected_vibes = set()
            for word in topic_words:
                for vibe_name, vibe_data in self.vibe_mappings.items():
                    if word in vibe_data['keywords']:
                        detected_vibes.add(vibe_data['tag'])
            
            return list(detected_vibes)
            
        except Exception as e:
            logger.error(f"LDA topic modeling failed: {e}")
            return []

