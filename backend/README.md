# Know Before You Go — Backend API

FastAPI backend that powers restaurant search, review fetching, and AI-generated insights.

## How It Works

1. Frontend sends a search query to `GET /api/v1/search`
2. Backend detects whether the query is a restaurant name or a location
3. Google Places API is called to find restaurants and fetch their reviews
4. OpenAI `gpt-4o-mini` analyzes the reviews for all restaurants in parallel
5. Results are validated and returned as JSON

## Quick Start

### 1. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

Create a `.env` file in the `backend/` folder:

```
GOOGLE_PLACES_API_KEY=your_google_places_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run the server

```bash
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

---

## API Endpoint

### `GET /api/v1/search`

Search for restaurants by location or name.

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `location` | string | Yes | — | City, neighborhood, or restaurant name |
| `max_results` | int | No | 10 | Max restaurants to return (1–20) |
| `user_lat` | float | No | null | User's GPS latitude (from Near Me) |
| `user_lng` | float | No | null | User's GPS longitude (from Near Me) |

**Example requests:**

```bash
# Location search
curl "http://localhost:8000/api/v1/search?location=Sushi+downtown+Boston&max_results=10"

# Near Me search (with GPS)
curl "http://localhost:8000/api/v1/search?location=42.3601,-71.0589&max_results=10&user_lat=42.3601&user_lng=-71.0589"
```

**Example response:**

```json
[
  {
    "name": "O Ya",
    "rating": 4.7,
    "trueSentiment": "91% Very Positive",
    "vibeDescription": "Intimate and hushed — a 12-seat omakase counter where every course feels deliberate. Lighting is low, conversation stays quiet, and the energy is focused entirely on the food.",
    "bestFor": ["Date Night", "Special Occasion"],
    "skipIf": ["Groups 4+", "Casual Bite"],
    "mustTryDishes": ["Wagyu nigiri", "Foie gras torchon"],
    "commonComplaints": ["Very expensive", "Hard to get a reservation"],
    "neighborhoodNote": "Downtown Boston near the Theater District. Safe to walk at night, close to South Station.",
    "address": "9 East St, Boston, MA 02111",
    "distance": "0.3 mi",
    "photo_url": "https://maps.googleapis.com/...",
    "photos": ["https://...", "https://..."],
    "website": "https://o-ya.restaurant"
  }
]
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── api/
│   │   └── search.py        # The /search endpoint + pipeline orchestration
│   ├── core/
│   │   └── config.py        # API keys and settings via Pydantic BaseSettings
│   ├── models/
│   │   └── restaurant.py    # Pydantic response model (RestaurantResponse)
│   └── services/
│       ├── google_places.py # Google Places API — find restaurants + fetch reviews
│       ├── review_scraper.py# Pulls review text from Google Places per restaurant
│       └── claude_analyzer.py # Sends reviews to OpenAI, returns structured insights
├── requirements.txt
└── .env                     # API keys (not committed to git)
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Python 3.12 | Language |
| FastAPI | Web framework + automatic API docs |
| Uvicorn | ASGI server |
| Pydantic | Data validation and settings management |
| `googlemaps` | Google Places API client |
| `openai` | OpenAI API client (`gpt-4o-mini`) |
| `python-dotenv` | Loads `.env` file |

---

## Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API** and **Geocoding API**
3. Create an API key
4. Add it to your `.env` file as `GOOGLE_PLACES_API_KEY`

## OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Create an API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

---

## Deployment

Backend is deployed on **Railway**. Set `GOOGLE_PLACES_API_KEY` and `OPENAI_API_KEY` as environment variables in the Railway project settings.
