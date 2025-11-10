# 🔍 Review Scraping System Setup Guide

## Overview

The review scraping system provides 100+ reviews per restaurant for accurate ML analysis using:

- **Google Maps** (primary source via Selenium)
- **Reddit API** (supplementary sentiment data)
- **Background jobs** (Celery + Redis)
- **Database caching** (PostgreSQL)

---

## 🚀 Quick Setup

### 1. Install Redis

Redis is required for the background job queue.

**macOS (Homebrew):**

```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian:**

```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows:**

- Download from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run -d -p 6379:6379 redis`

### 2. Install ChromeDriver Dependencies

The scraper uses Selenium with Chrome.

**macOS:**

```bash
brew install --cask google-chrome
# ChromeDriver will auto-install via webdriver-manager
```

**Ubuntu/Debian:**

```bash
sudo apt-get install chromium-browser chromium-chromedriver
```

### 3. Install Python Dependencies

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Edit `backend/.env`:

```bash
# Redis (Required)
REDIS_URL=redis://localhost:6379/0

# Scraping Settings
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=100
SCRAPING_DELAY_SECONDS=2

# Reddit API (Optional but recommended)
# Get from: https://www.reddit.com/prefs/apps
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_secret
REDDIT_USER_AGENT=VibeFinder/1.0
```

### 5. Initialize Database

```bash
cd backend
python setup_db.py
```

This creates the new tables:

- `scraping_jobs` - Track scraping tasks
- Updated `reviews` table with source/scraped_at fields
- Updated `restaurants` table with last_scraped field

---

## 🏃 Running the System

You need **3 terminal windows**:

### Terminal 1: Backend API

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2: Celery Worker

```bash
cd backend
source venv/bin/activate
celery -A celery_worker worker --loglevel=info
```

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

---

## 📊 How It Works

### Automatic Flow:

1. **User searches** → Frontend sends request to backend
2. **Backend checks DB** → Are there cached reviews?
   - ✅ **Yes** → Use cached data (fast!)
   - ❌ **No** → Queue background scraping job
3. **Celery worker** → Scrapes reviews in background
   - Google Maps: 100+ reviews
   - Reddit: Supplementary mentions
4. **Saves to DB** → Reviews cached for 7 days
5. **ML processing** → Sentiment/vibe/dishes extracted
6. **Next search** → Uses cached data (instant!)

### Manual Triggering:

You can manually trigger scraping via API:

```bash
# Trigger scraping for a specific restaurant
curl -X POST "http://localhost:8000/api/v1/scraping/trigger/ChIJ..."

# Check job status
curl "http://localhost:8000/api/v1/scraping/status/1"

# Get scraping statistics
curl "http://localhost:8000/api/v1/scraping/stats"
```

---

## 🔧 Admin Endpoints

### POST `/api/v1/scraping/trigger/{place_id}`

Manually trigger scraping for a restaurant

**Response:**

```json
{
  "message": "Scraping job queued successfully",
  "job_id": 1,
  "place_id": "ChIJ...",
  "restaurant_id": 1
}
```

### GET `/api/v1/scraping/status/{job_id}`

Check status of a scraping job

**Response:**

```json
{
  "job_id": 1,
  "place_id": "ChIJ...",
  "status": "completed",
  "reviews_scraped": 127,
  "created_at": "2025-01-08T10:30:00",
  "completed_at": "2025-01-08T10:35:00"
}
```

### GET `/api/v1/scraping/stats`

Get overall scraping statistics

**Response:**

```json
{
  "total_restaurants": 25,
  "total_reviews": 2847,
  "google_maps_reviews": 2650,
  "reddit_reviews": 197,
  "pending_jobs": 2,
  "running_jobs": 1,
  "completed_jobs": 22,
  "failed_jobs": 0
}
```

### GET `/api/v1/scraping/jobs?limit=20&status=completed`

List recent scraping jobs

---

## 🔍 Testing the System

### Test 1: Check Redis Connection

```bash
redis-cli ping
# Should return: PONG
```

### Test 2: Check Celery Worker

```bash
# In the Celery terminal, you should see:
# [tasks]
#   . app.services.background_jobs.scrape_restaurant_task
#   . app.services.background_jobs.process_ml_task
```

### Test 3: Trigger Manual Scraping

```bash
# Replace with a real Google Places ID
curl -X POST "http://localhost:8000/api/v1/scraping/trigger/ChIJN1t_tDeuEmsRUsoyG83frY4"
```

### Test 4: Check Job Status

```bash
# Watch the Celery terminal for activity
# Check job status:
curl "http://localhost:8000/api/v1/scraping/status/1"
```

### Test 5: Full End-to-End

1. Open frontend: http://localhost:5173
2. Search for a restaurant: "Joe's Pizza New York"
3. Check backend logs → Should queue scraping job
4. Check Celery logs → Should see scraping activity
5. Wait ~2-5 minutes for scraping to complete
6. Search again → Should use cached data (instant!)

---

## ⚠️ Important Notes

### Legal Considerations

**Google Maps Scraping:**

- ⚠️ Against Google's Terms of Service
- ✅ OK for learning/prototype projects
- ❌ NOT for production/commercial use
- 💡 For production, use: Yelp API, Google Places API (paid tier), or user-generated reviews

**Reddit API:**

- ✅ Fully legal with API credentials
- ✅ OK for production
- 📝 Requires Reddit app registration

### Rate Limiting

The scraper includes built-in rate limiting:

- 2-5 second delays between requests
- Headless Chrome with user-agent rotation
- Graceful handling of blocks/errors

### Performance

- First search: 2-5 minutes (scraping in background)
- Subsequent searches: Instant (cached for 7 days)
- Celery worker can process multiple restaurants in parallel
- Redis handles job queue efficiently

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'celery'"

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### "ConnectionRefusedError: [Errno 61] Connection refused" (Redis)

```bash
# Check if Redis is running
redis-cli ping

# If not, start it:
brew services start redis  # macOS
sudo systemctl start redis  # Linux
```

### "WebDriverException: Chrome not reachable"

```bash
# Install Chrome/Chromium
brew install --cask google-chrome  # macOS
sudo apt-get install chromium-browser  # Linux
```

### Scraping job stuck in "running" status

```bash
# Check Celery worker logs
# Restart Celery worker if needed
pkill -f celery
celery -A celery_worker worker --loglevel=info
```

### No reviews found (even after scraping)

- Google Maps HTML changes frequently
- Check Celery logs for specific errors
- The scraper includes multiple CSS selector fallbacks
- If scraping fails, system falls back to hybrid ML generation

---

## 📈 Monitoring

### Watch Celery Activity

```bash
# Terminal with Celery worker shows real-time activity
celery -A celery_worker worker --loglevel=info
```

### Check Database

```bash
psql -U vibefinder -d vibefinder

# Check recent scraping jobs
SELECT * FROM scraping_jobs ORDER BY created_at DESC LIMIT 10;

# Check review counts
SELECT source, COUNT(*) FROM reviews GROUP BY source;

# Check restaurants with cached reviews
SELECT name, last_scraped,
       (SELECT COUNT(*) FROM reviews WHERE restaurant_id = restaurants.id) as review_count
FROM restaurants
WHERE last_scraped IS NOT NULL;
```

### Monitor Redis Queue

```bash
redis-cli

# Check queue size
LLEN celery

# List pending tasks
LRANGE celery 0 -1
```

---

## 🚀 Production Deployment

For production deployment:

1. **Use Legal APIs:**

   - Yelp Fusion API (free tier available)
   - Google Places API (paid, official)
   - TripAdvisor API
   - User-generated reviews

2. **Scale Celery:**

   - Multiple workers: `celery -A celery_worker worker --concurrency=4`
   - Separate queues for scraping vs ML
   - Use Celery Beat for scheduled tasks

3. **Use Redis in Production Mode:**

   - Configure persistence
   - Set up replica
   - Enable authentication

4. **Monitor & Alert:**
   - Set up Flower (Celery monitoring): `celery -A celery_worker flower`
   - Configure error alerting (Sentry, email)
   - Track job success rates

---

## 📚 Next Steps

1. ✅ Get system running locally
2. ✅ Test manual scraping via API
3. ✅ Verify reviews are cached
4. 🔜 Add more review sources (Yelp, TripAdvisor)
5. 🔜 Implement scheduled scraping (Celery Beat)
6. 🔜 Build admin dashboard for monitoring

---

**Happy Scraping! 🎉**
