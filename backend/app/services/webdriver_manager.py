"""
WebDriver Manager

Handles Chrome WebDriver setup, configuration, and lifecycle management.
"""

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import logging
import random

logger = logging.getLogger(__name__)


class WebDriverManager:
    """Manages Chrome WebDriver instances"""
    
    # User agents for rotation
    USER_AGENTS = [
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ]
    
    def __init__(self, headless=True):
        """
        Initialize WebDriver Manager
        
        Args:
            headless: Run browser in headless mode (no GUI)
        """
        self.headless = headless
        self.driver = None
    
    def get_driver(self):
        """
        Create and configure a Chrome WebDriver instance
        
        Returns:
            WebDriver instance
        """
        if self.driver:
            return self.driver
        
        try:
            # Configure Chrome options
            chrome_options = Options()
            
            if self.headless:
                chrome_options.add_argument('--headless=new')
            
            # Essential options for scraping
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            chrome_options.add_argument('--disable-blink-features=AutomationControlled')
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Random user agent
            user_agent = random.choice(self.USER_AGENTS)
            chrome_options.add_argument(f'user-agent={user_agent}')
            
            # Window size (important even in headless)
            chrome_options.add_argument('--window-size=1920,1080')
            
            # Disable images for faster loading
            prefs = {
                "profile.managed_default_content_settings.images": 2,
                "profile.default_content_setting_values.notifications": 2,
            }
            chrome_options.add_experimental_option("prefs", prefs)
            
            # Auto-download and setup ChromeDriver
            service = Service(ChromeDriverManager().install())
            
            # Create driver
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Set timeouts
            self.driver.set_page_load_timeout(30)
            self.driver.implicitly_wait(10)
            
            logger.info("Chrome WebDriver initialized successfully")
            return self.driver
            
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            raise
    
    def close(self):
        """Close and cleanup WebDriver"""
        if self.driver:
            try:
                self.driver.quit()
                self.driver = None
                logger.info("WebDriver closed successfully")
            except Exception as e:
                logger.error(f"Error closing WebDriver: {e}")
    
    def __enter__(self):
        """Context manager entry"""
        return self.get_driver()
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()

