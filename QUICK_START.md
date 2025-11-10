# 🚀 VibeFinder Quick Start Guide

## Prerequisites Checklist

- [ ] Python 3.9+
- [ ] Node.js 16+
- [ ] Chrome browser

---

## Step 1: Install Required Services (5 minutes)

```bash
# Install PostgreSQL and Redis
brew install postgresql@14 redis

# Start services
brew services start postgresql@14
brew services start redis

# Verify
redis-cli ping          # Should return: PONG
psql --version          # Should show version 14.x
```

---

## Step 2: Setup Database (2 minutes)

```bash
# Create database
createdb vibefinder

# Initialize tables
cd backend
source venv/bin/activate
pip install -r requirements.txt
python setup_db.py
```

**Expected output:**
```
✅ Database connection successful!
✅ Created tables: restaurants, reviews, scraping_jobs
🎉 Database setup complete!
```

---

## Step 3: Configure Environment (1 minute)

Your `backend/.env` should already have:

```bash
# Already configured ✅
GOOGLE_PLACES_API_KEY=AIzaSyCvGpQYjkc_laF27tL8z_r6EpeQ0Q6U6VI
DATABASE_URL=postgresql://vibefinder:vibefinder@localhost:5432/vibefinder
REDIS_URL=redis://localhost:6379/0

# Optional - Add Reddit API if you want
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
```

---

## Step 4: Run the Application (3 terminals)

### Terminal 1: Backend API

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

### Terminal 2: Celery Worker (Background Jobs)

```bash
cd backend
source venv/bin/activate
celery -A celery_worker worker --loglevel=info
```

**Expected output:**
```
[INFO/MainProcess] Connected to redis://localhost:6379/0
[INFO/MainProcess] celery@MacBook ready.
```

### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

---

## Step 5: Test It Out! 🎉

1. **Open browser:** http://localhost:5173
2. **Search for:** "Pizza Boston" or click "📍 Near Me"
3. **Watch magic happen:**
   - Google Places finds restaurants
   - Background job scrapes Google Maps reviews
   - ML analyzes sentiment, vibes, dishes
   - Results appear with full insights!

---

## 🔍 Verify Everything Works

### Check Backend API
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy","service":"VibeFinder API"}
```

### Check Redis
```bash
redis-cli ping
# Should return: PONG
```

### Check Database
```bash
psql vibefinder -c "\dt"
# Should list: restaurants, reviews, scraping_jobs
```

### Check Celery Worker
Look for this in Terminal 2:
```
[INFO/MainProcess] celery@YourComputer ready.
```

---

## 🐛 Common Issues

### Issue: "Connection refused" (PostgreSQL)
```bash
# Solution:
brew services restart postgresql@14
createdb vibefinder
```

### Issue: "Connection refused" (Redis)
```bash
# Solution:
brew services restart redis
```

### Issue: "ModuleNotFoundError"
```bash
# Solution:
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: Celery worker not starting
```bash
# Check Redis is running:
redis-cli ping

# Restart Redis:
brew services restart redis
```

### Issue: No reviews being scraped
```bash
# Check Celery worker is running in Terminal 2
# Check logs in Terminal 2 for errors
# ChromeDriver auto-installs on first scrape (may take 30s)
```

---

## 📊 How to Monitor Scraping Jobs

### Via API (while app is running):

```bash
# Get recent scraping jobs
curl http://localhost:8000/api/v1/scraping/recent_jobs

# Trigger manual scrape (replace place_id)
curl -X POST http://localhost:8000/api/v1/scraping/trigger/ChIJ-y_0_0_0_0

# Check job status (replace job_id)
curl http://localhost:8000/api/v1/scraping/status/1
```

### Via Database:

```bash
psql vibefinder

-- Check scraping jobs
SELECT * FROM scraping_jobs ORDER BY created_at DESC LIMIT 5;

-- Check scraped reviews
SELECT restaurant_id, COUNT(*) FROM reviews GROUP BY restaurant_id;

-- Check which restaurants have been scraped
SELECT name, last_scraped FROM restaurants WHERE last_scraped IS NOT NULL;

\q
```

---

## 🎯 What Happens on First Search

```
1. User searches "Pizza Boston"
2. Google Places API finds 10 restaurants
3. For each restaurant:
   ├─ Check if reviews cached in DB
   ├─ If not cached:
   │  └─ Queue background Celery job
   │  └─ Return quick "hybrid" insights (name + rating based)
   ├─ Celery worker (Terminal 2):
   │  ├─ Scrapes 100 Google Maps reviews (Selenium)
   │  ├─ Optionally scrapes Reddit mentions (if configured)
   │  ├─ Runs VADER sentiment analysis
   │  ├─ Saves to PostgreSQL
   │  └─ Marks job complete
   └─ Next search: Uses cached data (instant!)
```

---

## 🔄 Stopping Everything

```bash
# Stop all brew services
brew services stop postgresql@14
brew services stop redis

# Stop servers: Ctrl+C in each terminal
```

---

## 📚 Additional Documentation

- **COMPLETE_API_GUIDE.md** - Detailed API and sentiment explanation
- **DATABASE_SETUP_GUIDE.md** - Database configuration details
- **SCRAPING_SETUP.md** - Advanced scraping configuration
- **IMPLEMENTATION_SUMMARY.md** - Recent feature changes

---

## ✅ Success Criteria

You'll know it's working when:

- ✅ All 3 terminals show "running" messages
- ✅ Frontend loads at http://localhost:5173
- ✅ Searching "Pizza Boston" returns real restaurants
- ✅ Restaurant cards show sentiment, vibes, dishes
- ✅ Terminal 2 (Celery) shows scraping activity
- ✅ Second search for same location is instant (cached!)

---

## 🎉 You're Ready!

**System is now:**
- ✅ Finding real restaurants (Google Places API)
- ✅ Scraping 100+ reviews per restaurant (Google Maps)
- ✅ Running ML sentiment analysis (VADER)
- ✅ Detecting vibes (LDA topic modeling)
- ✅ Extracting dishes & complaints (TF-IDF)
- ✅ Caching everything in PostgreSQL
- ✅ Processing jobs in background (Celery + Redis)

**Optional next steps:**
- Add Reddit API for supplementary data
- Deploy to production (Heroku/AWS)
- Add more ML models (custom NER for dishes)
- Implement user accounts and favorites

---

## 🆘 Need Help?

Check the logs:
- **Backend API:** Terminal 1
- **Celery Worker:** Terminal 2 (most important for scraping)
- **Frontend:** Terminal 3
- **Database:** `psql vibefinder` and run SELECT queries

**Most common fix:** Make sure Redis and PostgreSQL are running!
```bash
brew services list
# Both should show "started"
```

