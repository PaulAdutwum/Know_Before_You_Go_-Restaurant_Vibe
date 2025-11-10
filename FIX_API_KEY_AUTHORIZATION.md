# 🔧 Fix: API Key Not Authorized

## ⚠️ **Current Error:**
```
This API key is not authorized to use this service or API.
```

This means your API key exists but **Places API is not enabled** or the key is **not authorized**.

---

## ✅ **Quick Fix Steps:**

### **Step 1: Enable Places API**

1. Go to: **https://console.cloud.google.com/apis/library/places-backend.googleapis.com**
2. Click **"ENABLE"** button
3. Wait for it to enable (takes a few seconds)

---

### **Step 2: Enable Geocoding API**

1. Go to: **https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com**
2. Click **"ENABLE"** button
3. Wait for it to enable

---

### **Step 3: Check API Key Restrictions**

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. Click on your API key (the one starting with `AIzaSyAn...`)
3. Scroll down to **"API restrictions"**
4. Choose one:
   - **Option A:** Select **"Restrict key"** → Check **"Places API"** and **"Geocoding API"** → Save
   - **Option B:** Select **"Don't restrict key"** (for testing only) → Save

---

### **Step 4: Verify Billing is Enabled**

1. Go to: **https://console.cloud.google.com/billing**
2. Make sure billing is enabled on your project
3. If not, enable it (Google gives $200 free credit/month)

---

### **Step 5: Test Again**

After enabling the APIs, wait 1-2 minutes, then test:

```bash
# Test the API
curl "http://localhost:8000/api/v1/search?location=Pizza%20Boston&max_results=1"
```

You should see **real restaurant data** (not "Joe's Pizza" mock data)!

---

## 🎯 **What to Look For:**

✅ **Success:** Real restaurant names, addresses, and ratings from Google Places  
❌ **Still failing:** Check the error message in backend logs

---

## 📋 **Checklist:**

- [ ] Places API is enabled
- [ ] Geocoding API is enabled  
- [ ] API key has correct restrictions (or no restrictions)
- [ ] Billing is enabled
- [ ] Backend is restarted
- [ ] Test query returns real data

---

## 🆘 **Still Not Working?**

Check the backend logs:
```bash
tail -20 /tmp/vibefinder_backend.log
```

Look for the exact error message and share it!

