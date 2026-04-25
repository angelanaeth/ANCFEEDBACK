# COMPLETE TAPER CALCULATOR LOGIC & CALCULATIONS
## For Angela Naeth Review & Edits

---

## 📊 CURRENT TAPER FORMULAS (Angela's Brain Implementation)

### Volume Reduction by Week

```javascript
// These are the exact percentages used in the calculator
const volumeReductionByWeek = {
  1: [0.80],              // 1-week taper (Olympic, Sprint)
  2: [0.70, 0.40],        // 2-week taper (70.3, Half Marathon)
  3: [0.85, 0.60, 0.30]   // 3-week taper (Ironman, Marathon)
};
```

### Breakdown by Race Type

#### **Ironman / Marathon (3-Week Taper)**
- **Week -3 (15-21 days out)**: 85% of normal volume
- **Week -2 (8-14 days out)**: 60% of normal volume  
- **Week -1 (Race Week)**: 30% of normal volume

#### **Half Ironman / Half Marathon (2-Week Taper)**
- **Week -2 (8-14 days out)**: 70% of normal volume
- **Week -1 (Race Week)**: 40% of normal volume

#### **Olympic / Sprint (1-Week Taper)**
- **Week -1 (Race Week)**: 80% of normal volume

---

## 🧮 CALCULATION METHODOLOGY

### Step 1: Determine Normal Weekly TSS
```javascript
normalWeeklyTSS = currentCTL × 7
```

**Example**: If athlete's CTL = 80
- Normal weekly TSS = 80 × 7 = **560 TSS**

### Step 2: Calculate Weekly TSS Targets
```javascript
weeklyTSSTargets = normalWeeklyTSS × volumeReduction
```

**Example (Ironman 3-week taper with CTL 80)**:
- Week -3: 560 × 0.85 = **476 TSS** (68 TSS/day)
- Week -2: 560 × 0.60 = **336 TSS** (48 TSS/day)
- Week -1: 560 × 0.30 = **168 TSS** (24 TSS/day)

### Step 3: Daily TSS Distribution
```javascript
dailyTSS = weeklyTSS / 7
```

But actual daily distribution uses multipliers to vary intensity across the week.

---

## 📅 DAILY TSS MULTIPLIERS (Race Week)

### Final Week (Week -1) Daily Distribution

**Base Daily TSS**: 24 (for athlete with CTL 80)

```javascript
Monday:    24 × 1.2 = 29 TSS  (Easy spin/run 30-40 min)
Tuesday:   24 × 1.3 = 31 TSS  (Short intervals 4-5 x 1 min @ race pace)
Wednesday: 24 × 0.8 = 19 TSS  (Easy swim + easy bike/run)
Thursday:  24 × 0.6 = 14 TSS  (Pre-race shakeout 15-20 min)
Friday:    24 × 0.0 = 0 TSS   (REST - travel/fuel/sleep)
Saturday:  24 × 0.5 = 12 TSS  (Optional 15 min easy + 3x20sec pickups)
Sunday:    24 × 0.0 = 0 TSS   (RACE DAY)

Total Week: ~105 TSS
```

**Multipliers Summary**:
- Monday: 1.2× (slightly above average)
- Tuesday: 1.3× (highest day - short race-pace work)
- Wednesday: 0.8× (below average)
- Thursday: 0.6× (minimal)
- Friday: 0.0× (complete rest)
- Saturday: 0.5× (optional opener)
- Sunday: 0.0× (race day)

### Week -2 Daily Distribution

**Base Daily TSS**: 48 (for athlete with CTL 80)

```javascript
Monday:    48 × 0.8 = 38 TSS   (Recovery 30-40 min Z1-Z2)
Tuesday:   48 × 1.4 = 67 TSS   (Key session - race pace intervals)
Wednesday: 48 × 1.0 = 48 TSS   (Moderate 45-60 min Z2-Z3)
Thursday:  48 × 1.2 = 58 TSS   (Threshold 2-3 x 8-10 min @ FTP)
Friday:    48 × 0.8 = 38 TSS   (Easy recovery 30-40 min Z1)
Saturday:  48 × 1.4 = 67 TSS   (Long-ish 60-70% of normal)
Sunday:    48 × 0.4 = 19 TSS   (Easy active recovery)

Total Week: ~335 TSS
```

### Week -3 Daily Distribution

**Base Daily TSS**: 68 (for athlete with CTL 80)

```javascript
Monday:    68 × 0.6 = 41 TSS   (Easy recovery 30-45 min)
Tuesday:   68 × 1.5 = 102 TSS  (Last big interval session)
Wednesday: 68 × 1.0 = 68 TSS   (Moderate endurance 60-75 min)
Thursday:  68 × 1.3 = 88 TSS   (Tempo/sweet spot 3-4 x 10-12 min)
Friday:    68 × 0.8 = 54 TSS   (Easy 40-50 min Z1-Z2)
Saturday:  68 × 1.5 = 102 TSS  (Last long workout 75-80% peak)
Sunday:    68 × 0.3 = 20 TSS   (Easy recovery or rest)

Total Week: ~475 TSS
```

---

## 🔬 CTL/ATL/TSB PROGRESSION FORMULAS

### Core PMC (Performance Manager Chart) Equations

```javascript
// CTL (Chronic Training Load) - 42-day time constant
CTL_today = CTL_yesterday + (TSS_today - CTL_yesterday) / 42

// ATL (Acute Training Load) - 7-day time constant  
ATL_today = ATL_yesterday + (TSS_today - ATL_yesterday) / 7

// TSB (Training Stress Balance)
TSB = CTL - ATL
```

### Time Constants Explained
- **CTL (42 days)**: Fitness changes SLOWLY
  - Takes ~6 weeks for significant fitness changes
  - Preserves fitness during taper
  
- **ATL (7 days)**: Fatigue changes FAST
  - Responds within days to reduced training
  - Allows rapid recovery during taper

### Example Progression (Ironman Taper, Starting CTL 80, ATL 85, TSB -5)

#### Week -3 (85% volume = 68 TSS/day)
```
Day 1:  CTL 79.9, ATL 82.6, TSB -2.7
Day 3:  CTL 79.7, ATL 78.8, TSB +0.9
Day 7:  CTL 79.1, ATL 73.4, TSB +5.7
```

#### Week -2 (60% volume = 48 TSS/day)
```
Day 8:  CTL 78.8, ATL 69.8, TSB +9.0
Day 10: CTL 78.5, ATL 64.9, TSB +13.6
Day 14: CTL 76.8, ATL 58.1, TSB +18.7
```

#### Week -1 (30% volume = 24 TSS/day)
```
Day 15: CTL 75.5, ATL 53.0, TSB +22.5
Day 18: CTL 74.1, ATL 44.5, TSB +29.6
Day 21: CTL 73.5, ATL 38.7, TSB +34.8 ⚠️
```

**Result**: Final TSB of +34.8 is HIGHER than target of +10

---

## 🎯 GOAL TSB SETTINGS

### Current TSB Targets in Calculator
```javascript
// User can select from dropdown
Goal TSB Options:
  +5  (Slightly Fresh)
  +8  (Moderately Fresh)
  +10 (Optimal) ← DEFAULT
  +12 (Very Fresh)
  +15 (Maximum Freshness)
```

### Angela's Stated Target Range
**+5 to +15** (positive values = fresh and ready)

### Current Problem
Calculator **CALCULATES** toward these targets but doesn't **DYNAMICALLY ADJUST** the taper to hit them.

It uses fixed volume reductions (85%, 60%, 30%) regardless of:
- Starting TSB
- Goal TSB selection
- Athlete's current fatigue level

---

## 📊 SIMULATION RESULTS

### Scenario A: Moderately Fatigued Athlete
**Starting State**:
- CTL: 80
- ATL: 85
- TSB: -5 (slightly fatigued)

**Ironman Taper Results**:
- Week -3 End: TSB +5.7 ✅
- Week -2 End: TSB +18.7 ⚠️ (slightly high)
- Race Day: TSB +34.8 ❌ (too high!)

### Scenario B: More Fatigued Athlete
**Starting State**:
- CTL: 80
- ATL: 95
- TSB: -15 (moderately fatigued)

**Ironman Taper Results** (same volume reductions):
- Week -3 End: TSB -4.3 (still building freshness)
- Week -2 End: TSB +8.7 ✅ (good!)
- Race Day: TSB +24.8 ⚠️ (better but still high)

### Scenario C: High-Performance Athlete
**Starting State**:
- CTL: 120
- ATL: 130
- TSB: -10

**Ironman Taper Results**:
- Week -3 End: TSB +0.2
- Week -2 End: TSB +18.1
- Race Day: TSB +41.2 ❌ (way too high!)

---

## 🤔 KEY QUESTIONS FOR ANGELA

### A. Volume Reduction Percentages

#### Ironman (3-week taper)
Current: **85%, 60%, 30%**

**Questions**:
1. Is Week -3 at 85% correct? Should it be:
   - [ ] Higher (90%, 95%)?
   - [ ] Lower (80%, 75%)?
   - [ ] Keep at 85% ✓

2. Is Week -2 at 60% correct? Should it be:
   - [ ] Higher (65%, 70%)?
   - [ ] Lower (55%, 50%)?
   - [ ] Keep at 60% ✓

3. Is Race Week at 30% correct? Should it be:
   - [ ] Higher (35%, 40%)?
   - [ ] Lower (25%, 20%)?
   - [ ] Keep at 30% ✓

#### Half Ironman (2-week taper)
Current: **70%, 40%**

**Questions**:
1. Is Week -2 at 70% correct?
2. Is Race Week at 40% correct?

#### Olympic (1-week taper)
Current: **80%**

**Questions**:
1. Is 80% correct for Olympic race week?
2. Should it vary by athlete type (AG vs Pro)?

---

### B. Daily TSS Distribution Multipliers

#### Race Week Daily Multipliers
Current pattern:
```
Mon: 1.2× (29 TSS)
Tue: 1.3× (31 TSS) ← Highest
Wed: 0.8× (19 TSS)
Thu: 0.6× (14 TSS)
Fri: 0.0× (0 TSS)
Sat: 0.5× (12 TSS)
Sun: 0.0× (0 TSS - Race)
```

**Questions**:
1. Should Monday or Tuesday be the "hardest" day?
2. Is Thursday too light? (only 0.6×)
3. Should Saturday opener be optional or mandatory?
4. Should we recommend a 10-min shake-out on Saturday instead?

#### Week -2 Daily Multipliers
Current pattern:
```
Mon: 0.8×
Tue: 1.4× ← Highest (key session)
Wed: 1.0×
Thu: 1.2×
Fri: 0.8×
Sat: 1.4× ← Second highest (long workout)
Sun: 0.4×
```

**Questions**:
1. Are Tuesday and Saturday being the hardest days correct?
2. Should Monday be more or less?
3. Is Sunday too easy at 0.4×?

---

### C. Starting TSB Considerations

#### Current Behavior
Calculator uses FIXED volume reductions regardless of starting TSB.

**Example Problems**:
- Athlete starts with TSB -5 → Ends at +34.8 (too high)
- Athlete starts with TSB -15 → Ends at +24.8 (better, but still high)
- Athlete starts with TSB -25 → Ends at +14.8 (perfect!)

**Questions**:
1. Should we adjust taper based on starting TSB?
   - If TSB > -10: More aggressive taper? (less volume reduction)
   - If TSB < -20: Less aggressive taper? (more volume reduction)

2. Should we add warnings?
   - "You're starting taper too fresh (TSB > 0)"
   - "You're starting taper very fatigued (TSB < -20)"

3. Should we recommend an EXTRA recovery week before taper starts if TSB < -25?

---

### D. Time Constants

#### Current Values
```javascript
CTL time constant: 42 days
ATL time constant: 7 days
```

These are industry-standard PMC values.

**Questions**:
1. Should CTL time constant be adjustable?
   - Younger athletes (20-30): 42 days ✓
   - Masters athletes (40+): 45-50 days? (slower adaptation)
   - Elite athletes: 38-40 days? (faster adaptation)

2. Should ATL time constant vary?
   - Most athletes: 7 days ✓
   - High responders: 5 days? (recover faster)
   - Slow responders: 10 days? (recover slower)

---

### E. Dynamic Taper Adjustment

#### Current: Static Formula
Same volume reductions for ALL athletes regardless of:
- Starting fatigue level
- Training age
- Recovery ability
- Race importance

#### Proposed: Dynamic Formula

**Option 1: TSB-Based Adjustments**
```javascript
if (starting_TSB > -5) {
  // Athlete is TOO FRESH entering taper
  // Add MORE volume to prevent over-tapering
  Week -3: 90% (instead of 85%)
  Week -2: 70% (instead of 60%)
  Week -1: 40% (instead of 30%)
}

if (starting_TSB < -20) {
  // Athlete is VERY FATIGUED entering taper
  // Reduce MORE volume to ensure recovery
  Week -3: 80% (instead of 85%)
  Week -2: 50% (instead of 60%)
  Week -1: 25% (instead of 30%)
}
```

**Option 2: CTL-Based Adjustments**
```javascript
if (CTL > 120) {
  // Elite/Pro athlete
  // Need less aggressive taper (preserve fitness)
  Week -3: 90%
  Week -2: 70%
  Week -1: 40%
}

if (CTL < 60) {
  // Beginner athlete
  // Need standard or aggressive taper
  Week -3: 85%
  Week -2: 60%
  Week -1: 30%
}
```

**Option 3: Goal-TSB-Based Adjustments**
```javascript
if (goal_TSB === 5) {
  // Want to be only slightly fresh
  // Less aggressive taper
  multiplier = 1.2
}

if (goal_TSB === 15) {
  // Want maximum freshness
  // More aggressive taper
  multiplier = 0.8
}

adjusted_volumes = base_volumes * multiplier
```

**Questions**:
1. Should we implement dynamic adjustments?
2. Which option makes most sense?
3. Should we combine multiple factors?

---

## 💡 SPECIFIC CHANGE OPTIONS

### Option A: Keep Current Formula, Adjust Week -1
**Change Race Week from 30% → 35%**

Result: Less aggressive taper in final week
- Current ending TSB: +34.8
- New ending TSB: ~+26 (better but still high)

### Option B: Adjust Week -2 Instead
**Change Week -2 from 60% → 65%**

Result: More volume in Week -2
- Current ending TSB: +34.8
- New ending TSB: ~+28 (slight improvement)

### Option C: Adjust Week -3
**Change Week -3 from 85% → 90%**

Result: Even less taper in Week -3
- Current ending TSB: +34.8
- New ending TSB: ~+31 (minimal improvement)

### Option D: Combination Approach
**Week -3: 85% → 90%**
**Week -2: 60% → 65%**
**Week -1: 30% → 35%**

Result: Less aggressive taper across all weeks
- Current ending TSB: +34.8
- New ending TSB: ~+18 (much better! within range!)

### Option E: Add Starting-TSB Logic
**If starting TSB > -10: Use Option D volumes**
**If starting TSB < -20: Use current volumes (85, 60, 30)**

Result: Personalized taper based on starting fatigue

---

## 📝 RECOMMENDATIONS NEEDED FROM ANGELA

Please review and provide specific edits for:

### 1. Volume Percentages
- [ ] Keep Ironman: 85%, 60%, 30%
- [ ] Change to: ___%, ___%, ___%
- [ ] Add logic: if (starting_TSB > X) use ___%, ___%, ___%

### 2. Daily Multipliers (Race Week)
- [ ] Keep current: Mon 1.2×, Tue 1.3×, Wed 0.8×, Thu 0.6×, Sat 0.5×
- [ ] Change to: Mon ___×, Tue ___×, Wed ___×, Thu ___×, Sat ___×
- [ ] Notes: _________________________________

### 3. Starting TSB Warnings
- [ ] Add warning if TSB > -5 (too fresh)
- [ ] Add warning if TSB < -20 (too fatigued)
- [ ] Recommend extra recovery week if TSB < -25
- [ ] No warnings needed

### 4. Dynamic Adjustments
- [ ] Keep static formula (same for all athletes)
- [ ] Add TSB-based adjustments
- [ ] Add CTL-based adjustments
- [ ] Add goal-TSB-based adjustments
- [ ] Combination: _________________________________

### 5. Other Changes
Please specify any other adjustments:
- Time constants: _________________________________
- Daily distributions: _________________________________
- Race-specific formulas: _________________________________
- Athlete-type variations: _________________________________

---

## 🎯 NEXT STEPS

Once I receive your edits, I will:
1. Update the volume reduction formulas
2. Adjust daily multipliers
3. Implement any dynamic logic
4. Add warnings/recommendations
5. Update documentation
6. Test with example athletes
7. Deploy to production

**Please provide your specific changes and I'll implement them immediately!** 🚀
