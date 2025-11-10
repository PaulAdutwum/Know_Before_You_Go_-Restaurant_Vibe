# 🚀 SET VERCEL ENVIRONMENT VARIABLES

Your frontend is now fixed to use environment variables!

## 📋 STEP 1: Go to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click your project: **Know Before You Go**
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

## 🔑 STEP 2: Add This Variable

Click **Add New** and enter:

```
Name:  VITE_API_URL
Value: https://your-backend-name.onrender.com
```

**IMPORTANT:**
- Replace `your-backend-name` with your actual Render app name
- Do NOT include `/api/v1/search` - just the base URL
- Do NOT add a trailing slash

Example:
```
https://knowbeforeyougo-backend.onrender.com
```

## ✅ STEP 3: Select Environment

Make sure to check:
- ✅ Production
- ✅ Preview  
- ✅ Development (optional)

Then click **Save**.

## 🔄 STEP 4: Redeploy

After saving the environment variable:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster)
5. Click **Redeploy**

## ⏳ Wait 2-3 Minutes

Your app will redeploy with the correct backend URL!

## 🧪 STEP 5: Test

After redeployment:
1. Visit your Vercel URL
2. Try searching for a restaurant
3. Should now connect to your Render backend! 🎉

---

## 🔍 Find Your Render Backend URL

If you don't know your Render backend URL:

1. Go to: https://dashboard.render.com
2. Click your backend service
3. Copy the URL at the top (looks like: `https://something.onrender.com`)

---

## ✅ Done!

Once you add the environment variable and redeploy, your frontend will talk to your backend! 🚀
