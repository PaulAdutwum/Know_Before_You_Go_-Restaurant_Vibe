# know Before You GO

Welcome to **VibeFinder** - Your AI-powered restaurant discovery platform!

## 📋 What You Need

### Required Software:
- **Node.js** (v16+) - for the frontend
- **Python** (3.9+) - for the backend
- **PostgreSQL** (12+) - for the database
- **npm** or **yarn** - package manager

## 🎬 Getting Started (3 Easy Steps)

### Step 1: Start the Frontend

Open a terminal and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173** 🎨

### Step 2: Start the Backend

Open a **new terminal** and run:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download NLTK data (one-time setup)
python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('stopwords'); nltk.download('punkt')"

# Start the server
uvicorn app.main:app --reload
```

The backend will be available at: **http://localhost:8000** 🚀

API documentation: **http://localhost:8000/docs** 📚

### Step 3: Set Up Database (Optional for MVP)

The app works with mock data initially. To use the full database:

```bash
# Create PostgreSQL database
createdb vibefinder

# Initialize tables
cd backend
python setup_db.py
```

## 🎯 Quick Test

1. Open http://localhost:5173 in your browser
2. Enter a location (e.g., "Lewiston, Maine")
3. Click Search
4. See AI-powered restaurant insights! ✨

## 🔑 Optional: Google Places API

To use real restaurant data:

1. Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add it to `backend/app/.env`:
   ```
   GOOGLE_PLACES_API_KEY=your_key_here
   ```
3. Restart the backend

**Note**: Without the API key, the app uses mock data which still showcases all features!

## 🏗️ Project Structure

```
VibeFinder/
├── frontend/          # React + Tailwind UI
│   ├── src/
│   │   ├── App.jsx                    # Main app
│   │   └── components/                # UI components
│   └── package.json
│
├── backend/           # FastAPI + ML
│   ├── app/
│   │   ├── main.py                   # API entry
│   │   ├── api/search.py             # Search endpoint
│   │   ├── services/                 # External APIs
│   │   ├── ml/                       # ML models
│   │   └── models/                   # Data models
│   └── requirements.txt
│
└── README.md          # Full documentation
```

## ✨ Features

### Frontend (React)
- 🎨 Modern dark-themed UI with beautiful cards
- 🔍 Real-time search with loading states
- 📱 Fully responsive design
- 🎭 Smooth animations and transitions

### Backend (FastAPI)
- ⚡ High-performance async API
- 🤖 ML-powered sentiment analysis (VADER)
- 🏷️ Topic modeling for vibe detection (LDA)
- 🍕 Automatic dish extraction (TF-IDF)
- 💾 PostgreSQL for data persistence

## 🐛 Troubleshooting

### Frontend Issues

**Problem**: `npm install` fails
```bash
# Try clearing npm cache
npm cache clean --force
npm install
```

**Problem**: Port 5173 already in use
```bash
# Kill the process or change port in vite.config.js
```

### Backend Issues

**Problem**: Module not found
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

**Problem**: Database connection error
```bash
# The app works without a database (uses mock data)
# To fix: Check PostgreSQL is running and DATABASE_URL in .env is correct
```

**Problem**: CORS errors
```bash
# Frontend URL should be in BACKEND_CORS_ORIGINS in backend/app/.env
# Default includes: http://localhost:5173
```

## 📖 Learn More

- **Full Documentation**: See `README.md` in the root directory
- **Backend API Docs**: http://localhost:8000/docs (when backend is running)
- **Architecture Details**: See the main `README.md` for 3-tier architecture explanation

## 🎓 What Makes This Special?

This isn't just another restaurant app. VibeFinder demonstrates:

1. **Professional 3-Tier Architecture**
   - Separation of concerns
   - Scalable design
   - Industry best practices

2. **Real ML Integration**
   - VADER sentiment analysis
   - LDA topic modeling
   - TF-IDF keyword extraction

3. **Modern Tech Stack**
   - React with Tailwind CSS
   - FastAPI (Python's fastest framework)
   - PostgreSQL for production-ready data storage

4. **Beautiful, Polished UI**
   - Professional color scheme
   - Smooth animations
   - Great UX

## 🚀 Next Steps

1. ✅ Get it running (follow steps above)
2. 🔑 Add Google Places API key for real data
3. 💾 Set up PostgreSQL database
4. 🎨 Customize the UI colors/branding
5. 🚀 Deploy to production

## 🤝 Need Help?

- Check the logs in the terminal for errors
- Review the full README.md for detailed setup
- Make sure all prerequisites are installed

---

**Happy coding! 🍽️✨**

