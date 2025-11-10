# 🔍 Real-Time Monitoring Guide

## ✅ Current Status

All systems are running:
- 🚀 Backend API: http://localhost:8000
- ⚛️ Frontend: http://localhost:5173
- ⚙️ Celery Worker: Processing background jobs
- 🗄️ PostgreSQL: Storing data
- 🔴 Redis: Queue management

---

## 🧪 Testing Right Now

### 1. Open Frontend in Browser

```bash
# Open this URL:
http://localhost:5173
```

### 2. Search for Something

Try these searches:
- `Pizza Boston`
- `Sushi New York`  
- `Coffee Seattle`
- Click "📍 Near Me" button

---

## 📊 What You'll See (Real-Time Flow)

### First Search: "Pizza Boston"

**Step 1 - Instant Results (< 2 seconds)**
```
✅ You'll see 10 restaurants immediately
✅ Each shows "hybrid insights" (quick, generated)
   Example:
   - 84% Positive (based on rating)
   - #Loud, #GoodForGroups (generic vibes)
   - House Salad, Daily Special (generic dishes)
```

**Step 2 - Background Scraping Starts**
```
⚙️ Celery worker starts scraping Google Maps
   (This happens silently in the background)
```

**Step 3 - Wait 60 seconds**
```
⏳ Scraping 100+ reviews per restaurant
⏳ Running ML analysis
⏳ Saving to database
```

**Step 4 - Search Again**
```
✅ Lightning fast results (< 500ms)
✅ REAL ML insights from scraped reviews!
   Example:
   - 82% Positive (from 127 actual reviews!)
   - #Loud, #DateNight, #Trendy (from review analysis)
   - Spicy Rigatoni, Garlic Knots (mentioned 23x, 18x)
   - "Slow service on weekends" (from negative reviews)
```

---

## 🔍 How to Monitor in Real-Time

### Option 1: Watch All Logs (Recommended)

Open a new terminal and run:

```bash
tail -f /tmp/vibefinder_*.log
```

This shows:
- Backend API requests
- Celery worker scraping activity
- Frontend build messages

### Option 2: Watch Specific Components

**Backend API logs:**
```bash
tail -f /tmp/vibefinder_backend.log
```

You'll see:
```
INFO: 127.0.0.1:12345 - "GET /api/v1/search?location=Pizza%20Boston" 200 OK
INFO: Google Places API called for location: Pizza Boston
INFO: Found 10 restaurants
INFO: Queued 10 scraping jobs to Celery
```

**Celery Worker logs (Scraping Activity):**
```bash
tail -f /tmp/vibefinder_celery.log
```

You'll see:
```
[INFO] Task scrape_and_process_reviews_task received
[INFO] Scraping restaurant: Joe's Pizza (ChIJ123...)
[INFO] Opening Chrome browser...
[INFO] Navigating to Google Maps...
[INFO] Scrolling reviews section...
[INFO] Extracted 127 reviews
[INFO] Running sentiment analysis...
[INFO] Saved to database
[INFO] Task completed successfully
```

**Frontend logs:**
```bash
tail -f /tmp/vibefinder_frontend.log
```

---

## 📊 Monitor Database in Real-Time

### Watch Reviews Being Saved

Open a new terminal:

```bash
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Watch review count increase
watch -n 2 'psql vibefinder -c "SELECT COUNT(*) as total_reviews FROM reviews;"'
```

You'll see the count increase as scraping happens!

### See Which Restaurants Have Been Scraped

```bash
psql vibefinder << 'EOF'
SELECT 
    name, 
    last_scraped,
    (SELECT COUNT(*) FROM reviews WHERE restaurant_id = restaurants.id) as review_count
FROM restaurants
WHERE last_scraped IS NOT NULL
ORDER BY last_scraped DESC;
EOF
```

### Check Scraping Job Status

```bash
psql vibefinder << 'EOF'
SELECT 
    place_id,
    status,
    reviews_scraped,
    created_at,
    completed_at
FROM scraping_jobs
ORDER BY created_at DESC
LIMIT 5;
EOF
```

---

## 🧪 Test API Directly (Command Line)

### Search for Restaurants

```bash
curl -s "http://localhost:8000/api/v1/search?location=Pizza%20Boston&max_results=5" | python3 -m json.tool
```

### Check API Health

```bash
curl -s http://localhost:8000/health | python3 -m json.tool
```

### Get Recent Scraping Jobs

```bash
curl -s http://localhost:8000/api/v1/scraping/recent_jobs | python3 -m json.tool
```

### Check Specific Job Status

```bash
# Replace 1 with actual job_id
curl -s http://localhost:8000/api/v1/scraping/status/1 | python3 -m json.tool
```

---

## 📈 Visual Monitoring Dashboard

### Create a Simple Monitor Script

Save this as `monitor.sh`:

```bash
#!/bin/bash

while true; do
    clear
    echo "════════════════════════════════════════════════════════════"
    echo "🔍 VibeFinder Real-Time Monitor"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    
    # System Status
    echo "✅ System Status:"
    curl -s http://localhost:8000/health > /dev/null && echo "   🚀 Backend: Running" || echo "   ❌ Backend: Down"
    redis-cli ping > /dev/null 2>&1 && echo "   🔴 Redis: Running" || echo "   ❌ Redis: Down"
    psql vibefinder -c "SELECT 1" > /dev/null 2>&1 && echo "   🗄️  PostgreSQL: Running" || echo "   ❌ PostgreSQL: Down"
    echo ""
    
    # Database Stats
    echo "📊 Database Stats:"
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
    RESTAURANT_COUNT=$(psql vibefinder -t -c "SELECT COUNT(*) FROM restaurants;" | xargs)
    REVIEW_COUNT=$(psql vibefinder -t -c "SELECT COUNT(*) FROM reviews;" | xargs)
    SCRAPED_COUNT=$(psql vibefinder -t -c "SELECT COUNT(*) FROM restaurants WHERE last_scraped IS NOT NULL;" | xargs)
    
    echo "   🍽️  Restaurants: $RESTAURANT_COUNT"
    echo "   📝 Reviews: $REVIEW_COUNT"
    echo "   ✅ Scraped: $SCRAPED_COUNT"
    echo ""
    
    # Recent Activity
    echo "🔄 Recent Scraping Jobs:"
    psql vibefinder -t -c "
        SELECT 
            CONCAT('   ', status, ' - ', place_id, ' (', reviews_scraped, ' reviews)')
        FROM scraping_jobs
        ORDER BY created_at DESC
        LIMIT 3;" 2>/dev/null || echo "   No jobs yet"
    
    echo ""
    echo "Press Ctrl+C to stop monitoring..."
    sleep 3
done
```

Make it executable and run:
```bash
chmod +x monitor.sh
./monitor.sh
```

---

## 🎯 What to Look For

### Signs Everything is Working:

1. **Backend responds to API calls** ✅
   ```bash
   curl -s http://localhost:8000/health
   # Should return: {"status":"healthy","service":"VibeFinder API"}
   ```

2. **Celery worker is connected** ✅
   ```bash
   grep "celery.*ready" /tmp/vibefinder_celery.log
   # Should find: "celery@YourMac ready."
   ```

3. **Scraping jobs are processing** ✅
   ```bash
   grep "Task scrape_and_process_reviews_task" /tmp/vibefinder_celery.log
   # Should show scraping activity
   ```

4. **Reviews are being saved** ✅
   ```bash
   psql vibefinder -c "SELECT COUNT(*) FROM reviews;"
   # Should increase over time
   ```

5. **Second search is faster** ✅
   - First search: ~2 seconds
   - Second search (after scraping): < 500ms

---

## 🐛 Troubleshooting Real-Time

### Issue: No scraping activity in Celery logs

**Check:**
```bash
# Is Celery worker running?
ps aux | grep celery | grep -v grep

# Is it connected to Redis?
grep "Connected to redis" /tmp/vibefinder_celery.log

# Are tasks being registered?
grep "tasks" /tmp/vibefinder_celery.log
```

**Fix:**
```bash
# Restart Celery worker
pkill -f celery
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder/backend
source venv/bin/activate
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
celery -A celery_worker worker --loglevel=info > /tmp/vibefinder_celery.log 2>&1 &
```

---

### Issue: Backend returns errors

**Check logs:**
```bash
tail -50 /tmp/vibefinder_backend.log | grep ERROR
```

**Common errors:**
- `ModuleNotFoundError` → Run `pip install -r requirements.txt`
- `Database connection failed` → Check PostgreSQL is running
- `Google Places API error` → Check API key in `.env`

---

### Issue: Frontend not loading

**Check:**
```bash
# Is it running?
lsof -ti:5173

# Check logs
tail -50 /tmp/vibefinder_frontend.log
```

**Fix:**
```bash
# Restart frontend
lsof -ti:5173 | xargs kill -9
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder/frontend
npm run dev > /tmp/vibefinder_frontend.log 2>&1 &
```

---

## 📱 Real-Time Testing Checklist

- [ ] Open http://localhost:5173 in browser
- [ ] Search for "Pizza Boston"
- [ ] See 10 restaurants with hybrid insights
- [ ] Open terminal and run: `tail -f /tmp/vibefinder_celery.log`
- [ ] Watch scraping activity in Celery logs
- [ ] Wait 60 seconds
- [ ] Search "Pizza Boston" again
- [ ] See real ML insights with specific dishes
- [ ] Click "Show Chart" to see sentiment breakdown
- [ ] Check database: `psql vibefinder -c "SELECT COUNT(*) FROM reviews;"`
- [ ] Should see 100+ reviews per restaurant

---

## ✅ Success!

You'll know everything is working when:

1. **First search**: Instant results with generic insights
2. **Celery logs**: Show "Scraping restaurant..." messages
3. **Database**: Review count increases
4. **Second search**: Same query is instant with real insights
5. **UI**: Shows specific dishes like "Spicy Rigatoni (mentioned 23x)"

---

## 🚀 Quick Commands Reference

```bash
# Start everything
./start_all.sh

# Watch all logs
tail -f /tmp/vibefinder_*.log

# Test API
curl -s "http://localhost:8000/api/v1/search?location=Pizza%20Boston"

# Check database
psql vibefinder -c "SELECT COUNT(*) FROM reviews;"

# Monitor in real-time
watch -n 2 'psql vibefinder -c "SELECT COUNT(*) FROM reviews;"'

# Stop everything
pkill -f uvicorn
pkill -f celery
pkill -f "node.*vite"
```

---

**Ready? Open http://localhost:5173 and start searching! Watch the logs to see everything happening in real-time!** 🎉

