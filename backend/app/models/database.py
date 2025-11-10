"""
Database Models

SQLAlchemy models for PostgreSQL database.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from datetime import datetime
from app.core.config import settings

Base = declarative_base()


class Restaurant(Base):
    """Restaurant model - stores basic restaurant information"""
    
    __tablename__ = "restaurants"
    
    id = Column(Integer, primary_key=True, index=True)
    place_id = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    rating = Column(Float, default=0.0)
    address = Column(Text)
    total_ratings = Column(Integer, default=0)
    last_scraped = Column(DateTime, nullable=True)  # When reviews were last scraped
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reviews = relationship("Review", back_populates="restaurant", cascade="all, delete-orphan")
    scraping_jobs = relationship("ScrapingJob", back_populates="restaurant", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Restaurant(id={self.id}, name='{self.name}', rating={self.rating})>"


class Review(Base):
    """Review model - stores scraped reviews"""
    
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    review_text = Column(Text, nullable=False)
    rating = Column(Float)
    author = Column(String(255))
    review_date = Column(String(100))
    sentiment_score = Column(Float)  # Compound sentiment score from VADER
    source = Column(String(50), default='google_maps')  # 'google_maps', 'reddit', 'yelp'
    scraped_at = Column(DateTime, default=datetime.utcnow)  # When review was scraped
    is_processed = Column(Boolean, default=False)  # Whether ML analysis is complete
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review(id={self.id}, restaurant_id={self.restaurant_id}, rating={self.rating}, source={self.source})>"


class ScrapingJob(Base):
    """Scraping job model - tracks background scraping tasks"""
    
    __tablename__ = "scraping_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    place_id = Column(String(255), nullable=False)
    status = Column(String(50), default='pending')  # pending, running, completed, failed
    reviews_scraped = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    restaurant = relationship("Restaurant", back_populates="scraping_jobs")
    
    def __repr__(self):
        return f"<ScrapingJob(id={self.id}, place_id='{self.place_id}', status='{self.status}')>"


# Database engine and session
def get_engine():
    """Create database engine"""
    return create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        echo=settings.DEBUG
    )


def get_session_local():
    """Create database session factory"""
    engine = get_engine()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal


def init_db():
    """Initialize database - create all tables"""
    engine = get_engine()
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


def get_db():
    """Dependency for getting database session"""
    SessionLocal = get_session_local()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

