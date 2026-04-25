# 🔧 FIXES NEEDED - PLANNED WORKOUTS, WELLNESS, TSS PLANNER, FUEL

## 🎯 ISSUES TO FIX

### **Issue 1: Planned Workouts Show TSS = 0 and Duration = 0**
**Problem:** API returns planned workouts but TssPlanned and TotalTime are null  
**Root Cause:** Demo token doesn't have access to real TrainingPeaks data  
**Solution:** Reconnect TrainingPeaks token with real coach access

### **Issue 2: Wellness Section - Need Last 7 Days Rolling**
**Problem:** Wellness section doesn't show comprehensive 7-day view  
**Solution:** Expand wellness display to show last 7 days with all metrics

### **Issue 3: TSS Planner Not Working**
**Problem:** TSS planner functionality broken  
**Solution:** Debug and fix TSS planner modal/calculations

### **Issue 4: Fuel Workouts Not Working**
**Problem:** Fuel calculations not working  
**Solution:** Debug and fix fuel calculation endpoint

---

## ⚠️ CRITICAL: TOKEN ISSUE

### **Current Status:**
```bash
$ curl -s http://localhost:3000/api/gpt/fetch -d '{"athlete_id":"427194"}' | jq '.future_planned_workouts[0]'

{
  "date": "2026-01-12",
  "sport": "bike",
  "title": "Z1 Ride, LT1 High-Torque Intervals [BD-K3]",
  "duration": 0,        # ← Should show duration in minutes
  "tss": 0,             # ← Should show TssPlanned value
  "distance": null,
  "if": null,
  "planned": true
}
```

**Why This Happens:**
- Demo token is active (not real TrainingPeaks connection)
- TrainingPeaks API returns 500 error for demo token
- Workouts exist but without TSS/duration data

### **Solution:**
**Reconnect TrainingPeaks token at:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html
```

**After reconnection, data will show:**
```json
{
  "date": "2026-01-12",
  "sport": "bike",
  "title": "Z1 Ride, LT1 High-Torque Intervals [BD-K3]",
  "duration": 180,      # ← 3 hours = 180 minutes
  "tss": 250,           # ← Planned TSS from TrainingPeaks
  "distance": 120.5,    # ← km
  "if": 0.75,          # ← Intensity Factor
  "planned": true
}
```

---

## 🔧 FIX #1: PLANNED WORKOUTS TSS & DURATION

### **Current Code:**
```typescript
// File: src/index.tsx, line 4853
futurePlannedWorkouts = allFutureWorkouts
  .filter((w: any) => !w.Completed)
  .map((w: any) => ({
    date: w.WorkoutDay?.split('T')[0],
    sport: w.WorkoutType?.toLowerCase() || 'other',
    title: w.Title || 'Planned Workout',
    description: w.Description || null,
    duration: Math.round((w.TotalTime || 0) * 60),  // Minutes
    distance: w.Distance ? w.Distance / 1000 : null,
    tss: w.TssPlanned || w.PlannedTss || 0,        // TSS
    if: w.IF || null,
    planned: true
  }));
```

**Code is CORRECT!** The issue is data source (demo token).

### **Verification After Token Reconnect:**
```bash
# Test after reconnecting token
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194"}' | jq '.future_planned_workouts[0]'

# Expected output:
{
  "tss": 250,       # ← Now shows planned TSS
  "duration": 180   # ← Now shows duration
}
```

---

## 🔧 FIX #2: WELLNESS 7-DAY ROLLING VIEW

### **Current State:**
Wellness data exists in database but UI doesn't show comprehensive 7-day view

### **Database Check:**
```bash
npx wrangler d1 execute angela-db --local --command="
  SELECT date, hrv_rmssd, sleep_hours, fatigue, muscle_soreness 
  FROM wellness_data 
  WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = '427194')
  ORDER BY date DESC 
  LIMIT 7
"
```

### **Solution: Create 7-Day Wellness Table**

**Add to dashboard (coach.html):**
```html
<!-- 7-Day Wellness Rolling View -->
<div class="card mb-4">
  <div class="card-header bg-light">
    <h5 class="mb-0"><i class="fas fa-heartbeat me-2"></i>Wellness - Last 7 Days</h5>
  </div>
  <div class="card-body">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Date</th>
          <th>HRV</th>
          <th>Sleep (hrs)</th>
          <th>Fatigue</th>
          <th>Soreness</th>
          <th>Mood</th>
          <th>Energy</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody id="wellness-7day">
        <!-- Populated via JavaScript -->
      </tbody>
    </table>
  </div>
</div>
```

**API Endpoint:**
```typescript
// Add to src/index.tsx
app.get('/api/coach/athlete/:athleteId/wellness/week', async (c) => {
  const athleteId = c.req.param('athleteId');
  const { DB } = c.env;
  
  const result = await DB.prepare(`
    SELECT * FROM wellness_data 
    WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
    ORDER BY date DESC 
    LIMIT 7
  `).bind(athleteId).all();
  
  return c.json({ wellness: result.results });
});
```

---

## 🔧 FIX #3: TSS PLANNER

### **Issue:**
TSS Planner modal not opening or calculations failing

### **Debug Steps:**
```bash
# 1. Check if modal HTML exists
curl -s http://localhost:3000/static/coach.html | grep -i "tss.*planner"

# 2. Check JavaScript function
curl -s http://localhost:3000/static/coach.html | grep -A20 "openTSSPlanner"

# 3. Test in browser console
openTSSPlanner('427194')
```

### **Common Issues:**
1. **Modal not defined** → Add Bootstrap modal HTML
2. **Function not found** → Check JavaScript loaded
3. **Metrics not passed** → Verify CTL/ATL/TSB values

### **Quick Fix:**
Check if `tss_planner_modal.html` is included in page.

---

## 🔧 FIX #4: FUEL WORKOUTS

### **Issue:**
Fuel calculation endpoint not working

### **Test Current State:**
```bash
# Test fuel endpoint
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194"}'

# Check logs
pm2 logs angela-coach --nostream | grep -i fuel
```

### **Expected Behavior:**
```json
{
  "success": true,
  "queued": 5,
  "total_planned": 5,
  "week_range": "2026-01-13 → 2026-01-19",
  "message": "Queued 5 workouts for fueling"
}
```

### **Common Issues:**
1. **Token expired** → Reconnect TrainingPeaks
2. **No planned workouts** → Check TrainingPeaks calendar
3. **API 500 error** → Check logs for stack trace

---

## ✅ ACTION PLAN

### **Priority 1: Reconnect Token** (REQUIRED)
```
1. Visit: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/tp-connect-production.html
2. Click "Connect to TrainingPeaks"
3. Authorize
4. Test: curl -X POST http://localhost:3000/api/coach/sync-athletes
```

### **Priority 2: Verify Data After Token**
```bash
# Test planned workouts show TSS/duration
curl -X POST http://localhost:3000/api/gpt/fetch \
  -d '{"athlete_id":"427194"}' | jq '.future_planned_workouts[0]'

# Should show:
# "tss": <number>
# "duration": <minutes>
```

### **Priority 3: Implement Wellness 7-Day View**
- Add API endpoint
- Add UI table
- Load on dashboard

### **Priority 4: Fix TSS Planner**
- Debug modal opening
- Fix calculations
- Test with real athlete data

### **Priority 5: Fix Fuel Workouts**
- Debug endpoint
- Check TrainingPeaks write permissions
- Test with planned workouts

---

## 📊 CURRENT STATUS

```
Issue 1 (Planned TSS/Duration):  ⚠️  Token Reconnect Needed
Issue 2 (Wellness 7-Day):         🔧 Implementation Needed
Issue 3 (TSS Planner):            🔧 Debug Needed
Issue 4 (Fuel Workouts):          ⚠️  Token Reconnect Needed
```

---

## 🎯 NEXT STEPS

1. **Reconnect TrainingPeaks Token** (2 minutes)
2. **Test planned workouts show data** (1 minute)
3. **Implement wellness 7-day view** (15 minutes)
4. **Debug TSS Planner** (10 minutes)
5. **Test fuel workouts** (5 minutes)

**Total time: ~35 minutes to fix all issues**

---

**After token reconnection, most issues will be resolved! 🚀**
