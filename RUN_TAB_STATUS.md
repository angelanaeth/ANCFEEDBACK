# 🏃 RUN TAB IMPLEMENTATION STATUS
**Date**: 2026-04-13  
**Project**: EchoDevo Coach - Angela Coach Platform  
**Latest Deployment**: https://64b4205c.angela-coach.pages.dev  
**Production**: https://angela-coach.pages.dev  
**GitHub**: https://github.com/angelanaeth/Block-Race-Planner (commit de973eb)

---

## ✅ COMPLETED WORK

### 1. Database Schema ✅
**File**: `migrations/0013_run_test_history.sql`

Created 6 new tables for run calculator test history:
- `run_cs_history` - Critical Speed tests (CS, D', test type)
- `run_best_effort_history` - Best effort pace intervals
- `run_pace_zones_history` - Training pace zones
- `run_vo2_history` - VO₂max interval prescriptions (CS, D', vVO₂max)
- `run_cho_history` - Carbohydrate burn calculations
- `run_training_zones_history` - General training zones

**Migration Applied**: ✅ Local D1 database  
**Status**: All tables created with proper indexes

### 2. Backend API Endpoints ✅
**File**: `src/index.tsx`

**POST Endpoints** (Save test history):
- POST `/api/athlete-profile/:id/test-history` with `calculator_type`:
  - `run-cs` → run_cs_history
  - `run-best-effort` → run_best_effort_history
  - `run-pace-zones` → run_pace_zones_history
  - `run-vo2` → run_vo2_history
  - `run-cho` → run_cho_history
  - `run-training-zones` → run_training_zones_history

**GET Endpoints** (Retrieve test history):
- GET `/api/athlete-profile/:id/test-history/:calculator_type`
- Returns all tests ordered by test_date DESC

**DELETE Endpoints** (Remove test):
- DELETE `/api/athlete-profile/:id/test-history/:test_id`
- Requires `calculator_type` in request body

**Testing**: 
```bash
curl http://localhost:3000/api/athlete-profile/427194/test-history/run-cs
curl http://localhost:3000/api/athlete-profile/427194/test-history/run-vo2
```

### 3. Frontend JavaScript Functions ✅
**File**: `run_functions.js`

**Main Functions**:
- `loadRunTestHistories()` - Load all 6 histories in parallel
- `updateRunMetricCards()` - Update CS, D', vVO₂max display
- `loadRunCSHistory()` / `renderRunCSHistory()`
- `loadRunBestEffortHistory()` / `renderRunBestEffortHistory()`
- `loadRunPaceZonesHistory()` / `renderRunPaceZonesHistory()`
- `loadRunVO2History()` / `renderRunVO2History()`
- `loadRunCHOHistory()` / `renderRunCHOHistory()`
- `loadRunTrainingZonesHistory()` / `renderRunTrainingZonesHistory()`
- `deleteRunTest(calculatorType, testId)` - Delete with confirmation

**Helper Functions**:
- `formatPace(seconds)` - Convert seconds to MM:SS
- `formatDate(dateString)` - Format ISO date to readable
- Edit toggle functions (placeholders)

### 4. Deployment ✅
**Build**: ✅ Completed (`npm run build`)  
**Deploy**: ✅ Live at https://64b4205c.angela-coach.pages.dev  
**GitHub**: ✅ Pushed to main branch (commit de973eb)

---

## 📋 REMAINING WORK

### Frontend Integration (Est. 3-4 hours)

#### A. Update `athlete-profile-v3.html`

**1. Add Run Metric Cards** (after Bike tab, before General Info)
```html
<!-- RUN METRICS CARDS -->
<div class="metric-card">
  <div class="metric-header">
    <span>Critical Speed (CS)</span>
    <button onclick="toggleRunCSEdit()"><i class="fas fa-edit"></i></button>
  </div>
  <div class="metric-main">
    <span id="run-cs-value" class="metric-value">--:--</span>
    <span class="metric-unit">/mile</span>
  </div>
  <div class="metric-meta">
    <small>Source: <span id="run-cs-source">---</span></small>
    <small>Updated: <span id="run-cs-updated">---</span></small>
  </div>
</div>

<div class="metric-card">
  <div class="metric-header">
    <span>D' (Distance Prime)</span>
    <button onclick="toggleRunDPrimeEdit()"><i class="fas fa-edit"></i></button>
  </div>
  <div class="metric-main">
    <span id="run-dprime-value" class="metric-value">---</span>
    <span class="metric-unit">meters</span>
  </div>
  <div class="metric-meta">
    <small>Source: <span id="run-dprime-source">---</span></small>
    <small>Updated: <span id="run-dprime-updated">---</span></small>
  </div>
</div>

<div class="metric-card">
  <div class="metric-header">
    <span>Pace @ VO₂max</span>
    <button onclick="toggleRunVVO2Edit()"><i class="fas fa-edit"></i></button>
  </div>
  <div class="metric-main">
    <span id="run-vvo2-value" class="metric-value">--:--</span>
    <span class="metric-unit">/mile</span>
  </div>
  <div class="metric-meta">
    <small>Source: <span id="run-vvo2-source">---</span></small>
    <small>Updated: <span id="run-vvo2-updated">---</span></small>
  </div>
</div>
```

**2. Add 6 Test History Tables** (same structure as bike)
```html
<!-- Critical Speed History -->
<div class="history-section">
  <h4>📊 Critical Speed Test History</h4>
  <table class="history-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>CS Pace</th>
        <th>D'</th>
        <th>Test Type</th>
        <th>Source</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="run-cs-history-tbody">
      <tr><td colspan="6" class="text-center">Loading...</td></tr>
    </tbody>
  </table>
</div>

<!-- Add similar tables for: -->
<!-- - Best Effort Pace History (run-best-effort-history-tbody) -->
<!-- - Pace Zones History (run-pace-zones-history-tbody) -->
<!-- - VO2 Max Intervals History (run-vo2-history-tbody) -->
<!-- - CHO Burn History (run-cho-history-tbody) -->
<!-- - Training Zones History (run-training-zones-history-tbody) -->
```

**3. Insert `run_functions.js` code** into `<script>` section

**4. Call `loadRunTestHistories()`** in `loadAthleteProfile()`:
```javascript
async function loadAthleteProfile() {
  // ... existing code ...
  
  // Load test histories
  await loadSwimCHOHistory();
  await loadBikeTestHistories(); // Already present
  await loadRunTestHistories();   // ADD THIS LINE
  
  // ... rest of code ...
}
```

#### B. Update `athlete-calculators.html`

Update 6 run calculator save functions to save to test history:

**1. Critical Speed (Run)**
```javascript
// Find: function saveCSToProfile()
// Update to call POST /api/athlete-profile/:id/test-history

async function saveCSToProfile(cs, dPrime, testType) {
  // First save to test history
  await fetch(`/api/athlete-profile/${athleteId}/test-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      calculator_type: 'run-cs',
      test_date: new Date().toISOString().split('T')[0],
      data: {
        cs_pace_seconds: cs,
        cs_pace_formatted: formatPace(cs),
        d_prime: dPrime,
        test_type: testType,
        test_data: { /* input values */ }
      },
      source: 'Calculator',
      notes: ''
    })
  });
  
  // Then save to athlete profile
  await saveToAthleteProfile('Critical Speed', {
    run_cs_seconds: cs,
    run_d_prime: dPrime,
    run_cs_source: 'Calculator',
    run_cs_updated: new Date().toISOString()
  }, 'run');
}
```

**2. Best Effort Pace**
```javascript
async function saveBestEffortPaceToProfile(cs, dPrime, intervals) {
  await fetch(`/api/athlete-profile/${athleteId}/test-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      calculator_type: 'run-best-effort',
      test_date: new Date().toISOString().split('T')[0],
      data: {
        cs_pace_seconds: cs,
        d_prime: dPrime,
        intervals: intervals,
        test_data: { /* inputs */ }
      },
      source: 'Calculator',
      notes: ''
    })
  });
  
  await saveToAthleteProfile('Best Effort Pace', {
    pace_intervals: JSON.stringify(intervals)
  }, 'run');
}
```

**3-6. Similar updates** for:
- Run Pace Zones → `calculator_type: 'run-pace-zones'`
- VO₂ Max Intervals (Run) → `calculator_type: 'run-vo2'`
- CHO Burn (Run) → `calculator_type: 'run-cho'`
- Training Zones (Run) → `calculator_type: 'run-training-zones'`

---

## 🧪 TESTING PLAN

### 1. Backend API Testing
```bash
# Start local dev server
cd /home/user/webapp
fuser -k 3000/tcp 2>/dev/null || true
npm run build
pm2 start ecosystem.config.cjs

# Test GET endpoints
curl http://localhost:3000/api/athlete-profile/427194/test-history/run-cs
curl http://localhost:3000/api/athlete-profile/427194/test-history/run-vo2

# Test POST endpoint (manual)
curl -X POST http://localhost:3000/api/athlete-profile/427194/test-history \
  -H "Content-Type: application/json" \
  -d '{
    "calculator_type": "run-cs",
    "test_date": "2026-04-13",
    "data": {
      "cs_pace_seconds": 420,
      "cs_pace_formatted": "7:00",
      "d_prime": 180,
      "test_type": "2-point",
      "test_data": {}
    },
    "source": "Manual Test",
    "notes": "Testing API"
  }'
```

### 2. Frontend Testing
1. Open: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
2. Test each calculator:
   - **Critical Speed**: Enter test data → Calculate → Save to Profile
   - **Best Effort Pace**: Enter CS/D' → Calculate → Save
   - **VO₂ Max Intervals**: Enter CS/D'/vVO₂max → Prescribe → Save
   - **CHO Burn**: Enter weight/intensity/duration → Calculate → Save
3. Verify profile: https://angela-coach.pages.dev/static/athlete-profile-v3?athlete=427194
4. Check Run tab shows:
   - Metric cards populated
   - History tables populated
   - Delete buttons work

### 3. Cross-Tab Testing
- Verify Swim tab still works ✅
- Verify Bike tab still works ✅
- Verify Run tab works ✅
- All 3 tabs save correctly

---

## 📊 COMPLETION STATUS

| Component | Status | Notes |
|-----------|--------|-------|
| Database Migration | ✅ Done | 6 tables created |
| Backend POST | ✅ Done | All 6 calculators |
| Backend GET | ✅ Done | All 6 calculators |
| Backend DELETE | ✅ Done | All 6 calculators |
| Frontend Functions | ✅ Done | run_functions.js |
| Profile HTML | 🟡 TODO | Add metric cards + tables |
| Profile JS Integration | 🟡 TODO | Insert functions + call |
| Calculator Save Functions | 🟡 TODO | Update 6 save functions |
| Local Testing | 🟡 TODO | Test all endpoints |
| Production Deploy | 🟡 TODO | Final deploy |
| Documentation | ✅ Done | This file |

**Overall Progress**: 60% Complete (Backend + Functions done, Frontend integration TODO)

---

## 🚀 QUICK DEPLOY CHECKLIST

Once frontend is integrated:

```bash
# 1. Build
cd /home/user/webapp
npm run build

# 2. Local test (optional)
pm2 restart webapp
curl http://localhost:3000/api/athlete-profile/427194/test-history/run-cs

# 3. Deploy production
npx wrangler pages deploy dist --project-name angela-coach

# 4. Test production
# Open: https://angela-coach.pages.dev/static/athlete-profile-v3?athlete=427194

# 5. Commit & push
git add -A
git commit -m "🏃 RUN: Complete frontend integration for run tab"
git push origin main
```

---

## 📁 FILES MODIFIED/CREATED

### Created:
- `migrations/0013_run_test_history.sql` - Database schema
- `run_functions.js` - JavaScript functions for loading/rendering

### Modified:
- `src/index.tsx` - Added 18 new case statements (6 POST, 6 GET, 6 DELETE)

### To Modify:
- `public/static/athlete-profile-v3.html` - Add run tab HTML + JS
- `public/static/athlete-calculators.html` - Update 6 save functions

---

## 🎯 NEXT ACTIONS

1. **Update athlete-profile-v3.html** (Est. 1.5 hours)
   - Add 3 metric cards
   - Add 6 history tables
   - Insert run_functions.js code
   - Call loadRunTestHistories()

2. **Update athlete-calculators.html** (Est. 1.5 hours)
   - Update 6 save functions to call test history API
   - Test each calculator save

3. **End-to-end testing** (Est. 1 hour)
   - Test all 6 run calculators
   - Verify data displays in profile
   - Test delete functionality

4. **Final deployment** (Est. 15 min)
   - Build, deploy, commit

**Total Estimated Time**: ~4 hours to complete

---

## ✅ SUCCESS CRITERIA

Run tab is complete when:
- ✅ All 6 calculators save to test history
- ✅ All 6 history tables display on profile
- ✅ Metric cards show CS, D', vVO₂max
- ✅ Delete buttons work for all histories
- ✅ No console errors
- ✅ Deployed to production
- ✅ Committed to GitHub

---

**Status**: Backend 100% complete, frontend integration ready to begin.  
**Next Step**: Update athlete-profile-v3.html with Run tab UI.
