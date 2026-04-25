# 🚀 GPT API QUICK REFERENCE

## ⭐ TOP 5 MOST USED ENDPOINTS

### 1. **POST /api/gpt/fetch** (⭐⭐⭐ PRIMARY)
```bash
# Fetch complete athlete data including future workouts
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}'
```
**Returns:** athlete, metrics, workouts, future_planned_workouts, next_week_planned_workouts, weekly_metrics, upcoming_races

---

### 2. **POST /api/fuel/next-week** (⭐⭐)
```bash
# Queue fueling for next week's workouts
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194", "force": true}'
```
**Returns:** success, queued, updated, total_planned, week_range, message

---

### 3. **GET /api/gpt/athletes** (⭐)
```bash
# List all athletes
curl http://localhost:3000/api/gpt/athletes
```
**Returns:** Array of athletes with id, name, email, sport

---

### 4. **GET /api/coach/athlete/:athleteId/profile** (⭐)
```bash
# Get athlete profile (CP, CS, weight, swim pace)
curl http://localhost:3000/api/coach/athlete/427194/profile
```
**Returns:** weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100, ftp, lactate_threshold_hr

---

### 5. **POST /api/gpt/write** (⭐)
```bash
# Write workout to TrainingPeaks
curl -X POST http://localhost:3000/api/gpt/write \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "workout_date": "2026-01-20",
    "workout_title": "Sweet Spot Intervals",
    "workout_description": "Full workout plan...",
    "workout_type": "Bike",
    "planned_duration": 90,
    "planned_tss": 85
  }'
```
**Returns:** success status

---

## 📊 DATA FLOW

```
GPT Request
    ↓
/api/gpt/fetch (athlete_id)
    ↓
Fetches from TrainingPeaks API:
  - Past workouts (90 days)
  - Future workouts (28 days)
  - Athlete profile
    ↓
Calculates:
  - CTL/ATL/TSB (per sport)
  - Weekly metrics
  - Training load
    ↓
Returns complete JSON response
    ↓
GPT processes data
    ↓
/api/fuel/next-week (athlete_id)
    ↓
Calculates CHO using:
  - Athlete profile (CP, CS, weight, swim pace)
  - Workout details (sport, IF, duration)
  - IF-to-CHO lookup table
    ↓
Queues in tp_write_queue:
  - workout_id, fuel_carb, fuel_fluid, fuel_sodium
    ↓
Background processor writes to TrainingPeaks:
  - Pre-Activity Comments with fueling guidance
```

---

## 🔑 AUTHENTICATION STATUS

```sql
-- Check coach token status
SELECT 
  name,
  email,
  account_type,
  access_token IS NOT NULL as has_token,
  datetime(token_expires_at, 'unixepoch') as expires_at,
  (token_expires_at - strftime('%s', 'now')) / 60 as minutes_remaining
FROM users 
WHERE account_type = 'coach'
ORDER BY created_at DESC LIMIT 1;
```

**Current Status:**
- ✅ Token: Valid
- ✅ Expires: ~47 minutes (auto-refresh enabled)
- ✅ Access: Full API access

---

## 💪 ATHLETE PROFILE STRUCTURE

```json
{
  "weight_kg": 79.4,           // For CHO/hydration calculations
  "cp_watts": 256,             // Critical Power (bike)
  "cs_run_seconds": 423,       // Critical Speed (7:03/mile)
  "swim_pace_per_100": 95,     // Seconds per 100m/yards
  "ftp": 256,                  // Functional Threshold Power
  "lactate_threshold_hr": 165, // LTHR
  "age": 35,
  "height_cm": 175
}
```

---

## ⚡ CHO CALCULATION FORMULAS

### **BIKE**
```
NP = CP × IF
Work (kJ) = 3.6 × Duration(hr) × NP
CHO% = lookup(IF) from if_cho_lookup.json
Calories = Work / 0.225
g CHO = (Calories × CHO%) / 4
```

### **RUN**
```
CS (m/s) = 1609 / CS_seconds
Weight (kg) = Body Weight / 2.2046
VO2 cost = 0.205 × Weight
Running Economy = VO2_cost × CS × IF
kcal/min = Running Economy × 5
Total kcal = kcal/min × Duration(min)
CHO% = lookup(IF)
g CHO = (Total kcal × CHO%) / 4
```

### **SWIM**
```
MET = 6 (Easy), 8 (Steady), 9.5 (Tempo), 11 (High-Intensity)
cal/min = MET × Weight × 0.0175
Total Calories = cal/min × Duration
g CHO = (Total Calories × 0.85) / 4
```

---

## 📋 COMPLETE ENDPOINT LIST (40+ APIs)

| Category | Endpoint | Method | Key |
|----------|----------|--------|-----|
| **GPT Core** | /api/gpt/fetch | POST | ⭐⭐⭐ |
| **GPT Core** | /api/gpt/write | POST | ⭐ |
| **GPT Core** | /api/gpt/athletes | GET | ⭐ |
| **GPT Core** | /api/gpt/metrics/calculate | POST | |
| **Fueling** | /api/fuel/next-week | POST | ⭐⭐ |
| **Fueling** | /api/fuel/all-athletes | POST | |
| **Fueling** | /api/fuel/bulk | POST | |
| **Fueling** | /api/fuel/status | GET | |
| **Fueling** | /api/fueling/calculate | POST | |
| **Fueling** | /api/athlete/:athleteId/fueling | POST | |
| **Coach** | /api/coach/athletes | GET | ⭐ |
| **Coach** | /api/coach/athlete/:athleteId | GET | |
| **Coach** | /api/coach/athlete/:athleteId/metrics | POST | |
| **Coach** | /api/coach/athlete/:athleteId/workout | POST | |
| **Coach** | /api/coach/sync-athletes | POST | |
| **Coach** | /api/coach/athlete/:athleteId/sync | POST | |
| **Coach** | /api/coach/add-sample-athletes | POST | |
| **Profile** | /api/coach/athlete/:athleteId/profile | GET | ⭐ |
| **Profile** | /api/coach/athlete/:athleteId/profile | POST | ⭐ |
| **Notes** | /api/coach/athlete/:athleteId/notes | GET | |
| **Notes** | /api/coach/athlete/:athleteId/notes | POST | |
| **Wellness** | /api/coach/athlete/:athleteId/wellness/week | GET | |
| **Wellness** | /api/athlete/:athleteId/wellness | GET | |
| **Wellness** | /api/athlete/:athleteId/wellness | POST | |
| **Wellness** | /api/wellness/:athleteId | GET | |
| **Analytics** | /api/athlete/:athleteId/analytics | GET | |
| **AI** | /api/angela/analyze | POST | |
| **AI** | /api/angela/plan-workout | POST | |
| **AI** | /api/echodevo/insight | POST | |
| **TSS** | /api/training-stress-recommendation | POST | |
| **TSS** | /api/fetch-tss-workout-options | POST | |
| **TSS** | /api/post-workout-week | POST | |
| **OAuth** | /api/tp-auth/coach | GET | |
| **OAuth** | /api/enable-demo-mode | POST | |
| **OAuth** | /api/tp-oauth-proxy | GET | |
| **OAuth** | /api/tp-callback-manual | POST | |
| **OAuth** | /api/tp-exchange-token | POST | |
| **Testing** | /api/test/update-workout | POST | |
| **Testing** | /api/athlete/analyze | POST | |
| **Testing** | /api/athlete/project | POST | |

---

## 🎯 TESTING COMMANDS

```bash
# Test 1: List athletes
curl http://localhost:3000/api/gpt/athletes | jq '.'

# Test 2: Fetch athlete data
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}' | jq '.athlete, .metrics.current.total, .future_planned_workouts'

# Test 3: Get athlete profile
curl http://localhost:3000/api/coach/athlete/427194/profile | jq '.'

# Test 4: Queue fueling
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194"}' | jq '.'

# Test 5: Check fuel status
curl http://localhost:3000/api/fuel/status | jq '.'
```

---

## 📚 DOCUMENTATION FILES

1. **GPT_API_ACCESS.md** - Full API documentation (this file)
2. **FUTURE_WORKOUTS_DIAGNOSIS.md** - Future workouts system diagnosis
3. **CHO_FUELING_SYSTEM.md** - CHO calculation system
4. **ALWAYS_REFUEL_COMPLETE.md** - Always-refuel behavior
5. **verify_future_workouts.sh** - Verification script

---

**Your GPT has FULL ACCESS to all 40+ endpoints!** ✅
