# Wellness & Recovery Integration - Complete

## ✅ Implementation Status: COMPLETE

### What Was Added

**New Section 8: Wellness & Recovery** - Added to the athlete dashboard accordion

### Features Implemented

#### 1. **Current Day Wellness Metrics** (When Data Exists)
Displays 4 key wellness cards:

- **HRV (Heart Rate Variability)**
  - Shows RMSSD value in milliseconds
  - Color-coded status: Optimal (≥1.1x baseline), Normal (0.8-1.1x), Low (0.7-0.8x), Critical (<0.7x)
  - Status badge with interpretation

- **Sleep**
  - Hours of sleep (e.g., 7.5h)
  - Sleep quality score (0-100)
  - Color-coded: Green (≥7.5hrs), Blue (6.5-7.5hrs), Yellow (5.5-6.5hrs), Red (<5.5hrs)

- **Wellness Score**
  - Composite score (0-100) based on mood, energy, fatigue
  - Color-coded: Green (≥75), Blue (60-75), Yellow (45-60), Red (<45)

- **Readiness Status**
  - Overall training readiness: Optimal, Ready, Normal, Caution, Critical
  - Color-coded based on status

#### 2. **Subjective Metrics Progress Bars**
Visual representation of 6 subjective ratings (1-10 scale):
- **Mood** (Blue)
- **Energy** (Green)
- **Fatigue** (Yellow/Warning)
- **Muscle Soreness** (Red/Danger)
- **Stress Level** (Yellow/Warning)
- **Motivation** (Blue/Primary)

#### 3. **30-Day Wellness Trends**
Shows rolling averages when data exists:
- Average HRV (RMSSD in ms)
- Average Sleep (hours)
- Average Wellness Score (0-100)

#### 4. **Notes Section**
Displays athlete's wellness notes if provided

#### 5. **No Data State**
When no wellness data exists:
- Clear messaging: "No Wellness Data Yet"
- Call-to-action button: "Log Wellness Data" → Links to wellness page
- Educational content: "Why Track Wellness?"
- Benefits explained:
  - HRV indicates autonomic nervous system recovery
  - Sleep essential for adaptation
  - Subjective metrics guide training intensity
  - Readiness optimizes training load

### Backend Changes

#### API Endpoint Enhanced: `/api/gpt/fetch`
Now includes wellness data in response:

```json
{
  "wellness": {
    "latest": {
      "date": "2026-01-11",
      "hrv_rmssd": 65,
      "hrv_baseline": 60,
      "hrv_ratio": 1.08,
      "hrv_status": "normal",
      "sleep_hours": 7.5,
      "sleep_quality": 8,
      "sleep_score": 87,
      "mood": 7,
      "energy": 8,
      "fatigue": 4,
      "muscle_soreness": 3,
      "stress_level": 5,
      "motivation": 8,
      "wellness_score": 72,
      "readiness_status": "ready",
      "notes": "Feeling good today"
    },
    "history": [...], // Last 30 days
    "summary": {
      "hrv_avg": 63,
      "sleep_avg": 7.2,
      "wellness_avg": 68
    }
  }
}
```

#### Database Integration
- Fetches wellness data from `wellness_data` table
- Joins with users via `user_id` → `tp_athlete_id`
- Returns last 30 days of wellness history
- Calculates 30-day rolling averages

### Frontend Changes

#### New Helper Functions
Added 4 wellness color-coding functions:

```javascript
getHRVColor(ratio)       // Success/Info/Warning/Danger based on HRV ratio
getSleepColor(hours)     // Color based on sleep duration
getWellnessColor(score)  // Color based on wellness score 0-100
getReadinessColor(status) // Color based on readiness status string
```

#### UI Components
- Accordion section (#wellness) - Collapsible like other sections
- Responsive grid layout (4 cards per row on desktop)
- Bootstrap progress bars for subjective metrics
- Alert boxes for trends and notes
- Icon integration (FontAwesome)

### Color Coding Logic

#### HRV (Heart Rate Variability Ratio)
- 🟢 **Success (Green)**: ratio ≥ 1.1 (Optimal recovery)
- 🔵 **Info (Blue)**: ratio 0.8-1.1 (Normal)
- 🟡 **Warning (Yellow)**: ratio 0.7-0.8 (Low - caution)
- 🔴 **Danger (Red)**: ratio < 0.7 (Critical - rest needed)

#### Sleep Hours
- 🟢 **Success**: ≥ 7.5 hours
- 🔵 **Info**: 6.5-7.5 hours
- 🟡 **Warning**: 5.5-6.5 hours
- 🔴 **Danger**: < 5.5 hours

#### Wellness Score (0-100)
- 🟢 **Success**: ≥ 75
- 🔵 **Info**: 60-75
- 🟡 **Warning**: 45-60
- 🔴 **Danger**: < 45

#### Readiness Status
- 🟢 **Success**: "optimal", "ready"
- 🔵 **Info**: "normal", "moderate"
- 🟡 **Warning**: "caution"
- 🔴 **Danger**: "critical", "compromised"

### Data Flow

```
User Opens Dashboard
  ↓
Select Athlete (e.g., Angela 1A - 427194)
  ↓
Frontend calls /api/gpt/fetch with athlete_id
  ↓
Backend:
  - Fetches wellness_data for user_id (last 30 days)
  - Calculates latest, history, and 30-day averages
  - Returns wellness object
  ↓
Frontend:
  - Renders Section 8: Wellness & Recovery
  - IF data exists: Shows metrics, progress bars, trends
  - IF no data: Shows "No Wellness Data Yet" with CTA
  ↓
Dashboard Displayed
```

### How to Log Wellness Data

**For Athletes:**
1. Open dashboard: `/static/coach`
2. Select athlete
3. Expand "Wellness & Recovery" section
4. Click "Log Wellness Data" button
5. Navigate to: `/static/wellness?athlete={athlete_id}`
6. Fill out wellness form:
   - HRV (RMSSD and baseline)
   - Sleep (hours and quality 1-10)
   - Subjective ratings (mood, energy, fatigue, soreness, stress, motivation)
   - Notes
7. Submit data
8. Return to dashboard to see updated metrics

**API Endpoint for Logging:**
```bash
POST /api/athlete/:athleteId/wellness
{
  "hrv_rmssd": 65,
  "hrv_baseline": 60,
  "sleep_hours": 7.5,
  "sleep_quality": 8,
  "mood": 7,
  "energy": 8,
  "fatigue": 4,
  "muscle_soreness": 3,
  "stress_level": 5,
  "motivation": 8,
  "notes": "Feeling good today"
}
```

### Testing

#### Test with No Data (Current State)
```bash
# API Test
curl -X POST http://localhost:3000/api/gpt/fetch \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "427194", "start_date": "2025-12-01", "end_date": "2026-01-10"}' \
  | jq '.wellness'

# Expected Response:
{
  "latest": null,
  "history": [],
  "summary": null
}

# Dashboard Display:
- Shows "No Wellness Data Yet" message
- Shows "Log Wellness Data" button
- Shows educational content about wellness tracking
```

#### Test with Sample Data (After Logging)
```bash
# Insert sample wellness data
cd /home/user/webapp && npx wrangler d1 execute angela-db --local --command="
INSERT INTO wellness_data (user_id, date, hrv_rmssd, hrv_baseline, hrv_ratio, hrv_status, sleep_hours, sleep_quality, sleep_score, mood, energy, fatigue, muscle_soreness, stress_level, motivation, wellness_score, readiness_status, notes)
VALUES (
  (SELECT id FROM users WHERE tp_athlete_id = '427194'),
  '2026-01-11',
  65, 60, 1.08, 'normal',
  7.5, 8, 87,
  7, 8, 4, 3, 5, 8,
  72, 'ready',
  'Feeling good today'
)"

# Then refresh dashboard - should show:
- HRV: 65 ms (Normal status, blue color)
- Sleep: 7.5h (Score: 87, green color)
- Wellness Score: 72 (blue color)
- Readiness: Ready (green color)
- Progress bars for mood (7), energy (8), fatigue (4), etc.
```

### Dashboard URL
https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach

### Files Changed
- `src/index.tsx` - Added wellness data fetching (lines 4079-4103)
- `public/static/coach.html` - Added Section 8: Wellness & Recovery (lines 748-909)
- `public/static/coach.html` - Added 4 wellness helper functions (lines 1019-1056)

### Commits
- `11f03c4` - FEAT: Add Wellness & Recovery section to athlete dashboard

### Integration Points

#### 1. Wellness Page Link
Button links to: `/static/wellness?athlete={athlete_id}`
- Existing wellness.html page allows data entry
- Auto-populates athlete selection
- Submits to POST `/api/athlete/:athleteId/wellness`

#### 2. Database Tables Used
- `wellness_data` - Stores all wellness metrics
- `users` - Links wellness to athlete via tp_athlete_id

#### 3. Future Enhancements (Optional)
- **Wellness Trends Chart**: Add Chart.js visualization for 30-day trends
- **Alerts**: Highlight when HRV drops below baseline
- **Recommendations**: Auto-generate training adjustments based on wellness
- **TrainingPeaks Sync**: Pull HRV/sleep from connected devices if available

### Summary

✅ **Wellness & Recovery section fully integrated into athlete dashboard**
✅ **Displays comprehensive wellness metrics when data exists**
✅ **Clear call-to-action when no data exists**
✅ **Color-coded visual indicators for quick assessment**
✅ **Educational content explains why wellness matters**
✅ **Ready for production use**

**Status: COMPLETE AND OPERATIONAL** 🎉

Athletes can now track and monitor:
- HRV for recovery assessment
- Sleep quantity and quality
- Subjective wellness ratings
- Overall readiness for training
- 30-day wellness trends

All integrated into the comprehensive TrainingPeaks dashboard!

---

**Last Updated**: 2026-01-11
**Version**: v5.3
**Commit**: 11f03c4
