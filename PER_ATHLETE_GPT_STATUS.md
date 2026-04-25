# Per-Athlete GPT & Dashboard Status

## 🎯 Goal
Create a per-athlete GPT system where:
- **Coach login**: GPT prompts "Which athlete would you like to discuss?"
- **Per-athlete context**: Each athlete gets their own GPT instance that remembers only their data
- **Per-athlete UI**: Each athlete has a dedicated dashboard with all data, sync, TSS planner, and GPT
- **Navigation**: Coaches can navigate between athletes, each with their own GPT instance

## ✅ What's Working Now

### 1. Multi-Tenant Authentication System
- **Coach Login**: `/login` → OAuth with TrainingPeaks → `/static/coach`
- **Athlete Login**: `/login` → OAuth with TrainingPeaks → `/dashboard`
- **Session Management**: HttpOnly cookies with 30-day expiration
- **Logout**: Clears session and redirects to login

### 2. Coach Dashboard
- **URL**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach
- **Features**:
  - View all athletes (currently showing 7 athletes: 2 real + 5 sample)
  - Filter by stress state (All, Attention, Ready, Productive)
  - Athlete cards show: Name, Email, CTL/ATL/TSB, Stress State
  - Per-athlete actions: **Dashboard**, **Sync**, **Plan**, **Post**

### 3. Per-Athlete Dashboard
- **URL Pattern**: `/static/athlete-dashboard-single?id={athleteId}`
- **Example**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/athlete-dashboard-single?id=427194
- **Features**:
  - **Athlete Profile**: ID, Email, Gender, FTP, LTHR, Weight
  - **Sport-Specific Training Load**:
    - TOTAL: CTL, ATL, TSB
    - SWIM: CTL, ATL, TSB
    - BIKE: CTL, ATL, TSB
    - RUN: CTL, ATL, TSB
  - **90-Day Training Summary**: Total workouts, workouts by sport, avg TSS, total hours
  - **Recent Workouts Table**: Last 30 workouts with Date, Sport, Title, TSS, Duration, Distance, Avg HR
  - **Wellness Metrics Section**: HRV, Resting HR, Sleep (structure ready, needs data)
  - **Action Buttons**: Sync, TSS Planner, Post Workout

### 4. API Endpoints
All endpoints are working and tested:
- `GET /api/coach/athletes` → List all athletes
- `GET /api/coach/athlete/:athleteId` → Get athlete details with metrics and workouts
- `POST /api/coach/athlete/:athleteId/sync` → Sync athlete data from TrainingPeaks
- `POST /api/coach/athlete/:athleteId/workout` → Post workout to TrainingPeaks

### 5. GPT API Endpoints (Session-Aware)
- `GET /api/gpt/athletes` → List athletes (coach = ALL, athlete = SELF)
- `POST /api/gpt/fetch` → Fetch athlete data (permission-checked)
- `POST /api/gpt/write` → Write workout plan (permission-checked)
- `POST /api/gpt/metrics/calculate` → Calculate CTL/ATL/TSB

## 🚧 What Needs To Be Done

### 1. **Per-Athlete GPT Context** (HIGHEST PRIORITY)
**Goal**: When coach clicks "Dashboard" for an athlete, embed a GPT chat interface that ONLY knows about that athlete.

**Implementation Plan**:
```html
<!-- Add to athlete-dashboard-single.html -->
<div class="card mb-4">
  <div class="card-header bg-info text-white">
    <h5><i class="fas fa-robot me-2"></i>Athlete GPT Assistant</h5>
  </div>
  <div class="card-body">
    <!-- Embed GPT Chat iframe with athlete context -->
    <iframe 
      src="https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5?athleteId={athleteId}"
      width="100%"
      height="600px"
      frameborder="0">
    </iframe>
  </div>
</div>
```

**Backend Changes Needed**:
- Update GPT API endpoints to accept `athleteId` parameter
- When `athleteId` is provided, filter ALL data to ONLY that athlete
- GPT should use athlete ID from URL parameter: `/api/gpt/fetch?athlete_id=427194`

### 2. **GPT Session Context** (REQUIRED)
**Problem**: GPT needs to know which athlete we're discussing.

**Solution Options**:

**Option A: URL Parameter (SIMPLEST)**
- Coach visits: `/static/athlete-dashboard-single?id=427194`
- GPT iframe loads with: `?athleteId=427194`
- All GPT API calls include: `athlete_id=427194` in request

**Option B: Session Cookie**
- When coach clicks athlete dashboard, set cookie: `current_athlete_id=427194`
- GPT reads cookie and includes in API calls
- Automatic athlete context without URL params

**Recommended**: Use Option A (URL parameter) - simpler and more explicit

### 3. **Update GPT Actions Schema**
```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "EchoDevo Coach API - Per-Athlete Context",
    "version": "2.1.0"
  },
  "servers": [
    {
      "url": "https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai"
    }
  ],
  "paths": {
    "/api/gpt/fetch": {
      "post": {
        "summary": "Fetch athlete data with optional athlete filter",
        "parameters": [
          {
            "name": "athlete_id",
            "in": "query",
            "required": false,
            "schema": { "type": "string" },
            "description": "If provided, ONLY return data for this athlete"
          }
        ]
      }
    }
  }
}
```

### 4. **Frontend GPT Integration**
Add a "Chat with GPT" button on each athlete card:
```html
<button class="btn btn-sm btn-outline-primary" onclick="openAthleteGPT('${athlete.id}')">
  <i class="fas fa-robot me-1"></i>GPT
</button>
```

Add GPT modal:
```javascript
function openAthleteGPT(athleteId) {
  // Open GPT in modal with athlete context
  window.open(
    `https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5?athlete_id=${athleteId}`,
    '_blank'
  )
}
```

## 📋 Implementation Checklist

- [ ] **Step 1**: Add GPT iframe to athlete-dashboard-single.html
- [ ] **Step 2**: Update GPT API endpoints to accept `athlete_id` query parameter
- [ ] **Step 3**: Filter all GPT responses to ONLY include data for the specified athlete
- [ ] **Step 4**: Update OpenAPI schema with athlete_id parameter
- [ ] **Step 5**: Add "Chat with GPT" button to athlete cards
- [ ] **Step 6**: Test GPT with athlete context:
  - "What is Angela's current CTL?"
  - "Show me Angela's workouts from last week"
  - "What is Angela's stress state?"
- [ ] **Step 7**: Verify GPT does NOT show data from other athletes

## 🔍 Current Athlete Data Available

### Example: Angela (ID: 427194)
```json
{
  "athlete": {
    "id": "427194",
    "name": "Athlete 427194"
  },
  "metrics": {
    "current": {
      "total": { "ctl": 124.47, "atl": 259.83, "tsb": -135.36 },
      "swim": { "ctl": 33.27, "atl": 62.64, "tsb": -29.37 },
      "bike": { "ctl": 77.93, "atl": 157.67, "tsb": -79.74 },
      "run": { "ctl": 13.26, "atl": 39.51, "tsb": -26.25 }
    },
    "stress_state": "Compromised"
  },
  "workouts": [],
  "summary": {
    "total_workouts": 0,
    "workouts_by_sport": { "swim": 0, "bike": 0, "run": 0 }
  }
}
```

## 🌐 URLs

- **Coach Dashboard**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach
- **Angela's Dashboard**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/athlete-dashboard-single?id=427194
- **Login Page**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/login
- **GPT**: https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5

## 📝 Notes

1. **Workout Data**: Currently empty because TrainingPeaks API returns 401 (authentication issues)
2. **Wellness Data**: Structure is ready but needs TrainingPeaks metrics API endpoint
3. **Authentication**: Cookie-based sessions working but needs testing with real TrainingPeaks OAuth
4. **GPT Context**: Ready to implement - just needs athlete_id parameter in API calls

## 🚀 Next Steps

1. Implement per-athlete GPT context (URL parameter approach)
2. Add "Chat with GPT" button to athlete cards
3. Update GPT API to filter by athlete_id
4. Test complete flow: Coach → Select Athlete → View Dashboard → Chat with GPT → Ask about ONLY that athlete
5. Fix TrainingPeaks authentication to get real workout data
6. Add wellness metrics endpoint integration

---

**Status**: ✅ Dashboard complete, 🚧 GPT integration in progress
**Last Updated**: 2026-01-10
