# 🔑 Complete API & Sentiment Guide

## 📋 What You Need (Checklist)

### ✅ **Required Components**

| Component             | Purpose               | Status            | Notes                        |
| --------------------- | --------------------- | ----------------- | ---------------------------- |
| **PostgreSQL**        | Store scraped reviews | Setup needed      | See DATABASE_SETUP_GUIDE.md  |
| **Redis**             | Background job queue  | ⚠️ Install needed | `brew install redis`         |
| **Google Places API** | Find restaurants      | Already have      | Already in .env              |
| **Selenium/Chrome**   | Scrape Google Maps    | Auto-install      | webdriver-manager handles it |

### 🔄 **Optional Components**

| Component      | Purpose               | Status      | Notes                           |
| -------------- | --------------------- | ----------- | ------------------------------- |
| **Reddit API** | Supplementary reviews | ⚠️ Optional | Free from reddit.com/prefs/apps |

---

## 🗄️ **Database Setup (Required)**

### **Option 1: PostgreSQL (Recommended)**

```bash
# 1. Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14

# 2. Create database
createdb vibefinder

# 3. Initialize tables
cd backend
source venv/bin/activate
python setup_db.py
```

**Verify:**

```bash
psql vibefinder
\dt  # Should show: restaurants, reviews, scraping_jobs
\q
```

### **Option 2: SQLite (Simpler)**

If PostgreSQL is too complex, use SQLite:

**Edit `backend/.env`:**

```bash
DATABASE_URL=sqlite:///./vibefinder.db
```

**Initialize:**

```bash
cd backend
python setup_db.py
```

SQLite creates a file `vibefinder.db` in the backend folder.

---

## 🔄 **Redis Setup (Required for Background Jobs)**

```bash
# macOS
brew install redis
brew services start redis

# Verify it's running
redis-cli ping
# Should return: PONG
```

**Why needed:** Redis manages the background scraping job queue.

---

## 🔑 **API Keys Breakdown**

### **1. Google Places API** ✅ Already Configured

**What it does:**

- Finds restaurants by location
- Gets basic info: name, address, rating
- Gets place_id for scraping

**Status:** ⚠️ Add your API key

```bash
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
```

**No additional setup needed!**

---

### **2. Google Maps Scraping** ✅ No API Needed

**What it does:**

- Scrapes 100+ reviews from Google Maps website
- Uses Selenium (browser automation)
- Gets full review text, ratings, dates

**Status:** ✅ Already works - NO API key needed!

**How:** Acts like a browser visiting google.com/maps

**Requirements:**

- Chrome browser (auto-installed)
- ChromeDriver (auto-installed via webdriver-manager)

---

### **3. Reddit API** ⚠️ Optional

**What it does:**

- Searches Reddit for restaurant mentions
- Adds supplementary sentiment data
- Fully legal via official API

**Status:** ⚠️ Not configured yet (optional)

**Setup (5 minutes):**

1. Go to: https://www.reddit.com/prefs/apps
2. Click "Create App"
3. Fill in:
   - Name: `VibeFinder`
   - Type: **script**
   - Redirect URI: `http://localhost:8080`
4. Copy credentials

**Add to `backend/.env`:**

```bash
REDDIT_CLIENT_ID=your_id_here
REDDIT_CLIENT_SECRET=your_secret_here
REDDIT_USER_AGENT=VibeFinder/1.0
```

**What happens without Reddit:**

- System still works perfectly
- Just skips Reddit mentions
- Logs a warning (not an error)

---

## 🧠 **How Sentiment Analysis Works**

### **VADER Sentiment Analyzer**

**Technology:** VADER (Valence Aware Dictionary and sEntiment Reasoner)

**Why VADER:**

- ✅ Perfect for social media & reviews
- ✅ Understands slang ("awesome!", "meh", "sucks")
- ✅ Handles emojis and punctuation
- ✅ No training needed (pre-built)
- ✅ Fast and accurate

**How it works:**

#### **Step 1: Analyze Each Review**

```python
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()

review = "The pizza was absolutely amazing! Best I've ever had!"
scores = analyzer.polarity_scores(review)

# Output:
{
  'neg': 0.0,      # Negative score (0%)
  'neu': 0.323,    # Neutral score (32%)
  'pos': 0.677,    # Positive score (68%)
  'compound': 0.87 # Overall score (-1 to +1)
}
```

#### **Step 2: Average All Reviews**

```python
# For restaurant with 100 reviews:
all_scores = [0.87, 0.92, -0.34, 0.76, 0.81, ...]
average = sum(all_scores) / len(all_scores)
# average = 0.72
```

#### **Step 3: Convert to Percentage**

```python
# Convert from [-1, 1] to [0, 100]
percentage = int((average + 1) / 2 * 100)
# percentage = 86

# Categorize
if average >= 0.5:
    label = "Very Positive"
elif average >= 0.05:
    label = "Positive"
elif average >= -0.05:
    label = "Neutral"
else:
    label = "Negative"

# Result: "86% Very Positive"
```

### **Real Example:**

**Input:** 127 reviews from "Joe's Pizza"

**Sample Reviews:**

- "Best pizza in town! 🍕" → `compound: 0.89`
- "Pretty good, nice crust" → `compound: 0.65`
- "Meh, nothing special" → `compound: -0.28`
- "Amazing sauce!" → `compound: 0.82`

**Process:**

```
Average of 127 compound scores: 0.64
Convert to percentage: (0.64 + 1) / 2 * 100 = 82%
Categorize: 0.64 >= 0.05 = "Positive"
Result: "82% Positive"
```

**Display on UI:**

```
✅ 82% Positive (shown in green)
```

---

## 🎯 **Other ML Models**

### **1. Topic Modeling (Vibe Detection)**

**Technology:** LDA (Latent Dirichlet Allocation)

**What it does:** Finds hidden patterns in reviews

**Example:**

```
Reviews mention: "loud", "music", "friends", "bar", "group"
↓
Model detects Topic: Social/Loud atmosphere
↓
Maps to: #Loud, #GoodForGroups
```

**How it works:**

```python
from sklearn.decomposition import LatentDirichletAllocation

# Discover 3 topics in reviews
lda = LatentDirichletAllocation(n_components=3)
topics = lda.fit_transform(review_text_vectors)

# Topic 1: [loud, music, bar, friends] → #Loud
# Topic 2: [romantic, quiet, date] → #Romantic
# Topic 3: [family, kids, friendly] → #FamilyFriendly
```

### **2. Keyword Extraction (Dishes & Complaints)**

**Technology:** TF-IDF (Term Frequency-Inverse Document Frequency)

**What it does:** Finds important words/phrases

**Example - Dishes:**

```
Reviews frequently mention:
- "spicy rigatoni" (mentioned 23 times)
- "garlic knots" (mentioned 18 times)
- "margherita" (mentioned 15 times)
↓
Extract as: Must-Try Dishes
```

**Example - Complaints:**

```
Negative sentiment + phrases:
- "slow service" (mentioned 8 times)
- "too expensive" (mentioned 5 times)
↓
Extract as: Common Complaints
```

**How it works:**

```python
from sklearn.feature_extraction.text import TfidfVectorizer

vectorizer = TfidfVectorizer(ngram_range=(1, 3))
tfidf_matrix = vectorizer.fit_transform(reviews)

# Get most important n-grams
top_dishes = get_top_n_grams(tfidf_matrix, n=5)
# ["spicy rigatoni", "garlic knots", "margherita pizza", ...]
```

---

## **Complete Data Flow**

```
1. User Searches "Pizza Boston"
         ↓
2. Google Places API finds restaurants
   → Returns: name, address, place_id
         ↓
3. Check Database
   ├─ Reviews cached? → Use them (instant!)
   └─ No cache? → Queue background job
         ↓
4. Background Job (Celery Worker)
   ├─ Google Maps Scraper: 100+ reviews
   │  └─ Uses Selenium (no API needed)
   ├─ Reddit Scraper: Mentions (optional)
   │  └─ Uses Reddit API
   └─ Save to PostgreSQL
         ↓
5. ML Processing (Automatic)
   ├─ VADER: Sentiment analysis
   │  → "82% Positive"
   ├─ LDA: Topic modeling
   │  → "#Loud", "#GoodForGroups"
   ├─ TF-IDF: Dish extraction
   │  → ["Spicy Rigatoni", "Garlic Knots"]
   └─ TF-IDF: Complaint detection
      → ["Slow service on weekends"]
         ↓
6. Save ML Results to Database
         ↓
7. Next Search: Instant (uses cache!)
```

---

## **Setup Checklist**

```bash
# 1. Install PostgreSQL
brew install postgresql@14
brew services start postgresql@14
createdb vibefinder

# 2. Install Redis
brew install redis
brew services start redis

# 3. Install Python dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt

# 4. Initialize database
python setup_db.py

# 5. Verify setup
redis-cli ping        # Should return: PONG
psql vibefinder -c "\dt"  # Should show tables

# 6. Optional: Add Reddit API (skip if you want)
# Edit .env with Reddit credentials

# 7. Run the system (3 terminals)
# Terminal 1: uvicorn app.main:app --reload
# Terminal 2: celery -A celery_worker worker --loglevel=info
# Terminal 3: cd ../frontend && npm run dev
```

---

## 🎓 **Summary**

### **APIs Needed:**

| API           | Status        | Notes                          |
| ------------- | ------------- | ------------------------------ |
| Google Places | Already have  | For finding restaurants        |
| Google Maps   | No API needed | Scraping with Selenium         |
| Reddit        | Optional      | Get from reddit.com/prefs/apps |

### **Infrastructure Needed:**

| Component  | Status | Command                      |
| ---------- | ------ | ---------------------------- |
| PostgreSQL | Setup  | `brew install postgresql@14` |
| Redis      | Setup  | `brew install redis`         |

### **Sentiment Analysis:**

- **VADER** - Pre-built, no API needed
- **LDA** - Built into scikit-learn
- **TF-IDF** - Built into scikit-learn
- All models work offline after pip install

---

## **Quick Start Commands**

```bash
# Install everything
brew install postgresql@14 redis
brew services start postgresql@14 redis
createdb vibefinder

# Setup backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python setup_db.py

# Run (3 terminals)
# Terminal 1: uvicorn app.main:app --reload
# Terminal 2: celery -A celery_worker worker --loglevel=info
# Terminal 3: cd ../frontend && npm run dev
```
