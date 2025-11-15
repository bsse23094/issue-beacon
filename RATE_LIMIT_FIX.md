# 🚨 IMPORTANT: GitHub API Rate Limit Fix

## Problem
You're seeing: **"Failed to load issues. Please try again."**
This is because GitHub limits unauthenticated API requests to **60 per hour**.

## Solution (Takes 2 minutes!)

### Step 1: Get a GitHub Token
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name: `IssueBeacon`
4. **DON'T select any scopes/permissions** (we only need public repo access)
5. Click **"Generate token"** at the bottom
6. **COPY the token** (starts with `ghp_`)

### Step 2: Add Token to Your App
1. Open `src/environments/environment.ts`
2. Find the line: `githubToken: ''`
3. Paste your token between the quotes:
   ```typescript
   githubToken: 'ghp_xxxxxxxxxxxxxxxxxxxx'
   ```
4. Save the file

### Step 3: Reload the App
- The app will automatically reload
- Issues should now load successfully!
- You now have 5,000 requests/hour instead of 60

## ✅ Benefits
- ✅ No more rate limit errors
- ✅ 5,000 requests/hour (vs 60)
- ✅ Faster, more reliable loading
- ✅ Token is safe (environment.ts is in .gitignore)

## ⚠️ Security Notes
- Your token is automatically excluded from Git (already in .gitignore)
- Never share your token publicly
- Token only has public repo read access (safe)
- If leaked, just delete it from GitHub and create a new one

---

**That's it! Your app should work perfectly now.** 🎉
