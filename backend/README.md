# VibeFinder Backend API

FastAPI-powered backend with ML-based restaurant insights.

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

### Installation

1. **Create a virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**

```bash
pip install -r requirements.txt
```

3. **Download NLTK data (for sentiment analysis):**

```bash
python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('stopwords'); nltk.download('punkt')"
```

4. **Set up environment variables:**

Copy `.env.example` to `.env` and configure:

```bash
# Edit the .env file with your settings
DATABASE_URL=postgresql://username:password@localhost:5432/vibefinder
GOOGLE_PLACES_API_KEY=your_api_key_here
```

5. **Set up PostgreSQL database:**

```bash
# Create database
createdb vibefinder

# Or using psql:
psql -U postgres
CREATE DATABASE vibefinder;
CREATE USER vibefinder WITH PASSWORD 'vibefinder';
GRANT ALL PRIVILEGES ON DATABASE vibefinder TO vibefinder;
\q
```

6. **Initialize database tables:**

```bash
python setup_db.py
```

### Running the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload

# Or using the main.py directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Main Search Endpoint

**GET** `/api/v1/search?location={location}&max_results={max_results}`

Search for restaurants with AI-powered insights.

**Parameters:**
- `location` (required): City or location (e.g., "Lewiston, Maine")
- `max_results` (optional): Maximum number of results (default: 10, max: 20)

**Example:**

```bash
curl "http://localhost:8000/api/v1/search?location=Lewiston,%20Maine&max_results=5"
```

**Response:**

```json
[
  {
    "name": "Joe's Pizza",
    "rating": 4.5,
    "trueSentiment": "82% Positive",
    "vibeCheck": ["#Loud", "#GoodForGroups"],
    "mustTryDishes": ["Spicy Rigatoni", "Garlic Knots"],
    "commonComplaints": ["Slow service on weekends"],
    "address": "123 Main St, Lewiston, ME",
    "place_id": "ChIJ..."
  }
]
```

### Health Check

**GET** `/health`

Check if the API is running.

## 🧠 ML Pipeline

The backend uses multiple NLP/ML models:

### 1. Sentiment Analysis (VADER)
- Analyzes review sentiment (-1 to +1 scale)
- Calculates "True Sentiment" percentage
- Fast and accurate for social media/review text

### 2. Topic Modeling (LDA)
- Discovers hidden topics in reviews
- Maps topics to vibe tags (#Romantic, #Loud, etc.)
- Uses scikit-learn's LatentDirichletAllocation

### 3. Keyword Extraction (TF-IDF)
- Extracts must-try dishes using TF-IDF
- Identifies common complaints from negative reviews
- Pattern matching for food items

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── api/
│   │   ├── __init__.py
│   │   └── search.py        # Search endpoint
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py        # App configuration
│   ├── models/
│   │   ├── __init__.py
│   │   ├── database.py      # SQLAlchemy models
│   │   └── restaurant.py    # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── google_places.py # Google Places API
│   │   └── review_scraper.py # Review scraping
│   └── ml/
│       ├── __init__.py
│       ├── sentiment_analyzer.py  # VADER sentiment
│       ├── topic_modeler.py       # LDA topic modeling
│       └── keyword_extractor.py   # TF-IDF extraction
├── setup_db.py              # Database setup script
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md
```

## 🔑 Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable these APIs:
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Add the API key to `.env` file

## 🗄️ Database Schema

### Restaurants Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| place_id | String | Google Places ID (unique) |
| name | String | Restaurant name |
| rating | Float | Google rating |
| address | Text | Full address |
| total_ratings | Integer | Number of ratings |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Update timestamp |

### Reviews Table

| Column | Type | Description |
|--------|------|-------------|
| id | Integer | Primary key |
| restaurant_id | Integer | Foreign key to restaurants |
| review_text | Text | Review content |
| rating | Float | Review rating |
| author | String | Review author |
| review_date | String | Review date |
| sentiment_score | Float | VADER sentiment score |
| created_at | DateTime | Creation timestamp |

## 🧪 Testing

```bash
# Install test dependencies (already in requirements.txt)
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# With coverage
pytest --cov=app tests/
```

## 🚀 Deployment

### Using Docker (Recommended)

```dockerfile
# Coming soon - Dockerfile
```

### Manual Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Install dependencies
4. Run with uvicorn in production mode

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 📝 Notes

- The app currently uses mock data if Google Places API is not configured
- Review scraping is limited to Google Places reviews (5 max per restaurant)
- For production, implement caching and rate limiting
- Consider using Celery for async ML processing with large datasets

## 🤝 Contributing

This is a demonstration project showcasing full-stack ML integration.

## 📄 License

MIT License

