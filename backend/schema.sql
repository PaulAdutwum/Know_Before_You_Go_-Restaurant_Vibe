-- VibeFinder Database Schema
-- This SQL script defines the tables used by the backend.
-- Used it as a reference for database migrations.

CREATE TABLE IF NOT EXISTS restaurants (
    id SERIAL PRIMARY KEY,
    place_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    rating FLOAT DEFAULT 0.0,
    address TEXT,
    total_ratings INTEGER DEFAULT 0,
    last_scraped TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    review_text TEXT NOT NULL,
    rating FLOAT,
    author VARCHAR(255),
    review_date VARCHAR(100),
    sentiment_score FLOAT,
    source VARCHAR(50) DEFAULT 'google_maps',
    scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraping_jobs (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    place_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    reviews_scraped INTEGER DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
