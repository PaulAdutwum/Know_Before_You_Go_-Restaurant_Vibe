# 🗄️ Database Setup for Scraping System

## Quick Setup Guide

### 1. Install PostgreSQL

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Option A: Using createdb command
createdb vibefinder

# Option B: Using psql
psql postgres
CREATE DATABASE vibefinder;
CREATE USER vibefinder WITH PASSWORD 'vibefinder';
GRANT ALL PRIVILEGES ON DATABASE vibefinder TO vibefinder;
\q
```

### 3. Initialize Tables

```bash
cd backend
source venv/bin/activate
python setup_db.py
```

This creates:
- `restaurants` table - Basic restaurant info + last_scraped timestamp
- `reviews` table - Scraped reviews with source (google_maps/reddit)
- `scraping_jobs` table - Track background scraping tasks

### 4. Verify

```bash
psql -U vibefinder -d vibefinder

# Check tables
\dt

# Should see:
# restaurants
# reviews
# scraping_jobs
```

## Alternative: SQLite (Simpler but less production-ready)

If PostgreSQL is too complex, you can use SQLite:

Edit `backend/.env`:
```bash
DATABASE_URL=sqlite:///./vibefinder.db
```

Then run:
```bash
python setup_db.py
```

SQLite is easier but not recommended for production.
