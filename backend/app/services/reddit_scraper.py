"""
Reddit Scraper

Searches Reddit for restaurant mentions and sentiment data.
Uses PRAW (Python Reddit API Wrapper) - fully legal with API access.
"""

import praw
from praw.exceptions import PRAWException
import logging
import os
from typing import List, Dict
from datetime import datetime

logger = logging.getLogger(__name__)


class RedditScraper:
    """Scrapes restaurant mentions from Reddit"""
    
    def __init__(self):
        """Initialize Reddit API client"""
        self.client_id = os.getenv('REDDIT_CLIENT_ID', '')
        self.client_secret = os.getenv('REDDIT_CLIENT_SECRET', '')
        self.user_agent = os.getenv('REDDIT_USER_AGENT', 'VibeFinder/1.0')
        
        self.reddit = None
        
        if self.client_id and self.client_secret:
            try:
                self.reddit = praw.Reddit(
                    client_id=self.client_id,
                    client_secret=self.client_secret,
                    user_agent=self.user_agent
                )
                logger.info("Reddit API client initialized successfully")
            except Exception as e:
                logger.warning(f"Failed to initialize Reddit client: {e}")
        else:
            logger.warning("Reddit API credentials not configured")
    
    def search_restaurant_mentions(self, restaurant_name: str, location: str = None, limit: int = 50) -> List[Dict]:
        """
        Search Reddit for mentions of a restaurant
        
        Args:
            restaurant_name: Name of the restaurant
            location: Location/city (optional, helps narrow results)
            limit: Maximum number of results
            
        Returns:
            List of dicts with text, author, date
        """
        if not self.reddit:
            logger.warning("Reddit client not initialized, skipping search")
            return []
        
        mentions = []
        
        try:
            # Build search query
            query = f'"{restaurant_name}"'
            if location:
                # Extract city name from location
                city = location.split(',')[0].strip()
                query += f' {city}'
            
            logger.info(f"Searching Reddit for: {query}")
            
            # Search relevant subreddits
            subreddits = [
                'food',
                'restaurant',
                'FoodPorn',
                'AskCulinary',
                'Cooking'
            ]
            
            # Add location-specific subreddit if available
            if location:
                city = location.split(',')[0].strip().replace(' ', '')
                subreddits.append(city)
            
            # Search each subreddit
            for subreddit_name in subreddits:
                try:
                    subreddit = self.reddit.subreddit(subreddit_name)
                    
                    # Search posts
                    for submission in subreddit.search(query, limit=10):
                        # Add post title and body
                        if submission.selftext and len(submission.selftext) > 50:
                            mentions.append({
                                'text': f"{submission.title}\n\n{submission.selftext}",
                                'author': str(submission.author) if submission.author else 'deleted',
                                'date': datetime.fromtimestamp(submission.created_utc).strftime('%Y-%m-%d'),
                                'score': submission.score,
                                'type': 'post'
                            })
                        
                        # Get top comments
                        submission.comments.replace_more(limit=0)
                        for comment in submission.comments.list()[:5]:
                            if hasattr(comment, 'body') and len(comment.body) > 30:
                                # Check if comment mentions the restaurant
                                if restaurant_name.lower() in comment.body.lower():
                                    mentions.append({
                                        'text': comment.body,
                                        'author': str(comment.author) if comment.author else 'deleted',
                                        'date': datetime.fromtimestamp(comment.created_utc).strftime('%Y-%m-%d'),
                                        'score': comment.score,
                                        'type': 'comment'
                                    })
                        
                        if len(mentions) >= limit:
                            break
                    
                except Exception as e:
                    logger.debug(f"Error searching subreddit {subreddit_name}: {e}")
                    continue
                
                if len(mentions) >= limit:
                    break
            
            logger.info(f"Found {len(mentions)} Reddit mentions for {restaurant_name}")
            
        except PRAWException as e:
            logger.error(f"Reddit API error: {e}")
        except Exception as e:
            logger.error(f"Error searching Reddit: {e}")
        
        return mentions[:limit]
    
    def get_subreddit_posts(self, subreddit_name: str, query: str, limit: int = 20) -> List[Dict]:
        """
        Get posts from a specific subreddit
        
        Args:
            subreddit_name: Name of the subreddit
            query: Search query
            limit: Maximum number of posts
            
        Returns:
            List of post dicts
        """
        if not self.reddit:
            return []
        
        posts = []
        
        try:
            subreddit = self.reddit.subreddit(subreddit_name)
            
            for submission in subreddit.search(query, limit=limit):
                posts.append({
                    'title': submission.title,
                    'text': submission.selftext,
                    'author': str(submission.author) if submission.author else 'deleted',
                    'date': datetime.fromtimestamp(submission.created_utc).strftime('%Y-%m-%d'),
                    'score': submission.score,
                    'url': submission.url
                })
        
        except Exception as e:
            logger.error(f"Error getting subreddit posts: {e}")
        
        return posts

