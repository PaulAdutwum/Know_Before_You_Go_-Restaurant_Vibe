#!/bin/bash

# VibeFinder Startup Script with Real-Time Monitoring
# This script starts all components and shows you what's happening in real-time

set -e

PROJECT_ROOT="/Users/pauladutwum/Documents/Myprojects/VibeFinder"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

echo "════════════════════════════════════════════════════════════"
echo "🚀 Starting VibeFinder with Real-Time Monitoring"
echo "════════════════════════════════════════════════════════════"
echo ""

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -9 -f "uvicorn app.main:app" 2>/dev/null || true
pkill -9 -f "celery.*worker" 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Check prerequisites
echo "🔍 Checking prerequisites..."
redis-cli ping > /dev/null 2>&1 && echo "✅ Redis running" || { echo "❌ Redis not running. Run: brew services start redis"; exit 1; }
psql -d vibefinder -c "SELECT 1" > /dev/null 2>&1 && echo "✅ PostgreSQL running" || { echo "❌ PostgreSQL not running. Run: brew services start postgresql@14"; exit 1; }
echo ""

# Start Backend API
echo "════════════════════════════════════════════════════════════"
echo "🚀 Starting Backend API..."
echo "════════════════════════════════════════════════════════════"
cd "$PROJECT_ROOT/backend"
source venv/bin/activate
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 > /tmp/vibefinder_backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API started (PID: $BACKEND_PID)"
    echo "   http://localhost:8000"
    echo ""
else
    echo "❌ Backend failed to start!"
    tail -20 /tmp/vibefinder_backend.log
    exit 1
fi

# Start Celery Worker
echo "════════════════════════════════════════════════════════════"
echo "⚙️  Starting Celery Worker..."
echo "════════════════════════════════════════════════════════════"
cd "$PROJECT_ROOT/backend"
source venv/bin/activate
celery -A celery_worker worker --loglevel=info > /tmp/vibefinder_celery.log 2>&1 &
CELERY_PID=$!
sleep 3

if ps -p $CELERY_PID > /dev/null 2>&1; then
    echo "✅ Celery Worker started (PID: $CELERY_PID)"
    echo "   Logs: /tmp/vibefinder_celery.log"
    echo ""
else
    echo "❌ Celery failed to start!"
    tail -20 /tmp/vibefinder_celery.log
    exit 1
fi

# Start Frontend
echo "════════════════════════════════════════════════════════════"
echo "⚛️  Starting Frontend..."
echo "════════════════════════════════════════════════════════════"
cd "$PROJECT_ROOT/frontend"
npm run dev > /tmp/vibefinder_frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 4

if lsof -ti:5173 > /dev/null 2>&1; then
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
    echo "   http://localhost:5173"
    echo ""
else
    echo "❌ Frontend failed to start!"
    tail -20 /tmp/vibefinder_frontend.log
    exit 1
fi

# Summary
echo "════════════════════════════════════════════════════════════"
echo "✅ ALL SYSTEMS RUNNING!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🌐 Open in browser: http://localhost:5173"
echo ""
echo "📊 Process IDs:"
echo "   Backend:       $BACKEND_PID"
echo "   Celery Worker: $CELERY_PID"
echo "   Frontend:      $FRONTEND_PID"
echo ""
echo "📝 Log files:"
echo "   Backend:       /tmp/vibefinder_backend.log"
echo "   Celery:        /tmp/vibefinder_celery.log"
echo "   Frontend:      /tmp/vibefinder_frontend.log"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🔍 REAL-TIME MONITORING COMMANDS:"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Watch Backend logs:"
echo "  tail -f /tmp/vibefinder_backend.log"
echo ""
echo "Watch Celery worker (scraping activity):"
echo "  tail -f /tmp/vibefinder_celery.log"
echo ""
echo "Watch all logs simultaneously:"
echo "  tail -f /tmp/vibefinder_*.log"
echo ""
echo "Test API directly:"
echo "  curl 'http://localhost:8000/api/v1/search?location=Pizza%20Boston&max_results=3'"
echo ""
echo "Check database reviews:"
echo "  psql vibefinder -c 'SELECT COUNT(*) FROM reviews;'"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🧪 Ready to test! Search for 'Pizza Boston' in the browser."
echo ""

