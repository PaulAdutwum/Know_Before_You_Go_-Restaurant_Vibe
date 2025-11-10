#!/bin/bash

# VibeFinder Frontend Startup Script

echo "🍽️  Starting VibeFinder Frontend..."
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo "Frontend will be available at: http://localhost:5173"
echo ""

npm run dev

