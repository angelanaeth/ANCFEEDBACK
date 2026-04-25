# ❌ TSS PLANNER VALUES ARE WRONG - Need Projected Values, Not Current

## Problem Identified

### What's Currently Happening (WRONG):
```javascript
// In coach.html openTSSPlanner function:
document.getElementById('ctl_value').value = Math.round(athlete.ctl || 0);  // ← CURRENT CTL
document.getElementById('atl_value').value = Math.round(athlete.atl || 0);  // ← CURRENT ATL
document.getElementById('wtsb_value').value = Math.round((athlete.ctl || 0) - (athlete.atl || 0)); // ← CURRENT TSB
```

**This is populating with TODAY's values**, but the labels say:
- "CTL (Coming Sunday)" - Should be FUTURE value
- "ATL (Coming Sunday)" - Should be FUTURE value
- "Mid-week TSB" - Should be FUTURE value

### What Should Be Happening (CORRECT):
The TSS Planner needs **PROJECTED** values:

1. **CTL (Coming Sunday)** = CTL projected to the coming Sunday
2. **ATL (Coming Sunday)** = ATL projected to the coming Sunday  
3. **Mid-week TSB** = TSB projected to mid-week Wednesday

## Date Context

### Example (Sarah Johnson):
- **Metrics last updated**: 2026-01-09 (Thursday - YESTERDAY)
- **Today**: 2026-01-10 (Friday)
- **Coming Sunday**: 2026-01-12 (2 days from today, 3 days from metrics date)
- **Mid-week Wednesday**: 2026-01-15 (5 days from today, 6 days from metrics date)

### Current Values (from 2026-01-09):
- CTL: 82
- ATL: 94
- TSB: -12

### What TSS Planner Should Show:

#### Scenario A: No workouts planned between now and Sunday
With natural decay (no TSS added):
- **CTL (Coming Sunday 2026-01-12)**: ~80.5 (decays slowly, TAU=42)
- **ATL (Coming Sunday 2026-01-12)**: ~88.2 (decays faster, TAU=7)
- **Mid-week TSB (Wednesday 2026-01-15)**: ~-6.8 (improves as ATL decays faster)

#### Scenario B: Workouts planned between now and Sunday
If athlete does 100 TSS today (Friday) and 120 TSS Saturday:
- **CTL (Coming Sunday)**: ~84.2 (increases slowly)
- **ATL (Coming Sunday)**: ~106.5 (increases rapidly)
- **Mid-week TSB (Wednesday)**: ~-18.3 (gets worse before recovery)

## Required Calculation: CTL/ATL Projection

### CTL/ATL EWMA Decay Formula:
```javascript
// Angela Engine v5.1 formulas
const TAU_CTL = 42  // Days
const TAU_ATL = 7   // Days

// For each day with no workout (TSS = 0):
newCTL = currentCTL + (0 - currentCTL) / TAU_CTL
newATL = currentATL + (0 - currentATL) / TAU_ATL

// For each day with a workout (TSS > 0):
newCTL = currentCTL + (TSS - currentCTL) / TAU_CTL
newATL = currentATL + (TSS - currentATL) / TAU_ATL

// TSB = CTL - ATL (always)
```

### Projection Logic Needed:
```javascript
function projectMetrics(currentCTL, currentATL, daysForward, plannedWorkouts = []) {
  let ctl = currentCTL
  let atl = currentATL
  const TAU_CTL = 42
  const TAU_ATL = 7
  
  for (let day = 1; day <= daysForward; day++) {
    // Check if there's a planned workout for this day
    const workout = plannedWorkouts.find(w => w.dayOffset === day)
    const tss = workout ? workout.tss : 0
    
    // Apply EWMA formula
    ctl = ctl + (tss - ctl) / TAU_CTL
    atl = atl + (tss - atl) / TAU_ATL
  }
  
  return { ctl, atl, tsb: ctl - atl }
}
```

## What Needs To Be Fixed

### Option 1: Calculate Projections in Frontend (SIMPLE)
When opening TSS Planner, calculate projections before populating:

```javascript
async function openTSSPlanner(athleteId) {
  const athlete = allAthletes.find(a => a.id === athleteId);
  
  // Get metrics date
  const metricsDate = new Date(athlete.last_updated);
  const today = new Date();
  const comingSunday = getNextSunday(today);
  const midWeekWednesday = getNextWednesday(today);
  
  // Calculate days forward from metrics date
  const daysToSunday = Math.ceil((comingSunday - metricsDate) / (1000 * 60 * 60 * 24));
  const daysToWednesday = Math.ceil((midWeekWednesday - metricsDate) / (1000 * 60 * 60 * 24));
  
  // Project CTL/ATL (assuming no planned workouts for now)
  const sundayMetrics = projectMetrics(athlete.ctl, athlete.atl, daysToSunday);
  const wednesdayMetrics = projectMetrics(athlete.ctl, athlete.atl, daysToWednesday);
  
  // Populate with PROJECTED values
  document.getElementById('ctl_value').value = Math.round(sundayMetrics.ctl);
  document.getElementById('atl_value').value = Math.round(sundayMetrics.atl);
  document.getElementById('wtsb_value').value = Math.round(wednesdayMetrics.tsb);
  
  // Also store sport-specific projections
  window.currentTSSAthleteMetrics = {
    total: sundayMetrics,
    bike: projectMetrics(athlete.bike_metrics.ctl, athlete.bike_metrics.atl, daysToSunday),
    run: projectMetrics(athlete.run_metrics.ctl, athlete.run_metrics.atl, daysToSunday)
  };
}
```

### Option 2: Calculate Projections in Backend (BETTER)
Add projection logic to `/api/coach/athlete/:athleteId`:

```javascript
// In the response, add projected metrics
{
  "metrics": {
    "current": {
      "total": { "ctl": 82, "atl": 94, "tsb": -12 },
      "date": "2026-01-09"
    },
    "projected": {
      "coming_sunday": {
        "date": "2026-01-12",
        "total": { "ctl": 80.5, "atl": 88.2, "tsb": -7.7 },
        "bike": { "ctl": 44.2, "atl": 51.3, "tsb": -7.1 },
        "run": { "ctl": 29.1, "atl": 32.8, "tsb": -3.7 }
      },
      "mid_week_wednesday": {
        "date": "2026-01-15",
        "total": { "ctl": 79.3, "atl": 81.5, "tsb": -2.2 },
        "bike": { "ctl": 43.5, "atl": 47.2, "tsb": -3.7 },
        "run": { "ctl": 28.5, "atl": 30.1, "tsb": -1.6 }
      }
    }
  }
}
```

## Sport-Specific Projections

**CRITICAL**: Each sport needs its own projection:

### Current (2026-01-09):
```
TOTAL: CTL 82  | ATL 94  | TSB -12
BIKE:  CTL 45  | ATL 55  | TSB -10
RUN:   CTL 30  | ATL 35  | TSB -5
```

### Projected to Sunday (2026-01-12) with no workouts:
```
TOTAL: CTL 80.5 | ATL 88.2 | TSB -7.7
BIKE:  CTL 44.2 | ATL 51.3 | TSB -7.1
RUN:   CTL 29.1 | ATL 32.8 | TSB -3.7
```

### Projected to Wednesday (2026-01-15) with no workouts:
```
TOTAL: CTL 79.3 | ATL 81.5 | TSB -2.2
BIKE:  CTL 43.5 | ATL 47.2 | TSB -3.7
RUN:   CTL 28.5 | ATL 30.1 | TSB -1.6
```

## Summary

### ❌ Current Behavior (WRONG):
- Showing **CURRENT** CTL/ATL from 2026-01-09
- Labels say "Coming Sunday" but values are from YESTERDAY
- No projection calculation happening

### ✅ Required Behavior (CORRECT):
- Show **PROJECTED** CTL/ATL for Coming Sunday
- Show **PROJECTED** TSB for Mid-week Wednesday
- Calculate using Angela Engine v5.1 EWMA formulas (TAU_CTL=42, TAU_ATL=7)
- Apply to TOTAL and per-sport (BIKE, RUN)

### Implementation Priority:
**HIGHEST** - TSS Planner cannot work correctly without projected values. Coach needs to know where athlete WILL BE, not where they ARE NOW.

---

**Date**: 2026-01-10
**Status**: ❌ Bug identified - TSS Planner showing current values instead of projected values
**Action Required**: Add projection calculation before populating TSS Planner inputs
