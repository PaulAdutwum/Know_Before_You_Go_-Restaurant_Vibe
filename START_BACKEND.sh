#!/bin/bash

# VibeFinder Backend Startup Script

echo "🍽️  Starting VibeFinder Backend..."
echo ""

cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if [ ! -f "venv/installed" ]; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    touch venv/installed
    echo ""
    
    echo "📚 Downloading NLTK data..."
    python -c "import nltk; nltk.download('vader_lexicon'); nltk.download('stopwords'); nltk.download('punkt')"
    echo ""
fi

echo "🚀 Starting FastAPI server..."
echo "Backend will be available at: http://localhost:8000"
echo "API Docs at: http://localhost:8000/docs"
echo ""

uvicorn app.main:app --reload

