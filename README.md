# Know Before You Go

**Know the vibe before you walk in.**

An AI-powered restaurant discovery app that turns raw customer reviews into real, actionable insights — so you know the atmosphere, what to order, and what to watch out for before you go.

Instead of reading through dozens of reviews or trusting a star rating, you get a vibe description, a true sentiment score, must-try dishes, honest warnings, and neighborhood safety notes — all extracted from what real diners actually said.

---

## Why This Was Built

Choosing where to eat in a new city is surprisingly hard. Most people scroll through dozens of reviews trying to piece together what a place is actually like. Star ratings miss nuance. Review apps are cluttered.

This project was built to solve that — take unstructured, noisy review data and turn it into something you can act on in under 2 minutes.

---

## What It Does

For every restaurant, the app surfaces:

- **Vibe** — what it actually feels like inside: noise level, lighting, crowd energy
- **True Sentiment** — a percentage calculated from review language, not star averages
- **Best For / Skip If** — whether it fits your night (date night, groups, quick bite, etc.)
- **Must-Try Dishes** — real food items reviewers mentioned by name
- **Honest Warnings** — the most common complaints before you book
- **Neighborhood Note** — whether the area is safe to walk at night and what is nearby

---

## Architecture

```
Frontend (React + Vite + Tailwind)
        ↓  HTTP GET request
Backend (FastAPI + Python)
        ↓                    ↓
Google Places API       OpenAI gpt-4o-mini
(restaurants + reviews) (AI analysis of reviews)
        ↓
JSON response → React renders restaurant cards
```

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 19 | UI framework — component-based, state-driven |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling |
| Fetch API | HTTP requests to the backend |
| Browser Geolocation API | Near Me feature — GPS coordinates |

### Backend
| Tool | Purpose |
|---|---|
| Python 3.12 | Language |
| FastAPI | REST API framework with auto-generated docs |
| Uvicorn | ASGI web server |
| Pydantic | Data validation and settings management |
| `googlemaps` | Google Places API — find restaurants and fetch reviews |
| `openai` | OpenAI API client — `gpt-4o-mini` for review analysis |
| `python-dotenv` | Loads API keys from `.env` file |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Railway | Backend hosting |

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.12+
- A Google Places API key
- An OpenAI API key

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
GOOGLE_PLACES_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

```bash
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`
Interactive API docs at `http://localhost:8000/docs`

---

## API

### `GET /api/v1/search`

| Parameter | Required | Description |
|---|---|---|
| `location` | Yes | City, neighborhood, or restaurant name |
| `max_results` | No | Max results to return (default 10) |
| `user_lat` | No | GPS latitude (for Near Me distance calculation) |
| `user_lng` | No | GPS longitude (for Near Me distance calculation) |

**Example:**
```
GET /api/v1/search?location=Sushi+downtown+Boston&max_results=10
```

---

## Project Structure

```
Know-Before-You-Go/
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # Entry point
│   │   ├── App.jsx               # Root component, state, API call
│   │   └── components/
│   │       ├── SearchBar.jsx     # Search input + Near Me button
│   │       ├── ResultsContainer.jsx  # Results grid
│   │       ├── RestaurantCard.jsx    # Individual restaurant card
│   │       ├── PhotoGalleryModal.jsx # Photo overlay
│   │       └── Logo.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── app/
    │   ├── main.py               # FastAPI app, CORS, router setup
    │   ├── api/search.py         # Search endpoint + pipeline orchestration
    │   ├── core/config.py        # Settings via Pydantic BaseSettings
    │   ├── models/restaurant.py  # Pydantic response model
    │   └── services/
    │       ├── google_places.py  # Google Places API integration
    │       ├── review_scraper.py # Fetches reviews per restaurant
    │       └── claude_analyzer.py# OpenAI review analysis
    └── requirements.txt
```

---

## License

MIT
