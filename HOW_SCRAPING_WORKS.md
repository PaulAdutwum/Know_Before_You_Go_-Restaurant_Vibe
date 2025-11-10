# 🔍 How VibeFinder Scraping & Filtering Works

## 📊 The Complete Flow

### 1. User Searches for "Pizza Boston"

```
Frontend (React) → Backend API → Google Places API
                                      ↓
                              Returns 10 restaurants
                              (name, address, rating, place_id)
```

### 2. Backend Checks Database Cache

```python
# For each restaurant:
restaurant = db.query(Restaurant).filter(place_id == "ChIJ123...").first()

if restaurant and restaurant.last_scraped:
    # Reviews already scraped!
    reviews = db.query(Review).filter(restaurant_id == restaurant.id).all()
    → Run ML on cached reviews (instant!)
else:
    # Never scraped before
    → Return hybrid insights (quick, name+rating based)
    → Queue background scraping job
```

### 3. Background Scraping (Celery Worker)

**This runs in the background while user browses:**

```
Celery Worker picks up job
    ↓
GoogleMapsScraper (Selenium)
    • Opens Chrome browser (headless)
    • Navigates to: google.com/maps/search/?query_place_id=ChIJ123...
    • Clicks "Reviews" tab
    • Scrolls down to load 100+ reviews
    • Extracts: text, rating, author, date
    ↓
Saves to PostgreSQL (reviews table)
    • restaurant_id: 1
    • review_text: "Amazing pizza! Best I've had..."
    • rating: 5.0
    • source: 'google_maps'
    • sentiment_score: 0.89 (calculated by VADER)
    ↓
Updates restaurant.last_scraped = NOW()
    ↓
Job complete!
```

### 4. Next Search = Instant Results!

```
User searches "Pizza Boston" again
    ↓
Backend checks cache
    ↓
"Reviews scraped 5 minutes ago! Use them!"
    ↓
Load 100+ reviews from database
    ↓
Run ML analysis:
    • VADER: Calculate average sentiment → "82% Positive"
    • LDA: Find topics → "#Loud", "#GoodForGroups"
    • TF-IDF: Extract dishes → "Spicy Rigatoni", "Garlic Knots"
    ↓
Return full ML insights in <200ms
```

---

## 🎯 What Makes Scraping Work Correctly

### Required Components ✅

1. **✅ PostgreSQL** - Stores scraped reviews

   - Tables: `restaurants`, `reviews`, `scraping_jobs`
   - Status: **Installed and running!**

2. **✅ Redis** - Task queue for background jobs

   - Celery uses Redis to queue scraping tasks
   - Status: **Already running!**

3. **✅ Python Dependencies** - All scraping libraries

   - `selenium` - Browser automation
   - `webdriver-manager` - Auto-installs ChromeDriver
   - `celery` - Background job processing
   - `nltk`, `vaderSentiment`, `scikit-learn` - ML analysis
   - Status: **All installed!**

4. **✅ Chrome Browser** - For Selenium

   - Selenium opens Chrome to visit Google Maps
   - ChromeDriver auto-downloads on first run
   - Status: **Will auto-install!**

5. **🔄 Celery Worker** - Must be running!
   - This process picks up scraping jobs from Redis
   - **Without this, scraping jobs will queue forever!**
   - Status: **Need to start this!**

---

## 🚀 How to Run Everything

### Terminal 1: Start Backend API

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder/backend
source venv/bin/activate
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**What it does:**

- Receives search requests from frontend
- Calls Google Places API
- Checks database cache
- Queues scraping jobs if needed
- Returns results to frontend

---

### Terminal 2: Start Celery Worker (🚨 CRITICAL!)

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder/backend
source venv/bin/activate
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
celery -A celery_worker worker --loglevel=info
```

**What it does:**

- Picks up scraping jobs from Redis queue
- Runs GoogleMapsScraper (Selenium)
- Saves reviews to PostgreSQL
- Runs ML sentiment analysis
- Marks jobs complete

**Why it's critical:**

- Without this, scraping jobs sit in Redis forever
- You'll only see hybrid insights (name+rating based)
- Real ML insights require scraped reviews

**You'll see:**

```
[INFO/MainProcess] Connected to redis://localhost:6379/0
[INFO/MainProcess] celery@YourMac ready.
[INFO/MainProcess] Task scrape_and_process_reviews_task received
[INFO/ForkPoolWorker] Scraping 100 reviews for ChIJ123...
[INFO/ForkPoolWorker] Saved 127 reviews to database
[INFO/ForkPoolWorker] Task completed successfully
```

---

### Terminal 3: Start Frontend

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder/frontend
npm run dev
```

**What it does:**

- Serves React app on http://localhost:5173
- Displays search bar and results
- Shows sentiment charts and insights

---

## 🧪 Testing the Flow

### First Search (Cold Cache)

```bash
# 1. Open: http://localhost:5173
# 2. Search: "Pizza Boston"
# 3. You'll see: Quick results with hybrid insights
# 4. Watch Terminal 2 (Celery): See scraping activity
# 5. Wait 30-60 seconds for scraping to complete
# 6. Search again: Full ML insights!
```

**Timeline:**

```
0s:  Search "Pizza Boston"
1s:  Backend returns 10 restaurants (hybrid insights)
2s:  Frontend displays results
5s:  Celery worker starts scraping restaurant #1
35s: Scraping complete for restaurant #1 (100 reviews)
60s: All 10 restaurants scraped
∞:   Future searches are instant (cached!)
```

---

## 🎛️ Filtering & Quality Control

### How We Filter for Quality Reviews

#### 1. **Source Filtering**

```python
# Google Maps (primary source)
- Longer reviews (avg 50-200 words)
- Verified purchases
- More detailed feedback

# Reddit (supplementary)
- Authentic discussions
- Less formal, more honest
- Community recommendations
```

#### 2. **Review Text Filtering**

```python
# In keyword_extractor.py
def extract_dishes(reviews):
    # Filter out short/useless reviews
    valid_reviews = [
        r for r in reviews
        if len(r.split()) > 5  # At least 5 words
        and not is_spam(r)      # Not spam
    ]

    # Extract food-related terms
    dish_patterns = [
        r'\b(pizza|burger|pasta|salad|soup)\b',
        r'\b(appetizer|entree|dessert|drink)\b',
        # ... more patterns
    ]

    # Use TF-IDF to find most important dishes
    vectorizer = TfidfVectorizer(ngram_range=(1, 3))
    tfidf_matrix = vectorizer.fit_transform(valid_reviews)

    # Return top 5 dishes by importance
    return top_5_dishes
```

#### 3. **Sentiment Filtering**

```python
# Only analyze reviews with meaningful sentiment
def run_sentiment_analysis(reviews):
    scores = []
    for review in reviews:
        if len(review) < 10:  # Skip very short reviews
            continue

        score = analyzer.polarity_scores(review)

        # Filter out neutral noise (score between -0.05 and +0.05)
        if abs(score['compound']) > 0.05:
            scores.append(score['compound'])

    # Average the meaningful scores
    return f"{int((sum(scores)/len(scores) + 1) / 2 * 100)}% Positive"
```

#### 4. **Vibe Detection Filtering**

```python
# LDA Topic Modeling with filtering
def run_topic_modeling(reviews):
    # Remove reviews that are too short or too generic
    filtered = [
        r for r in reviews
        if len(r.split()) > 15  # At least 15 words
        and has_descriptive_words(r)  # Contains adjectives/vibes
    ]

    # Run LDA on filtered reviews
    lda = LatentDirichletAllocation(n_components=3)
    topics = lda.fit_transform(review_vectors)

    # Map topics to hashtags
    # Topic 1: [loud, music, bar] → #Loud
    # Topic 2: [quiet, romantic, date] → #Romantic

    return vibes
```

---

## 🔧 Configuration Options

### In `backend/.env`:

```bash
# Scraping Configuration
MAX_REVIEWS_PER_RESTAURANT=100    # How many reviews to scrape
SCRAPING_DELAY_SECONDS=2          # Delay between scrolls (avoid blocking)
SCRAPING_ENABLED=true              # Enable/disable scraping

# Cache Configuration
CACHE_EXPIRY_DAYS=7               # Re-scrape after 7 days

# ML Configuration
MIN_SENTIMENT_THRESHOLD=0.6       # Minimum confidence for sentiment
VIBE_TOPIC_COUNT=3                # Number of vibes to extract
TOP_DISHES_COUNT=5                # Number of dishes to show
```

---

## 🐛 Troubleshooting Scraping Issues

### Issue: "No scraping activity in Terminal 2"

**Cause:** Celery worker not connected to Redis

**Fix:**

```bash
# Check Redis is running
redis-cli ping  # Should return: PONG

# Restart Redis
brew services restart redis

# Restart Celery worker
# Ctrl+C in Terminal 2, then restart
celery -A celery_worker worker --loglevel=info
```

---

### Issue: "Only seeing hybrid insights, not real ML"

**Cause:** Scraping hasn't completed yet, or Celery worker isn't running

**Fix:**

1. Check Terminal 2 - is Celery worker running?
2. Wait 30-60 seconds for scraping to complete
3. Search again - you should see real ML insights

---

### Issue: "ChromeDriver errors"

**Cause:** First-time ChromeDriver download

**Fix:**

- ChromeDriver auto-downloads on first scrape
- Takes 30-60 seconds
- Check Terminal 2 for download progress
- Subsequent scrapes will be faster

---

### Issue: "Google Maps blocking requests"

**Cause:** Too many requests too quickly

**Fix:**

1. Increase `SCRAPING_DELAY_SECONDS` in .env (try 3-4)
2. Reduce `MAX_REVIEWS_PER_RESTAURANT` (try 50)
3. Wait a few minutes between searches
4. Use user-agent rotation (already implemented)

---

## ✅ Success Indicators

### You'll know scraping is working when:

1. **Terminal 2 shows activity:**

   ```
   [INFO] Scraping restaurant: Joe's Pizza (ChIJ123...)
   [INFO] Scrolled 5 times, found 87 reviews
   [INFO] Extracted 87 reviews
   [INFO] Saved to database
   [INFO] Task completed
   ```

2. **Database has reviews:**

   ```bash
   export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
   psql vibefinder -c "SELECT COUNT(*) FROM reviews;"
   # Should show: count > 0
   ```

3. **Second search is instant:**

   - First search: 2-3 seconds
   - Second search: <500ms (cached!)

4. **ML insights are detailed:**
   - Sentiment: "82% Positive" (not "N/A")
   - Vibes: Multiple specific tags like "#Loud", "#Trendy"
   - Dishes: Actual dish names from reviews
   - Complaints: Specific issues mentioned

---

## 🎉 Summary

**What you have now:**

- ✅ PostgreSQL running and initialized
- ✅ Redis running
- ✅ All Python dependencies installed
- ✅ Database tables created
- ✅ Backend API ready
- ✅ Frontend ready

**What you need to do:**

1. Start Backend (Terminal 1)
2. **Start Celery Worker (Terminal 2) - CRITICAL!**
3. Start Frontend (Terminal 3)
4. Search and watch the magic happen!

**The scraping will work correctly because:**

- Reviews are cached in PostgreSQL (no redundant scraping)
- Background jobs run asynchronously (no blocking)
- ML runs on scraped data (accurate insights)
- Future searches are instant (cache hit!)

---

Ready to start? Run the 3 commands above and test it out! 🚀
