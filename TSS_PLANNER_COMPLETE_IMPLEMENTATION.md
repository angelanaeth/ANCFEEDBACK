# ✅ CONFIRMED: TSS Planner Complete Implementation Requirements

## From Your Provided Code (Echo-devo.zip)

### Current TSS Planner Flow (What You Gave Me):

#### Step 1: Calculate Recommendation
**Endpoint**: `POST /api/training-stress-recommendation`

**Input**:
- athlete_id
- sport_type (bike/run)
- block_type (base_durability, build_th, vo2_max, specificity, hybrid)
- key_workouts
- soreness, mood_irritability, sleep, hrv_rhr, motivation
- life_stress
- orthopedic_flags (run only)

**Process**:
1. Fetch workouts from TrainingPeaks (90 days history + future to Sunday)
2. Calculate CTL/ATL/TSB using EWMA (TAU_CTL=42, TAU_ATL=7)
3. Compute derived metrics:
   - echo_estimate = (7 * ctl_sunday) / 0.965
   - eow_tsb = ctl_sunday - atl_sunday
   - tsb_slope_5d = (wtsb - eow_tsb) / 5
   - atl_ctl_ratio = atl_sunday / ctl_sunday
4. Score using BLOCK_CONFIGS:
   - atl_ctl_score
   - tsb_trend_score
   - eow_tsb_score
   - workout_execution_score
   - subjective_score
   - life_stress_score
   - orthopedic_score (run only)
5. Find recommendation from training_stress_recommendation_scale
6. Calculate low_change and high_change percentages

**Output**:
```json
{
  "status": "ok",
  "ctl": 132,
  "atl": 125,
  "wtsb": -10,
  "echo_estimate": 132,
  "eow_tsb": 7,
  "tsb_slope_5d": -3.4,
  "atl_ctl_ratio": 0.9469,
  "overall_score": 5,
  "recommendation": "increase_a_little",
  "percentage_change": 7,
  "coming_sunday": "2026-01-12",
  "mid_week_wednesday": "2026-01-15",
  "low_change": 1.05,
  "high_change": 1.1
}
```

#### Step 2: Calculate TSS Range
**UI Action**: "Calculate Training Stress Range" button

**Process**:
1. Take echo_estimate (or custom value)
2. Apply low_change and high_change multipliers
3. Display range: low_tss = echo * low_change, high_tss = echo * high_change

**Output**:
```
Echo Estimate: 132
Recommended TSS Range: 139 - 145
```

#### Step 3: Post Workouts
**Endpoint**: `POST /api/fetch-tss-workout-options` (to fetch from Google Sheets)
**Endpoint**: `POST /api/coach/athlete/:athleteId/workout` (to post to TrainingPeaks)

**UI Fields**:
- Block Type (from Step 1)
- Sport (from Step 1)
- TSS Value (dropdown from Google Sheets options)
- Frequency (dropdown from Google Sheets)
- Intensity (dropdown from Google Sheets)
- Start Date (date picker)
- "Post Workout" button

**Process**:
1. Fetch workout options from Google Sheets based on sport/block/TSS
2. User selects TSS, frequency, intensity
3. System retrieves week of workouts from Google Sheets
4. User clicks "Post Workout"
5. System posts full week of workouts to TrainingPeaks calendar

## What's Currently Missing in My Implementation

### ❌ Missing Components:

1. **Real TSS Recommendation Calculation**
   - Current: Stub endpoint returning hardcoded values
   - Needed: Full Angela Engine calculation with BLOCK_CONFIGS

2. **Echo Estimate Display**
   - Current: Not shown
   - Needed: Display "Echo Estimate Value (Calculated: 132)"

3. **TSS Range Calculation**
   - Current: Not implemented
   - Needed: "Calculate Training Stress Range" button

4. **Google Sheets Integration**
   - Current: Not integrated
   - Needed: Fetch workout options from Google Sheets

5. **Step 3: Post Workouts UI**
   - Current: Only basic "Post Workout" with single workout
   - Needed: Full UI with TSS/Frequency/Intensity dropdowns

6. **Week of Workouts Posting**
   - Current: Post single workout
   - Needed: Post entire week of workouts from Google Sheets

## Implementation Plan

### Phase 1: Fix TSS Recommendation Endpoint ✅ CRITICAL

**File**: `/home/user/webapp/src/index.tsx`
**Current** (line 2059):
```typescript
app.post('/api/training-stress-recommendation', async (c) => {
  const data = await c.req.json()
  
  return c.json({
    status: 'ok',
    recommendation: 'increase_a_little',
    percentage_change: 5,
    ctl: 85,
    atl: 72,
    tsb: -10,
    echo_estimate: 620
  })
})
```

**Needed**: Full implementation with:
- BLOCK_CONFIGS constant
- Workout fetching from TrainingPeaks
- CTL/ATL/TSB calculation using EWMA
- Scoring logic
- Recommendation lookup
- Echo estimate calculation

### Phase 2: Update TSS Planner Frontend ✅ CRITICAL

**File**: `/home/user/webapp/public/static/tss_planner.js`

**Add**:
1. Display Echo Estimate after Step 1
2. Add "Calculate Training Stress Range" button
3. Calculate and display TSS range (low - high)
4. Update Step 3 UI to match provided screenshot

### Phase 3: Google Sheets Integration ⏳ PENDING

**Endpoint**: `POST /api/fetch-tss-workout-options`

**Need**:
- Google Sheets API credentials
- Spreadsheet ID and configuration
- Parse workout data from sheets

### Phase 4: Week of Workouts Posting ⏳ PENDING

**Update**: `POST /api/coach/athlete/:athleteId/workout`

**Add**:
- Accept array of workouts instead of single workout
- Loop and post each workout with proper date offset
- Return summary of posted workouts

## Google Sheets Structure (From Your Code)

**Expected Spreadsheet Config**:
```python
{
  "bike": {
    "base_durability": {
      "spreadsheet_id": "...",
      "sheet_name": "Bike Base",
      "range": "A1:Z100"
    },
    "build_th": {...},
    "vo2_max": {...},
    ...
  },
  "run": {
    "base_durability": {...},
    ...
  }
}
```

**Expected Data Format**:
- TSS values (e.g., 350, 400, 450, 500)
- Frequencies (e.g., 3x/week, 4x/week, 5x/week)
- Intensities (e.g., Easy, Moderate, Hard)
- Workout details for each combination

## Current Status

### ✅ What's Working:
- Multi-tenant authentication
- Per-athlete dashboards
- Sport-specific CTL/ATL/TSB (projected to Sunday)
- TSS Planner modal opens
- Basic form inputs (Step 1)
- Sport selection (BIKE/RUN)

### ❌ What's NOT Working:
- TSS recommendation calculation (stub only)
- Echo estimate not displayed
- No TSS range calculation
- No Google Sheets integration
- Step 3 UI incomplete
- Can't post week of workouts

## Next Steps (Priority Order)

1. **Implement TSS Recommendation Calculation** (HIGHEST PRIORITY)
   - Port BLOCK_CONFIGS to TypeScript
   - Implement full calculation logic
   - Return proper response with echo_estimate

2. **Update TSS Planner UI**
   - Display Echo Estimate
   - Add "Calculate TSS Range" button
   - Show recommended range (139 - 145)

3. **Build Step 3 UI**
   - TSS dropdown (from sheets)
   - Frequency dropdown
   - Intensity dropdown
   - "Post Workout" button

4. **Google Sheets Integration**
   - Setup sheets API
   - Fetch workout options
   - Parse and return structured data

5. **Week of Workouts Posting**
   - Modify workout post endpoint
   - Accept array of workouts
   - Post full week to TrainingPeaks

## Confirmation

Based on your uploaded code (Echo-devo.zip) and screenshot, I can confirm:

✅ **TSS Planner Flow**:
1. Step 1: Calculate Recommendation → Returns echo_estimate
2. Step 2: Calculate TSS Range → Shows range based on echo_estimate
3. Step 3: Post Workouts → Fetch from Google Sheets, post week to TrainingPeaks

✅ **Current Implementation Status**:
- Step 1: Partial (form exists, calculation missing)
- Step 2: Missing
- Step 3: Partial (basic post exists, Google Sheets missing)

✅ **What You Already Gave Me**:
- Complete BLOCK_CONFIGS for bike and run
- Full scoring logic
- Echo estimate formula
- TSS range calculation method
- Google Sheets structure

## Questions Before Implementation

1. **Google Sheets API**: Do you have API credentials ready?
2. **Spreadsheet ID**: What's the Google Sheet ID for workouts?
3. **Sheet Names**: What are the exact sheet names for each sport/block combo?
4. **Data Format**: Can you confirm the column structure in sheets?

---

**Status**: Ready to implement once Google Sheets credentials are provided
**Priority**: HIGH - TSS Planner is core functionality
**Estimated Time**: 4-6 hours for full implementation
