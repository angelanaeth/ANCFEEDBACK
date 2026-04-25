# 🔧 ANGELA COACH - FIXES APPLIED & REMAINING ISSUES
# Date: 2026-01-11 19:05 UTC

---

## ✅ FIXED ISSUES

### 1. ✅ Echodevo Insights - NOW WORKING

**Problem**: "Error loading insight data"
**Root Cause**: Token expiry was being checked incorrectly
- `token_expires_at` is stored as INTEGER (Unix timestamp in SECONDS)
- Code was treating it as milliseconds: `new Date(token_expires_at)`
- This caused tokens to appear as expired in year 1970

**Solution Applied**:
```typescript
// BEFORE (WRONG):
const tokenExpiry = new Date(coach.token_expires_at);

// AFTER (FIXED):
const tokenExpiry = new Date(coach.token_expires_at * 1000); // Multiply by 1000
```

**Fixed in 4 locations**:
- Line ~4441: GPT fetch endpoint
- Line ~5491: Echodevo insight endpoint  
- Line ~5752: Fuel next week endpoint
- Line ~6020: Test update workout endpoint

**Result**: Echodevo insights now loads successfully ✅
```bash
curl -X POST http://localhost:3000/api/echodevo/insight \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2026-01-06","end_date":"2026-01-12"}'

# Returns full insight data (was returning "Error loading insight data")
```

---

## ⚠️ REMAINING ISSUES

### 2. ⚠️ Fueling Calculation - Partially Working

**Current Status**:
- ✅ `/api/fuel/next-week` endpoint exists and compiles
- ✅ Fetches next Monday-Sunday date range correctly
- ⚠️ TrainingPeaks API returns 500 error for some athletes
- ❌ No UI interface to trigger fueling calculation
- ❌ CHO notes not being written to pre-activity comments yet

**What's Implemented**:
```typescript
// File: src/index.tsx, line ~5733
app.post('/api/fuel/next-week', async (c: any) => {
  // 1. Gets coach token ✅
  // 2. Calculates next week range (Monday-Sunday) ✅
  // 3. Fetches planned workouts from TrainingPeaks ⚠️
  // 4. Calculates CHO/Hydration/Sodium for each workout ✅
  // 5. Queues workouts for writeback ✅
  // 6. Writes fueling to pre-activity comments ⚠️
});
```

**Test Results**:
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194"}'

# Current Response:
{
  "error": "TrainingPeaks API error: 500"
}

# Expected dates: 2026-01-12 to 2026-01-18 (next week)
```

**Possible Causes**:
1. TrainingPeaks API endpoint changed
2. Athlete 427194 has no planned workouts for next week
3. API requires different authentication for future workout writes
4. Need to test with current week instead of next week

**What Needs to Happen**:

**A. Fix TrainingPeaks API Call**:
The endpoint uses: `GET /v2/workouts/{athlete_id}/{start_date}/{end_date}`

Need to verify:
- Is this the correct endpoint for planned (future) workouts?
- Does it require write scopes?
- Try with current week instead of next week

**B. Create UI Interface**:
```javascript
// Add to coach dashboard (public/static/coach.html):
<button onclick="fuelNextWeek(athleteId)">
  Calculate Fueling for Next Week
</button>

<script>
async function fuelNextWeek(athleteId) {
  const response = await fetch('/api/fuel/next-week', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ athlete_id: athleteId })
  });
  
  const data = await response.json();
  if (data.success) {
    alert(`Queued ${data.total_planned} workouts for fueling`);
  } else {
    alert(`Error: ${data.error}`);
  }
}
</script>
```

**C. Verify Writeback Queue**:
Check if `tp_write_queue` table exists:
```sql
SELECT * FROM tp_write_queue LIMIT 5;
```

**D. Test with Real Athlete**:
Use athlete with actual planned workouts in calendar:
```bash
# Test with athlete 4499140 or 4337068
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"4499140"}'
```

---

### 3. ⚠️ Future TSS Not Showing on Planned Workouts

**Problem**: Future workouts don't display planned TSS, which affects:
- Future TSB/ATL/CTL projections
- Next Sunday's stress state prediction
- Weekly planning accuracy

**Current Behavior**:
```javascript
// When fetching future workouts:
{
  "date": "2026-01-13",
  "tss": null,  // ← Should show planned TSS
  "completed": false
}
```

**What's Missing**:
1. **Planned TSS Field Mapping**:
   - TrainingPeaks API returns `TssPlanned` field
   - Code might be looking for `TssActual` only
   - Need to check both fields for future workouts

2. **Future Projections**:
   - CTL/ATL/TSB calculations need planned TSS
   - Without it, future stress state is inaccurate

**Where to Fix**:
```typescript
// In workout fetching logic, need to add:
const tss = workout.Completed 
  ? workout.TssActual 
  : (workout.TssPlanned || workout.TssActual || 0);

// Currently it's probably just:
const tss = workout.TssActual || 0;
```

**Locations to Update**:
1. `fetchWorkoutsForChunks()` - line ~4500
2. `calculateCurrentMetrics()` - analysis_engine.ts
3. GPT fetch endpoint - line ~4400
4. Echodevo insight - line ~5500

**Expected Result**:
```javascript
// Future workouts should show:
{
  "date": "2026-01-13",
  "tss": 180,  // ← From TssPlanned
  "tssPlanned": 180,
  "tssActual": null,
  "completed": false,
  "projection": true  // Flag for UI
}
```

---

## 🎯 PRIORITY ACTION ITEMS

### High Priority (Fix Now)

**1. Fix Future TSS Display**
- Update workout TSS logic to use `TssPlanned` for future workouts
- Test with: `GET /api/coach/athlete/427194`
- Verify future workouts show planned TSS

**2. Debug Fueling API**
- Test `/api/fuel/next-week` with current week dates
- Try different athlete IDs
- Check if planned workouts exist in TrainingPeaks for next week
- Verify API endpoint format

### Medium Priority (Next)

**3. Add Fueling UI Button**
- Add "Calculate Fueling" button to coach dashboard
- Display queued workouts count
- Show success/error messages

**4. Test Fueling Writeback**
- Verify `processFuelQueue()` function works
- Test writing CHO notes to pre-activity comments
- Confirm notes appear in TrainingPeaks UI

### Low Priority (Optional)

**5. Wellness Metrics**
- Add HRV/Sleep/Resting HR from TrainingPeaks Wellness API
- Currently generating demo data

---

## 📊 CURRENT SYSTEM STATUS

```
✅ Service: ONLINE (PM2)
✅ Database: angela-db (local D1)
✅ Athletes: 8 loaded (3 real + 5 sample)
✅ TrainingPeaks OAuth: Tokens valid until 2026
✅ Token Expiry Bug: FIXED (4 locations)
✅ Echodevo Insights: WORKING
⚠️ Fueling Calculation: API returns 500
⚠️ Future TSS: Not showing planned values
⚠️ CHO Notes Writeback: Not tested yet
```

---

## 🧪 TEST COMMANDS

### Test Echodevo (Should Work Now)
```bash
curl -X POST http://localhost:3000/api/echodevo/insight \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2025-12-01","end_date":"2026-01-10"}'
```

### Test Fueling (Currently Returns 500)
```bash
curl -X POST http://localhost:3000/api/fuel/next-week \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194"}'
```

### Check Athlete Data
```bash
curl http://localhost:3000/api/coach/athlete/427194 | python3 -m json.tool
```

### Check Future Workouts
```bash
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194"}' | grep -A5 "planned"
```

---

## 📝 NEXT STEPS

1. **Immediate**:
   - Fix future TSS field mapping (`TssPlanned` vs `TssActual`)
   - Debug why `/api/fuel/next-week` returns 500
   - Test with current week dates instead of next week

2. **Short Term**:
   - Add UI button for fueling calculation
   - Test CHO notes writeback to TrainingPeaks
   - Verify pre-activity comments appear correctly

3. **Long Term**:
   - Implement real wellness metrics (HRV, sleep)
   - Add bulk athlete fueling (all athletes at once)
   - Schedule automatic fueling calculation (cron)

---

**Last Updated**: 2026-01-11 19:05 UTC
**Status**: 1 of 3 issues fixed, 2 remaining
**Service**: ONLINE ✅
