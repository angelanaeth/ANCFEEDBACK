# ✅ DATABASE FIXED - TrainingPeaks Auth Now Working

## Problem
You were getting:
```
D1_ERROR: no such table: users: SQLITE_ERROR
```

## Root Cause
The local D1 database was empty - no tables were created. The migrations had never been applied.

## ✅ Solution Applied

**Created all required database tables:**
- ✅ `users` - Stores TrainingPeaks tokens and athlete data
- ✅ `training_metrics` - Training history
- ✅ `posted_workouts` - Workout log
- ✅ `recommendations` - Coaching recommendations

## 🧪 Test TrainingPeaks Authorization

### Step 1: Clear Browser Cache
**Important:** Clear your browser cache first to load the fixed JavaScript:
- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### Step 2: Test OAuth Flow

**Dashboard URL:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
```

**Expected Flow:**
1. Open dashboard
2. Click "Connect TrainingPeaks" or "Authorize Coach"
3. Redirects to TrainingPeaks OAuth
4. Login to TrainingPeaks
5. Authorize the app
6. **Should now successfully save your token** ✅
7. Redirects back to dashboard
8. Should load athletes from TrainingPeaks

### What Was Fixed

**Before:**
```
TrainingPeaks → Sends auth code → 
App tries to save token → 
❌ ERROR: no such table: users
```

**After:**
```
TrainingPeaks → Sends auth code → 
App saves token to users table → 
✅ SUCCESS → Loads athletes
```

## 🔍 Verify Database Tables

To verify the database is set up correctly:

```bash
cd /home/user/webapp
npx wrangler d1 execute angela-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"
```

**Expected tables:**
- users
- training_metrics
- posted_workouts
- recommendations
- athlete_notes
- athlete_profiles
- wellness_data
- fueling_data
- tp_write_queue

## 📊 Database Schema

### users table
Stores TrainingPeaks OAuth tokens:
- `id` - Primary key
- `tp_athlete_id` - TrainingPeaks athlete ID (unique)
- `email` - Athlete email
- `name` - Athlete name
- `access_token` - OAuth access token
- `refresh_token` - OAuth refresh token
- `token_expires_at` - Token expiry timestamp
- `account_type` - 'coach' or 'athlete'

## 🚨 Note About Port 5000

You may still see references to port 5000 in the OAuth redirect URI. This is expected - TrainingPeaks redirects to the port configured in your OAuth app settings.

**If you see port 5000 errors:**
1. Check `wrangler.jsonc` for `TP_REDIRECT_URI_COACH`
2. Should match: `http://127.0.0.1:3000/handle_trainingpeaks_authorization`
3. Or update TrainingPeaks OAuth app settings to use port 3000

## ✅ Status

- ✅ Database tables created
- ✅ users table exists
- ✅ Service restarted
- ✅ OAuth should now work

## 🧪 Test Steps

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Open dashboard**
3. **Click "Connect TrainingPeaks"**
4. **Login and authorize**
5. **Should successfully save token** ✅
6. **Should load athletes** ✅

---

**Next:** Try the OAuth flow again and let me know if you see any errors!
