# EchoDevo GPT Setup Guide 🤖

## Your GPT
**URL:** https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5

---

## 🔌 API Proxy URLs for Your GPT

### Base URL
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
```

### Available API Endpoints

#### 1. **Fetch Athlete Data** (Primary Endpoint)
```
POST /api/gpt/fetch
```
**Purpose:** Retrieve comprehensive athlete training data from TrainingPeaks

**Request Body:**
```json
{
  "athlete_id": "427194",
  "start_date": "2026-01-01",
  "end_date": "2026-01-09",
  "include_planned": false
}
```

**Response:** Complete athlete data including:
- Athlete profile (name, email, FTP, LTHR, weight)
- Current metrics (CTL, ATL, TSB, HRV, RHR)
- Workout history with TSS, duration, distance
- Sport-specific breakdowns

---

#### 2. **Write Workout Plan**
```
POST /api/gpt/write
```
**Purpose:** Post prescribed workouts to athlete's TrainingPeaks calendar

**Request Body:**
```json
{
  "athlete_id": "427194",
  "workouts": [
    {
      "date": "2026-01-15",
      "sport": "bike",
      "title": "VO2 Max Intervals",
      "description": "Warmup 15min Z2, then 5x4min @ 105% CP with 4min recovery, cooldown 10min Z1-Z2",
      "duration": 75,
      "tss": 95,
      "zones": {
        "warmup": "Z2",
        "main": "Z4-Z5",
        "cooldown": "Z1-Z2"
      },
      "coach_notes": "Focus on maintaining power consistency during intervals"
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "workouts_created": 1,
  "workout_ids": ["123456789"]
}
```

---

#### 3. **List Athletes** (Coach Mode)
```
GET /api/gpt/athletes
```
**Purpose:** Get list of all athletes connected to coach account

**Response:**
```json
{
  "athletes": [
    {
      "id": "427194",
      "name": "Angela 1A",
      "email": "tri3angela@yahoo.com",
      "sport": "triathlon",
      "current_ctl": 125,
      "current_atl": 260,
      "current_tsb": -135,
      "last_workout": "2025-11-26",
      "current_block": "build"
    }
  ],
  "total": 93
}
```

---

#### 4. **Calculate Metrics**
```
POST /api/gpt/metrics/calculate
```
**Purpose:** Calculate CTL/ATL/TSB from workout history using EWMA algorithm

**Request Body:**
```json
{
  "athlete_id": "427194",
  "workouts": [
    {"date": "2026-01-01", "tss": 85},
    {"date": "2026-01-02", "tss": 120},
    {"date": "2026-01-03", "tss": 95}
  ]
}
```

**Response:**
```json
{
  "ctl": 17.8,
  "atl": 70.7,
  "tsb": -52.9,
  "calculated_date": "2026-01-10"
}
```

---

## 📝 How to Configure Your GPT

### Step 1: Add Actions in GPT Builder

1. Go to your GPT: https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5
2. Click **Configure** tab
3. Scroll to **Actions** section
4. Click **Create new action**

### Step 2: Import OpenAPI Schema

**Option A: Import from URL**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/gpt/echodevo-openapi.json
```

**Option B: Copy/Paste the Schema**
The schema is located at: `/home/user/webapp/gpt/echodevo-openapi.json`

### Step 3: Configure Authentication

**Authentication Type:** API Key

**API Key Settings:**
- **Auth Type:** Custom Header
- **Custom Header Name:** `Authorization`
- **Custom Header Value:** `Bearer YOUR_API_KEY` (if needed)

**Note:** Currently, the sandbox doesn't require authentication, but this is ready for production.

---

## 🎯 Example GPT Prompts

### 1. Analyze Athlete
```
Analyze athlete 427194 (Angela) from the last 90 days. 
What is her current training status and recommendations?
```

**GPT will call:**
```
POST /api/gpt/fetch
{
  "athlete_id": "427194",
  "start_date": "2025-10-12",
  "end_date": "2026-01-10"
}
```

---

### 2. Create Weekly Training Plan
```
Create a weekly training plan for athlete 427194 starting January 15, 2026.
She's in Build phase, focus on VO2 Max and Threshold work.
```

**GPT will:**
1. Fetch current data: `POST /api/gpt/fetch`
2. Generate workout plan based on CTL/ATL/TSB
3. Post workouts: `POST /api/gpt/write`

---

### 3. List All Athletes
```
Show me all my athletes and their current training status.
```

**GPT will call:**
```
GET /api/gpt/athletes
```

---

## 🔍 Testing Your GPT Integration

### Test 1: Fetch Angela's Data
```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "start_date": "2025-12-01",
    "end_date": "2026-01-10"
  }'
```

### Test 2: List Athletes
```bash
curl https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/athletes
```

### Test 3: Calculate Metrics
```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/gpt/metrics/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "427194",
    "workouts": [
      {"date": "2026-01-01", "tss": 85},
      {"date": "2026-01-02", "tss": 120},
      {"date": "2026-01-03", "tss": 95}
    ]
  }'
```

---

## 📊 What Data Your GPT Can Access

### Athlete Profile
- ✅ Name, Email, ID
- ✅ FTP (Functional Threshold Power)
- ✅ LTHR (Lactate Threshold Heart Rate)
- ✅ Weight, Age, Gender
- ✅ Primary Sport

### Training Metrics
- ✅ **CTL** (Chronic Training Load / Fitness)
- ✅ **ATL** (Acute Training Load / Fatigue)
- ✅ **TSB** (Training Stress Balance / Form)
- ✅ **Sport-Specific CTL/ATL/TSB** (SWIM, BIKE, RUN, TOTAL)
- ✅ Stress State (Compromised, Overreached, Productive, Recovered)

### Workout Data (90 days)
- ✅ Date, Sport, Title, Description
- ✅ TSS (Training Stress Score)
- ✅ Duration, Distance
- ✅ Intensity Factor (IF)
- ✅ Normalized Power (NP)
- ✅ Average Power, Heart Rate, Pace
- ✅ Elevation Gain
- ✅ Completed vs Planned

### Wellness Metrics (Structure Ready)
- ⏳ HRV (Heart Rate Variability)
- ⏳ Resting Heart Rate
- ⏳ Sleep Hours & Quality
- ⏳ Readiness Score

**Note:** HRV/wellness data structure is built, needs TrainingPeaks metrics endpoint integration.

---

## 🚀 Quick Start Checklist

- [ ] 1. Open your GPT: https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5
- [ ] 2. Go to Configure → Actions
- [ ] 3. Import OpenAPI schema from URL or file
- [ ] 4. Test with: "Analyze athlete 427194 from the last 90 days"
- [ ] 5. Verify GPT can fetch data and see 249 workouts
- [ ] 6. Test workout posting: "Create a test workout for Angela on January 15"
- [ ] 7. Check TrainingPeaks calendar for posted workout

---

## 📁 Files in Your Project

### GPT Configuration Files
- `/home/user/webapp/gpt/echodevo-openapi.json` - OpenAPI schema for GPT
- `/home/user/webapp/openapi-gpt.json` - Alternative schema (same content)
- `/home/user/webapp/src/echodevo/angela_brain.txt` - Angela's coaching personality
- `/home/user/webapp/gpt/echodevo_gpt_instructions.md` - GPT instructions

### API Implementation
- `/home/user/webapp/src/index.tsx` - Main API with all GPT endpoints

---

## 🎊 Summary

**Your GPT has access to:**
- ✅ 93 athletes from TrainingPeaks
- ✅ Complete 90-day workout history (249 workouts for Angela)
- ✅ Sport-specific CTL/ATL/TSB (TOTAL, SWIM, BIKE, RUN)
- ✅ Ability to fetch athlete data
- ✅ Ability to write workouts to TrainingPeaks
- ✅ Ability to calculate training metrics
- ✅ Real-time TrainingPeaks integration

**Base API URL:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
```

**Test Athlete ID:** `427194` (Angela 1A)

---

## 💡 Pro Tips

1. **Start with a simple test:** Ask GPT to "List all my athletes"
2. **Use specific athlete IDs:** "Analyze athlete 427194" is better than "Analyze Angela"
3. **Check the dashboard:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach
4. **Monitor API calls:** Check PM2 logs with `pm2 logs angela-coach --nostream`

---

## 🆘 Troubleshooting

**Issue:** GPT can't connect to API
- **Solution:** Check the base URL in your GPT Actions matches the sandbox URL

**Issue:** No athlete data returned
- **Solution:** Verify athlete has been synced first in the dashboard

**Issue:** Workouts not posting to TrainingPeaks
- **Solution:** Check TrainingPeaks OAuth token is valid and has `workouts:plan` scope

---

**Ready to test your GPT! 🚀**

Ask it: *"Analyze athlete 427194 from the last 90 days and tell me her current training status."*
