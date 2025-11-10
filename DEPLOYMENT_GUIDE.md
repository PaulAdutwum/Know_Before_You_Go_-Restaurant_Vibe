# 🚀 Free Deployment Guide - "Know Before You Go"

## 🎯 **Deployment Options (All FREE)**

| Component | Service | Free Tier | Setup Time |
|-----------|---------|-----------|------------|
| **Frontend** | Vercel | Unlimited | 5 min |
| **Backend** | Railway | $5/month credit | 10 min |
| **Database** | Railway PostgreSQL | Included | 2 min |
| **Redis** | Upstash | 10K commands/day | 5 min |
| **Celery** | Railway Worker | Included | 5 min |

**Total Cost: $0/month** ✅  
**Total Setup Time: ~30 minutes** ⏱️

---

## 📋 **OPTION 1: Railway (Easiest - Recommended)**

Railway provides **$5/month credit** which is enough for this project!

### **Prerequisites:**
- GitHub account
- Credit card (for verification, won't be charged)

---

### **Step 1: Prepare Your GitHub Repository**

```bash
# 1. Initialize git if not already done
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder
git init
git add .
git commit -m "Initial commit - Know Before You Go"

# 2. Create GitHub repo and push
# Go to github.com/new
# Then:
git remote add origin https://github.com/YOUR_USERNAME/know-before-you-go.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Deploy Backend on Railway**

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click:** "New Project"
4. **Select:** "Deploy from GitHub repo"
5. **Choose:** Your "know-before-you-go" repository
6. **Railway will auto-detect** FastAPI and deploy!

#### **Configure Environment Variables:**

In Railway dashboard → Variables, add:

```env
# Google API
GOOGLE_PLACES_API_KEY=your_actual_api_key

# Database (Auto-provided by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (Will add later)
REDIS_URL=${{Redis.REDIS_URL}}

# Python path
PYTHONPATH=/app/backend

# Port
PORT=8000

# Scraping config
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=50
SCRAPING_DELAY_SECONDS=3
```

---

### **Step 3: Add PostgreSQL Database**

In your Railway project:

1. **Click:** "New" → "Database" → "Add PostgreSQL"
2. **Railway auto-connects** it to your backend
3. **Run migrations:**
   - In Railway dashboard, go to your backend service
   - Click "Settings" → "Custom Start Command"
   - Add: `python backend/setup_db.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

### **Step 4: Add Redis**

In your Railway project:

1. **Click:** "New" → "Database" → "Add Redis"
2. **Railway auto-connects** it to your backend
3. Redis URL will be available as `${{Redis.REDIS_URL}}`

---

### **Step 5: Add Celery Worker**

In your Railway project:

1. **Click:** "New" → "Service"
2. **Select:** Same GitHub repo
3. **Settings:**
   - Name: "Celery Worker"
   - Start Command: `celery -A celery_worker worker --loglevel=info`
   - Root Directory: `/backend`
4. **Add same environment variables** as backend

---

### **Step 6: Deploy Frontend on Vercel**

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. **Click:** "New Project"
4. **Import:** Your GitHub repo
5. **Framework Preset:** Vite
6. **Root Directory:** `frontend`
7. **Build Command:** `npm run build`
8. **Output Directory:** `dist`
9. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
10. **Deploy!**

---

### **Step 7: Update CORS in Backend**

Update `backend/app/core/config.py`:

```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "https://your-frontend.vercel.app",  # Add your Vercel URL
    "https://*.vercel.app"  # Allow all Vercel preview deployments
]
```

Commit and push - Railway will auto-deploy!

---

## 🎉 **You're Live!**

Your app is now deployed at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **Add to Resume:** ✅

---

## 📋 **OPTION 2: Alternative Free Services**

### **2A: Render.com (Backend Alternative)**

**Pros:** Truly free, no credit card needed  
**Cons:** Slower cold starts (spins down after inactivity)

#### **Setup:**

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect** your GitHub repo
5. **Settings:**
   - **Name:** know-before-you-go-api
   - **Environment:** Python 3
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables:** (same as Railway)

6. **Add PostgreSQL:**
   - New → PostgreSQL
   - Free tier available

7. **Add Redis:**
   - Use **Upstash** (see below)

---

### **2B: Upstash Redis (Free Redis)**

**Perfect for:** Any deployment needing Redis

1. **Go to:** https://upstash.com
2. **Sign up** (free, no credit card)
3. **Create Database:**
   - Region: Choose closest to your backend
   - Type: Redis
4. **Copy Connection URL:**
   ```
   redis://default:password@region.upstash.io:port
   ```
5. **Add to Environment Variables:**
   ```
   REDIS_URL=your_upstash_url
   ```

**Free Tier:**
- 10,000 commands/day
- Enough for development/portfolio

---

### **2C: Netlify (Frontend Alternative)**

Similar to Vercel, steps:

1. **Go to:** https://netlify.com
2. **Sign up** with GitHub
3. **New site from Git**
4. **Build settings:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
5. **Environment:** `VITE_API_URL=your-backend-url`

---

## 🎯 **Simplest Setup for Portfolio (Recommended)**

### **Quick Win - 15 Minutes:**

```
Frontend: Vercel (easiest)
Backend: Railway (all-in-one with $5 credit)
Database: Railway PostgreSQL (included)
Redis: Railway Redis (included)
Worker: Railway Celery (included)
```

**Why this is best:**
- ✅ Everything in one place
- ✅ Auto-deploys on git push
- ✅ No cold starts
- ✅ Real database + Redis
- ✅ Professional URL
- ✅ SSL certificates included
- ✅ Environment variables managed
- ✅ Logs available

**Cost:** $0 for first 500 hours (~$5 credit lasts 1-2 months)

---

## 💡 **Optimizations for Free Tier**

### **1. Reduce Scraping Load**

Update `.env` for production:

```env
MAX_REVIEWS_PER_RESTAURANT=20  # Reduce from 100
SCRAPING_DELAY_SECONDS=5       # Increase from 2
```

This reduces compute and stays within free limits.

---

### **2. Disable Celery for Demo (Optional)**

If Celery worker is too resource-heavy:

Update `backend/app/api/search.py`:

```python
# Comment out background job queuing
# scrape_and_process_reviews_task.delay(restaurant.id, place_id)

# Just use hybrid insights for demo
```

This way you get instant results without background processing.

---

### **3. Use Static Mock Data**

For pure demo purposes (no API costs):

Create `backend/app/api/search.py` demo mode:

```python
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

if DEMO_MODE:
    # Return mock data with realistic insights
    return get_mock_data()
```

Set `DEMO_MODE=true` in Railway environment.

---

## 📊 **Cost Breakdown (Production)**

If you want to run this long-term:

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Vercel Frontend | ✅ Free forever | N/A |
| Railway Backend | $5 credit/month | $0.000463/GB-hour (~$5-10/mo) |
| Railway PostgreSQL | Included in credit | Included |
| Railway Redis | Included in credit | Included |
| Upstash Redis | ✅ Free (10K/day) | $0.2 per 100K requests |
| Google Places API | ✅ $200 credit/month | $17 per 1000 requests |

**Estimated Real Cost:** $0-5/month depending on traffic

---

## 🎨 **Custom Domain (Optional)**

Make it even more professional:

1. **Buy domain** on Namecheap ($10/year):
   - `knowbeforeyougo.com`
   
2. **Connect to Vercel:**
   - Vercel Dashboard → Domains → Add
   - Follow DNS instructions
   
3. **Connect to Railway:**
   - Railway → Settings → Domains → Custom Domain
   - Add CNAME record

**Result:**
- Frontend: `knowbeforeyougo.com`
- Backend: `api.knowbeforeyougo.com`

---

## 🔧 **Deployment Checklist**

### **Before Deploying:**

- [ ] Push code to GitHub
- [ ] Remove any hardcoded secrets
- [ ] Update CORS origins
- [ ] Test locally one more time
- [ ] Create `.env.example` file (without actual secrets)

### **After Deploying:**

- [ ] Test frontend loads
- [ ] Test API endpoint: `https://your-api.railway.app/health`
- [ ] Test a search query
- [ ] Check Railway logs for errors
- [ ] Verify database connection
- [ ] Test Celery worker (if deployed)

### **For Resume:**

- [ ] Add live link: `🔗 knowbeforeyougo.vercel.app`
- [ ] Add GitHub link: `💻 github.com/you/know-before-you-go`
- [ ] Take screenshots for portfolio
- [ ] Write project description
- [ ] List tech stack used

---

## 🐛 **Common Issues & Fixes**

### **Issue: Railway Build Fails**

**Fix:** Check `railway.json` is in root directory

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

---

### **Issue: Database Connection Error**

**Fix:** Ensure `DATABASE_URL` uses Railway's provided variable:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

---

### **Issue: CORS Error**

**Fix:** Update `config.py`:

```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "https://*.vercel.app",
    os.getenv("FRONTEND_URL", "")
]
```

And add `FRONTEND_URL` in Railway environment variables.

---

### **Issue: Frontend Can't Connect to Backend**

**Fix:** Update `frontend/src/App.jsx`:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Use this for API calls
const response = await fetch(`${API_URL}/api/v1/search?location=${location}`);
```

---

### **Issue: Celery Worker Not Running**

**Fix:** Ensure worker has same environment variables as backend, especially:
- `DATABASE_URL`
- `REDIS_URL`
- `GOOGLE_PLACES_API_KEY`

---

## 🎯 **Quick Deploy Commands**

### **One-Time Setup:**

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Initial commit"
gh repo create know-before-you-go --public --source=. --push

# 2. Deploy to Railway (via dashboard)
# 3. Deploy to Vercel (via dashboard)
```

### **Update After Changes:**

```bash
# Just push to GitHub - auto-deploys!
git add .
git commit -m "Update: feature description"
git push

# Railway & Vercel will auto-deploy in ~2 minutes
```

---

## 🚀 **Final Result**

After deployment, you'll have:

✅ **Live Demo:** `https://knowbeforeyougo.vercel.app`  
✅ **Backend API:** `https://knowbeforeyougo.railway.app`  
✅ **GitHub:** `https://github.com/you/know-before-you-go`

**Add to resume:**
```
Know Before You Go | ML-Powered Restaurant Intelligence Platform    [Live Demo ↗]
```

---

## 🎉 **You're Done!**

Your project is now:
- ✅ Deployed and live
- ✅ Professional demo link
- ✅ Ready for resume/portfolio
- ✅ Costs $0/month
- ✅ Auto-deploys on push

---

## 📚 **Next Steps**

1. **Monitor Usage:**
   - Railway Dashboard → Metrics
   - Check if staying within $5 credit

2. **Optimize if Needed:**
   - Reduce scraping frequency
   - Add caching
   - Disable features for demo

3. **Show It Off:**
   - Add to LinkedIn
   - Include in cover letters
   - Demo in interviews!

**Good luck! 🚀**

