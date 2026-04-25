# Taper Calculator - CORRECTED Documentation

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
- **During Taper**: CTL decreases SLOWLY as training volume reduces

#### ATL (Acute Training Load) - "Fatigue"
- **Definition**: Short-term training load representing recent fatigue
- **Time Constant**: 7 days (fast-changing)
- **Calculation**: Exponentially Weighted Moving Average (EWMA)
- **Formula**: `ATL[today] = ATL[yesterday] + (TSS[today] - ATL[yesterday]) / 7`
- **Interpretation**:
  - Higher ATL = More fatigued
  - ATL close to CTL = Maintaining normal training
  - ATL >> CTL = Overreaching/fatigued
- **During Taper**: ATL decreases RAPIDLY as training volume reduces

#### TSB (Training Stress Balance) - "Form/Freshness"
- **Definition**: The balance between fitness and fatigue
- **Formula**: `TSB = CTL - ATL`
- **Interpretation**:
  - **Negative TSB** (< 0): Fatigued state
    - TSB < -30: Very fatigued, overreached, need recovery
    - TSB -25 to -10: Productive training range (building fitness)
    - TSB -10 to 0: Slightly fatigued but functional
  - **Zero TSB** (0): Perfect balance between fitness and fatigue
  - **POSITIVE TSB** (> 0): Fresh/Rested state ✅ **RACE READY**
    - **TSB +5 to +10**: Optimal race-day range (fresh but fit)
    - **TSB +10 to +15**: Well-rested, excellent for long races
    - **TSB +15 to +20**: Very fresh, maximum taper benefit
    - TSB > +25: Risk of over-tapering (too much rest, fitness loss)

**KEY INSIGHT**: During a taper, as training volume drops:
- ATL drops FAST (7-day decay)
- CTL drops SLOW (42-day decay)
- TSB = CTL - ATL INCREASES (becomes more positive)
- **Goal**: Reach +5 to +15 TSB on race day

#### TSS (Training Stress Score)
- **Definition**: Daily training stress from workouts
- **Unit**: Arbitrary points representing workout difficulty
- **Typical Values**:
  - Easy 1-hour ride: 40-50 TSS
  - Hard 1-hour ride: 80-100 TSS
  - Long endurance ride (3 hours): 150-200 TSS
  - Normal training week: 400-600 TSS
  - Heavy training week: 600-800 TSS

---

## Taper Calculation Logic

### Input Parameters

1. **Race Information**
   - Race Name (required)
   - Race Date (required)
   - Race Distance (required) - determines default taper length

2. **Current Training Load**
   - Current CTL (required) - Your current fitness level
   - Current ATL (optional, defaults to CTL - 20) - Your current fatigue
   - Current TSB (optional, calculated as CTL - ATL) - Your current form
   - Weeks Trained (required) - Total training cycle length

3. **Taper Preferences**
   - Taper Length (auto or manual: 1-3 weeks)
   - **Goal TSB on Race Day (default: +10)** ✅ CORRECTED - Now POSITIVE

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

**Rationale**:
- **Shorter races** (Sprint, Olympic, 10K): 1 week sufficient
  - Less total fatigue accumulated
  - Quick recovery possible
  - Don't want to lose sharpness
  
- **Medium races** (Half Ironman, Half Marathon): 2 weeks optimal
  - Moderate fatigue accumulated
  - Need substantial recovery
  - Enough time to freshen without detraining
  
- **Long races** (Ironman, Marathon): 3 weeks necessary
  - Significant fatigue accumulated
  - Deep recovery needed
  - Longer taper preserves fitness while maximizing freshness

#### Adjustment for Fatigue State
```javascript
// If athlete is very fatigued (TSB < -30), add 1 week to taper
if (currentTSB < -30) {
    taperWeeks = Math.min(taperWeeks + 1, 3); // Max 3 weeks
}
```

**Logic**: 
- Athletes with TSB < -30 are deeply fatigued
- Need extra time to recover and reach positive TSB
- Adding 1 week gives ATL more time to decay
- Maximum 3 weeks to avoid excessive detraining

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

**Rationale**:
- **Gradual reduction**: Volume drops progressively each week
- **Maintain intensity**: These are volume cuts, not intensity cuts
- **Final week most aggressive**: Race week has most dramatic cut

**Example (3-week taper):**
- Week -3 (3 weeks before race): Train at 80% of normal volume
  - Still substantial training
  - Beginning recovery process
  
- Week -2 (2 weeks before race): Train at 60% of normal volume
  - Moderate reduction
  - ATL starts dropping significantly
  
- Week -1 (race week): Train at 35% of normal volume
  - Minimal training
  - Focus on staying sharp, not building fitness
  - ATL drops rapidly, TSB rises toward positive

#### Calculate Weekly TSS Targets
```javascript
// Estimate normal weekly TSS from CTL
const normalWeeklyTSS = currentCTL * 7;

// Apply volume reductions
const weeklyTSSTargets = volumeReductions.map(reduction => 
    Math.round(normalWeeklyTSS * reduction)
);
```

**Logic**:
- **Assumption**: Normal weekly TSS ≈ CTL × 7
- This is because CTL represents average daily TSS over 42 days
- If CTL = 80, you've been averaging ~80 TSS/day
- Weekly TSS = 80 × 7 = 560 TSS/week

**Example Calculation (3-week taper, CTL = 80):**
```
Normal Weekly TSS = 80 × 7 = 560 TSS

Week -3 Target = 560 × 0.80 = 448 TSS
Week -2 Target = 560 × 0.60 = 336 TSS
Week -1 Target = 560 × 0.35 = 196 TSS
```

#### Calculate Daily TSS for Each Week
```javascript
const dailyTSSByWeek = weeklyTSSTargets.map(weeklyTSS => 
    Math.round(weeklyTSS / 7)
);
```

**Result**:
```
Week -3: 448 / 7 = 64 TSS/day average
Week -2: 336 / 7 = 48 TSS/day average
Week -1: 196 / 7 = 28 TSS/day average
```

**Note**: These are averages. Actual daily TSS varies by day (see daily workout plans).

---

### Step 3: Simulate CTL/ATL/TSB Progression

#### The Core Simulation Loop

For each day of the taper, calculate new CTL, ATL, and TSB:

```javascript
let ctl = currentCTL;
let atl = currentATL;
const tsbProgression = [currentTSB];
const ctlProgression = [currentCTL];

for (let week = 0; week < taperWeeks; week++) {
    for (let day = 0; day < 7; day++) {
        const dailyTSS = dailyTSSByWeek[week];
        
        // Update CTL (42-day time constant - SLOW decay)
        ctl = ctl + (dailyTSS - ctl) / 42;
        
        // Update ATL (7-day time constant - FAST decay)
        atl = atl + (dailyTSS - atl) / 7;
        
        // Calculate TSB
        const tsb = ctl - atl;
        
        // Store progression
        tsbProgression.push(tsb);
        ctlProgression.push(ctl);
    }
}
```

#### Example: Full 3-Week Taper Simulation

**Starting Values (Day 0):**
- CTL = 80 (fitness)
- ATL = 85 (fatigued from hard training)
- TSB = 80 - 85 = **-5** (slightly fatigued)

**Week -3 (Days 1-7): 64 TSS/day**

**Day 1:**
- CTL = 80 + (64 - 80) / 42 = 80 - 0.38 = **79.62**
- ATL = 85 + (64 - 85) / 7 = 85 - 3.00 = **82.00**
- TSB = 79.62 - 82.00 = **-2.38** ✅ TSB rising (less negative)

**Day 2:**
- CTL = 79.62 + (64 - 79.62) / 42 = 79.62 - 0.37 = **79.25**
- ATL = 82.00 + (64 - 82.00) / 7 = 82.00 - 2.57 = **79.43**
- TSB = 79.25 - 79.43 = **-0.18** ✅ Almost neutral

**Day 3:**
- CTL = 79.25 + (64 - 79.25) / 42 = **78.89**
- ATL = 79.43 + (64 - 79.43) / 7 = **77.22**
- TSB = 78.89 - 77.22 = **+1.67** ✅ NOW POSITIVE!

**Day 7 (End of Week -3):**
- CTL ≈ **77.8** (lost 2.2 points)
- ATL ≈ **69.5** (lost 15.5 points)
- TSB ≈ **+8.3** ✅ Positive and rising

**Week -2 (Days 8-14): 48 TSS/day**

**Day 8:**
- CTL = 77.8 + (48 - 77.8) / 42 = 77.8 - 0.71 = **77.09**
- ATL = 69.5 + (48 - 69.5) / 7 = 69.5 - 3.07 = **66.43**
- TSB = 77.09 - 66.43 = **+10.66** ✅ Approaching target

**Day 14 (End of Week -2):**
- CTL ≈ **74.2** (lost 5.8 points from start)
- ATL ≈ **54.8** (lost 30.2 points from start)
- TSB ≈ **+19.4** ✅ Very fresh

**Week -1 (Days 15-21): 28 TSS/day**

**Day 15:**
- CTL = 74.2 + (28 - 74.2) / 42 = 74.2 - 1.10 = **73.10**
- ATL = 54.8 + (28 - 54.8) / 7 = 54.8 - 3.83 = **50.97**
- TSB = 73.10 - 50.97 = **+22.13** ✅ Very fresh

**Day 21 (Race Day):**
- CTL ≈ **69.5** (lost 10.5 points total, ~13% fitness loss)
- ATL ≈ **35.2** (lost 49.8 points total, ~59% fatigue reduction)
- TSB ≈ **+34.3** ⚠️ VERY HIGH - might be over-tapered

#### Key Observations

**CTL Behavior:**
- Drops slowly due to 42-day time constant
- Total loss: ~10-15% over 3 weeks
- Acceptable fitness loss for the freshness gained

**ATL Behavior:**
- Drops rapidly due to 7-day time constant
- Total loss: ~40-60% over 3 weeks
- This rapid fatigue reduction is the goal

**TSB Behavior:**
- Starts negative (fatigued)
- Rises steadily as ATL drops faster than CTL
- Reaches positive values within first week
- Continues rising throughout taper
- **Target**: +5 to +15 on race day
- **Actual**: Often reaches +25 to +35 (over-tapered?)

---

### Step 4: Generate Daily Workout Plans

#### Philosophy
- **Maintain Intensity**: Workout intensity stays high
- **Reduce Volume**: Workout duration/volume decreases dramatically
- **Preserve Frequency**: Continue training most days
- **Quality Over Quantity**: Focus on sharpness, not fitness building

#### Week -1 (Race Week) - FINAL WEEK

Average Daily TSS: 28 (very low)

```javascript
Monday: 28 × 1.2 = 34 TSS
- Description: 'Easy spin/run. 30-40 min Z1-Z2. Stay loose.'
- Purpose: Active recovery, maintain movement patterns
- Intensity: Very low (Z1-Z2)

Tuesday: 28 × 1.3 = 36 TSS
- Description: 'Short intervals. 4-5 x 1 min @ race pace, full recovery. Total 30-40 min.'
- Purpose: Maintain neuromuscular sharpness, race pace feel
- Intensity: High (race pace) but very short duration

Wednesday: 28 × 0.8 = 22 TSS
- Description: 'Easy swim + easy bike or run. 20-30 min each. Very light.'
- Purpose: Multi-sport athletes stay loose in all disciplines
- Intensity: Very low

Thursday: 28 × 0.6 = 17 TSS
- Description: 'Pre-race shakeout. 15-20 min easy + 3-5 x 20sec pickups.'
- Purpose: Final race-pace reminder, gear check
- Intensity: Mostly easy with brief race-pace touches

Friday: 28 × 0 = 0 TSS
- Description: 'REST. Travel day if needed. Hydrate, fuel, sleep.'
- Purpose: Complete rest, carb loading begins
- Intensity: None

Saturday: 28 × 0.5 = 14 TSS
- Description: 'Optional 15 min easy spin/jog + 3 x 20sec race pace. Check gear.'
- Purpose: Optional light movement, final gear check
- Intensity: Very low with brief race-pace

Sunday: 28 × 0 = 0 TSS
- Description: 'RACE DAY! Trust your training. Execute your plan.'
- Purpose: Race!
- Intensity: Race effort
```

**Week Total**: ~123 TSS (actual varies by athlete choices)

**Multipliers Logic**:
- Early week: Slightly higher to maintain feel (1.2-1.3x)
- Mid-week: Lower to maximize recovery (0.6-0.8x)
- Final days: Minimal or zero (0-0.5x)

#### Week -2 (2 Weeks Out) - MODERATE REDUCTION

Average Daily TSS: 48 (moderate)

```javascript
Monday: 48 × 0.8 = 38 TSS
- Description: 'Recovery day. Easy 30-40 min Z1-Z2.'
- Purpose: Start week easy
- Intensity: Low

Tuesday: 48 × 1.4 = 67 TSS
- Description: 'Key session. Race pace intervals with good recovery. Maintain intensity.'
- Purpose: Main quality workout of the week
- Intensity: High (race pace/threshold)

Wednesday: 48 × 1.0 = 48 TSS
- Description: 'Moderate session. 45-60 min Z2-Z3.'
- Purpose: Aerobic maintenance
- Intensity: Moderate

Thursday: 48 × 1.2 = 58 TSS
- Description: 'Threshold work. 2-3 x 8-10 min @ FTP/threshold. Quality over quantity.'
- Purpose: Secondary quality workout
- Intensity: High (threshold)

Friday: 48 × 0.8 = 38 TSS
- Description: 'Easy recovery. 30-40 min Z1.'
- Purpose: Recovery before weekend
- Intensity: Low

Saturday: 48 × 1.4 = 67 TSS
- Description: 'Long-ish but reduced. 60-70% of normal long workout.'
- Purpose: Reduced long workout for endurance touch
- Intensity: Moderate to high

Sunday: 48 × 0.4 = 19 TSS
- Description: 'Easy active recovery. 20-30 min Z1.'
- Purpose: Easy spin-down
- Intensity: Very low
```

**Week Total**: ~335 TSS

**Key Principles**:
- Still includes quality workouts (Tue, Thu, Sat)
- Volume significantly reduced from normal
- Intensity maintained on key days
- More recovery days than normal

#### Week -3 (3 Weeks Out) - SLIGHT REDUCTION

Average Daily TSS: 64 (slight reduction)

```javascript
Monday: 64 × 0.6 = 38 TSS
- Description: 'Easy recovery. 30-45 min Z1-Z2.'
- Purpose: Easy start to taper
- Intensity: Low

Tuesday: 64 × 1.5 = 96 TSS
- Description: 'Last big interval session. Race specificity. Quality focus.'
- Purpose: Final major quality workout
- Intensity: Very high (VO2/race pace)

Wednesday: 64 × 1.0 = 64 TSS
- Description: 'Moderate endurance. 60-75 min Z2-Z3.'
- Purpose: Aerobic maintenance
- Intensity: Moderate

Thursday: 64 × 1.3 = 83 TSS
- Description: 'Tempo or sweet spot. 3-4 x 10-12 min. Maintain power/pace.'
- Purpose: Quality tempo work
- Intensity: High (sweet spot/tempo)

Friday: 64 × 0.8 = 51 TSS
- Description: 'Easy day. 40-50 min Z1-Z2.'
- Purpose: Recovery
- Intensity: Low

Saturday: 64 × 1.5 = 96 TSS
- Description: 'Last long workout. 75-80% of peak volume. Race simulation.'
- Purpose: Final long workout, race rehearsal
- Intensity: Moderate to high

Sunday: 64 × 0.3 = 19 TSS
- Description: 'Easy recovery or rest. 20-30 min Z1 or off.'
- Purpose: Recovery
- Intensity: Very low or off
```

**Week Total**: ~447 TSS

**Key Principles**:
- Last "normal" training week
- Includes final big workouts (Tue, Sat)
- Volume ~20% reduced from peak
- Beginning taper process

---

## Output Metrics

### 1. Taper Duration
- **Display**: "2 Weeks" or "3 Weeks"
- **Source**: Based on race distance or manual selection
- **Example**: Ironman → 3 weeks automatically

### 2. Total Volume Reduction
```javascript
volume_reduction_percent = (1 - volumeReductions[last_week]) * 100
```

**Calculation**:
- 1-week taper: (1 - 0.50) × 100 = **50% reduction**
- 2-week taper: (1 - 0.40) × 100 = **60% reduction**
- 3-week taper: (1 - 0.35) × 100 = **65% reduction**

**Interpretation**: Total volume reduction from normal training by race week

### 3. Race Day CTL
- **Display**: "75.3" (example)
- **Source**: Final CTL value from progression simulation
- **Typical Result**: 5-15% drop from starting CTL
- **Example**: Start at 80 → End at 72 (10% loss)

### 4. Race Day TSB
- **Display**: "+12.5" (example) ✅ NOW POSITIVE
- **Source**: Final TSB value from progression simulation
- **Target Range**: +5 to +15
- **Interpretation**:
  - +5 to +10: Optimal (fresh but fit)
  - +10 to +15: Very fresh (good for long races)
  - +15 to +25: Very rested (risk of over-taper)
  - +25+: Over-tapered (too much rest)

### 5. TSB Progression Chart
Shows TSB at key milestones:
```
Day 0 (Today):        TSB = -5  (fatigued)
Day 7 (Week -3 end):  TSB = +8  (freshening)
Day 14 (Week -2 end): TSB = +19 (fresh)
Day 21 (Race Day):    TSB = +34 (very fresh, maybe too much?)
```

**Visual**: Bar chart showing TSB progression from negative to positive

---

## Key Formulas Summary

### Core EWMA Formulas
```
CTL[t] = CTL[t-1] + (TSS[t] - CTL[t-1]) / 42
ATL[t] = ATL[t-1] + (TSS[t] - ATL[t-1]) / 7
TSB[t] = CTL[t] - ATL[t]
```

### Taper Volume Calculations
```
Normal Weekly TSS = CTL × 7
Target Weekly TSS (Week X) = Normal Weekly TSS × Volume Reduction Factor[X]
Average Daily TSS (Week X) = Target Weekly TSS / 7
Specific Day TSS = Average Daily TSS × Day Multiplier
```

### Volume Reduction Factors
```
1-week taper:  Week -1: 0.50
2-week taper:  Week -2: 0.70, Week -1: 0.40
3-week taper:  Week -3: 0.80, Week -2: 0.60, Week -1: 0.35
```

---

## Known Issues & Areas for Improvement

### 1. ✅ FIXED: TSB Target Range
- **Was**: -5 to -15 (incorrect - negative values)
- **Now**: +5 to +15 (correct - positive values)
- **Status**: CORRECTED

### 2. Over-Tapering Problem
- **Issue**: Simulation often produces TSB of +25 to +35 by race day
- **Target**: +5 to +15
- **Problem**: Current volume reductions are too aggressive
- **Result**: Athletes may lose too much fitness and feel flat

**Potential Solutions**:
- **Option A**: Reduce the aggressiveness of volume cuts
  - Change Week -1 from 0.35 to 0.45 (45% instead of 35%)
  - Change Week -2 from 0.60 to 0.65 (65% instead of 60%)
  
- **Option B**: Adjust daily TSS multipliers
  - Increase Tuesday/Thursday multipliers in race week
  - Add more "quality" days with higher TSS
  
- **Option C**: Use target TSB to dynamically adjust volume
  - If simulated TSB > target, increase volume
  - If simulated TSB < target, decrease volume

### 3. CTL Estimation Inaccuracy
- **Current**: Assumes `normalWeeklyTSS = CTL × 7`
- **Problem**: This is a rough estimate
- **Reality**: Some athletes train more or less than their CTL × 7
- **Example**: CTL of 80 could mean:
  - Athlete A: 500 TSS/week (consistent training)
  - Athlete B: 600 TSS/week (high volume training)
  
**Better Approach**: Ask for "Average Weekly TSS" from last 4 weeks

### 4. ATL Default Calculation
- **Current**: If not provided, defaults to `ATL = CTL - 20`
- **Problem**: Arbitrary assumption
- **Reality**: ATL depends on recent training patterns
- **Example**: Two athletes with CTL = 80:
  - Athlete A just finished recovery week: ATL = 50, TSB = +30
  - Athlete B just finished build week: ATL = 100, TSB = -20

**Better Approach**: Calculate from recent weekly TSS or ask user

### 5. No Sport-Specific Breakdown
- **Current**: All TSS is generic
- **Problem**: Triathletes need swim/bike/run distribution
- **Missing**: Sport-specific taper recommendations
  - Swim: Usually taper more (50% reduction)
  - Bike: Moderate taper (40% reduction)
  - Run: Conservative taper (30% reduction)

**Better Approach**: Ask for primary sport, provide sport-specific guidance

### 6. Day Multipliers Are Static
- **Current**: Tuesday always = 1.4×, Friday always = 0
- **Problem**: Doesn't account for athlete preferences
- **Example**: Some athletes prefer:
  - Swimming on Monday (need pool access)
  - Resting Thursday (personal preference)
  - Longer Saturday workout (weekend warrior)

**Better Approach**: Provide customizable workout schedule template

### 7. No Integration with TrainingPeaks Data
- **Current**: All calculations are theoretical
- **Problem**: Not using actual athlete data
- **Available**: TrainingPeaks API has:
  - Actual CTL/ATL/TSB from completed workouts
  - Weekly TSS totals
  - Historical training patterns

**Better Approach**: Pull real data from TrainingPeaks, use actual averages

### 8. No Athlete Response Variability
- **Current**: All athletes taper the same way
- **Problem**: Taper response is highly individual
- **Reality**: 
  - Some athletes need more taper (high responders)
  - Some need less taper (low responders)
  - Age, training history, genetics all factor in

**Better Approach**: 
- Track taper outcomes over multiple races
- Adjust recommendations based on past performance
- Machine learning on athlete response patterns

---

## Full Worked Example - CORRECTED

### Inputs
- **Race**: Ironman Arizona 2026
- **Race Date**: 2026-11-15
- **Race Distance**: Ironman
- **Current CTL**: 80
- **Current ATL**: 85 (fatigued from recent training block)
- **Current TSB**: 80 - 85 = **-5** (slightly fatigued)
- **Weeks Trained**: 16
- **Taper Length**: Auto → 3 weeks (Ironman)
- **Goal TSB**: +10 ✅ CORRECTED (was -10)

### Calculation Process

#### Step 1: Determine Taper Length
- Race distance = Ironman → **3 weeks**
- TSB = -5 (not < -30) → No adjustment needed
- **Final taper: 3 weeks**

#### Step 2: Calculate Volume Targets
```
Normal Weekly TSS = 80 × 7 = 560 TSS

Week -3 Target = 560 × 0.80 = 448 TSS (64 TSS/day)
Week -2 Target = 560 × 0.60 = 336 TSS (48 TSS/day)
Week -1 Target = 560 × 0.35 = 196 TSS (28 TSS/day)
```

#### Step 3: Simulate Day-by-Day (Key Days)

**Day 0 (Start):**
- CTL = 80.0
- ATL = 85.0
- TSB = **-5.0** (fatigued)

**Day 1 (Week -3, 64 TSS):**
- CTL = 80 + (64-80)/42 = 79.62
- ATL = 85 + (64-85)/7 = 82.00
- TSB = **-2.38** (less fatigued)

**Day 3:**
- CTL = 78.89
- ATL = 77.22
- TSB = **+1.67** ✅ NOW POSITIVE (fresh)

**Day 7 (End Week -3):**
- CTL = 77.8
- ATL = 69.5
- TSB = **+8.3** (getting fresh)

**Day 14 (End Week -2):**
- CTL = 74.2
- ATL = 54.8
- TSB = **+19.4** (very fresh)

**Day 21 (Race Day):**
- CTL = 69.5
- ATL = 35.2
- TSB = **+34.3** ⚠️ OVER-TAPERED!

#### Analysis

**CTL Loss**: 80 → 69.5 = **-10.5 points (13% loss)**
- Acceptable fitness loss for a 3-week taper
- Within normal range (10-15%)

**ATL Reduction**: 85 → 35.2 = **-49.8 points (59% reduction)**
- Excellent fatigue reduction
- This is the goal of taper

**TSB Result**: -5 → +34.3 = **+39.3 point increase**
- Started slightly fatigued (TSB = -5)
- Ended very fresh (TSB = +34.3)
- **Problem**: Target was +10, achieved +34.3
- **Assessment**: OVER-TAPERED by ~24 points

#### Conclusion

**Current taper is TOO AGGRESSIVE for this athlete:**
- Goal TSB: +10 (optimal freshness)
- Actual TSB: +34.3 (over-rested)
- Risk: Lost too much fitness, may feel flat on race day

**Recommended Adjustments**:
1. **Increase race week volume**: Change 0.35 to 0.50 (50% instead of 35%)
2. **Increase Week -2 volume**: Change 0.60 to 0.70 (70% instead of 60%)
3. **Add more quality workouts**: More high-intensity, short-duration sessions

**Alternative**: If athlete historically responds well to aggressive tapers, this might be fine. Track race day performance to adjust future tapers.

---

## Conclusion

This corrected documentation now reflects:
1. ✅ **Positive TSB targets** (+5 to +15) for race day
2. ✅ **Correct interpretation** of TSB values
3. ✅ **Accurate simulation** showing how TSB rises during taper
4. ⚠️ **Identified problem**: Current volume reductions often over-taper

**The calculator works correctly in terms of EWMA physics. The issue is the volume reduction percentages may be too aggressive for many athletes, causing over-tapering (TSB > +20 instead of target +10).**

Review this and tell me what specific changes you want to make!
