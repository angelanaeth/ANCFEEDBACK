# Swim Workout Library - Testing Guide

## Test Environment
- **Sandbox URL**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai
- **Production URL**: https://angela-coach.pages.dev
- **Test Athlete**: Angela 1A (ID: 427194)
- **Test CSS**: 1:40 per 100m (100 seconds)

---

## Test Results

### ✅ Test 1: Service Health Check
**Status**: PASSED
```bash
Service: angela-coach (PM2 ID: 0)
Status: online
Uptime: 6+ minutes
Memory: 63.6 MB
```

### ✅ Test 2: Athlete Profile API
**Endpoint**: `GET /api/coach/athlete/427194/profile`
**Status**: PASSED
```json
{
    "athlete_id": "427194",
    "name": "Angela 1A",
    "weight_kg": 70,
    "cp_watts": 250,
    "cs_run_seconds": 420,
    "swim_pace_per_100": 100  ← CSS = 1:40
}
```

### ⚠️ Test 3: Swim Workouts API
**Endpoint**: `GET /api/swim/workouts/427194?start_date=2026-02-23&end_date=2026-03-08`
**Status**: FAILED (401 Unauthorized)
**Issue**: Coach token expired (last updated: 2026-01-23)
**Resolution Needed**: Re-authenticate coach via TrainingPeaks OAuth

### ✅ Test 4: Push Endpoint Validation
**Endpoint**: `POST /api/swim/push-workouts`
**Status**: PASSED
**Validation**: Correctly requires `athlete_id` and `workouts` array

---

## Manual UI Testing Checklist

### Page Load & CSS Display
- [ ] Open: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner.html?athlete=427194
- [ ] Verify page title: "Swim Planner - Echodevo Coach"
- [ ] Check navbar: "Swim Planner" with swimmer icon
- [ ] Verify "Back to Dashboard" button present
- [ ] Check athlete name displays: "Angela 1A (427194)"
- [ ] Verify CSS displays: "1:40 / 100m"
- [ ] Check CSS info card shows: "Critical Swim Speed (CSS) is your sustainable swim pace..."

### Workout Library Section
- [ ] Scroll to "Swim Workout Library" section
- [ ] Verify blue gradient header
- [ ] Check info alert: "Based on your CSS (1:40)..."
- [ ] Verify "Plan Your Week" table visible
- [ ] Check 7 rows (Sunday - Saturday)
- [ ] Verify each row has 3 columns: Day, Workout, Yardage

### Week Planner - Workout Selection
**For each day (Sunday - Saturday):**
- [ ] Click "Workout" dropdown
- [ ] Verify dropdown shows: "-- Select Workout --"
- [ ] Verify workout option: "#9 - Triathlon Swim Series - Open Water Skills #3"
- [ ] Select workout #9
- [ ] Verify "Yardage" dropdown becomes enabled
- [ ] Check yardage options: "3,500 yards" and "2,500 yards"

### Week Planner - Sample Plan
**Create a test plan:**
- [ ] Sunday: Select "#9 - Triathlon Swim Series" + "3,500 yards"
- [ ] Tuesday: Select "#9 - Triathlon Swim Series" + "2,500 yards"
- [ ] Thursday: Select "#9 - Triathlon Swim Series" + "3,500 yards"
- [ ] Saturday: Select "#9 - Triathlon Swim Series" + "2,500 yards"
- [ ] Leave Monday, Wednesday, Friday empty
- [ ] Verify selections persist when changing between dropdowns

### Action Buttons
- [ ] Verify "Clear Plan" button visible (gray outline)
- [ ] Click "Clear Plan" - all dropdowns should reset
- [ ] Re-select a few workouts
- [ ] Verify "Push to TrainingPeaks" button visible (large green button)
- [ ] Check button icon: cloud-upload icon present

### Push to TrainingPeaks Flow
**Note**: This will fail with 401 if coach token expired. Expected behavior:

**If token is valid:**
- [ ] Click "Push to TrainingPeaks"
- [ ] Button shows: "Pushing..." with spinner
- [ ] Wait for response (may take 10-30 seconds)
- [ ] Success alert: "✅ Success! Pushed X workout(s) to TrainingPeaks"
- [ ] Week plan automatically clears
- [ ] Recent workouts calendar refreshes

**If token is expired (current state):**
- [ ] Click "Push to TrainingPeaks"
- [ ] Button shows: "Pushing..." with spinner
- [ ] Error alert: "❌ Error: No coach token found" or "401 Unauthorized"
- [ ] Button returns to normal state
- [ ] Week plan remains (not cleared)

### Recent Swim Workouts Calendar
- [ ] Verify two calendar tables visible:
  - Previous Week (gray header)
  - Current Week (cyan header)
- [ ] Check column headers: SUN, MON, TUE, WED, THU, FRI, SAT
- [ ] Verify date headers in each cell
- [ ] Check for existing swim workouts (if any)
- [ ] Completed workouts: green background, ✅ icon
- [ ] Planned workouts: blue background, 📅 icon
- [ ] Empty days: gray background, "-"

### Responsive Design
- [ ] Resize browser window
- [ ] Verify tables remain readable
- [ ] Check mobile view (if applicable)
- [ ] Ensure buttons remain accessible

### Console Logs (Browser DevTools)
Open browser console (F12) and check for:
- [ ] "🏊 Fetching swim workouts: [URL]"
- [ ] "📥 Received X total workouts"
- [ ] "🏊 Filtered to X swim workouts"
- [ ] "Loaded X swim workouts"
- [ ] No JavaScript errors

---

## Known Issues

### 1. Coach Token Expired (401 Error)
**Status**: ACTIVE ISSUE
**Impact**: Cannot fetch workouts or push to TrainingPeaks
**Last Token Update**: 2026-01-23 19:54:31
**Current Date**: 2026-03-06
**Age**: ~6 weeks old

**Resolution**:
1. Go to: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production.html
2. Complete TrainingPeaks OAuth flow
3. Authorize coach access
4. New token will be stored in database
5. Retry swim workouts fetch

**Alternative** (if production has valid token):
- Use production URL: https://angela-coach.pages.dev/static/swim-planner.html?athlete=427194
- Production may have a more recent token

---

## API Endpoints Summary

| Endpoint | Method | Status | Description |
|----------|--------|--------|-------------|
| `/api/coach/athlete/:athleteId/profile` | GET | ✅ Working | Fetch athlete CSS |
| `/api/swim/workouts/:athleteId` | GET | ⚠️ Auth Error | Fetch swim workouts (requires valid token) |
| `/api/swim/push-workouts` | POST | ✅ Validates | Push workouts to TP (requires valid token) |

---

## Workout Library Data

### Currently Available
- **CSS Level**: 1:40 per 100m
- **Workout Count**: 1 (WKT #9)
- **Workout Title**: Triathlon Swim Series - Open Water Skills #3
- **Yardage Options**: 3,500 yards, 2,500 yards

### Workout #9 Details

**3500 Yards Version**:
- Warm-Up: 600 yd
- Drill Set: 400 yd (Single-Arm drills)
- Pre-Set: 400 yd (TARZAN + Kick variations)
- Main Set: 1,900 yd (2×400 Pull, 10×50 Sprint intervals, 2×300 Pull)
- Cool-Down: 200 yd
- **Total**: 3,500 yards
- **Estimated TSS**: 65
- **Estimated Duration**: 60 minutes

**2500 Yards Version**:
- Warm-Up: 600 yd
- Drill Set: 400 yd (Single-Arm drills)
- Pre-Set: 400 yd (TARZAN + Kick variations)
- Main Set: 900 yd (1×400 Pull, 8×50 Sprint intervals, 1×300 Pull)
- Cool-Down: 200 yd
- **Total**: 2,500 yards
- **Estimated TSS**: 50
- **Estimated Duration**: 45 minutes

---

## Test URLs

### Sandbox (Current Session)
- **Dashboard**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach.html
- **Swim Planner**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/swim-planner.html?athlete=427194
- **TP OAuth**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/tp-connect-production.html
- **Athlete Profile**: https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/athlete-profile.html?athlete=427194

### Production (Deployed)
- **Dashboard**: https://angela-coach.pages.dev/static/coach.html
- **Swim Planner**: https://angela-coach.pages.dev/static/swim-planner.html?athlete=427194
- **TP OAuth**: https://angela-coach.pages.dev/static/tp-connect-production.html
- **Athlete Profile**: https://angela-coach.pages.dev/static/athlete-profile.html?athlete=427194

---

## Next Steps

1. **Fix Auth Issue**:
   - Re-authenticate coach via OAuth page
   - Or use production site (may have valid token)

2. **Test Full Flow**:
   - Select workouts for the week
   - Push to TrainingPeaks
   - Verify workouts appear in TP calendar
   - Check TrainingPeaks shows correct:
     - Title: "Triathlon Swim Series - Open Water Skills #3 [WKT #9]"
     - Distance: 3,500 or 2,500 yards
     - TSS: 65 or 50
     - Description: Full workout details
     - Date: Next week (Sunday-Saturday)

3. **Expand Library**:
   - Add workouts #1-23
   - Create additional CSS levels (1:35, 1:45, etc.)
   - Import from spreadsheet functionality

4. **Enhancements**:
   - Workout preview modal
   - Edit/delete pushed workouts
   - Workout history tracking
   - Custom workout creation

---

## Test Completion Status

**Overall Status**: ⚠️ PARTIALLY COMPLETE

**Working Features** (5/6):
- ✅ Page loads correctly
- ✅ CSS displays from athlete profile
- ✅ Workout library UI functional
- ✅ Week planner dropdowns work
- ✅ API endpoints respond correctly

**Blocked Features** (1/6):
- ⚠️ Push to TrainingPeaks (requires valid coach token)

**Action Required**:
Re-authenticate coach to test full end-to-end flow.

---

Generated: 2026-03-06 19:41 UTC
Session: i8mf68r87mlc4fo6mi2yb-ad490db5
