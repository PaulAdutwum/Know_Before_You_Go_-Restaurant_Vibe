# 🏗️ VibeFinder Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:5173                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Search "Pizza Boston"
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                      REACT FRONTEND                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  SearchBar   │  │ ResultCards  │  │  Charts      │          │
│  │ + Near Me    │  │ + Distance   │  │ + Sentiment  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ GET /api/v1/search?location=Pizza+Boston
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND (Port 8000)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  1. Search Endpoint (/api/v1/search)                 │      │
│  │     ├─ Parse location/query                          │      │
│  │     ├─ Call Google Places API                        │      │
│  │     └─ Return basic restaurant info                  │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  2. Check Database Cache                             │      │
│  │     ├─ Reviews already scraped? → Use them (fast!)   │      │
│  │     └─ Not cached? → Queue background job            │      │
│  └──────────────────────────────────────────────────────┘      │
│                         │                                       │
│                         ↓                                       │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  3. If no cache: Return Hybrid Insights              │      │
│  │     (generated from name + rating)                   │      │
│  │     + Queue Celery task for background scraping      │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Queue job
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│                    REDIS TASK QUEUE                             │
│                  (redis://localhost:6379)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Pending Jobs:                                       │      │
│  │  • scrape_restaurant_1 (ChIJ123...)                  │      │
│  │  • scrape_restaurant_2 (ChIJ456...)                  │      │
│  │  • scrape_restaurant_3 (ChIJ789...)                  │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Worker picks up task
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              CELERY WORKER (Background Process)                 │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Task: scrape_and_process_reviews_task               │      │
│  │                                                      │      │
│  │  Step 1: Scrape Google Maps                         │      │
│  │  ┌────────────────────────────────────┐             │      │
│  │  │  GoogleMapsScraper (Selenium)      │             │      │
│  │  │  • Opens Chrome (headless)         │             │      │
│  │  │  • Navigates to Google Maps        │             │      │
│  │  │  • Scrolls reviews section         │             │      │
│  │  │  • Extracts 100+ reviews           │             │      │
│  │  │  • Gets: text, rating, author, date│             │      │
│  │  └────────────────────────────────────┘             │      │
│  │                                                      │      │
│  │  Step 2: Scrape Reddit (Optional)                   │      │
│  │  ┌────────────────────────────────────┐             │      │
│  │  │  RedditScraper (PRAW API)          │             │      │
│  │  │  • Search relevant subreddits      │             │      │
│  │  │  • Find posts/comments             │             │      │
│  │  │  • Extract mentions                │             │      │
│  │  └────────────────────────────────────┘             │      │
│  │                                                      │      │
│  │  Step 3: Run ML Analysis                            │      │
│  │  ┌────────────────────────────────────┐             │      │
│  │  │  SentimentAnalyzer (VADER)         │             │      │
│  │  │  → Scores: -1 to +1                │             │      │
│  │  │  → "82% Positive"                  │             │      │
│  │  │                                    │             │      │
│  │  │  TopicModeler (LDA)                │             │      │
│  │  │  → Discovers themes                │             │      │
│  │  │  → "#Loud #GoodForGroups"          │             │      │
│  │  │                                    │             │      │
│  │  │  KeywordExtractor (TF-IDF)         │             │      │
│  │  │  → Top dishes                      │             │      │
│  │  │  → Common complaints               │             │      │
│  │  └────────────────────────────────────┘             │      │
│  │                                                      │      │
│  │  Step 4: Save to Database                           │      │
│  │  • Store reviews                                    │      │
│  │  • Store ML results                                 │      │
│  │  • Mark job complete                                │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ Save results
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE (vibefinder)                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Table: restaurants                                  │      │
│  │  ├─ id, place_id, name, rating, address             │      │
│  │  └─ last_scraped (timestamp)                        │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Table: reviews                                      │      │
│  │  ├─ restaurant_id, review_text, rating              │      │
│  │  ├─ author, review_date, sentiment_score            │      │
│  │  └─ source (google_maps/reddit)                     │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Table: scraping_jobs                                │      │
│  │  ├─ restaurant_id, place_id, status                 │      │
│  │  ├─ reviews_scraped, error_message                  │      │
│  │  └─ created_at, completed_at                        │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow on Second Search

```
User searches "Pizza Boston" again
        ↓
FastAPI checks database
        ↓
Reviews cached! (last_scraped < 7 days)
        ↓
Run ML on cached reviews (instant!)
        ↓
Return full insights in <100ms
```

## ML Pipeline Detail

```
100 Reviews from Google Maps
        ↓
┌───────────────────────────────────────────┐
│  VADER Sentiment Analysis                 │
│  • Review 1: "Amazing!" → +0.89           │
│  • Review 2: "Pretty good" → +0.65        │
│  • Review 3: "Meh" → -0.28                │
│  • Average: +0.64 → "82% Positive"        │
└───────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────┐
│  LDA Topic Modeling (3 topics)            │
│  • Topic 1: [loud, music, bar, friends]   │
│    → #Loud, #GoodForGroups               │
│  • Topic 2: [romantic, quiet, date]       │
│    → #Romantic, #DateNight               │
│  • Topic 3: [family, kids, friendly]      │
│    → #FamilyFriendly                     │
└───────────────────────────────────────────┘
        ↓
┌───────────────────────────────────────────┐
│  TF-IDF Keyword Extraction                │
│  • High-frequency food terms:             │
│    "spicy rigatoni" (23x)                │
│    "garlic knots" (18x)                  │
│  • Negative sentiment keywords:           │
│    "slow service" (8x)                   │
│    "too expensive" (5x)                  │
└───────────────────────────────────────────┘
        ↓
Final Result:
{
  "trueSentiment": "82% Positive",
  "vibeCheck": ["#Loud", "#GoodForGroups"],
  "mustTryDishes": ["Spicy Rigatoni", "Garlic Knots"],
  "commonComplaints": ["Slow service on weekends"]
}
```

## No APIs Needed (Mostly)

```
 Google Places API
   └─ Purpose: Find restaurants
   └─ Get your key: https://console.cloud.google.com/apis/credentials

 Google Maps Scraping
   └─ Purpose: Get 100+ reviews
   └─ Method: Selenium (no API)
   └─ Status: Ready to use

  Reddit API (Optional)
   └─ Purpose: Supplementary mentions
   └─ Status: Not configured (app works without it)

 VADER Sentiment
   └─ Purpose: ML analysis
   └─ Method: Pre-built model (pip install)
   └─ Status: Ready to use

LDA & TF-IDF
   └─ Purpose: Topic modeling, keywords
   └─ Method: scikit-learn (pip install)
   └─ Status: Ready to use
```

## What You Need to Install

```bash
# Infrastructure
brew install postgresql@14 redis

# Python packages (already in requirements.txt)
# - fastapi, uvicorn
# - sqlalchemy, psycopg2-binary
# - celery, redis
# - selenium, webdriver-manager (auto-installs Chrome driver)
# - praw (Reddit)
# - nltk, vaderSentiment, scikit-learn

# Frontend (already done)
npm install
```

## Start Commands

```bash
# Terminal 1: Backend API
uvicorn app.main:app --reload

# Terminal 2: Background worker (THIS IS KEY!)
celery -A celery_worker worker --loglevel=info

# Terminal 3: Frontend
npm run dev
```

## You're Ready!

Everything is set up. Just need to:

1. Install PostgreSQL & Redis
2. Run setup_db.py
3. Start the 3 processes
4. Search and watch it work!
