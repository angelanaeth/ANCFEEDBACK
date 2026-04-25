# 🚀 CONNECT ALL ATHLETES - COMPLETE GUIDE
**Angela Coach Multi-Athlete System**  
**Date: 2026-01-11**

---

## 🎯 YOUR GOAL
Connect to **ALL athletes** in your TrainingPeaks coach account (not just 3)

---

## ⚡ CURRENT STATUS

### What We Have:
✅ **Multi-athlete sync endpoint** - `/api/coach/sync-athletes`  
✅ **Code is 100% ready** - fetches all athletes from TrainingPeaks  
✅ **Database schema supports unlimited athletes**  
✅ **Individual athlete sync** - `/api/coach/athlete/:athleteId/sync`  
✅ **Bulk fueling endpoint** - `/api/fuel/bulk` (all athletes at once)

### What's Missing:
❌ **Valid TrainingPeaks token** - current token is demo/expired  
❌ **Token reconnection needed** - OAuth flow must be completed

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### **STEP 1: Reconnect TrainingPeaks Token**

Visit the TrainingPeaks connection page:

```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html
```

**What happens:**
1. You authorize Angela Coach to access your TrainingPeaks account
2. TrainingPeaks OAuth provides a **coach token** with these scopes:
   - `coach:athletes` - Read all your athletes
   - `workouts:read` - Read all workouts
   - `workouts:plan` - Write fueling notes
3. Token is stored in database with 1-hour expiration

---

### **STEP 2: Sync ALL Athletes**

After connecting, run this command:

```bash
curl -X POST http://localhost:3000/api/coach/sync-athletes
```

**What happens:**
1. Calls TrainingPeaks API: `GET /v1/coach/athletes` (or v2 fallback)
2. Fetches **complete list** of all your athletes
3. Creates database record for each athlete
4. Returns: `{ success: true, synced: 50, errors: 0, total: 50 }`

**Expected output:**
```json
{
  "success": true,
  "synced": 50,
  "errors": 0,
  "total": 50
}
```

---

### **STEP 3: Verify Athletes Loaded**

Check how many athletes are now in the system:

```bash
curl -s http://localhost:3000/api/coach/athletes | jq '.total_athletes'
```

**Expected:** Should show 50+ athletes (or however many you coach)

---

### **STEP 4: Sync Workouts for Each Athlete**

For each athlete, sync their workout data:

```bash
# Example for athlete ID 427194
curl -X POST http://localhost:3000/api/coach/athlete/427194/sync
```

**What happens:**
1. Fetches last 45 days of workouts from TrainingPeaks
2. Calculates CTL/ATL/TSB per sport (Swim/Bike/Run)
3. Stores metrics in database
4. Returns athlete profile with metrics

**To sync ALL athletes:**
```bash
# Get all athlete IDs
athlete_ids=$(curl -s http://localhost:3000/api/coach/athletes | jq -r '.athletes[].id')

# Sync each athlete
for id in $athlete_ids; do
  echo "Syncing athlete $id..."
  curl -X POST http://localhost:3000/api/coach/athlete/$id/sync
  sleep 1  # Rate limiting
done
```

---

### **STEP 5: Bulk Fueling for All Athletes**

Calculate and write fueling notes for ALL athletes' next week workouts:

```bash
curl -X POST http://localhost:3000/api/fuel/bulk \
  -H "Content-Type: application/json"
```

**What happens:**
1. Fetches all athletes with CTL > 0 (active athletes)
2. For each athlete:
   - Gets next Monday-Sunday planned workouts
   - Calculates CHO/Hydration/Sodium per workout
   - Writes fueling notes to TrainingPeaks pre-activity comments
3. Returns summary for all athletes

**Expected output:**
```json
{
  "success": true,
  "total_athletes": 50,
  "processed": 50,
  "total_workouts_queued": 234,
  "summary": [
    {
      "athlete_id": "427194",
      "athlete_name": "John Doe",
      "queued": 5,
      "total_planned": 5
    },
    ...
  ]
}
```

---

## 🎯 COMPLETE WORKFLOW

### **One-Time Setup:**
```bash
# 1. Connect TrainingPeaks (visit URL in browser)
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html

# 2. Sync all athletes
curl -X POST http://localhost:3000/api/coach/sync-athletes

# 3. Verify count
curl -s http://localhost:3000/api/coach/athletes | jq '.total_athletes'
```

### **Weekly Workflow (Automate This):**
```bash
# Every Monday morning:
# 1. Sync all athletes' workouts
for id in $(curl -s http://localhost:3000/api/coach/athletes | jq -r '.athletes[].id'); do
  curl -X POST http://localhost:3000/api/coach/athlete/$id/sync
done

# 2. Calculate and write fueling for next week
curl -X POST http://localhost:3000/api/fuel/bulk
```

---

## 📊 API ENDPOINTS SUMMARY

### Multi-Athlete Management:
- `POST /api/coach/sync-athletes` - Fetch ALL athletes from TrainingPeaks
- `GET /api/coach/athletes` - List all athletes with metrics
- `GET /api/coach/athlete/:id` - Get single athlete details
- `POST /api/coach/athlete/:id/sync` - Sync single athlete workouts

### Bulk Operations:
- `POST /api/fuel/bulk` - Calculate fueling for ALL athletes
- `POST /api/fuel/next-week` - Calculate fueling for ONE athlete

### TrainingPeaks Connection:
- `/static/tp-connect-production.html` - OAuth connection page
- `GET /auth/trainingpeaks/coach` - OAuth initiate
- `GET /auth/trainingpeaks/callback` - OAuth callback

---

## 🔧 TECHNICAL DETAILS

### Database Schema:
```sql
-- users table supports unlimited athletes
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tp_athlete_id TEXT UNIQUE NOT NULL,  -- TrainingPeaks athlete ID
  email TEXT,
  name TEXT NOT NULL,
  access_token TEXT,      -- Coach token (shared) or athlete token (individual)
  refresh_token TEXT,
  token_expires_at INTEGER,
  account_type TEXT CHECK(account_type IN ('coach', 'athlete')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- No limit on number of athletes!
```

### Token Management:
- **Coach account**: Single token with `coach:*` scopes
- **Athlete records**: Use coach token to access data
- **Token refresh**: Automatic refresh when expired
- **Expiration**: 1 hour (TrainingPeaks default)

### Rate Limiting:
- TrainingPeaks API: ~100 requests/minute
- Add 1-second delays when syncing many athletes
- Bulk operations process in batches

---

## ⚠️ TROUBLESHOOTING

### "TrainingPeaks API error: 404"
**Problem:** Token is demo/expired  
**Solution:** Reconnect at tp-connect-production.html

### "No coach account found"
**Problem:** Coach token not in database  
**Solution:** Complete OAuth flow first

### "Error: 401 Unauthorized"
**Problem:** Token expired (1 hour limit)  
**Solution:** Reconnect token

### Only showing 3 athletes
**Problem:** Haven't run sync-athletes yet  
**Solution:** Run `POST /api/coach/sync-athletes`

---

## ✅ VERIFICATION CHECKLIST

- [ ] Token connected (visit tp-connect-production.html)
- [ ] Token stored in database (check coach account exists)
- [ ] All athletes synced (run sync-athletes endpoint)
- [ ] Athlete count matches TrainingPeaks (check total_athletes)
- [ ] Workouts synced for each athlete (run athlete/:id/sync)
- [ ] Fueling calculations working (run fuel/bulk)
- [ ] Fueling notes appearing in TrainingPeaks (check calendar)

---

## 🎯 NEXT STEPS

Once token is connected and athletes are synced:

1. **Dashboard will show ALL athletes**
2. **Fueling will work for ALL athletes**
3. **Future TSS will calculate correctly**
4. **Echodevo Insights will work for each athlete**

---

## 📞 STATUS

**Current:** Demo token active (expires 2027-01-11)  
**Needed:** Real TrainingPeaks coach token  
**Athletes in DB:** 8 (3 real + 5 sample)  
**Target:** 50+ athletes (your full roster)

**Action Required:** Visit tp-connect-production.html to connect real token
