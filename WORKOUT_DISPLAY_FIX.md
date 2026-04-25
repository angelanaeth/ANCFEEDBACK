# WORKOUT DISPLAY FIX - COMPLETE ✅

## Problem
- **Recent Workouts** section was showing incorrect/unreliable data
- No clear indication of sync status
- Future planned workouts were not displayed for the upcoming week

## Solution Implemented

### Backend Changes (`/api/gpt/fetch`)
1. **Added `recent_completed_workouts`** field
   - Last 10 completed workouts
   - Sorted by date DESC (most recent first)
   - Filters only completed workouts with valid dates
   - Confirms sync is working properly

2. **Added `next_week_planned_workouts`** field
   - Workouts planned for upcoming Monday through Sunday
   - Uses `getNextWeekRange()` helper function
   - Filters from existing `future_planned_workouts` data
   - Shows what athlete has planned for next week

### Frontend Changes (`coach.html`)

#### Section 7: Recent Workouts (Last 10 Completed)
- **Clear title** indicating "Last 10 Completed" workouts
- **Success icon** (green checkmark) to indicate completed status
- **Help text** explaining purpose: "Showing the last 10 completed workouts to confirm sync status"
- **Enhanced table** with better styling:
  - Date (bold)
  - Sport icon + name
  - Title
  - Duration
  - TSS (badge)
  - IF
- **Empty state** with warning: "No completed workouts found. Sync may be incomplete."

#### Section 7b: Future Planned Workouts (Next Mon-Sun)
- **Clear title** indicating "Next Mon-Sun" scope
- **Calendar icon** (info blue) for planned status
- **Help text** explaining: "Showing planned workouts for upcoming Monday through Sunday"
- **Enhanced table** with:
  - Date (bold)
  - Sport icon + name
  - Title
  - Duration
  - TSS (info badge)
  - Status (warning badge: "Planned")
- **Empty state**: "No workouts planned for next week (Mon-Sun)."

## Test Results

### Athlete 427194
- **Recent Completed Workouts**: ✅ 10 workouts found
  - 2026-01-11: Swim, Run, Bike (TSS: 70, 45, 138)
  - 2026-01-10: Bike, Swim (TSS: 291, 25)
  - Showing most recent first ✅

- **Next Week Planned**: ✅ 11 workouts found
  - 2026-01-12 to 2026-01-18
  - Monday-Sunday range ✅
  - Sports: Bike, Swim, Other
  - All marked as "Planned" ✅

## How to Verify

### Dashboard Test
1. Go to https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
2. Select any athlete
3. Expand "Recent Workouts (Last 10 Completed)" accordion
   - Should see last 10 workouts with completion dates
   - Most recent should be at top
4. Expand "Future Planned Workouts (Next Mon-Sun)" accordion
   - Should see workouts for upcoming Monday-Sunday
   - All should be marked "Planned"

### API Test
```bash
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id":"427194","start_date":"2025-10-12","end_date":"2026-01-11"}' \
  | jq '{
    recent: .recent_completed_workouts | length,
    next_week: .next_week_planned_workouts | length,
    recent_dates: [.recent_completed_workouts[]?.date],
    next_week_dates: [.next_week_planned_workouts[]?.date]
  }'
```

Expected output:
```json
{
  "recent": 10,
  "next_week": 11,
  "recent_dates": ["2026-01-11", "2026-01-11", "2026-01-11", "2026-01-10", ...],
  "next_week_dates": ["2026-01-12", "2026-01-12", "2026-01-13", "2026-01-14", ...]
}
```

## Files Modified
- `src/index.tsx` - Backend API changes
  - Added `recent_completed_workouts` logic (line ~4830)
  - Added `next_week_planned_workouts` logic (line ~4850)
  - Uses existing `getNextWeekRange()` helper

- `public/static/coach.html` - Frontend display changes
  - Updated Section 7: Recent Workouts (line ~731)
  - Added Section 7b: Future Planned Workouts (line ~770)
  - Enhanced styling and empty states

## Commit
- Hash: `30df169`
- Message: "FIX: Recent Workouts now shows last 10 completed + Next Week Planned (Mon-Sun)"

## Status
✅ **COMPLETE AND WORKING**

Both sections now show:
- **Real data** from TrainingPeaks
- **Clear scope** (last 10 completed, next Mon-Sun planned)
- **Sync confirmation** (presence of completed workouts confirms sync)
- **Future planning** (athletes can see what's planned for next week)

## Next Steps (Optional Enhancements)
1. Add sync timestamp to section headers
2. Add "Refresh" button for on-demand sync
3. Add TSS totals for next week
4. Color-code workouts by intensity
5. Add expandable rows for workout details
