# Know Before You Go

Know Before You Go: Spend 30 minutes scrolling, or 2 minutes deciding?

This AI-powered app does the heavy lifting for you. It analyzes 100,000+ unstructured reviews to find the real vibe, must-try dishes, and hidden complaints to help you make the right choice, fast.


##  Architecture

This project follows a professional **3-Tier Architecture**:

### **Front-End (React + Vite + Tailwind CSS)**
- Modern, responsive UI with dark blue, white, and orange color scheme
- Real-time search with loading states
- Beautiful restaurant cards with AI-powered insights

### **Back-End (Python FastAPI)**
- High-performance REST API
- Orchestrates data collection and ML processing
- Google Places API integration
- Automatic API documentation

### **Data Layer (PostgreSQL + ML Pipeline)**
- Persistent storage for restaurants and reviews
- Sentiment Analysis (VADER)
- Topic Modeling for "vibe detection" (LDA)
- Keyword Extraction for must-try dishes and complaints

## Features

- **True Sentiment Analysis**: Goes beyond star ratings to show real customer sentiment
- **Vibe Check**: AI-detected ambiance tags (#Romantic, #Loud, #FamilyFriendly, etc.)
- **Must-Try Dishes**: Automatically extracted from reviews
- **Common Complaints**: Honest insights about potential issues
- **Beautiful UI**: Professional, modern interface with smooth animations

## 📦 Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

### Backend Setup (Coming Soon)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will run on `http://localhost:8000`

## 🛠️ Tech Stack

### Front-End
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- Fetch API (HTTP Client)

### Back-End
- Python 3.9+
- FastAPI (Web Framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)

### ML/NLP Libraries
- VADER (Sentiment Analysis)
- scikit-learn (Topic Modeling, TF-IDF)
- spaCy (Named Entity Recognition)
- BeautifulSoup/Scrapy (Web Scraping)

##  API Endpoints

### `GET /api/v1/search`

Search for restaurants by location.

**Parameters:**
- `location` (string): City or location to search (e.g., "Lewiston, Maine")

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
```

##  Project Phases

- [x] **Phase 1**: Front-End Setup
  - [x] React + Vite + Tailwind
  - [x] Core Components
  - [x] Professional UI Design

- [ ] **Phase 2**: Back-End API
  - [ ] FastAPI Setup
  - [ ] Google Places Integration
  - [ ] Data Pipeline Orchestration

- [ ] **Phase 3**: ML Pipeline
  - [ ] Database Setup
  - [ ] Review Scraping
  - [ ] Sentiment Analysis
  - [ ] Topic Modeling
  - [ ] Keyword Extraction

- [ ] **Phase 4**: Integration & Deployment
  - [ ] Connect Frontend to Backend
  - [ ] Testing & Optimization
  - [ ] Deployment

## Contributing

This is a project showcasing full-stack development with ML integration.

## 📄 License

MIT License

---


