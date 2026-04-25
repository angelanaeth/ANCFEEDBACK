# Echodevo Coach - Multi-Athlete Dashboard Guide

## 🎯 Overview

The Echodevo Coach Dashboard is a production-ready, multi-athlete coaching interface that integrates with TrainingPeaks to provide comprehensive training management for endurance coaches.

**Live URLs:**
- **Sandbox:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach
- **Production:** https://echodevo-coach.pages.dev/static/coach

## 📋 Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [API Endpoints](#api-endpoints)
4. [User Interface](#user-interface)
5. [Getting Started](#getting-started)
6. [Workflow Examples](#workflow-examples)
7. [Data Models](#data-models)
8. [Integration Guide](#integration-guide)

---

## ✨ Features

### Core Capabilities
- ✅ **Multi-Athlete Management** - Manage unlimited athletes from one dashboard
- ✅ **TrainingPeaks Integration** - OAuth authentication with coach scopes
- ✅ **Real-Time Metrics** - CTL/ATL/TSB tracking for all athletes
- ✅ **StressLogic Engine** - 5-state stress classification (Compromised, Overreached, Productive, Recovered, Detraining)
- ✅ **TSS Planner** - Weekly training load planning per athlete
- ✅ **Workout Posting** - Direct posting to athlete TrainingPeaks calendars
- ✅ **Athlete Filtering** - Filter by stress state for quick intervention
- ✅ **Sync Functionality** - One-click sync of all athletes from TrainingPeaks
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features
- **Backend:** Hono + Cloudflare Workers + D1 SQLite
- **Frontend:** Bootstrap 5 + Axios + Chart.js
- **Authentication:** TrainingPeaks OAuth 2.0 (coach scopes)
- **Data Storage:** Cloudflare D1 database
- **API:** RESTful JSON endpoints

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    COACH DASHBOARD UI                        │
│  (Bootstrap 5, Axios, Chart.js)                             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│              HONO BACKEND (Cloudflare Workers)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Coach API Endpoints                                  │  │
│  │  - GET  /api/coach/athletes                          │  │
│  │  - GET  /api/coach/athlete/:id                       │  │
│  │  - POST /api/coach/athlete/:id/metrics               │  │
│  │  - POST /api/coach/athlete/:id/workout               │  │
│  │  - POST /api/coach/sync-athletes                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  StressLogic Engine                                   │  │
│  │  - CTL/ATL/TSB Calculation                           │  │
│  │  - 5-State Stress Classification                     │  │
│  │  - Training Recommendations                          │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬───────────────────────────────┬───────────────┘
             │                               │
             ↓                               ↓
┌────────────────────────┐    ┌────────────────────────────┐
│  TrainingPeaks API     │    │  Cloudflare D1 Database    │
│  - Coach Athletes      │    │  - users                   │
│  - Athlete Metrics     │    │  - training_metrics        │
│  - Post Workouts       │    │  - posted_workouts         │
│  - OAuth Tokens        │    │  - recommendations         │
└────────────────────────┘    └────────────────────────────┘
```

---

## 🔌 API Endpoints

### 1. Get All Athletes
**Endpoint:** `GET /api/coach/athletes`

**Description:** Fetches all athletes for the authenticated coach from TrainingPeaks and enriches with metrics from local database.

**Response:**
```json
{
  "coach_id": 123,
  "coach_name": "John Doe",
  "total_athletes": 12,
  "athletes": [
    {
      "id": "TP-12345",
      "name": "Sarah Johnson",
      "email": "sarah@example.com",
      "ctl": 82,
      "atl": 94,
      "tsb": -12,
      "stress_state": "Overreached",
      "block_type": "Build",
      "last_updated": "2026-01-09"
    }
  ]
}
```

**Error Codes:**
- `401` - No coach account found (need to authenticate)
- `500` - TrainingPeaks API error or database error

---

### 2. Get Athlete Details
**Endpoint:** `GET /api/coach/athlete/:athleteId`

**Description:** Retrieves detailed information about a specific athlete including metrics history and recent workouts.

**Response:**
```json
{
  "athlete": {
    "id": "TP-12345",
    "name": "Sarah Johnson",
    "email": "sarah@example.com",
    "ftp": 220,
    "lactate_threshold_heart_rate": 165
  },
  "metrics": [
    {
      "date": "2026-01-09",
      "ctl": 82,
      "atl": 94,
      "tsb": -12,
      "stress_state": "Overreached",
      "block_type": "Build"
    }
  ],
  "workouts": [
    {
      "id": "workout-1",
      "date": "2026-01-09",
      "title": "Threshold Intervals",
      "tss": 85,
      "duration": 3600
    }
  ]
}
```

---

### 3. Update Athlete Metrics
**Endpoint:** `POST /api/coach/athlete/:athleteId/metrics`

**Description:** Manually update or store calculated metrics for an athlete.

**Request Body:**
```json
{
  "ctl": 85,
  "atl": 92,
  "tsb": -7,
  "stress_state": "Productive Fatigue",
  "block_type": "Build",
  "date": "2026-01-09"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Metrics updated"
}
```

---

### 4. Post Workout to Athlete
**Endpoint:** `POST /api/coach/athlete/:athleteId/workout`

**Description:** Posts a workout to an athlete's TrainingPeaks calendar.

**Request Body:**
```json
{
  "date": "2026-01-10",
  "title": "VO2 Max Intervals",
  "description": "5x5min @ 110% FTP with 3min recovery",
  "tss": 90,
  "duration": 3600,
  "sport": "Bike",
  "block_type": "Build"
}
```

**Response:**
```json
{
  "success": true,
  "workout": {
    "id": "tp-workout-id",
    "workoutDate": "2026-01-10",
    "title": "VO2 Max Intervals",
    "tss": 90
  }
}
```

**Error Codes:**
- `401` - No coach account found
- `500` - TrainingPeaks API error (check scopes and permissions)

---

### 5. Sync All Athletes
**Endpoint:** `POST /api/coach/sync-athletes`

**Description:** Fetches all athletes from TrainingPeaks and creates/updates local database records.

**Response:**
```json
{
  "success": true,
  "synced": 12,
  "errors": 0,
  "total": 12
}
```

---

## 🖥️ User Interface

### Dashboard Sections

#### 1. **Overview Section** (Default)
- **Summary Stats Cards:**
  - Total Athletes
  - Athletes Needing Attention (Compromised/Overreached)
  - Athletes Race Ready (Recovered)
  - Athletes in Productive State

- **Filter Bar:**
  - All Athletes
  - Compromised (TSB < -40)
  - Overreached (TSB < -25)
  - Productive (TSB -25 to -10)
  - Recovered (TSB > 10)

- **Athlete Grid:**
  - Each athlete displayed as a card
  - Shows: Name, ID, CTL/ATL/TSB, Stress State, Block Type
  - Quick actions: Plan (TSS Planner), Post (Workout)
  - Click card to view detailed athlete profile

#### 2. **TSS Planner Section**
- Embedded TSS Planner interface
- Week-by-week training load planning
- StressLogic-based recommendations
- Direct posting to athlete calendars

#### 3. **Echodevo GPT Section**
- Instructions for setting up Custom ChatGPT
- Links to OpenAPI spec and knowledge base
- Complete setup guide

#### 4. **Settings Section**
- Coach account management
- API key configuration
- TrainingPeaks connection status

---

## 🚀 Getting Started

### Prerequisites
1. TrainingPeaks Coach Account
2. TrainingPeaks API credentials (Client ID + Secret)
3. Cloudflare account for deployment

### Step 1: Connect TrainingPeaks
1. Navigate to the homepage: `/`
2. Click **"Connect as Coach"**
3. Authorize TrainingPeaks OAuth with coach scopes
4. Redirected to dashboard upon success

### Step 2: Sync Your Athletes
1. In the dashboard, click **"Sync All"** button
2. Wait for athletes to sync from TrainingPeaks
3. Athlete cards will populate with basic info

### Step 3: View and Manage Athletes
1. Click on any athlete card to view details
2. Use filter buttons to focus on specific stress states
3. Click **"Plan"** to open TSS Planner for an athlete
4. Click **"Post"** to post a workout to their calendar

---

## 📚 Workflow Examples

### Example 1: Weekly Planning for All Athletes

```javascript
// Step 1: Load all athletes
const response = await axios.get('/api/coach/athletes');
const athletes = response.data.athletes;

// Step 2: Filter athletes needing attention
const needsAttention = athletes.filter(a => 
  a.stress_state === 'Compromised' || 
  a.stress_state === 'Overreached'
);

// Step 3: For each athlete, create weekly plan
for (const athlete of needsAttention) {
  // Open TSS Planner with athlete context
  openTSSPlanner(athlete.id);
  
  // Generate recommended plan based on stress state
  // Post workouts to athlete calendar
}
```

### Example 2: Post Recovery Week for Overreached Athlete

```javascript
const athleteId = 'TP-12345';

// Post 3 easy days
for (let day = 0; day < 3; day++) {
  await axios.post(`/api/coach/athlete/${athleteId}/workout`, {
    date: getDatePlusDays(day),
    title: `Recovery - Easy ${day + 1}`,
    description: 'Zone 1-2 only, focus on feel',
    tss: 30,
    duration: 2700, // 45 minutes
    sport: 'Bike',
    block_type: 'Rebuild'
  });
}
```

### Example 3: Batch Update Metrics After Race Weekend

```javascript
const raceAthletes = [
  { id: 'TP-12345', ctl: 88, atl: 75, tsb: 13 },
  { id: 'TP-67890', ctl: 92, atl: 78, tsb: 14 }
];

for (const athlete of raceAthletes) {
  await axios.post(`/api/coach/athlete/${athlete.id}/metrics`, {
    ctl: athlete.ctl,
    atl: athlete.atl,
    tsb: athlete.tsb,
    stress_state: 'Recovered',
    block_type: 'Specificity',
    date: new Date().toISOString().split('T')[0]
  });
}
```

---

## 📊 Data Models

### User/Athlete Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tp_athlete_id TEXT UNIQUE NOT NULL,
  email TEXT,
  name TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at INTEGER NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'athlete', -- 'coach' or 'athlete'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Training Metrics Table
```sql
CREATE TABLE training_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  tss REAL DEFAULT 0,
  ctl REAL DEFAULT 0,
  atl REAL DEFAULT 0,
  tsb REAL DEFAULT 0,
  stress_state TEXT, -- Compromised, Overreached, Productive Fatigue, Recovered, Detraining
  block_type TEXT,   -- Base, Build, VO2, Specificity, Hybrid, Rebuild
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE(user_id, date)
);
```

### Posted Workouts Table
```sql
CREATE TABLE posted_workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tp_workout_id TEXT,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tss REAL NOT NULL,
  duration INTEGER,
  sport TEXT NOT NULL,
  block_type TEXT,
  posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Recommendations Table
```sql
CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  stress_state TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  intensity_mod REAL DEFAULT 1.0,
  reasoning TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Integration Guide

### TrainingPeaks OAuth Scopes (Coach Mode)
```javascript
const COACH_SCOPES = [
  'coach:athletes',           // Read athlete list
  'coach:attach-athletes',    // Attach new athletes
  'coach:create-athletes',    // Create new athlete accounts
  'coach:detach-athletes',    // Detach athletes
  'coach:search-athletes',    // Search for athletes
  'coach:plans',              // Read/write training plans
  'workouts:read',            // Read workouts
  'workouts:details',         // Read workout details
  'workouts:plan',            // Post planned workouts
  'events:read',              // Read events/races
  'events:write'              // Create/modify events
];
```

### Environment Variables
```bash
# TrainingPeaks API
TP_CLIENT_ID=your_client_id
TP_CLIENT_SECRET=your_client_secret
TP_AUTH_URL=https://oauth.trainingpeaks.com
TP_TOKEN_URL=https://oauth.trainingpeaks.com/oauth/token
TP_API_BASE_URL=https://api.trainingpeaks.com
TP_REDIRECT_URI_COACH=https://your-domain.com/auth/trainingpeaks/coach/callback

# Database
# D1 database is automatically bound as 'DB' in Cloudflare Workers

# Optional: OpenAI API for enhanced coaching
OPENAI_API_KEY=sk-...
SESSION_SECRET=your_session_secret
```

### wrangler.jsonc Configuration
```jsonc
{
  "name": "echodevo-coach",
  "main": "src/index.tsx",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": "./dist",
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "echodevo-coach-production",
      "database_id": "your-database-id"
    }
  ],
  
  "vars": {
    "TP_CLIENT_ID": "your_client_id",
    "TP_AUTH_URL": "https://oauth.trainingpeaks.com",
    "TP_TOKEN_URL": "https://oauth.trainingpeaks.com/oauth/token",
    "TP_API_BASE_URL": "https://api.trainingpeaks.com",
    "TP_REDIRECT_URI_COACH": "https://your-domain.com/auth/trainingpeaks/coach/callback"
  }
}
```

---

## 📈 StressLogic State Definitions

| State | TSB Range | Characteristics | Recommendation |
|-------|-----------|-----------------|----------------|
| **Compromised** | < -40 | Severe fatigue, HRV < 0.8 | Mandatory rest, reduce load 50%+ |
| **Overreached** | -40 to -25 | High fatigue, performance decline | Reduce load 30%, focus recovery |
| **Productive Fatigue** | -25 to -10 | Optimal training zone | Continue current block |
| **Recovered** | 10 to 25 | Fresh, ready for key sessions | Ideal for testing/racing |
| **Detraining** | > 25 | Losing fitness | Increase load significantly |

---

## 🎨 UI Components

### Athlete Card Component
```html
<div class="athlete-card card">
  <div class="card-body">
    <!-- Name and Badges -->
    <div class="d-flex justify-content-between">
      <h5>Athlete Name</h5>
      <span class="stress-badge stress-Overreached">Overreached</span>
    </div>
    
    <!-- Metrics -->
    <div class="row text-center">
      <div class="col-4">
        <div class="fw-bold">82</div>
        <small>CTL</small>
      </div>
      <div class="col-4">
        <div class="fw-bold">94</div>
        <small>ATL</small>
      </div>
      <div class="col-4">
        <div class="fw-bold">-12</div>
        <small>TSB</small>
      </div>
    </div>
    
    <!-- Alert -->
    <div class="alert alert-warning">
      TSB -28: Reduce load 30%
    </div>
  </div>
  
  <!-- Actions -->
  <div class="card-footer">
    <button class="btn btn-primary">Plan</button>
    <button class="btn btn-success">Post</button>
  </div>
</div>
```

### Filter Bar Component
```html
<div class="d-flex gap-2">
  <button class="filter-btn active" data-filter="all">All Athletes</button>
  <button class="filter-btn" data-filter="Compromised">Compromised</button>
  <button class="filter-btn" data-filter="Overreached">Overreached</button>
  <button class="filter-btn" data-filter="Productive">Productive</button>
  <button class="filter-btn" data-filter="Recovered">Recovered</button>
</div>
```

---

## 🐛 Troubleshooting

### Issue: "No coach account found"
**Solution:** Ensure you've connected as a coach via `/auth/trainingpeaks/coach`

### Issue: Athletes not loading
**Solution:** 
1. Check TrainingPeaks API credentials in environment variables
2. Verify coach account has athletes attached
3. Try clicking "Sync All" to manually fetch athletes

### Issue: Cannot post workouts
**Solution:**
1. Verify coach OAuth scopes include `workouts:plan`
2. Check athlete is attached to your coach account
3. Ensure workout data includes required fields (date, title, tss)

### Issue: Metrics not displaying
**Solution:**
1. Metrics are calculated from TrainingPeaks workout data
2. Use "Update Metrics" API to manually input CTL/ATL/TSB
3. Check database migrations have been applied

---

## 📞 Support & Next Steps

### Completed Features
✅ Multi-athlete dashboard UI
✅ TrainingPeaks OAuth (coach mode)
✅ Real-time athlete cards with metrics
✅ Stress state visualization
✅ Workout posting to TP calendars
✅ Athlete filtering by stress state
✅ TSS Planner integration
✅ Responsive Bootstrap 5 design

### Upcoming Features
🔜 Automated metrics calculation from TP workouts
🔜 Weekly plan templates per block type
🔜 Coach notes and athlete messaging
🔜 Performance analytics and charting
🔜 Custom GPT integration for AI coaching
🔜 Mobile app companion
🔜 Multi-coach support for teams

### Resources
- **Main Documentation:** `/home/user/webapp/FINAL_DELIVERABLES.md`
- **Integration Guide:** `/home/user/webapp/COMPLETE_ECHODEVO_INTEGRATION.md`
- **GPT Setup:** `/home/user/webapp/ECHODEVO_GPT_SETUP.md`
- **Source Code:** `/home/user/webapp/src/index.tsx`
- **Coach UI:** `/home/user/webapp/public/static/coach.html`

---

## 📝 License & Credits

**Echodevo Coach Dashboard v5.1**
Built with ❤️ for endurance coaches

**Technologies:**
- Hono v4.0
- Cloudflare Workers & Pages
- Cloudflare D1 (SQLite)
- Bootstrap 5
- Chart.js
- Axios
- TrainingPeaks API

**Created:** January 2026
**Last Updated:** January 9, 2026
**Status:** ✅ Production Ready

---

**Need Help?** Check the comprehensive documentation in `/home/user/webapp/` or review the source code for detailed implementation examples.
