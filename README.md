# Know Before You Go

**Know Before You Go: Spend 30 minutes scrolling, or 2 minutes deciding?**

This AI-powered application helps users make faster, more informed dining decisions by analyzing over 100,000+ unstructured restaurant reviews. Instead of relying on star ratings, it extracts real insights about vibe, must-try dishes, and common complaints — so users can quickly understand what to expect before they go.

---

## Why This Was Built

This project started from a simple problem I kept seeing, especially among international students — choosing where to eat in a new city is often confusing and time-consuming. Most people rely on scrolling through dozens of reviews, trying to piece together what a place is actually like.

I wanted to build a system that could take that unstructured, messy data and turn it into something actionable. Instead of reading hundreds of reviews, users can quickly understand the overall sentiment, vibe, and key insights in seconds. The goal was to reduce decision fatigue and make the process more intuitive and reliable.

---

## Why "Know Before You Go"?

This project was originally called *VibeFinder*, but the name evolved to better reflect the core goal of the system. The focus is not just on identifying a restaurant’s vibe, but on helping users make confident, informed decisions ahead of time.  

“Know Before You Go” captures that intent more clearly — turning raw, messy data into actionable insights that reduce uncertainty and decision fatigue.

---

## Architecture

This project follows a scalable **3-Tier Architecture**:

### Front-End (React + Vite + Tailwind CSS)
- Responsive, modern UI with clean design
- Real-time search with loading states
- Interactive restaurant cards with AI-powered insights
- Focus on usability and fast decision-making

### Back-End (Python FastAPI)
- High-performance REST API
- Orchestrates data collection and ML pipelines
- Integrates with external APIs (e.g., Google Places)
- Automatically generated API documentation

### Data Layer (PostgreSQL + ML Pipeline)
- Stores restaurant data and processed reviews
- Handles large-scale unstructured text processing
- Supports efficient querying and recommendation generation

---

## Core Features

- **Sentiment Analysis**  
  Goes beyond star ratings by analyzing real customer sentiment using VADER.

- **Vibe Detection**  
  Uses topic modeling (LDA) to identify patterns like  
  `#Romantic`, `#FamilyFriendly`, `#Loud`, `#Casual`.

- **Must-Try Dishes**  
  Extracted using TF-IDF and keyword analysis from thousands of reviews.

- **Common Complaints**  
  Highlights recurring issues to give users a balanced perspective.

- **Location-Aware Recommendations**  
  Combines sentiment + proximity to surface locally relevant results.

---

## Engineering Focus

A key challenge in this project is working with **highly unstructured and noisy data**. Reviews vary widely in quality, tone, and relevance, so the system is designed to:

- Clean and normalize raw text data  
- Aggregate sentiment across multiple sources  
- Weight insights based on consistency rather than outliers  
- Filter results based on geolocation and user context  
- Balance signal vs noise to deliver reliable outputs  

This required building a pipeline that transforms raw reviews into structured, confidence-driven insights that users can trust.

---

## Tech Stack

### Front-End
- React 18  
- Vite  
- Tailwind CSS  
- Fetch API  

### Back-End
- Python 3.9+  
- FastAPI  
- PostgreSQL  
- SQLAlchemy  

### ML / NLP
- VADER (Sentiment Analysis)  
- scikit-learn (LDA, TF-IDF)  
- spaCy (NER + text processing)  
- BeautifulSoup / Selenium (Data collection)  

### Infrastructure
- Docker (Containerization)  
- Redis + Celery (Async processing)  
- Railway (Backend + DB hosting)  
- Vercel (Frontend deployment)  
- Upstash (Serverless Redis)  

---

## API Endpoint Example

### `GET /api/v1/search`

Search for restaurants by location.

**Parameters:**
- `location` (string): e.g. `"Lewiston, Maine"`

**Response:**
```json
[
  {
    "name": "Joe's Pizza",
    "rating": 4.5,
    "trueSentiment": "82% Positive",
    "vibeCheck": ["#Loud", "#GoodForGroups"],
    "mustTryDishes": ["Spicy Rigatoni", "Garlic Knots"],
    "commonComplaints": ["Slow service on weekends"]
  }
]
