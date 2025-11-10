# 🔐 Environment Variables Setup Guide

Complete guide to setting up environment variables for local development and production deployment.

---

## 📋 **Quick Reference**

| File                  | Purpose                        | When to Use              |
| --------------------- | ------------------------------ | ------------------------ |
| `env.example`         | Template for local development | Copy to `backend/.env`   |
| `env.railway.example` | Production backend config      | Add in Railway Dashboard |
| `env.vercel.example`  | Production frontend config     | Add in Vercel Dashboard  |

---

## 🏠 **Local Development Setup**

### **Step 1: Create Backend Environment File**

```bash
# Copy the example file
cp env.example backend/.env

# Or create manually:
cd backend
touch .env
```

### **Step 2: Fill in Required Values**

Edit `backend/.env` with your actual values:

```env
# ===== REQUIRED =====
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# ===== Database (Choose One) =====
# Option A: PostgreSQL (Recommended)
DATABASE_URL=postgresql://vibefinder:vibefinder@localhost:5432/vibefinder

# Option B: SQLite (Simpler, for testing)
# DATABASE_URL=sqlite:///./vibefinder.db

# ===== Redis =====
REDIS_URL=redis://localhost:6379/0

# ===== Backend Settings =====
DEBUG=true
PORT=8000

# ===== Scraping =====
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=100
SCRAPING_DELAY_SECONDS=2

# ===== Reddit (Optional) =====
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
REDDIT_USER_AGENT=VibeFinder/1.0
```

### **Step 3: Verify Setup**

```bash
# Start backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Test in another terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy","service":"VibeFinder API"}
```

---

## 🚀 **Production Deployment - Railway Backend**

### **Step 1: Deploy to Railway**

1. Go to **https://railway.app**
2. Create new project → Connect GitHub repo
3. Railway auto-detects FastAPI

### **Step 2: Add PostgreSQL**

1. In your Railway project: **New** → **Database** → **PostgreSQL**
2. Railway automatically creates: `${{Postgres.DATABASE_URL}}`

### **Step 3: Add Redis**

1. In your Railway project: **New** → **Database** → **Redis**
2. Railway automatically creates: `${{Redis.REDIS_URL}}`

### **Step 4: Add Environment Variables**

In Railway Dashboard → Your Backend Service → Variables:

#### **Essential Variables:**

```env
# Google API (REQUIRED - Add your actual key)
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Auto-provided by Railway (Use these exact values!)
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
PORT=${{PORT}}

# Python Path
PYTHONPATH=/app/backend

# Backend Settings
DEBUG=false

# Scraping (Reduced for production)
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=20
SCRAPING_DELAY_SECONDS=3
```

#### **Optional Variables:**

```env
# Reddit API (Optional)
REDDIT_CLIENT_ID=your_reddit_id
REDDIT_CLIENT_SECRET=your_reddit_secret
REDDIT_USER_AGENT=KnowBeforeYouGo/1.0

# ML Settings
REVIEW_SAMPLE_SIZE=50
MIN_SENTIMENT_THRESHOLD=0.6
VIBE_TOPIC_COUNT=3
TOP_DISHES_COUNT=5
TOP_COMPLAINTS_COUNT=3
```

### **Step 5: Update CORS for Production**

After deploying, get your Vercel frontend URL, then update `backend/app/core/config.py`:

```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",                    # Local dev
    "https://your-app.vercel.app",              # Your Vercel URL
    "https://*.vercel.app",                     # All Vercel previews
    os.getenv("FRONTEND_URL", "")               # Optional: add via env var
]
```

Commit and push - Railway will auto-deploy!

---

## 🌐 **Production Deployment - Vercel Frontend**

### **Step 1: Deploy to Vercel**

1. Go to **https://vercel.com**
2. Import GitHub repository
3. Settings:
   - Framework: **Vite**
   - Root Directory: **frontend**
   - Build Command: **npm run build**
   - Output Directory: **dist**

### **Step 2: Add Environment Variable**

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```
Key:   VITE_API_URL
Value: https://your-backend-name.railway.app

Environments: ✅ Production  ✅ Preview  ✅ Development
```

**Important:** Replace `your-backend-name` with your actual Railway backend URL!

### **Step 3: Redeploy**

After adding environment variable:

- Vercel → Deployments → Redeploy latest

---

## 🔧 **Celery Worker Configuration (Railway)**

If deploying Celery as separate service:

### **Option A: Share Environment with Backend (Recommended)**

In Railway:

1. Create new service from same repo
2. Settings → Service Variables → **Link** to backend service
3. All variables automatically shared!

### **Option B: Manual Configuration**

Add same environment variables as backend:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
GOOGLE_PLACES_API_KEY=your_key
PYTHONPATH=/app/backend
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=20
```

---

## 🔍 **Verifying Your Setup**

### **Local Development:**

```bash
# Check .env file exists
ls -la backend/.env

# Check environment loaded
cd backend
source venv/bin/activate
python -c "from app.core.config import settings; print(settings.GOOGLE_PLACES_API_KEY[:10] + '...')"
```

### **Production (Railway):**

```bash
# Test backend health
curl https://your-backend.railway.app/health

# Test API endpoint
curl "https://your-backend.railway.app/api/v1/search?location=Pizza%20Boston&max_results=3"
```

### **Production (Vercel):**

```bash
# Open frontend
open https://your-app.vercel.app

# Check browser console for API URL
# Should show requests to: https://your-backend.railway.app/api/v1/search
```

---

## 🐛 **Troubleshooting**

### **Issue: "GOOGLE_PLACES_API_KEY not set"**

**Local:**

```bash
# Check backend/.env file exists and has the key
cat backend/.env | grep GOOGLE_PLACES_API_KEY
```

**Railway:**

- Go to Variables tab
- Verify `GOOGLE_PLACES_API_KEY` is set
- Restart service

---

### **Issue: "Database connection failed"**

**Local:**

```bash
# Check PostgreSQL is running
redis-cli ping  # Should return PONG
psql vibefinder -c "SELECT 1"  # Should return 1
```

**Railway:**

- Verify PostgreSQL is added to project
- Check `DATABASE_URL=${{Postgres.DATABASE_URL}}` in variables
- View logs for specific error

---

### **Issue: Frontend shows "Failed to fetch"**

**Check:**

1. `VITE_API_URL` is set correctly in Vercel
2. CORS is configured in `backend/app/core/config.py`
3. Backend is deployed and running on Railway

**Test:**

```bash
# From your computer
curl https://your-backend.railway.app/health

# If this works but frontend doesn't, it's a CORS issue
```

**Fix:**
Update `config.py` with your Vercel URL and redeploy backend.

---

### **Issue: "Redis connection refused"**

**Local:**

```bash
# Start Redis
brew services start redis

# Test connection
redis-cli ping
```

**Railway:**

- Verify Redis is added to project
- Check `REDIS_URL=${{Redis.REDIS_URL}}` in variables

---

## 📊 **Environment Variable Checklist**

### **Before First Local Run:**

- [ ] Created `backend/.env` from `env.example`
- [ ] Added Google Places API key
- [ ] Set `DATABASE_URL` (PostgreSQL or SQLite)
- [ ] Set `REDIS_URL`
- [ ] PostgreSQL and Redis are running locally

### **Before Railway Deployment:**

- [ ] Pushed code to GitHub
- [ ] Added PostgreSQL to Railway project
- [ ] Added Redis to Railway project
- [ ] Set `GOOGLE_PLACES_API_KEY` in Railway variables
- [ ] Set `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] Set `REDIS_URL=${{Redis.REDIS_URL}}`
- [ ] Set `PYTHONPATH=/app/backend`

### **Before Vercel Deployment:**

- [ ] Backend is deployed to Railway
- [ ] Copied Railway backend URL
- [ ] Set `VITE_API_URL` in Vercel
- [ ] Updated CORS in `config.py` with Vercel URL
- [ ] Redeployed backend after CORS update

### **After Deployment:**

- [ ] Tested backend: `curl https://backend.railway.app/health`
- [ ] Tested API: Search query works
- [ ] Tested frontend: Opens and loads
- [ ] Tested frontend → backend: Search works from UI
- [ ] Checked Railway logs for errors
- [ ] Verified Celery worker (if deployed)

---

## 🎯 **Quick Copy-Paste Values**

### **Local Development (.env file):**

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
DATABASE_URL=postgresql://vibefinder:vibefinder@localhost:5432/vibefinder
REDIS_URL=redis://localhost:6379/0
DEBUG=true
PORT=8000
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=100
SCRAPING_DELAY_SECONDS=2
```

### **Railway Production:**

```env
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
PORT=${{PORT}}
PYTHONPATH=/app/backend
DEBUG=false
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=20
SCRAPING_DELAY_SECONDS=3
```

### **Vercel Production:**

```env
VITE_API_URL=https://your-backend-name.railway.app
```

---

## 🔒 **Security Best Practices**

### **Never Commit:**

- ❌ `backend/.env` (actual secrets)
- ❌ API keys
- ❌ Database passwords
- ❌ Redis URLs with credentials

### **Safe to Commit:**

- ✅ `env.example` (templates)
- ✅ `env.railway.example` (templates)
- ✅ `env.vercel.example` (templates)
- ✅ Configuration code without secrets

### **Add to .gitignore:**

```
backend/.env
.env
.env.local
.env.production
```

---

## 📚 **Additional Resources**

- **Railway Docs:** https://docs.railway.app/develop/variables
- **Vercel Docs:** https://vercel.com/docs/concepts/projects/environment-variables
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Reddit API:** https://www.reddit.com/prefs/apps

---

## ✅ **You're All Set!**

With these environment files and instructions, you can:

- ✅ Run locally with proper configuration
- ✅ Deploy to Railway with all services connected
- ✅ Deploy frontend to Vercel
- ✅ Everything communicates properly
- ✅ Ready for production use!

**Next:** Follow `DEPLOY_QUICK_START.md` for deployment! 🚀
