# 🚨 SECURITY FIX: API Key Exposed in GitHub

## ⚠️ **URGENT: Your API Key Was Committed to GitHub**

Your Google Places API key was accidentally committed to GitHub in documentation files. Here's how to fix it:

---

## 🔥 **STEP 1: ROTATE YOUR API KEY IMMEDIATELY** (Do This First!)

### **Why:**
- Your API key is now public on GitHub
- Anyone can see it and use it
- This can lead to unauthorized usage and charges

### **How to Rotate:**

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials
   ```

2. **Find your API key:**
   - Look for the key that starts with `AIzaSy...`
   - Click on it to open details

3. **Delete or Restrict the Old Key:**
   - Option A: **Delete it** (recommended if you can't restrict it)
   - Option B: **Restrict it** to only your IP addresses (if you have static IPs)

4. **Create a New API Key:**
   - Click "Create Credentials" → "API Key"
   - Copy the new key
   - **Restrict it immediately:**
     - Application restrictions: "HTTP referrers" or "IP addresses"
     - API restrictions: Only "Places API" and "Geocoding API"

5. **Update Your Local `.env`:**
   ```bash
   # Edit backend/.env
   GOOGLE_PLACES_API_KEY=your_new_api_key_here
   ```

6. **Update Railway (if deployed):**
   - Go to Railway Dashboard → Your Project → Variables
   - Update `GOOGLE_PLACES_API_KEY` with your new key

---

## 🧹 **STEP 2: REMOVE FROM GIT HISTORY**

The key is still in your git history even after removing it from files. Here's how to remove it:

### **Option A: Using git filter-repo (Recommended - Cleaner)**

```bash
# Install git-filter-repo (if not installed)
brew install git-filter-repo

# Remove the API key from all git history
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder
git filter-repo --invert-paths --path-glob '*.md' --path ENVIRONMENT_SETUP.md --path QUICK_START.md --path DEPLOY_QUICK_START.md --path COMPLETE_API_GUIDE.md --path ARCHITECTURE_DIAGRAM.md

# OR use string replacement (removes key from all files in history)
git filter-repo --replace-text <(echo 'AIzaSyCvGpQYjkc_laF27tL8z_r6EpeQ0Q6U6VI==>your_google_places_api_key_here')
```

### **Option B: Using BFG Repo-Cleaner (Easier)**

```bash
# Download BFG (if not installed)
brew install bfg

# Remove the key from history
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder
bfg --replace-text replacements.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

Create `replacements.txt`:
```
AIzaSyCvGpQYjkc_laF27tL8z_r6EpeQ0Q6U6VI==>your_google_places_api_key_here
```

### **Option C: Force Push New History (Nuclear Option)**

⚠️ **Warning:** This rewrites ALL history. Only use if you're the only contributor.

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder

# Create a new orphan branch (fresh start)
git checkout --orphan new-main
git add -A
git commit -m "Initial commit - API keys removed"

# Force push (THIS DELETES ALL OLD HISTORY)
git branch -D main
git branch -m main
git push -f origin main
```

---

## ✅ **STEP 3: COMMIT THE FIXES**

I've already removed the API key from all files. Now commit and push:

```bash
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder
git add -A
git commit -m "🔒 SECURITY: Remove exposed API key from documentation

- Removed API key from ENVIRONMENT_SETUP.md
- Removed API key from QUICK_START.md
- Removed API key from DEPLOY_QUICK_START.md
- Removed API key from COMPLETE_API_GUIDE.md
- Removed API key from ARCHITECTURE_DIAGRAM.md
- Replaced with placeholder: your_google_places_api_key_here

⚠️ IMPORTANT: Old API key was exposed. User must:
1. Rotate API key in Google Cloud Console
2. Remove from git history (see SECURITY_FIX.md)
3. Update local .env and Railway variables"

git push origin main
```

---

## 🔒 **STEP 4: PREVENT FUTURE LEAKS**

### **Update .gitignore:**

Make sure these are in `.gitignore`:
```
# Environment files
.env
.env.local
.env.production
backend/.env
*.env

# Documentation with secrets (optional - be careful)
# Only if you accidentally put real keys in docs
```

### **Best Practices:**

1. ✅ **Never commit real API keys**
2. ✅ **Use placeholders in documentation:** `your_api_key_here`
3. ✅ **Use environment variables:** Always load from `.env`
4. ✅ **Review before committing:** `git diff` before `git commit`
5. ✅ **Use git-secrets:** Pre-commit hook to detect secrets

### **Install git-secrets (Optional but Recommended):**

```bash
# Install git-secrets
brew install git-secrets

# Setup in your repo
cd /Users/pauladutwum/Documents/Myprojects/VibeFinder
git secrets --install
git secrets --register-aws  # Detects AWS keys
git secrets --add 'AIza[0-9A-Za-z_-]{35}'  # Detects Google API keys
```

---

## 📋 **CHECKLIST**

- [ ] **ROTATED API KEY** in Google Cloud Console
- [ ] **DELETED OLD KEY** or restricted it
- [ ] **CREATED NEW KEY** with restrictions
- [ ] **UPDATED** `backend/.env` with new key
- [ ] **UPDATED** Railway variables (if deployed)
- [ ] **REMOVED KEY** from git history (Step 2)
- [ ] **COMMITTED FIXES** (Step 3)
- [ ] **PUSHED TO GITHUB** (after history cleanup)
- [ ] **VERIFIED** no keys in current files
- [ ] **SET UP** git-secrets (optional)

---

## 🆘 **IF YOU SEE UNAUTHORIZED USAGE**

1. **Check Google Cloud Console:**
   - Go to "APIs & Services" → "Dashboard"
   - Check API usage graphs
   - Look for unusual spikes

2. **Check Billing:**
   - Go to "Billing" → "Reports"
   - Check for unexpected charges

3. **Immediately:**
   - Delete the compromised key
   - Create a new restricted key
   - Enable billing alerts

---

## 📚 **Additional Resources**

- **Google Cloud Security:** https://cloud.google.com/security
- **Git Secrets Guide:** https://github.com/awslabs/git-secrets
- **API Key Best Practices:** https://cloud.google.com/docs/authentication/api-keys

---

## ✅ **Current Status**

✅ **API key removed from all files**
✅ **Files updated with placeholders**
✅ **Ready to commit fixes**

**Next Steps:**
1. Rotate your API key (Step 1)
2. Remove from git history (Step 2)
3. Commit and push (Step 3)

---

**Remember:** Once a key is in git history, it's there forever unless you rewrite history. Always rotate exposed keys immediately!

