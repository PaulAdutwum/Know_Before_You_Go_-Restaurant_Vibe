#!/usr/bin/env python3
"""
Database Setup Script for VibeFinder

This script initializes the PostgreSQL database with all required tables.
Run this once after installing PostgreSQL.

Usage:
    python setup_db.py
"""
import sys
import logging
from app.models.database import init_db, get_engine
from sqlalchemy import inspect

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def check_database_connection():
    """Verify database connection"""
    try:
        engine = get_engine()
        connection = engine.connect()
        connection.close()
        logger.info("✅ Database connection successful!")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        logger.error("\nPlease check:")
        logger.error("1. PostgreSQL is installed: brew install postgresql@14")
        logger.error("2. PostgreSQL is running: brew services start postgresql@14")
        logger.error("3. Database exists: createdb vibefinder")
        logger.error("4. DATABASE_URL in .env is correct")
        return False


def check_existing_tables():
    """Check if tables already exist"""
    try:
        engine = get_engine()
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if existing_tables:
            logger.info(f"⚠️  Found existing tables: {', '.join(existing_tables)}")
            return existing_tables
        else:
            logger.info("ℹ️  No existing tables found. Creating fresh database.")
            return []
    except Exception as e:
        logger.error(f"❌ Error checking tables: {e}")
        return []


def main():
    """Main setup function"""
    print("=" * 60)
    print("🗄️  VibeFinder Database Setup")
    print("=" * 60)
    print()
    
    # Step 1: Check database connection
    logger.info("Step 1: Checking database connection...")
    if not check_database_connection():
        sys.exit(1)
    
    print()
    
    # Step 2: Check for existing tables
    logger.info("Step 2: Checking for existing tables...")
    existing_tables = check_existing_tables()
    
    print()
    
    # Step 3: Create tables
    logger.info("Step 3: Creating tables...")
    try:
        init_db()
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
        sys.exit(1)
    
    print()
    
    # Step 4: Verify tables
    logger.info("Step 4: Verifying tables...")
    try:
        engine = get_engine()
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        expected_tables = ['restaurants', 'reviews', 'scraping_jobs']
        
        logger.info(f"✅ Created tables: {', '.join(tables)}")
        
        # Check if all expected tables exist
        missing_tables = set(expected_tables) - set(tables)
        if missing_tables:
            logger.warning(f"⚠️  Missing tables: {', '.join(missing_tables)}")
        else:
            logger.info("✅ All expected tables created successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error verifying tables: {e}")
        sys.exit(1)
    
    print()
    print("=" * 60)
    print("🎉 Database setup complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Start Redis: brew services start redis")
    print("2. Start backend: uvicorn app.main:app --reload")
    print("3. Start Celery worker: celery -A celery_worker worker --loglevel=info")
    print("4. Start frontend: cd ../frontend && npm run dev")
    print()


if __name__ == "__main__":
    main()
