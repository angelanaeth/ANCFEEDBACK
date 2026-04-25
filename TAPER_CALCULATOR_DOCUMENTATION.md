# Taper Calculator - Complete Documentation

## Overview
The Taper Calculator generates a scientifically-based training reduction plan to optimize race-day performance by managing the balance between fitness (CTL), fatigue (ATL), and form (TSB).

---

## Core Concepts

### 1. Training Metrics

#### CTL (Chronic Training Load) - "Fitness"
- **Definition**: Long-term training load representing aerobic fitness
- **Time Constant**: 42 days (slow-changing)
- **Calculation**: Exponentially Weighted Moving Average (EWMA)
- **Formula**: `CTL[today] = CTL[yesterday] + (TSS[today] - CTL[yesterday]) / 42`
- **Interpretation**: 
  - Higher CTL = More fitness
  - CTL of 80 = Well-trained athlete
  - CTL of 100+ = Very fit athlete

#### ATL (Acute Training Load) - "Fatigue"
- **Definition**: Short-term training load representing recent fatigue
- **Time Constant**: 7 days (fast-changing)
- **Calculation**: Exponentially Weighted Moving Average (EWMA)
- **Formula**: `ATL[today] = ATL[yesterday] + (TSS[today] - ATL[yesterday]) / 7`
- **Interpretation**:
  - Higher ATL = More fatigued
  - ATL close to CTL = Maintaining normal training
  - ATL >> CTL = Overreaching/fatigued

#### TSB (Training Stress Balance) - "Form"
- **Definition**: The balance between fitness and fatigue
- **Formula**: `TSB = CTL - ATL`
- **Interpretation**:
  - **Negative TSB** (-30 to -10): Fatigued but building fitness
    - TSB < -30: Very fatigued, need recovery
    - TSB -25 to -10: Productive fatigue range
  - **Neutral TSB** (-10 to +10): Balanced state
    - TSB -10 to -5: Optimal race-day range (slightly fresh, fit retained)
    - TSB 0 to +5: Fresh but maintaining fitness
  - **Positive TSB** (+10 to +25): Fresh/rested
    - TSB +10 to +20: Well-rested, good for racing
    - TSB > +25: Risk of detraining (too much rest)

#### TSS (Training Stress Score)
- **Definition**: Daily training stress from workouts
- **Unit**: Arbitrary points representing workout difficulty
- **Typical Values**:
  - Easy 1-hour ride: 40-50 TSS
  - Hard 1-hour ride: 80-100 TSS
  - Long endurance ride (3 hours): 150-200 TSS

---

## Taper Calculation Logic

### Input Parameters

1. **Race Information**
   - Race Name (required)
   - Race Date (required)
   - Race Distance (required) - determines default taper length

2. **Current Training Load**
   - Current CTL (required)
   - Current ATL (optional, defaults to CTL - 20)
   - Current TSB (optional, calculated as CTL - ATL)
   - Weeks Trained (required)

3. **Taper Preferences**
   - Taper Length (auto or manual: 1-3 weeks)
   - Goal TSB on Race Day (default: -10)

---

## Calculation Steps

### Step 1: Determine Taper Length

#### Default Taper Length by Race Distance
```javascript
const taperLengthGuidelines = {
    'sprint': 1,           // Sprint triathlon: 1 week
    'olympic': 1,          // Olympic triathlon: 1 week
    '70.3': 2,             // Half Ironman: 2 weeks
    'ironman': 3,          // Ironman: 3 weeks
    'marathon': 3,         // Marathon: 3 weeks
    'half-marathon': 2,    // Half marathon: 2 weeks
    '10k': 1               // 10K: 1 week
};
```

#### Adjustment for Fatigue State
```javascript
// If athlete is very fatigued (TSB < -30), add 1 week to taper
if (currentTSB < -30) {
    taperWeeks = Math.min(taperWeeks + 1, 3); // Max 3 weeks
}
```

**Logic**: Athletes with very negative TSB need extra recovery time to reach optimal race-day form.

---

### Step 2: Calculate Volume Reduction Targets

#### Volume Reduction by Taper Week
```javascript
const volumeReductionByWeek = {
    1: [0.50],              // 1-week taper: Week -1 = 50% of normal
    2: [0.70, 0.40],        // 2-week taper: Week -2 = 70%, Week -1 = 40%
    3: [0.80, 0.60, 0.35]   // 3-week taper: Week -3 = 80%, Week -2 = 60%, Week -1 = 35%
};
```

**Example (3-week taper):**
- Week -3 (3 weeks before race): Train at 80% of normal volume
- Week -2 (2 weeks before race): Train at 60% of normal volume
- Week -1 (race week): Train at 35% of normal volume

#### Calculate Weekly TSS Targets
```javascript
// Estimate normal weekly TSS from CTL
const normalWeeklyTSS = currentCTL * 7;

// Example: CTL = 80
// normalWeeklyTSS = 80 * 7 = 560 TSS/week

// Apply volume reductions
const weeklyTSSTargets = volumeReductions.map(reduction => 
    Math.round(normalWeeklyTSS * reduction)
);

// Example (3-week taper, CTL = 80):
// Week -3: 560 * 0.80 = 448 TSS
// Week -2: 560 * 0.60 = 336 TSS
// Week -1: 560 * 0.35 = 196 TSS
```

#### Calculate Daily TSS for Each Week
```javascript
const dailyTSSByWeek = weeklyTSSTargets.map(weeklyTSS => 
    Math.round(weeklyTSS / 7)
);

// Example (3-week taper):
// Week -3: 448 / 7 = 64 TSS/day
// Week -2: 336 / 7 = 48 TSS/day
// Week -1: 196 / 7 = 28 TSS/day
```

---

### Step 3: Simulate CTL/ATL/TSB Progression

For each day of the taper, calculate new CTL, ATL, and TSB:

```javascript
let ctl = currentCTL;
let atl = currentATL;
const tsbProgression = [currentTSB];
const ctlProgression = [currentCTL];

for (let week = 0; week < taperWeeks; week++) {
    for (let day = 0; day < 7; day++) {
        const dailyTSS = dailyTSSByWeek[week];
        
        // Update CTL (42-day time constant)
        ctl = ctl + (dailyTSS - ctl) / 42;
        
        // Update ATL (7-day time constant)
        atl = atl + (dailyTSS - atl) / 7;
        
        // Calculate TSB
        const tsb = ctl - atl;
        
        // Store progression
        tsbProgression.push(tsb);
        ctlProgression.push(ctl);
    }
}
```

#### Example Calculation (Starting Values)
**Day 0 (Today - Start of Taper):**
- CTL = 80
- ATL = 60
- TSB = 80 - 60 = 20

**Day 1 (First day of taper, 64 TSS):**
- CTL = 80 + (64 - 80) / 42 = 80 + (-16/42) = 80 - 0.38 = 79.62
- ATL = 60 + (64 - 60) / 7 = 60 + (4/7) = 60 + 0.57 = 60.57
- TSB = 79.62 - 60.57 = 19.05

**Day 2 (Second day, 64 TSS):**
- CTL = 79.62 + (64 - 79.62) / 42 = 79.62 - 0.37 = 79.25
- ATL = 60.57 + (64 - 60.57) / 7 = 60.57 + 0.49 = 61.06
- TSB = 79.25 - 61.06 = 18.19

**Pattern:**
- CTL decreases SLOWLY (42-day time constant)
- ATL decreases FASTER (7-day time constant)
- TSB gradually INCREASES (becomes less negative / more positive)

**Day 21 (Race Day after 3-week taper):**
- CTL ≈ 75 (lost ~5 points of fitness)
- ATL ≈ 30 (lost ~30 points of fatigue)
- TSB ≈ 45 (very fresh, but might be TOO fresh)

---

### Step 4: Generate Daily Workout Plans

#### Week -1 (Race Week) - FINAL WEEK
```javascript
{
    day: 'Monday',
    tss: dailyTSS * 1.2,  // Slightly more than average
    description: 'Easy spin/run. 30-40 min Z1-Z2. Stay loose.'
},
{
    day: 'Tuesday',
    tss: dailyTSS * 1.3,  // Brief intensity
    description: 'Short intervals. 4-5 x 1 min @ race pace, full recovery. Total 30-40 min.'
},
{
    day: 'Wednesday',
    tss: dailyTSS * 0.8,  // Light
    description: 'Easy swim + easy bike or run. 20-30 min each. Very light.'
},
{
    day: 'Thursday',
    tss: dailyTSS * 0.6,  // Very light
    description: 'Pre-race shakeout. 15-20 min easy + 3-5 x 20sec pickups.'
},
{
    day: 'Friday',
    tss: 0,  // REST
    description: 'REST. Travel day if needed. Hydrate, fuel, sleep.'
},
{
    day: 'Saturday',
    tss: dailyTSS * 0.5,  // Optional light
    description: 'Optional 15 min easy spin/jog + 3 x 20sec race pace. Check gear.'
},
{
    day: 'Sunday',
    tss: 0,  // RACE DAY
    description: 'RACE DAY! Trust your training. Execute your plan.'
}
```

**Multipliers Rationale:**
- Early week (Mon-Wed): Slightly higher TSS to maintain sharpness
- Mid-week (Thu-Fri): Minimal TSS to maximize freshness
- Day before race (Sat): Very light with race-pace reminders
- Race day (Sun): 0 TSS (race itself not counted in taper)

#### Week -2 (2 Weeks Out) - MODERATE REDUCTION
```javascript
{
    day: 'Monday',
    tss: dailyTSS * 0.8,
    description: 'Recovery day. Easy 30-40 min Z1-Z2.'
},
{
    day: 'Tuesday',
    tss: dailyTSS * 1.4,  // Key workout
    description: 'Key session. Race pace intervals with good recovery. Maintain intensity.'
},
{
    day: 'Wednesday',
    tss: dailyTSS * 1.0,
    description: 'Moderate session. 45-60 min Z2-Z3.'
},
{
    day: 'Thursday',
    tss: dailyTSS * 1.2,  // Quality work
    description: 'Threshold work. 2-3 x 8-10 min @ FTP/threshold. Quality over quantity.'
},
{
    day: 'Friday',
    tss: dailyTSS * 0.8,
    description: 'Easy recovery. 30-40 min Z1.'
},
{
    day: 'Saturday',
    tss: dailyTSS * 1.4,  // Reduced long workout
    description: 'Long-ish but reduced. 60-70% of normal long workout.'
},
{
    day: 'Sunday',
    tss: dailyTSS * 0.4,
    description: 'Easy active recovery. 20-30 min Z1.'
}
```

**Multipliers Rationale:**
- Maintain intensity but reduce volume
- Key workouts (Tue, Thu, Sat) still present but shorter
- Recovery days more prominent

#### Week -3 (3 Weeks Out) - SLIGHT REDUCTION
```javascript
{
    day: 'Monday',
    tss: dailyTSS * 0.6,
    description: 'Easy recovery. 30-45 min Z1-Z2.'
},
{
    day: 'Tuesday',
    tss: dailyTSS * 1.5,  // Last big workout
    description: 'Last big interval session. Race specificity. Quality focus.'
},
{
    day: 'Wednesday',
    tss: dailyTSS * 1.0,
    description: 'Moderate endurance. 60-75 min Z2-Z3.'
},
{
    day: 'Thursday',
    tss: dailyTSS * 1.3,
    description: 'Tempo or sweet spot. 3-4 x 10-12 min. Maintain power/pace.'
},
{
    day: 'Friday',
    tss: dailyTSS * 0.8,
    description: 'Easy day. 40-50 min Z1-Z2.'
},
{
    day: 'Saturday',
    tss: dailyTSS * 1.5,  // Last long workout
    description: 'Last long workout. 75-80% of peak volume. Race simulation.'
},
{
    day: 'Sunday',
    tss: dailyTSS * 0.3,
    description: 'Easy recovery or rest. 20-30 min Z1 or off.'
}
```

**Multipliers Rationale:**
- Still includes solid training (Tue, Thu, Sat)
- Beginning volume reduction but maintaining quality
- Last "big" week before aggressive taper

---

## Output Metrics

### 1. Taper Duration
- Number of weeks selected (1-3)
- Based on race distance or manual selection

### 2. Total Volume Reduction
```javascript
volume_reduction_percent = (1 - volumeReductions[last_week]) * 100
```
- 1-week taper: 50% reduction
- 2-week taper: 60% reduction (last week = 0.40)
- 3-week taper: 65% reduction (last week = 0.35)

### 3. Race Day CTL
- Final CTL value from progression simulation
- Expected to drop by 5-10% from starting CTL

### 4. Race Day TSB
- Final TSB value from progression simulation
- Target range: -5 to -15 (slightly fresh, fitness retained)

### 5. TSB Progression Chart
Shows TSB at key milestones:
- Day 0: Today (starting TSB)
- Day 7: 1 week into taper
- Day 14: 2 weeks into taper (if applicable)
- Day 21: 3 weeks into taper (if applicable)
- Race Day: Final TSB

---

## Taper Principles (Displayed in UI)

### Key Guidelines:
1. **Maintain Intensity**: Keep workout intensity high, drastically reduce volume
2. **Preserve Frequency**: Continue regular training sessions, just shorter
3. **Listen to Your Body**: If fatigued, reduce more. If restless, add short sessions
4. **Final Week**: Minimal training 4-5 days before race. Day before: 15-20 min easy + 3-5 x 20sec pickups
5. **Nutrition**: Increase carbs by 10-20% in final 2-3 days. Stay hydrated
6. **Sleep**: Prioritize 8+ hours. Go to bed earlier than usual
7. **Trust the Taper**: Feeling sluggish in week 1-2 is normal. You'll feel sharp race week

---

## Save to Profile Feature

### API Endpoint
```
POST /api/coach/athlete/{athleteId}/race-note
```

### Request Body
```javascript
{
    note_type: 'taper_plan',
    race_name: 'Ironman Arizona 2026',
    content: {
        race_name: 'Ironman Arizona 2026',
        race_date: '2026-11-15',
        race_distance: 'ironman',
        taper_weeks: 3,
        current_training_load: {
            ctl: 80,
            atl: 60,
            tsb: 20,
            weeks_trained: 16
        },
        taper_plan: {
            weekly_tss_targets: [448, 336, 196],
            daily_tss_by_week: [64, 48, 28],
            volume_reduction_percent: 65,
            race_day_ctl: '75.3',
            race_day_tsb: '-8.2',
            goal_tsb: -10
        },
        tsb_progression: [...],
        ctl_progression: [...],
        weekly_plan: [...]
    }
}
```

---

## Known Issues / Potential Problems

### 1. TSB Display with Hyphen
- **Current**: Shows "-5" with negative sign
- **Issue**: User might interpret hyphen as dash, not negative
- **Solution Needed**: Add clarification or change display format

### 2. CTL Estimation
- **Current**: Assumes `normalWeeklyTSS = CTL * 7`
- **Issue**: This is a rough estimate. Actual weekly TSS varies
- **Problem**: If athlete's actual weekly TSS is different, projections will be off
- **Better Approach**: Ask for average weekly TSS from last 4 weeks

### 3. ATL Default Value
- **Current**: If not provided, defaults to `CTL - 20`
- **Issue**: This is arbitrary and might not reflect actual fatigue state
- **Problem**: TSB calculation will be inaccurate if ATL default is wrong

### 4. Race Day TSB Target Range
- **Current**: Options range from -5 to -15
- **Issue**: Optimal TSB varies by athlete and race type
- **Missing**: No guidance on which target to choose
- **Consideration**: 
  - Longer races (Ironman): -5 to -8 (need to be fresher)
  - Shorter races (Olympic): -10 to -15 (can handle more fatigue)

### 5. Taper Might Be Too Aggressive
- **Current**: Final week is only 35-40% of normal volume
- **Issue**: Some athletes perform better with less aggressive taper
- **Missing**: No personalization for taper sensitivity

### 6. Daily TSS Multipliers Are Fixed
- **Current**: Each day has a fixed multiplier (e.g., Tuesday = 1.4x)
- **Issue**: Doesn't account for athlete preferences or sport distribution
- **Missing**: Swim/Bike/Run breakdown

### 7. No Integration with Actual Training Data
- **Current**: All calculations are theoretical projections
- **Issue**: Not using actual workout data from TrainingPeaks
- **Better**: Pull actual CTL/ATL/TSB from TrainingPeaks API

### 8. Race Day TSB Might Be Too High
- **Current**: Simulation often results in TSB around +40 to +50 by race day
- **Issue**: This indicates over-tapering (too much rest, fitness loss)
- **Problem**: Volume reduction might be too aggressive
- **Example**: 3-week taper with 35% final week often overshoots target TSB

---

## Formulas Summary

### Core Formulas
```
CTL[t] = CTL[t-1] + (TSS[t] - CTL[t-1]) / 42
ATL[t] = ATL[t-1] + (TSS[t] - ATL[t-1]) / 7
TSB[t] = CTL[t] - ATL[t]
```

### Taper Calculations
```
Normal Weekly TSS = CTL × 7
Target Weekly TSS = Normal Weekly TSS × Volume Reduction Factor
Daily TSS = Target Weekly TSS / 7
Specific Day TSS = Daily TSS × Day Multiplier
```

### Volume Reduction Factors
```
1 week:  [0.50]
2 weeks: [0.70, 0.40]
3 weeks: [0.80, 0.60, 0.35]
```

### Day Multipliers (Race Week Example)
```
Monday:    1.2
Tuesday:   1.3
Wednesday: 0.8
Thursday:  0.6
Friday:    0.0
Saturday:  0.5
Sunday:    0.0 (Race)
```

---

## Example Full Calculation

### Inputs
- Race: Ironman Arizona 2026
- Race Date: 2026-11-15
- Race Distance: Ironman
- Current CTL: 80
- Current ATL: 60
- Current TSB: 20
- Weeks Trained: 16
- Taper Length: Auto (→ 3 weeks for Ironman)
- Goal TSB: -10

### Step-by-Step

**1. Determine Taper Length**
- Race distance = Ironman → 3 weeks
- TSB = 20 (not < -30) → No adjustment
- Final taper: 3 weeks

**2. Calculate Volume Targets**
- Normal Weekly TSS = 80 × 7 = 560 TSS
- Week -3 TSS = 560 × 0.80 = 448 TSS (64/day)
- Week -2 TSS = 560 × 0.60 = 336 TSS (48/day)
- Week -1 TSS = 560 × 0.35 = 196 TSS (28/day)

**3. Simulate Day-by-Day (First 3 days)**

Day 0: CTL=80, ATL=60, TSB=20

Day 1 (Week -3, 64 TSS):
- CTL = 80 + (64-80)/42 = 79.62
- ATL = 60 + (64-60)/7 = 60.57
- TSB = 19.05

Day 2 (Week -3, 64 TSS):
- CTL = 79.62 + (64-79.62)/42 = 79.25
- ATL = 60.57 + (64-60.57)/7 = 61.06
- TSB = 18.19

Day 3 (Week -3, 64 TSS):
- CTL = 79.25 + (64-79.25)/42 = 78.89
- ATL = 61.06 + (64-61.06)/7 = 61.48
- TSB = 17.41

... continues for 21 days ...

Day 21 (Race Day):
- CTL ≈ 75.3
- ATL ≈ 32.1
- TSB ≈ 43.2 ❌ PROBLEM: Target was -10, got +43.2!

**4. Issue Identified**
The taper is TOO AGGRESSIVE. TSB becomes very positive, indicating:
- Over-resting
- Potential fitness loss
- Not hitting the target TSB of -10

---

## Conclusion

This documentation provides the complete logic, formulas, and calculations behind the Taper Calculator. Review this and tell me what changes you'd like to make!
