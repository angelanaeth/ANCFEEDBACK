# GPT API ACCESS - COMPLETE DOCUMENTATION

## 🎯 SYSTEM OVERVIEW

**Base URL**: `http://localhost:3000` (local development)  
**Production URL**: `https://your-app.pages.dev` (when deployed)

---

## 📋 ALL API ENDPOINTS

### 🏋️ COACH MANAGEMENT ENDPOINTS

#### 1. **GET /api/coach/athletes**
**Purpose**: Get list of all athletes for the coach  
**Auth**: Coach token from database  
**Response**:
```json
{
  "athletes": [
    {
      "id": "427194",
      "name": "Angela 1A",
      "email": "tri3angela@yahoo.com",
      "sport": null,
      "stress_state": "Productive",
      "ctl": 45.2,
      "atl": 38.1,
      "tsb": 7.1
    }
  ]
}
```

#### 2. **GET /api/coach/athlete/:athleteId**
**Purpose**: Get detailed athlete data (90 days of workouts)  
**Parameters**: `athleteId` (string)  
**Response**: Full athlete dashboard data with workouts, metrics, wellness

#### 3. **POST /api/coach/athlete/:athleteId/metrics**
**Purpose**: Update athlete training metrics  
**Body**:
```json
{
  "ctl": 45.2,
  "atl": 38.1,
  "tsb": 7.1,
  "date": "2026-01-12"
}
```

#### 4. **POST /api/coach/athlete/:athleteId/workout**
**Purpose**: Add/update workout for athlete  
**Body**: Workout details (title, date, sport, tss, duration, etc.)

#### 5. **POST /api/coach/sync-athletes**
**Purpose**: Sync all athletes from TrainingPeaks  
**Response**: List of synced athletes

#### 6. **POST /api/coach/athlete/:athleteId/sync**
**Purpose**: Sync single athlete from TrainingPeaks  
**Response**: Athlete data with metrics

#### 7. **POST /api/coach/add-sample-athletes**
**Purpose**: Add sample test athletes (development only)

---

### 📝 ATHLETE NOTES ENDPOINTS

#### 8. **GET /api/coach/athlete/:athleteId/notes**
**Purpose**: Get coach notes for athlete  
**Response**:
```json
{
  "notes": "Test athlete note - working well with current training plan!",
  "updated_at": "2026-01-11T19:50:25.000Z"
}
```

#### 9. **POST /api/coach/athlete/:athleteId/notes**
**Purpose**: Save coach notes for athlete  
**Body**:
```json
{
  "notes": "Updated coaching notes here..."
}
```

---

### 👤 ATHLETE PROFILE ENDPOINTS

#### 10. **GET /api/coach/athlete/:athleteId/profile**
**Purpose**: Get athlete profile (CP, CS, weight, swim pace, etc.)  
**Response**:
```json
{
  "weight_kg": 79.4,
  "cp_watts": 256,
  "cs_run_seconds": 423,
  "swim_pace_per_100": 95,
  "ftp": 256,
  "lactate_threshold_hr": 165,
  "age": 35,
  "height_cm": 175
}
```

#### 11. **POST /api/coach/athlete/:athleteId/profile**
**Purpose**: Update athlete profile  
**Body**:
```json
{
  "weight_kg": 79.4,
  "cp_watts": 256,
  "cs_run_seconds": 423,
  "swim_pace_per_100": 95
}
```

---

### 💪 WELLNESS ENDPOINTS

#### 12. **GET /api/coach/athlete/:athleteId/wellness/week**
**Purpose**: Get last 7 days of wellness data  
**Response**:
```json
{
  "wellness": [
    {
      "date": "2026-01-12",
      "hrv_rmssd": 45.2,
      "hrv_baseline": 50.0,
      "hrv_ratio": 0.904,
      "hrv_status": "Normal",
      "sleep_hours": 7.5,
      "sleep_quality": "Good"
    }
  ]
}
```

#### 13. **POST /api/athlete/:athleteId/wellness**
**Purpose**: Add wellness entry  
**Body**:
```json
{
  "date": "2026-01-12",
  "hrv_score": 45.2,
  "hours_of_sleep": 7.5,
  "sleep_quality": 4,
  "feeling": 4,
  "resting_heart_rate": 52
}
```

#### 14. **GET /api/athlete/:athleteId/wellness**
**Purpose**: Get all wellness data for athlete  
**Response**: Array of wellness entries

#### 15. **GET /api/wellness/:athleteId**
**Purpose**: Get wellness metrics (alias endpoint)

---

### ⚡ FUELING ENDPOINTS (CHO Calculation System)

#### 16. **POST /api/fueling/calculate**
**Purpose**: Calculate fueling for a workout  
**Body**:
```json
{
  "workout_type": "bike",
  "duration": 120,
  "intensity": 0.75,
  "weight_kg": 79.4
}
```
**Response**:
```json
{
  "carbs_g": 90,
  "fluid_ml": 600,
  "sodium_mg": 900
}
```

#### 17. **POST /api/athlete/:athleteId/fueling**
**Purpose**: Save fueling plan for athlete

#### 18. **POST /api/fuel/next-week**
**Purpose**: ⭐ **MAIN FUELING ENDPOINT** - Queue fueling for next week's workouts  
**Body**:
```json
{
  "athlete_id": "427194",
  "force": true
}
```
**Response**:
```json
{
  "success": true,
  "queued": 0,
  "updated": 2,
  "total_planned": 2,
  "week_range": "2026-01-19 → 2026-01-25",
  "message": "✅ Fueling 2 workouts (0 new, 2 updated)"
}
```

#### 19. **POST /api/fuel/all-athletes**
**Purpose**: Queue fueling for all athletes' next week  
**Response**: Status for each athlete

#### 20. **POST /api/fuel/bulk**
**Purpose**: Bulk fueling operations

#### 21. **GET /api/fuel/status**
**Purpose**: Get fueling queue status  
**Response**:
```json
{
  "pending": 5,
  "processing": 2,
  "completed": 120,
  "failed": 3
}
```

---

### 📊 ANALYTICS & METRICS ENDPOINTS

#### 22. **GET /api/athlete/:athleteId/analytics**
**Purpose**: Get athlete analytics (CTL/ATL/TSB trends, performance analysis)

#### 23. **POST /api/gpt/metrics/calculate**
**Purpose**: Calculate training metrics for GPT  
**Body**:
```json
{
  "athlete_id": "427194",
  "workouts": [...]
}
```

---

### 🤖 GPT-SPECIFIC ENDPOINTS

#### 24. **POST /api/gpt/fetch** ⭐⭐⭐
**Purpose**: **PRIMARY GPT ENDPOINT** - Fetch complete athlete data for GPT  
**Body**:
```json
{
  "athlete_id": "427194",
  "start_date": "2025-10-12",
  "end_date": "2026-01-12"
}
```
**Response**:
```json
{
  "athlete": {
    "id": "427194",
    "name": "Angela 1A",
    "email": "tri3angela@yahoo.com",
    "weight_kg": 79.4,
    "cp_watts": 256,
    "cs_run_seconds": 423,
    "swim_pace_per_100": 95
  },
  "metrics": {
    "current": {
      "total": { "ctl": 45.2, "atl": 38.1, "tsb": 7.1 },
      "swim": { "ctl": 12.5, "atl": 10.2, "tsb": 2.3 },
      "bike": { "ctl": 18.7, "atl": 15.6, "tsb": 3.1 },
      "run": { "ctl": 14.0, "atl": 12.3, "tsb": 1.7 }
    }
  },
  "workouts": [
    {
      "date": "2026-01-12",
      "sport": "bike",
      "title": "Sweet Spot Intervals",
      "duration": 90,
      "tss": 85,
      "if": 0.82
    }
  ],
  "future_planned_workouts": [
    {
      "date": "2026-01-19",
      "sport": "swim",
      "title": "CS CHECK",
      "duration": 0,
      "tss": 0,
      "if": null,
      "planned": true
    },
    {
      "date": "2026-01-20",
      "sport": "bike",
      "title": "CP CHECK",
      "duration": 0,
      "tss": 0,
      "if": null,
      "planned": true
    }
  ],
  "next_week_planned_workouts": [
    // Same as future_planned_workouts but filtered for next Mon-Sun
  ],
  "weekly_metrics": {
    "lastWeek": { "tss": 420, "ctl": 44.1, "atl": 39.2, "tsb": 4.9 },
    "thisWeek": { "tss": 380, "ctl": 45.2, "atl": 38.1, "tsb": 7.1 }
  },
  "upcoming_races": [
    {
      "name": "Ironman Arizona",
      "date": "2026-11-15",
      "type": "Ironman",
      "distance": "140.6 miles",
      "days_until": 307
    }
  ]
}
```

#### 25. **POST /api/gpt/write**
**Purpose**: Write workout plan back to TrainingPeaks  
**Body**:
```json
{
  "athlete_id": "427194",
  "workout_date": "2026-01-20",
  "workout_title": "Sweet Spot Intervals",
  "workout_description": "Full workout plan...",
  "workout_type": "Bike",
  "planned_duration": 90,
  "planned_tss": 85
}
```

#### 26. **GET /api/gpt/athletes**
**Purpose**: List all athletes for GPT  
**Response**:
```json
{
  "athletes": [
    {
      "id": "427194",
      "name": "Angela 1A",
      "email": "tri3angela@yahoo.com",
      "sport": "triathlon"
    }
  ]
}
```

---

### 🧠 ANGELA AI ENDPOINTS

#### 27. **POST /api/angela/analyze**
**Purpose**: AI analysis of athlete data  
**Body**: Athlete data for analysis

#### 28. **POST /api/angela/plan-workout**
**Purpose**: AI-generated workout planning

---

### 📈 TRAINING STRESS ENDPOINTS

#### 29. **POST /api/training-stress-recommendation**
**Purpose**: Get TSS recommendations based on athlete data

#### 30. **POST /api/fetch-tss-workout-options**
**Purpose**: Get workout options for target TSS

#### 31. **POST /api/post-workout-week**
**Purpose**: Post full week of workouts

---

### 📊 ECHODEVO INSIGHT ENDPOINT

#### 32. **POST /api/echodevo/insight**
**Purpose**: Generate comprehensive athlete insights  
**Body**:
```json
{
  "athlete_id": "427194"
}
```
**Response**: AI-generated insights, recommendations, training analysis

---

### 🔐 TRAININGPEAKS OAUTH ENDPOINTS

#### 33. **GET /api/tp-auth/coach**
**Purpose**: Get TrainingPeaks OAuth URL for coach authentication

#### 34. **POST /api/enable-demo-mode**
**Purpose**: Enable demo mode (no TP auth required)

#### 35. **GET /api/tp-oauth-proxy**
**Purpose**: OAuth proxy for TrainingPeaks

#### 36. **POST /api/tp-callback-manual**
**Purpose**: Manual OAuth callback handling

#### 37. **POST /api/tp-exchange-token**
**Purpose**: Exchange OAuth code for access token

---

### 🧪 TESTING ENDPOINTS

#### 38. **POST /api/test/update-workout**
**Purpose**: Test workout update functionality

#### 39. **POST /api/athlete/analyze**
**Purpose**: Analyze athlete performance data

#### 40. **POST /api/athlete/project**
**Purpose**: Project future fitness trends

---

## 🔑 KEY ENDPOINTS FOR GPT

### **Most Important Endpoints:**

1. **POST /api/gpt/fetch** ⭐⭐⭐
   - **THE MAIN ENDPOINT** for fetching athlete data
   - Returns complete athlete profile, workouts, metrics, future workouts
   - Used by dashboard to populate all athlete data

2. **POST /api/fuel/next-week** ⭐⭐
   - Queue fueling for next week's workouts
   - Calculates CHO based on athlete profile (CP, CS, weight, swim pace)
   - Updates tp_write_queue for background processing

3. **GET /api/gpt/athletes** ⭐
   - List all athletes
   - Used for athlete selection

4. **POST /api/gpt/write** ⭐
   - Write workouts back to TrainingPeaks
   - Used for workout planning

5. **GET /api/coach/athlete/:athleteId/profile** ⭐
   - Get athlete profile (CP, CS, weight, swim pace)
   - Critical for CHO calculations

---

## 📝 REQUEST/RESPONSE EXAMPLES

### Example 1: Fetch Athlete Data for GPT

**Request:**
```bash
POST /api/gpt/fetch
Content-Type: application/json

{
  "athlete_id": "427194"
}
```

**Response:**
```json
{
  "athlete": { "id": "427194", "name": "Angela 1A", ... },
  "metrics": { "current": { "total": { "ctl": 45.2, ... }}},
  "workouts": [...],
  "future_planned_workouts": [
    {
      "date": "2026-01-19",
      "sport": "swim",
      "title": "CS CHECK",
      "planned": true
    }
  ],
  "next_week_planned_workouts": [...],
  "weekly_metrics": {...},
  "upcoming_races": [...]
}
```

### Example 2: Queue Fueling for Next Week

**Request:**
```bash
POST /api/fuel/next-week
Content-Type: application/json

{
  "athlete_id": "427194",
  "force": true
}
```

**Response:**
```json
{
  "success": true,
  "queued": 0,
  "updated": 2,
  "total_planned": 2,
  "week_range": "2026-01-19 → 2026-01-25",
  "message": "✅ Fueling 2 workouts (0 new, 2 updated)"
}
```

### Example 3: Get Athlete Profile

**Request:**
```bash
GET /api/coach/athlete/427194/profile
```

**Response:**
```json
{
  "weight_kg": 79.4,
  "cp_watts": 256,
  "cs_run_seconds": 423,
  "swim_pace_per_100": 95,
  "ftp": 256,
  "lactate_threshold_hr": 165
}
```

### Example 4: Update Athlete Profile

**Request:**
```bash
POST /api/coach/athlete/427194/profile
Content-Type: application/json

{
  "weight_kg": 80.0,
  "cp_watts": 260,
  "cs_run_seconds": 420,
  "swim_pace_per_100": 93
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated",
  "profile": { "weight_kg": 80.0, ... }
}
```

---

## 🔐 AUTHENTICATION

All endpoints use **Coach Token** from the database:
- Token stored in `users` table where `account_type = 'coach'`
- Token automatically refreshed when expired
- Token used in `Authorization: Bearer {token}` header for TrainingPeaks API calls

**Current Token Status:**
```sql
SELECT 
  access_token IS NOT NULL as has_token,
  token_expires_at,
  (token_expires_at - strftime('%s', 'now')) / 60 as minutes_until_expiry
FROM users 
WHERE account_type = 'coach'
ORDER BY created_at DESC LIMIT 1;
```

---

## 📊 DATABASE TABLES

### **users** - Athlete & Coach Profiles
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  tp_athlete_id TEXT UNIQUE,
  name TEXT,
  email TEXT,
  account_type TEXT, -- 'athlete' or 'coach'
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at INTEGER,
  weight_kg REAL,
  cp_watts INTEGER,
  cs_run_seconds INTEGER,
  swim_pace_per_100 INTEGER,
  ftp INTEGER,
  lactate_threshold_hr INTEGER,
  age INTEGER,
  height_cm INTEGER
);
```

### **tp_write_queue** - Fueling Queue
```sql
CREATE TABLE tp_write_queue (
  id INTEGER PRIMARY KEY,
  athlete_id TEXT,
  workout_id TEXT,
  workout_date TEXT,
  workout_title TEXT,
  workout_type TEXT,
  fuel_carb INTEGER,
  fuel_fluid INTEGER,
  fuel_sodium INTEGER,
  status TEXT, -- 'pending', 'processing', 'success', 'failed'
  error_message TEXT,
  created_at TEXT,
  updated_at TEXT
);
```

### **training_metrics** - Historical Metrics
```sql
CREATE TABLE training_metrics (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  date TEXT,
  sport TEXT,
  ctl REAL,
  atl REAL,
  tsb REAL,
  tss REAL
);
```

### **athlete_notes** - Coach Notes
```sql
CREATE TABLE athlete_notes (
  id INTEGER PRIMARY KEY,
  coach_id INTEGER,
  athlete_id TEXT,
  notes TEXT,
  created_at TEXT,
  updated_at TEXT
);
```

---

## 🎯 SUMMARY

**Total API Endpoints: 40+**

**Key Categories:**
- 🏋️ Coach Management: 7 endpoints
- 📝 Notes: 2 endpoints
- 👤 Profile: 2 endpoints
- 💪 Wellness: 4 endpoints
- ⚡ Fueling: 6 endpoints
- 📊 Analytics: 2 endpoints
- 🤖 GPT Core: 4 endpoints (⭐ MOST IMPORTANT)
- 🧠 AI Analysis: 2 endpoints
- 📈 Training Stress: 3 endpoints
- 🔐 OAuth: 5 endpoints
- 🧪 Testing: 3 endpoints

**GPT has full access to all 40+ endpoints!**

---

**Files:**
- API Implementation: `/home/user/webapp/src/index.tsx`
- Frontend: `/home/user/webapp/public/static/coach.html`
- Database: `/home/user/webapp/.wrangler/state/v3/d1/` (local)
- Documentation: `/home/user/webapp/GPT_API_ACCESS.md`
