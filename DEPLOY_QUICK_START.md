# ⚡ Quick Deploy - 15 Minutes to Live Demo

## 🎯 **Fastest Path: Railway + Vercel (100% Free)**

### **What You'll Get:**
- ✅ Live frontend: `https://your-app.vercel.app`
- ✅ Live backend: `https://your-app.railway.app`
- ✅ Professional demo for resume
- ✅ Cost: $0/month

---

## 📋 **Step-by-Step (15 Minutes)**

### **Step 1: Push to GitHub (2 min)**

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder

# Initialize git
git init
git add .
git commit -m "Initial commit - Know Before You Go"

# Create repo on GitHub.com/new, then:
git remote add origin https://github.com/YOUR_USERNAME/know-before-you-go.git
git branch -M main
git push -u origin main
```

---

### **Step 2: Deploy Backend on Railway (5 min)**

1. Go to: **https://railway.app** → Sign up with GitHub
2. Click: **"New Project"** → **"Deploy from GitHub repo"**
3. Select: **Your "know-before-you-go" repository**
4. Railway auto-detects FastAPI and deploys!

#### **Add Environment Variables:**

In Railway project → Variables:

```
GOOGLE_PLACES_API_KEY=AIzaSyCvGpQYjkc_laF27tL8z_r6EpeQ0Q6U6VI
PORT=8000
PYTHONPATH=/app/backend
SCRAPING_ENABLED=true
MAX_REVIEWS_PER_RESTAURANT=20
```

#### **Add Database:**

- Click **"New"** → **"Database"** → **"Add PostgreSQL"**
- Railway auto-connects it!

#### **Add Redis:**

- Click **"New"** → **"Database"** → **"Add Redis"**
- Railway auto-connects it!

#### **Get Your Backend URL:**

- Railway → Settings → Domain
- Copy: `https://your-backend.railway.app`

---

### **Step 3: Deploy Frontend on Vercel (5 min)**

1. Go to: **https://vercel.com** → Sign up with GitHub
2. Click: **"New Project"** → Import your GitHub repo
3. **Settings:**
   - Framework: **Vite**
   - Root Directory: **`frontend`**
   - Build Command: **`npm run build`**
   - Output Directory: **`dist`**

4. **Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
   *(Use your Railway URL from Step 2)*

5. Click **"Deploy"**!

---

### **Step 4: Update CORS (2 min)**

Update `backend/app/core/config.py`:

```python
BACKEND_CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "https://your-app.vercel.app",  # Your Vercel URL
    "https://*.vercel.app"
]
```

**Commit and push:**
```bash
git add .
git commit -m "Add production CORS"
git push
```

Railway will auto-deploy the update!

---

### **Step 5: Initialize Database (1 min)**

In Railway dashboard:
1. Go to your backend service
2. **Settings** → **Custom Start Command**
3. Change to:
   ```
   cd backend && python setup_db.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

---

## ✅ **Test Your Deployment**

1. **Frontend:** Open `https://your-app.vercel.app`
2. **Backend:** Test `https://your-backend.railway.app/health`
3. **Search:** Try "Pizza Boston" on your frontend

---

## 🎉 **You're Live!**

Add to your resume:

```
Know Before You Go | ML-Powered Restaurant Platform            [Live Demo ↗]
Python, React, FastAPI, PostgreSQL, ML/NLP                     [GitHub ↗]
```

---

## 💡 **Pro Tips**

### **Custom Domain (Optional):**
- Buy on Namecheap: `knowbeforeyougo.com` ($10/year)
- Add to Vercel: Settings → Domains
- Add to Railway: Settings → Custom Domain

### **Auto-Deploy:**
- Any `git push` to main → Both services auto-deploy!
- Takes ~2 minutes

### **Monitor Usage:**
- Railway: Dashboard → Metrics
- Vercel: Dashboard → Analytics

### **If You Hit Limits:**
- Reduce `MAX_REVIEWS_PER_RESTAURANT` to 10
- Increase `SCRAPING_DELAY_SECONDS` to 5

---

## 🆘 **Common Issues**

### **Frontend Shows "Failed to fetch"**
- Check CORS is updated in `config.py`
- Check `VITE_API_URL` in Vercel environment variables
- Redeploy Vercel after changes

### **Backend Build Fails**
- Ensure `requirements.txt` is in `backend/` folder
- Check Railway logs for specific error
- Try: Settings → Change Python version to 3.9

### **Database Connection Error**
- In Railway, check PostgreSQL is added
- Verify `DATABASE_URL` variable exists
- Restart backend service

---

## 📱 **Show It Off**

Once live, share:
- 📧 In cover letters: "Live demo at knowbeforeyougo.vercel.app"
- 💼 On LinkedIn: Post about your project
- 📝 In applications: Include both demo + GitHub link
- 🎤 In interviews: Pull it up and demo live!

---

**Total Time:** 15 minutes  
**Total Cost:** $0  
**Total Awesome:** 💯

🚀 **Deploy now and show the world what you built!**

