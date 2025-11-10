"""
Google Maps Review Scraper

Scrapes restaurant reviews from Google Maps using Selenium.
NOTE: This is against Google's TOS - for educational/prototype use only.
"""

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time
import logging
from typing import List, Dict
from app.services.webdriver_manager import WebDriverManager

logger = logging.getLogger(__name__)


class GoogleMapsScraper:
    """Scrapes reviews from Google Maps"""
    
    def __init__(self, delay_seconds=2):
        """
        Initialize scraper
        
        Args:
            delay_seconds: Delay between requests (rate limiting)
        """
        self.delay_seconds = delay_seconds
        self.webdriver_manager = WebDriverManager(headless=True)
    
    def scrape_restaurant_reviews(self, place_id: str, max_reviews: int = 100) -> List[Dict]:
        """
        Scrape reviews for a restaurant from Google Maps
        
        Args:
            place_id: Google Places ID
            max_reviews: Maximum number of reviews to scrape
            
        Returns:
            List of review dictionaries with text, rating, author, date
        """
        reviews = []
        
        try:
            driver = self.webdriver_manager.get_driver()
            
            # Build Google Maps URL with place_id
            url = f"https://www.google.com/maps/search/?api=1&query=Google&query_place_id={place_id}"
            logger.info(f"Navigating to Google Maps for place_id: {place_id}")
            
            driver.get(url)
            time.sleep(self.delay_seconds)
            
            # Wait for page to load
            try:
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[role='main']"))
                )
            except TimeoutException:
                logger.warning("Page load timeout, continuing anyway...")
            
            # Try to find and click the reviews tab
            try:
                # Look for reviews button/tab
                reviews_button = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label*='Reviews']"))
                )
                reviews_button.click()
                time.sleep(2)
                logger.info("Clicked on reviews tab")
            except Exception as e:
                logger.warning(f"Could not click reviews tab: {e}")
                # Try alternative method - scroll to reviews section
                try:
                    reviews_section = driver.find_element(By.CSS_SELECTOR, "div[aria-label*='Reviews']")
                    driver.execute_script("arguments[0].scrollIntoView();", reviews_section)
                    time.sleep(2)
                except:
                    pass
            
            # Scroll to load more reviews
            reviews_container = self._find_scrollable_element(driver)
            if reviews_container:
                self._scroll_reviews(driver, reviews_container, max_reviews)
            
            # Extract reviews
            reviews = self._extract_reviews(driver, max_reviews)
            
            logger.info(f"Successfully scraped {len(reviews)} reviews for place_id: {place_id}")
            
        except Exception as e:
            logger.error(f"Error scraping reviews for place_id {place_id}: {e}")
        
        finally:
            # Don't close driver yet - reuse for next scrape
            pass
        
        return reviews
    
    def _find_scrollable_element(self, driver):
        """Find the scrollable reviews container"""
        selectors = [
            "div[role='feed']",
            "div.m6QErb",
            "div[aria-label*='Reviews']",
            "div.section-scrollbox"
        ]
        
        for selector in selectors:
            try:
                element = driver.find_element(By.CSS_SELECTOR, selector)
                if element:
                    logger.info(f"Found scrollable element with selector: {selector}")
                    return element
            except NoSuchElementException:
                continue
        
        logger.warning("Could not find scrollable reviews container")
        return None
    
    def _scroll_reviews(self, driver, container, max_reviews):
        """Scroll through reviews to load more"""
        logger.info("Starting to scroll reviews...")
        
        last_height = driver.execute_script("return arguments[0].scrollHeight", container)
        scrolls = 0
        max_scrolls = 20  # Limit to avoid infinite scrolling
        
        while scrolls < max_scrolls:
            # Scroll down
            driver.execute_script("arguments[0].scrollTo(0, arguments[0].scrollHeight)", container)
            time.sleep(1.5)
            
            # Calculate new height
            new_height = driver.execute_script("return arguments[0].scrollHeight", container)
            
            # Check if we've reached the bottom
            if new_height == last_height:
                logger.info("Reached end of reviews")
                break
            
            last_height = new_height
            scrolls += 1
            
            # Check if we have enough reviews
            review_elements = driver.find_elements(By.CSS_SELECTOR, "div.jftiEf, div[data-review-id], div.gws-localreviews__google-review")
            if len(review_elements) >= max_reviews:
                logger.info(f"Loaded enough reviews: {len(review_elements)}")
                break
        
        logger.info(f"Completed {scrolls} scrolls")
    
    def _extract_reviews(self, driver, max_reviews) -> List[Dict]:
        """Extract review data from loaded page"""
        reviews = []
        
        # Multiple selectors to try (Google Maps HTML changes frequently)
        selectors = [
            "div.jftiEf",
            "div[data-review-id]",
            "div.gws-localreviews__google-review",
            "div.section-review"
        ]
        
        review_elements = []
        for selector in selectors:
            review_elements = driver.find_elements(By.CSS_SELECTOR, selector)
            if review_elements:
                logger.info(f"Found {len(review_elements)} reviews with selector: {selector}")
                break
        
        if not review_elements:
            logger.warning("No review elements found")
            return reviews
        
        for idx, element in enumerate(review_elements[:max_reviews]):
            try:
                review_data = self._parse_review_element(element, driver)
                if review_data and review_data['text']:
                    reviews.append(review_data)
            except Exception as e:
                logger.debug(f"Error parsing review {idx}: {e}")
                continue
        
        return reviews
    
    def _parse_review_element(self, element, driver) -> Dict:
        """Parse individual review element"""
        review = {
            'text': '',
            'rating': None,
            'author': '',
            'date': ''
        }
        
        try:
            # Extract review text
            text_selectors = [
                "span.wiI7pd",
                "span[data-expandable-section]",
                "div.MyEned",
                "span.review-full-text"
            ]
            
            for selector in text_selectors:
                try:
                    # Check if there's a "More" button and click it
                    try:
                        more_button = element.find_element(By.CSS_SELECTOR, "button[aria-label*='More']")
                        driver.execute_script("arguments[0].click();", more_button)
                        time.sleep(0.3)
                    except:
                        pass
                    
                    text_element = element.find_element(By.CSS_SELECTOR, selector)
                    review['text'] = text_element.text.strip()
                    if review['text']:
                        break
                except NoSuchElementException:
                    continue
            
            # Extract rating (count stars)
            try:
                stars = element.find_elements(By.CSS_SELECTOR, "span.hCCjke[aria-label*='stars'], span[aria-label*='stars']")
                if stars:
                    aria_label = stars[0].get_attribute('aria-label')
                    if aria_label:
                        rating_str = aria_label.split()[0]
                        review['rating'] = float(rating_str)
            except:
                pass
            
            # Extract author name
            try:
                author_selectors = ["div.d4r55", "span.x3PK2d", "div.TSUbDb"]
                for selector in author_selectors:
                    try:
                        author_element = element.find_element(By.CSS_SELECTOR, selector)
                        review['author'] = author_element.text.strip()
                        if review['author']:
                            break
                    except NoSuchElementException:
                        continue
            except:
                pass
            
            # Extract date
            try:
                date_selectors = ["span.rsqaWe", "span.DZVBPb", "span.dehysf"]
                for selector in date_selectors:
                    try:
                        date_element = element.find_element(By.CSS_SELECTOR, selector)
                        review['date'] = date_element.text.strip()
                        if review['date']:
                            break
                    except NoSuchElementException:
                        continue
            except:
                pass
            
        except Exception as e:
            logger.debug(f"Error in _parse_review_element: {e}")
        
        return review
    
    def close(self):
        """Close the WebDriver"""
        self.webdriver_manager.close()
    
    def __enter__(self):
        """Context manager entry"""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()

