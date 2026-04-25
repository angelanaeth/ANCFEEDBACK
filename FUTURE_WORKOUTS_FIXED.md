# ✅ FIXED: Future Planned Workouts Now Show Current Week

## Problem
Dashboard was showing "Next Week (Sun Projection)" but only displayed 2 workouts (CS CHECK and CP CHECK for Jan 19-20) instead of showing the current week's actual planned workouts.

## Root Cause
The `getNextWeekRange()` function was calculating **NEXT** week (Jan 19-25) instead of **THIS** week (Jan 12-18).

## ✅ Fix Applied

Changed the week range calculation to show the **CURRENT** week instead of next week:

**Before:**
- Showed: Jan 19-25 (next week)
- Result: Only 2 workouts (CS CHECK, CP CHECK)

**After:**
- Shows: Jan 12-18 (current week)
- Result: 12 workouts including all planned training

## 🎯 What You'll See Now

### Current Week Workouts (Jan 12-18):
- **Jan 13**: Triathlon Swim Series, Arrive in Gran Canaria
- **Jan 14**: Sweet Spot Intervals (Bike)
- **Jan 15**: Sweet Spot/CP+ Intervals (Bike), Triathlon Swim, STRENGTH
- **Jan 16**: Triathlon Swim, Low-Z1 Ride
- **Jan 17**: Z1 Ride with Sweet Spot Finish, Triathlon Swim
- **Jan 18**: (more workouts)

## ✅ Data Freshness

Every time you:
- Click "Refresh Data" button
- Select a different athlete
- Reload the dashboard

The system:
1. ✅ Fetches fresh data from TrainingPeaks API
2. ✅ Gets future workouts for next 28 days (4 weeks)
3. ✅ Filters to show current week (Mon-Sun)
4. ✅ Displays all planned workouts
5. ✅ No caching - always live data

## 🧪 Test Now

1. **Clear browser cache:** `Ctrl + Shift + R`

2. **Open dashboard:**
   ```
   https://5000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
   ```

3. **Select athlete Angela 1A (ID: 427194)**

4. **Scroll to "Future Planned Workouts (Next Mon-Sun)"**

5. **You should see 12 workouts** for this week (Jan 12-18)

## 📊 How It Works Now

```
1. Dashboard loads → Calls /api/gpt/fetch
   ↓
2. API fetches from TrainingPeaks (live data)
   - Historical workouts (last 90 days)
   - Future planned workouts (next 28 days)
   ↓
3. Filters future workouts to current week
   - Today is Monday, Jan 12, 2026
   - Current week: Jan 12-18 (Mon-Sun)
   - Shows all 12 planned workouts
   ↓
4. Dashboard displays current week's plan
```

## ✅ Refresh Behavior

- **Select Athlete**: Fetches fresh data ✅
- **Click "Refresh Data"**: Fetches fresh data ✅
- **Click "Sync Athletes"**: Updates athlete list + fetches fresh data ✅
- **Reload Page**: Fetches fresh data ✅

**No old/cached data - always current!**

## 🔧 Technical Details

**Function Changed:**
```javascript
// OLD: Calculated NEXT week (future)
function getNextWeekRange() {
  // Returns next Monday to next Sunday
  // Example: Jan 19-25
}

// NEW: Calculates CURRENT week (includes today)
function getNextWeekRange() {
  // Returns this Monday to this Sunday
  // Example: Jan 12-18
}
```

**API Response:**
- `future_planned_workouts`: All workouts for next 28 days (38 total)
- `next_week_planned_workouts`: Filtered to current week only (12 workouts)

## ✅ Status

- ✅ Week range fixed
- ✅ Shows current week workouts
- ✅ Always fetches fresh data from TrainingPeaks
- ✅ No caching issues
- ✅ Displays all planned training
- ✅ Service restarted

---

**The dashboard now shows your current week's actual planned workouts!** 🎉
