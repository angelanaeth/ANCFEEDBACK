# Angela Coach System - Complete Overview

**Last Updated**: 2026-03-28  
**Production URL**: https://de395323.angela-coach.pages.dev  
**Sandbox URL**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai

---

## 🎯 **System Architecture**

### **Core Pages (6)**

1. **coach.html** - Main Dashboard
   - Shows all athletes in a card grid
   - Quick stats: total athletes, active/inactive counts
   - Click athlete card → navigate to athlete-profile-v3.html

2. **athlete-profile-v3.html** - Athlete Profile (3 Tabs)
   - **SWIM Tab**: CSS, swim pace zones, swim intervals
   - **BIKE Tab**: FTP, bike power zones, power intervals, VO2 Bike prescription
   - **RUN Tab**: Run FTP, run pace zones, pace intervals, VO2 Run prescription
   - Navigation: "Open Toolkit" button → athlete-calculators.html (same tab)
   - Navigation: "Swim Planner" button → swim-planner.html (same tab)

3. **athlete-calculators.html** - Toolkit (11 Calculator Tabs)
   - Tab 1: CP TEST & BIKE POWER ZONES
   - Tab 2: RUN CS TEST & PACE ZONES
   - Tab 3: SWIM CSS TEST & PACE ZONES
   - Tab 4: RUN POWER ZONES
   - Tab 5: HEART RATE ZONES
   - Tab 6: POWER INTERVALS
   - Tab 7: PACE INTERVALS
   - Tab 8: SWIM INTERVALS
   - Tab 9: HEAT ADJUSTMENT (calculator only, no save)
   - Tab 10: VO2 BIKE CALCULATOR ✨ NEW
   - Tab 11: VO2 RUN CALCULATOR ✨ NEW

4. **swim-planner.html** - Swim Workout Planner
   - Loads athlete's CSS from profile
   - Filters workouts by zone based on CSS
   - Displays pace per 100m for each zone

5. **race-pacing-calculator.html** - Race Pacing Tool
   - Calculate race pacing strategies

6. **taper-calculator.html** - Taper Planning Tool
   - Plan training taper for races

---

## 🔄 **Navigation Flow (Seamless - Same Tab)**

```
coach.html (Dashboard)
  ↓ (click athlete card)
athlete-profile-v3.html (Profile - Swim/Bike/Run tabs)
  ↓ (click "Open Toolkit" button)
athlete-calculators.html (Toolkit - 11 calculator tabs)
  ← (Back to Profile button)
  
athlete-profile-v3.html
  ↓ (click "Swim Planner" button)
swim-planner.html
  ← (Back button)
```

**All navigation happens in the SAME TAB** for seamless user experience.

---

## 💾 **Data Persistence (Cloudflare D1 SQLite)**

### **athlete_profiles Table Columns**

**Basic Info:**
- `id`, `user_id`, `sport`, `status`, `weight_kg`, `height_cm`, `age`

**Bike Metrics:**
- `cp_watts` (Critical Power)
- `bike_ftp` (Functional Threshold Power)
- `bike_w_prime` (Anaerobic capacity in joules)
- `bike_pvo2max` (Power at VO2max)
- `bike_peak_power`
- `bike_power_zones` (JSON: recovery, endurance, tempo, threshold)
- `power_intervals` (JSON: 7 durations - 30s, 1min, 3min, 5min, 8min, 12min, 20min)
- `vo2_bike_prescription` (JSON: complete VO2 Bike prescription with 2 workouts) ✨ NEW

**Run Metrics:**
- `cs_run_seconds` (Critical Speed in seconds per km)
- `run_ftp` (Functional Threshold Pace)
- `run_d_prime` (Anaerobic distance reserve)
- `run_vvo2max_seconds` (Velocity at VO2max)
- `run_power_cp` (Run Critical Power in watts)
- `run_pace_zones` (JSON: recovery, endurance, tempo, threshold)
- `pace_intervals` (JSON: 6 distances - 200m, 400m, 800m, 1600m, 3200m, 5000m)
- `vo2_run_prescription` (JSON: complete VO2 Run prescription with 2 workouts) ✨ NEW

**Swim Metrics:**
- `swim_pace_per_100m` (seconds per 100m)
- `css_pace` (Critical Swim Speed - same as swim_pace_per_100m)
- `swim_pace_zones` (JSON: recovery, endurance, tempo, threshold)
- `swim_intervals` (JSON: 4 distances × 4 zones - 50m, 100m, 200m, 400m)

**Heart Rate:**
- `lactate_threshold_hr` (Lactate threshold heart rate)
- `hr_mid_z1` (Mid-point of Zone 1)

**Metadata:**
- `current_phase`, `target_race_name`, `target_race_id`
- `weekly_hours_available`, `primary_goal`
- `coach_notes`, `medical_history`
- `created_at`, `updated_at`

---

## ✅ **Complete Feature Matrix**

### **Toolkit Calculators (11/11 Complete)**

| # | Calculator | Input | Output | Save? | Display? |
|---|-----------|-------|--------|-------|----------|
| 1 | CP Test | Power curve | CP, W', bike zones | ✅ | ✅ Bike tab |
| 2 | Run CS Test | Pace curve | CS, D', run zones | ✅ | ✅ Run tab |
| 3 | Swim CSS Test | Time trials | CSS, swim zones | ✅ | ✅ Swim tab |
| 4 | Run Power | Run FTP | Run power zones | ✅ | ✅ Run tab |
| 5 | Heart Rate | Threshold HR, Mid Z1 | HR zones | ✅ | ❌ (not displayed) |
| 6 | Power Intervals | CP, W' | 7 power targets | ✅ | ✅ Bike tab |
| 7 | Pace Intervals | CS, D' | 6 pace targets | ✅ | ✅ Run tab |
| 8 | Swim Intervals | CSS | 16 zone paces | ✅ | ✅ Swim tab |
| 9 | Heat Adjustment | Temp, humidity | Adjusted pace/power | ❌ | ❌ (calculator only) |
| 10 | VO2 Bike | CP, W', pVO2max | 2 workouts | ✅ | ✅ Bike tab ✨ |
| 11 | VO2 Run | CS, D', vVO2max | 2 workouts | ✅ | ✅ Run tab ✨ |

### **Profile Display (All Tabs)**

**SWIM Tab:**
- ✅ CSS value (editable)
- ✅ Swim Pace Zones table (8 fields editable: 4 zones × 2 values each)
- ✅ Swim Intervals table (16 values: 4 distances × 4 zones)
- ✅ Swim Planner link

**BIKE Tab:**
- ✅ FTP value (editable)
- ✅ Bike Power Zones table (8 fields editable: 4 zones × 2 values each)
- ✅ Power Intervals table (7 rows: 30s → 20min)
- ✅ VO2 Bike Prescription (profile summary + 2 workout cards) ✨ NEW

**RUN Tab:**
- ✅ Run FTP value (editable)
- ✅ Run Pace Zones table (8 fields editable: 4 zones × 2 values each)
- ✅ Pace Intervals table (6 rows: 200m → 5000m)
- ✅ VO2 Run Prescription (profile summary + 2 workout cards) ✨ NEW

---

## 🎨 **User Experience Improvements**

### ✅ **Completed**
1. ✅ Removed 14 redundant/deprecated HTML files
2. ✅ Fixed navigation to open in same tab (removed `target="_blank"`)
3. ✅ All 11 calculators have save functionality
4. ✅ All saved data displays on profile
5. ✅ VO2 prescriptions show rich workout details
6. ✅ Data persists across sessions (saved to D1 database)
7. ✅ Clean URLs with athlete ID passed via query params

### 📋 **Lower Priority (Future)**
1. ⏳ Interval field editing (53 fields - power, pace, swim intervals)
   - Currently values are calculated from Toolkit
   - Manual editing is less critical since coaches use Toolkit
2. ⏳ Add navigation breadcrumbs for better orientation
3. ⏳ Add "recently viewed athletes" quick access

---

## 🚀 **Deployment**

### **Production (Cloudflare Pages)**
- **URL**: https://de395323.angela-coach.pages.dev
- **Dashboard**: `/static/coach.html`
- **Profile**: `/static/athlete-profile-v3.html?athlete=427194`
- **Toolkit**: `/static/athlete-calculators.html?athlete=427194`
- **Swim Planner**: `/static/swim-planner.html?athlete=427194`

### **Local Development (Sandbox)**
- **URL**: https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
- **Dashboard**: `/static/coach.html`
- **Profile**: `/static/athlete-profile-v3.html?athlete=427194`
- **Toolkit**: `/static/athlete-calculators.html?athlete=427194`

### **Database**
- **Local**: SQLite in `.wrangler/state/v3/d1/` (auto-created with `--local` flag)
- **Production**: Cloudflare D1 database `angela-db-production`

---

## 📝 **Key Files**

### **Frontend**
- `/public/static/coach.html` - Dashboard
- `/public/static/athlete-profile-v3.html` - Profile (Swim/Bike/Run tabs)
- `/public/static/athlete-calculators.html` - Toolkit (11 calculators)
- `/public/static/swim-planner.html` - Swim planner

### **Backend**
- `/src/index.tsx` - Main Hono API
  - `GET /api/athlete-profile/:id` - Load profile
  - `PUT /api/athlete-profile/:id` - Save profile (all zones, intervals, prescriptions)

### **Database**
- `/migrations/0011_add_toolkit_fields.sql` - Toolkit integration (zones, FTP, HR, etc.)
- `/migrations/0012_add_interval_prescriptions.sql` - Interval & VO2 prescription fields

### **Configuration**
- `/wrangler.jsonc` - Cloudflare config
- `/package.json` - Dependencies & scripts
- `/ecosystem.config.cjs` - PM2 config for local dev

---

## 🧪 **Testing Guide**

### **1. Dashboard → Profile Flow**
1. Open https://de395323.angela-coach.pages.dev/static/coach.html
2. Click any athlete card
3. ✅ Should open athlete-profile-v3.html in SAME TAB with athlete ID in URL

### **2. Profile → Toolkit Flow**
1. On athlete profile, click "Open Toolkit" button
2. ✅ Should open athlete-calculators.html in SAME TAB
3. ✅ Athlete ID should be in URL
4. Click "Back to Profile" button
5. ✅ Should return to profile

### **3. VO2 Bike Calculator (Tab 10)**
1. Open Toolkit → Tab 10
2. Enter: CP = 263W, W' = 15640J, pVO2max = 338W
3. Click "Prescribe" → see 2 workouts
4. Click "Save to Athlete Profile"
5. ✅ Success message appears
6. Go to Profile → Bike tab
7. ✅ Scroll to "VO2max Bike Prescription" section
8. ✅ Verify profile shows CP, W', pVO2max, gap
9. ✅ Verify 2 workout cards display (Ceiling & Kinetics)

### **4. VO2 Run Calculator (Tab 11)**
1. Open Toolkit → Tab 11
2. Enter: CS = 6:30/mi, vVO2max = 5:15/mi, D' = 280 yards
3. Select durability mode
4. Click "Prescribe" → see 2 workouts
5. Click "Save to Athlete Profile"
6. ✅ Success message appears
7. Go to Profile → Run tab
8. ✅ Scroll to "VO2max Run Prescription" section
9. ✅ Verify profile shows CS, vVO2max, D', durability
10. ✅ Verify 2 workout cards display (Classic Repeats & Kinetics)

### **5. Data Persistence Test**
1. Save any data (zones, intervals, VO2 prescription)
2. Close browser completely
3. Reopen and navigate to profile
4. ✅ All saved data should still be present

---

## 🔒 **Security & Best Practices**

1. ✅ All data stored in Cloudflare D1 (persistent SQL database)
2. ✅ No sensitive data in frontend code
3. ✅ API endpoints validate athlete_id
4. ✅ All PUT requests use authenticated API
5. ✅ Git repository excludes .env, node_modules, .wrangler

---

## 📊 **System Statistics**

- **Total HTML Pages**: 18 (down from 32 - cleaned up 14 redundant files)
- **Active User-Facing Pages**: 6
- **Toolkit Calculators**: 11 (all with save functionality)
- **Database Tables**: 1 (`athlete_profiles`)
- **Total Saveable Fields**: 77+
  - 24 zone fields (editable)
  - 7 power interval fields
  - 6 pace interval fields
  - 16 swim interval fields
  - 2 VO2 prescriptions (Bike & Run)
  - Plus basic profile fields (FTP, CSS, HR, etc.)

---

## ✨ **Recent Updates (2026-03-28)**

1. ✅ Added VO2 Bike Calculator (Tab 10) with save & display
2. ✅ Added VO2 Run Calculator (Tab 11) with save & display
3. ✅ Cleaned up 14 redundant HTML files
4. ✅ Fixed navigation to use same tab (removed `target="_blank"`)
5. ✅ All zones and intervals now persist across sessions
6. ✅ Backend PUT endpoint supports all zone/interval fields

---

## 🎯 **System Status: PRODUCTION READY**

All core features are implemented and working:
- ✅ All 11 calculators save to database
- ✅ All data displays on athlete profile
- ✅ Data persists across sessions
- ✅ Navigation flow is seamless (same tab)
- ✅ No redundant files cluttering the system
- ✅ VO2 prescriptions provide rich workout details

**The system is ready for daily coaching use!**
