# 🚴🏃 Bike & Run Tab User Guide
**Quick Reference for Athletes and Coaches**

---

## 🚴 BIKE TAB - What It Does

### Purpose
Tracks your bike power metrics, training zones, and test history to optimize cycling performance.

### What You'll See

#### 📊 Top Section: 4 Metric Cards

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Critical Power (CP) │  │    LT1 Power        │  │    OGC Power        │  │ W' (Anaerobic Cap)  │
│                     │  │                     │  │                     │  │                     │
│  280 W  (3.5 W/kg) │  │  210 W  (2.6 W/kg) │  │  252 W  (3.2 W/kg) │  │     20.5 kJ        │
│                     │  │    75% of CP        │  │    90% of CP        │  │                     │
│  Source: Calculator │  │ Source: Manual      │  │ Source: Manual      │  │ Source: Calculator  │
│  Updated: Jan 15    │  │ Updated: Jan 10     │  │ Updated: Jan 10     │  │ Updated: Jan 15     │
│  [Edit]             │  │ [Edit]              │  │ [Edit]              │  │ [Edit]              │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**What each means:**
- **CP (Critical Power):** The highest power you can sustain for ~45-60 minutes. Your FTP is typically 95% of this.
- **LT1 Power:** Your first lactate threshold - easy/moderate boundary. Usually 75-80% of CP.
- **OGC Power:** Optimal Glycolysis Capacity - the power at which you burn carbs most efficiently. Usually ~90% of CP.
- **W' (W-prime):** Your anaerobic battery - how much work you can do above CP before exhaustion (measured in kilojoules).

#### 🧪 Middle Section: 3 Test Cards

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   3-Minute Test     │  │   6-Minute Test     │  │  12-Minute Test     │
│                     │  │                     │  │                     │
│     350 W          │  │     320 W          │  │     295 W          │
│  Duration: 3:00    │  │  Duration: 6:00    │  │  Duration: 12:00   │
│  Date: Jan 12      │  │  Date: Jan 12      │  │  Date: Jan 12      │
│  [Edit]            │  │  [Edit]            │  │  [Edit]            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**What these are:**
Short, maximal efforts to establish your power curve and track fitness changes over time.

#### 📈 Bottom Section: Training Zones

**Power Zones (7 Zones) - Auto-calculated from CP:**
```
Zone  Name                        Range (watts)    % of CP
─────────────────────────────────────────────────────────
 1    Active Recovery              0 - 154         0-55%
 2    Endurance                  154 - 210       56-75%
 3    Tempo                      210 - 252       76-90%
 4    Lactate Threshold          252 - 294      91-105%
 5    VO2 Max                    294 - 336     106-120%
 6    Anaerobic Capacity         336 - 420     121-150%
 7    Neuromuscular Power         420+           >150%
```

**Heart Rate Zones (5 Zones) - Based on your LTHR:**
```
Zone    Name                  Range (bpm)    % of LTHR
──────────────────────────────────────────────────────
 1      Recovery              0 - 128        0-75%
 2      Aerobic            128 - 145       75-85%
 3      Tempo              145 - 154       85-90%
 4      Threshold          154 - 171      90-100%
 5      VO2 Max            171 - 188     100-110%
```

### How to Use It

**Option 1: Manual Entry**
1. Click **[Edit]** button on any metric card
2. Enter your value (watts or kilojoules)
3. Select test date
4. Choose source (Manual, Calculator, TrainingPeaks)
5. Click **Save**
6. Zones auto-generate instantly

**Option 2: Use Critical Power Calculator**
1. Click **"Open Bike Toolkit"** button
2. Select **"Critical Power"** calculator
3. Enter 2 or 3 distance-time pairs from recent tests:
   - Example 3-point: 400m @ 1:19, 800m @ 2:48, 3200m @ 12:57
4. Click **Calculate**
5. Review results (CP, W', FTP, VO2 Max)
6. Click **"Save to Athlete Profile"**
7. Return to profile → Everything updates automatically

**Option 3: Sync from TrainingPeaks**
1. Go to TrainingPeaks Connect page
2. Click **"Sync from TrainingPeaks"**
3. CP auto-populates from your TP account
4. Source shows "TrainingPeaks"

### What Gets Saved
- ✅ All metric values (CP, LT1, OGC, W')
- ✅ Test results (3/6/12-min power)
- ✅ Test dates and sources
- ✅ Calculated W/kg values
- ✅ Automatically calculated training zones
- ✅ Full test history with edit/delete options

---

## 🏃 RUN TAB - What It Does

### Purpose
Tracks your running pace metrics, training zones, and test history to optimize running performance.

### What You'll See

#### 📊 Top Section: 4 Metric Cards

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│ Critical Speed (CS) │  │    LT1 Pace         │  │    OGC Pace         │  │ D' (Distance Prime) │
│                     │  │                     │  │                     │  │                     │
│ 7:40 /mi (4:46 /km) │  │ 9:35 /mi (5:58 /km) │  │ 8:31 /mi (5:18 /km) │  │  200 m  (656 ft)   │
│                     │  │    125% of CS       │  │    111% of CS       │  │                     │
│  Source: Calculator │  │ Source: Manual      │  │ Source: Manual      │  │ Source: Calculator  │
│  Updated: Jan 15    │  │ Updated: Jan 10     │  │ Updated: Jan 10     │  │ Updated: Jan 15     │
│  [Edit]             │  │ [Edit]              │  │ [Edit]              │  │ [Edit]              │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**What each means:**
- **CS (Critical Speed):** The fastest pace you can sustain for ~45-60 minutes. Roughly equivalent to half-marathon pace.
- **LT1 Pace:** Your first lactate threshold - easy/moderate boundary. Usually 125-130% of CS (slower = higher %).
- **OGC Pace:** Optimal Glycolysis Capacity - the pace at which you burn carbs most efficiently. Usually ~110% of CS.
- **D' (Distance Prime):** Your anaerobic battery - how much distance you can run above CS before exhaustion (meters).

**⚠️ Important:** For pace, slower = higher percentage! 
- 100% of CS = CS pace (e.g., 7:40/mi)
- 125% of CS = slower pace (e.g., 9:35/mi = 7:40 × 1.25)
- 90% of CS = faster pace (e.g., 6:54/mi = 7:40 × 0.90)

#### 🧪 Middle Section: 3 Test Cards

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│   3-Minute Test     │  │   6-Minute Test     │  │  12-Minute Test     │
│                     │  │                     │  │                     │
│    6:30 /mi        │  │    6:54 /mi        │  │    7:12 /mi        │
│  Duration: 3:00    │  │  Duration: 6:00    │  │  Duration: 12:00   │
│  Date: Jan 12      │  │  Date: Jan 12      │  │  Date: Jan 12      │
│  [Edit]            │  │  [Edit]            │  │  [Edit]            │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

**What these are:**
Short, maximal efforts to establish your pace curve and track fitness changes over time.

#### 📈 Bottom Section: Training Zones

**Pace Zones (7 Zones) - Auto-calculated from CS:**
```
Zone  Name                 Low (pace/mi)    High (pace/mi)    % of CS
────────────────────────────────────────────────────────────────────
 1    Active Recovery      11:07            ---            >145%
 2    Easy                  9:35           11:07       125-145%
 3    Aerobic               8:26            9:35       110-125%
 4    Tempo                 7:40            8:26       100-110%
 5    Threshold             7:17            7:40        95-100%
 6    VO2 Max               6:54            7:17         90-95%
 7    Anaerobic              ---            6:54          <90%
```

**Note:** Each zone also shows pace per kilometer for international athletes.

**Heart Rate Zones (5 Zones) - Based on your LTHR:**
```
Zone    Name                  Range (bpm)    % of LTHR
──────────────────────────────────────────────────────
 1      Recovery              0 - 128        0-75%
 2      Aerobic            128 - 145       75-85%
 3      Tempo              145 - 154       85-90%
 4      Threshold          154 - 171      90-100%
 5      VO2 Max            171 - 188     100-110%
```

#### 🎯 Additional Sections

**Pace Interval Targets Table**
Shows calculated interval paces for common race distances (5K, 10K, half marathon, etc.)

**VO2max Run Prescription**
Detailed workout prescriptions with:
- Classic Repeats (e.g., 6 × 800m @ 6:54/mi)
- Kinetics Primed workouts
- Recovery times
- Total distance

### How to Use It

**Option 1: Manual Entry**
1. Click **[Edit]** button on any metric card
2. Enter your pace in **MM:SS format** (e.g., 7:40 for 7 minutes 40 seconds per mile)
3. Select test date
4. Choose source (Manual, Calculator, TrainingPeaks)
5. Click **Save**
6. Zones auto-generate in both /mi and /km

**Option 2: Use Critical Speed Calculator**
1. Click **"Open Run Toolkit"** button
2. Select **"Critical Speed (Run)"** calculator
3. Enter 2 or 3 distance-time pairs from recent tests:
   - Example 3-point: 400m @ 1:19, 800m @ 2:48, 3200m @ 12:57
4. Click **Calculate**
5. Review results:
   - CS pace (e.g., 7:40/mi)
   - D' (e.g., 200m)
   - vVO2max pace (e.g., 7:17/mi)
   - 7 pace zones
   - Physiology type (Standard/Durable)
6. Click **"Save to Athlete Profile"**
7. Return to profile → Everything updates automatically

**Option 3: Manual LTHR Entry**
1. Scroll to **"Lactate Threshold Heart Rate"** section
2. Enter your LTHR in bpm (e.g., 171)
3. Select test date
4. Click **"Save LTHR"**
5. Heart rate zones auto-generate instantly

### What Gets Saved
- ✅ All metric values (CS, LT1, OGC, D')
- ✅ Test results (3/6/12-min pace)
- ✅ Test dates and sources
- ✅ Paces in both /mi and /km
- ✅ Distance in both meters and feet
- ✅ Automatically calculated pace zones (7 zones)
- ✅ Heart rate zones (5 zones from LTHR)
- ✅ VO2max interval prescriptions
- ✅ Full test history with edit/delete options

---

## 🔄 How Data Flows Between Systems

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA FLOW DIAGRAM                              │
└─────────────────────────────────────────────────────────────────────┘

1. CALCULATOR → PROFILE
   ┌──────────────────┐
   │ Athlete Toolkit  │  User calculates CP or CS from test data
   │  (Calculator)    │  
   └────────┬─────────┘
            │ Click "Save to Athlete Profile"
            ▼
   ┌──────────────────┐
   │  Backend API     │  POST /api/athlete-profile/:id/test-history
   │ (Cloudflare D1)  │  → Saves test results
   └────────┬─────────┘  PUT /api/athlete-profile/:id
            │              → Updates profile fields
            ▼
   ┌──────────────────┐
   │ Athlete Profile  │  Auto-refreshes and displays:
   │  (Bike/Run Tab)  │  • Updated metric cards
   └──────────────────┘  • Auto-generated zones
                          • New test history entry

2. MANUAL ENTRY → PROFILE
   ┌──────────────────┐
   │ Athlete Profile  │  User clicks [Edit] button
   │  (Bike/Run Tab)  │  
   └────────┬─────────┘
            │ Edit inline form, click Save
            ▼
   ┌──────────────────┐
   │  Backend API     │  PUT /api/athlete-profile/:id
   │ (Cloudflare D1)  │  → Updates specific fields
   └────────┬─────────┘
            │ Returns updated data
            ▼
   ┌──────────────────┐
   │ Athlete Profile  │  Auto-refreshes:
   │  (Bike/Run Tab)  │  • Metric card updates
   └──────────────────┘  • Zones recalculate
                          • Timestamps update

3. TRAININGPEAKS → PROFILE
   ┌──────────────────┐
   │ TP Connect Page  │  User clicks "Sync from TrainingPeaks"
   └────────┬─────────┘
            │ GET /api/trainingpeaks/metrics/:id
            ▼
   ┌──────────────────┐
   │  Backend API     │  Fetches CP/CS from TrainingPeaks
   │ (TP API + D1)    │  
   └────────┬─────────┘
            │ PUT /api/athlete-profile/:id
            │ → Updates bike_cp, run_cs_seconds
            │ → Sets source = "TrainingPeaks"
            ▼
   ┌──────────────────┐
   │ Athlete Profile  │  Auto-updates with TP data
   │  (Bike/Run Tab)  │  Source shows "TrainingPeaks"
   └──────────────────┘
```

---

## 📱 Navigation Flow

```
https://angela-coach.pages.dev
         │
         ▼
    Coach Dashboard
         │
         ├──► Click Athlete Name
         │         │
         │         ▼
         │    Athlete Profile
         │         │
         │         ├──► [Swim Tab] → Swim metrics & zones
         │         ├──► [Bike Tab] → Bike metrics & zones ⬅️ YOU ARE HERE
         │         ├──► [Run Tab]  → Run metrics & zones ⬅️ YOU ARE HERE
         │         └──► [Profile Tab] → Personal info
         │
         ├──► Open Bike Toolkit
         │         │
         │         ▼
         │    Athlete Calculators
         │         │
         │         ├──► Critical Power (Bike)
         │         ├──► CHO Burn (Bike)
         │         ├──► VO2 Intervals (Bike)
         │         ├──► Critical Speed (Run)
         │         ├──► CHO Burn (Run)
         │         └──► VO2 Intervals (Run)
         │
         └──► TrainingPeaks Connect
                   │
                   └──► Sync athlete data from TP
```

---

## ⚙️ Technical Details (For Developers)

### Database Fields

**Bike Fields (13 total):**
- `bike_cp`, `bike_cp_source`, `bike_cp_updated_at`
- `bike_w_prime`, `bike_w_prime_source`, `bike_w_prime_updated`
- `bike_lt1_power`, `bike_lt1_hr`, `bike_lt1_updated`, `bike_lt1_source`
- `bike_ogc_power`, `bike_ogc_hr`, `bike_ogc_updated`, `bike_ogc_source`
- `bike_power_3min`, `bike_power_3min_duration`, `bike_power_3min_date`
- `bike_power_6min`, `bike_power_6min_duration`, `bike_power_6min_date`
- `bike_power_12min`, `bike_power_12min_duration`, `bike_power_12min_date`

**Run Fields (21 total):**
- `run_cs_seconds`, `run_cs_source`, `run_cs_updated`
- `run_d_prime`, `run_d_prime_source`, `run_d_prime_updated`
- `run_vvo2max_seconds`, `run_vvo2max_source`, `run_vvo2max_updated`
- `run_durability`
- `run_lt1_pace_seconds`, `run_lt1_pace_source`, `run_lt1_pace_updated`
- `run_ogc_pace_seconds`, `run_ogc_pace_source`, `run_ogc_pace_updated`
- `run_pace_3min`, `run_pace_3min_duration`, `run_pace_3min_date`
- `run_pace_6min`, `run_pace_6min_duration`, `run_pace_6min_date`
- `run_pace_12min`, `run_pace_12min_duration`, `run_pace_12min_date`

**Shared Fields:**
- `lactate_threshold_hr`, `lactate_threshold_hr_updated`, `lactate_threshold_hr_source`
- `weight_kg` (for W/kg calculations)

### API Endpoints
- `GET /api/athlete-profile/:id` - Fetch profile
- `PUT /api/athlete-profile/:id` - Update profile fields
- `POST /api/athlete-profile/:id/test-history` - Save test results
- `GET /api/athlete-profile/:id/test-history` - Load test history
- `POST /api/athlete-profile/:id/calculator-output` - Save calculator results
- `GET /api/trainingpeaks/metrics/:id` - Sync from TrainingPeaks

### Key JavaScript Functions

**Bike Tab:**
- `updateBikeMetricCards()` - Populate all metric cards
- `generateAndDisplayPowerZones()` - Calculate 7 power zones
- `generateAndDisplayBikeHRZones()` - Calculate 5 HR zones
- `editBikeCP()`, `saveBikeCPEdit()` - CP editing
- `parseMMSSToSeconds()` - Convert MM:SS to seconds

**Run Tab:**
- `updateRunMetricCards()` - Populate all metric cards
- `generateAndDisplayRunPaceZones()` - Calculate 7 pace zones
- `generateAndDisplayRunHRZones()` - Calculate 5 HR zones
- `editRunCS()`, `saveRunCSEdit()` - CS editing
- `parsePaceMMSS()`, `formatPaceMMSS()` - Pace conversions

---

## 🎓 Example Scenarios

### Scenario A: New Athlete Onboarding (Cyclist)
**Goal:** Set up bike profile from scratch

1. **Navigate to Athlete Profile** with `?athleteId=123`
2. **Click Bike Tab** → See empty metric cards
3. **Option 1: Quick Manual Entry**
   - Click [Edit] on CP card
   - Enter known FTP: 250W (FTP ≈ 95% of CP, so CP ≈ 263W)
   - Enter CP as 263W
   - Select source: "Manual"
   - Click Save
   - **Result:** Power zones auto-generate immediately
4. **Option 2: Use Calculator for Precision**
   - Click "Open Bike Toolkit"
   - Select "Critical Power (Bike)"
   - Enter recent test results:
     - 3-min: 400m @ 1:19 (350W held for 3 minutes)
     - 6-min: 800m @ 2:48 (320W held for 6 minutes)
     - 12-min: 3200m @ 12:57 (295W held for 12 minutes)
   - Click Calculate
   - Review: CP = 280W, W' = 20.5kJ
   - Click "Save to Athlete Profile"
   - **Result:** All metrics + zones populated

5. **Add LTHR for HR Zones**
   - Scroll to "Lactate Threshold Heart Rate"
   - Enter LTHR: 171 bpm
   - Click "Save LTHR"
   - **Result:** 5 HR zones appear

6. **Complete Setup**
   - Profile now shows:
     - ✅ CP: 280W (3.5 W/kg assuming 80kg)
     - ✅ W': 20.5kJ
     - ✅ 7 Power Zones (154W to 420W+)
     - ✅ 5 HR Zones (128 to 188 bpm)
     - ✅ Test history saved

### Scenario B: Runner Testing Fitness After Training Block
**Goal:** Update CS after 8-week training block

1. **Do Field Tests**
   - Week 8, Day 1: 3-min max effort → 6:30/mi avg pace
   - Week 8, Day 3: 6-min max effort → 6:54/mi avg pace
   - Week 8, Day 5: 12-min max effort → 7:12/mi avg pace

2. **Navigate to Run Tab**
   - See old CS: 8:00/mi (from 8 weeks ago)
   - Old D': 180m

3. **Use Critical Speed Calculator**
   - Click "Open Run Toolkit"
   - Select "Critical Speed (Run)"
   - Enter test data:
     - 3-min: 400m @ 1:19 (6:30/mi pace)
     - 6-min: 800m @ 2:48 (6:54/mi pace)
     - 12-min: 3200m @ 12:57 (7:12/mi pace)
   - Click Calculate
   - **Results:**
     - New CS: 7:40/mi (4:46/km) ← 20 seconds faster!
     - New D': 200m ← +20m capacity
     - vVO2max: 7:17/mi
     - Physiology: "Standard" profile
   - Click "Save to Athlete Profile"

4. **Review Updated Profile**
   - CS card: 7:40/mi (was 8:00/mi) ✅ Improved!
   - D' card: 200m (was 180m) ✅ Improved!
   - 7 Pace Zones all updated:
     - Zone 4 (Tempo): 7:40-8:26/mi (was 8:00-8:48/mi)
     - Zone 6 (VO2 Max): 6:54-7:17/mi (was 7:12-7:36/mi)
   - Test history updated with new entries

5. **Use VO2 Intervals Calculator**
   - Stay in toolkit, select "VO2 Intervals (Run)"
   - CS auto-filled: 7:40/mi
   - D' auto-filled: 200m
   - Select weekly volume: 30-37 mi/week
   - Click Calculate
   - **Results:**
     - Classic Repeats: 6 × 800m @ 7:17/mi, 2:00 rest
     - Kinetics Primed: 3 × (4 × 400m @ 7:17/mi, 0:45 rest, 2:00 between sets)
   - Click "Save to Athlete Profile"

6. **Training Plan Updated**
   - Profile now shows personalized VO2 max workouts
   - Coach can assign specific intervals based on current CS/D'
   - Athlete has clear pace targets for next training block

### Scenario C: TrainingPeaks Integration
**Goal:** Sync data from TrainingPeaks automatically

1. **Go to TP Connect Page**
   - URL: https://angela-coach.pages.dev/static/tp-connect-production
   - See list of athletes with TP accounts linked

2. **Click "Sync from TrainingPeaks"**
   - System fetches latest metrics:
     - Bike CP: 285W (from TP)
     - Run CSS: 7:35/mi (from TP)
     - FTP: 270W (from TP)

3. **Navigate to Athlete Profile**
   - Bike Tab:
     - CP: 285W ✅
     - Source: "TrainingPeaks" ✅
     - Updated: Today's date ✅
   - Run Tab:
     - CS: 7:35/mi ✅
     - Source: "TrainingPeaks" ✅
     - Updated: Today's date ✅

4. **Manual Override (If Needed)**
   - If TP data seems wrong, click [Edit]
   - Enter corrected value
   - Select source: "Manual"
   - Click Save
   - **Result:** Manual entry overrides TP data

---

## 📞 Support & Troubleshooting

### Common Questions

**Q: Why is my CP/CS not saving?**
A: Check that:
- Value is greater than 0
- Date is selected
- Source is chosen
- You clicked Save button (not Cancel)

**Q: Zones aren't showing up**
A: Zones require:
- **Power Zones:** CP must be set (bike)
- **Pace Zones:** CS must be set (run)
- **HR Zones:** LTHR must be set (both)

**Q: Pace format not accepting my input**
A: Use MM:SS format:
- ✅ Correct: `7:40` or `07:40`
- ❌ Wrong: `7.67`, `7m40s`, `460`

**Q: Calculator results not appearing in profile**
A: Make sure to:
1. Click "Save to Athlete Profile" in calculator
2. Return to profile page
3. Hard refresh (Ctrl+F5) if needed

**Q: W/kg not calculating**
A: Requires body weight to be set:
- Go to Profile tab
- Enter weight in kg or lbs
- Save changes
- Return to Bike/Run tab → W/kg now displays

### Technical Support
- **Production URL:** https://angela-coach.pages.dev
- **GitHub Repository:** https://github.com/angelanaeth/Block-Race-Planner
- **Latest Deployment:** April 16, 2026
- **Build Version:** 257.05 kB

---

**Document Version:** 1.0  
**Last Updated:** April 16, 2026  
**Status:** ✅ Production Ready
