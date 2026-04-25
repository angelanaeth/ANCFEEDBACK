# ✅ BIKE PROFILE - FINAL CONFIRMED REQUIREMENTS

## 🎯 ALL USER REQUIREMENTS CONFIRMED - READY TO IMPLEMENT

Based on your detailed specifications, here's the complete implementation plan with ALL requirements addressed:

---

## 1. ✅ ENHANCED METRIC CARDS (Top of Bike Tab)

### **4 Cards with Full Details:**

```
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐  ┌──────────────────┐
│ Critical Power (CP) │  │ LT1 Power           │  │ OGC Power           │  │ W' (Anaerobic)   │
│ 250 W               │  │ 180 W               │  │ 230 W               │  │ 20.5 kJ          │
│ 3.8 W/kg            │  │ 72% of CP ⬅         │  │ 92% of CP ⬅         │  │ 310 J/kg         │
│ Apr 12, 2026        │  │ 2.7 W/kg            │  │ 3.5 W/kg            │  │ Apr 10, 2026     │
│ (3-point test)      │  │ Apr 10, 2026        │  │ Apr 10, 2026        │  │ (from CP test)   │
│ [Edit]              │  │ (LT1/OGC test)      │  │ (LT1/OGC test)      │  │ [Edit]           │
└─────────────────────┘  │ [Edit]              │  │ [Edit]              │  └──────────────────┘
                         └─────────────────────┘  └─────────────────────┘
```

**Features:**
- ✅ **Full dates** (e.g., "Apr 12, 2026")
- ✅ **LT1 as % CP** auto-calculated and displayed
- ✅ **OGC as % CP** auto-calculated and displayed
- ✅ **W/kg values** for CP, LT1, OGC (requires body_weight_kg)
- ✅ **Inline edit buttons** for all metrics
- ✅ **Test source labels** (e.g., "3-point test", "LT1/OGC test")
- ✅ **Auto-save from calculators** + **manual edit capability**

---

## 2. ✅ POWER TEST CARDS (3/6/12 Minute Tests)

### **Editable Duration + Power + Date:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ POWER TESTS (for Critical Power Calculation)                        │
├──────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│ │ 3 Min Test      │  │ 6 Min Test      │  │ 12 Min Test     │      │
│ │ 320 W           │  │ 290 W           │  │ 265 W           │      │
│ │ Duration: 3:00  │  │ Duration: 6:00  │  │ Duration: 12:00 │      │
│ │ Apr 12, 2026    │  │ Apr 12, 2026    │  │ Apr 12, 2026    │      │
│ │ [Edit]          │  │ [Edit]          │  │ [Edit]          │      │
│ └─────────────────┘  └─────────────────┘  └─────────────────┘      │
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ **Editable durations** (e.g., user can change 3:00 to 2:45, 6:00 to 5:30, etc.)
- ✅ **Editable power values** for each test
- ✅ **Full dates** for each test
- ✅ **Auto-populate from CP calculator** when "Save to Profile" is clicked
- ✅ **Manual edit** capability via inline forms

**Database columns:**
- `bike_power_3min`, `bike_power_3min_duration`, `bike_power_3min_date`
- `bike_power_6min`, `bike_power_6min_duration`, `bike_power_6min_date`
- `bike_power_12min`, `bike_power_12min_duration`, `bike_power_12min_date`

---

## 3. ✅ TWO TYPES OF POWER ZONES

### **A) BASIC ZONES (from CP only - when NO LT1/OGC)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ POWER ZONES (Basic - from CP only)                                  │
│ Based on CP: 250W (Apr 12, 2026)                            [Edit]  │
├──────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ Power Range │ % CP    │ W/kg    │ Date       │
│──────┼───────────────┼─────────────┼─────────┼─────────┼────────────│
│ ZR   │ Recovery      │ 0-140 W     │ <56%    │ 0-2.1   │ Apr 12     │
│ Z1   │ Endurance     │ 140-175 W   │ 56-70%  │ 2.1-2.6 │ Apr 12     │
│ Z2   │ Tempo         │ 175-213 W   │ 70-85%  │ 2.6-3.2 │ Apr 12     │
│ Z3   │ Threshold     │ 213-250 W   │ 85-100% │ 3.2-3.8 │ Apr 12     │
│ Z4   │ VO2max        │ 250-300 W   │100-120% │ 3.8-4.5 │ Apr 12     │
│ Z5   │ Anaerobic     │ 300-375 W   │120-150% │ 4.5-5.7 │ Apr 12     │
│ Z6   │ Neuromuscular │ >375 W      │ >150%   │ >5.7    │ Apr 12     │
└──────────────────────────────────────────────────────────────────────┘
💡 For personalized zones, upload a LT1/OGC test (FIT file)
```

**Zone percentages (% CP):**
- ZR: < 56% CP
- Z1: 56-70% CP
- Z2: 70-85% CP
- Z3: 85-100% CP (at CP)
- Z4: 100-120% CP
- Z5: 120-150% CP
- Z6: > 150% CP

---

### **B) EXPANDED ZONES (from CP + LT1 + OGC - Personalized)**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ POWER ZONES (EXPANDED - Personalized with LT1/OGC)                      │
│ CP: 250W | LT1: 180W (72% CP) | OGC: 230W (92% CP) | Apr 10     [Edit] │
├──────────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ Power Range│ % CP  │ LT1/OGC  │ W/kg  │ Date    │
│──────┼───────────────┼────────────┼───────┼──────────┼───────┼─────────│
│ ZR   │ Recovery      │ 0-140 W    │ <56%  │ <LT1     │ 0-2.1 │ Apr 10  │
│ Z1   │ Aerobic Base  │ 140-180 W  │ 56-72%│ @LT1 ⬅   │ 2.1-2.7│ Apr 10 │
│ Z2   │ Tempo         │ 180-205 W  │ 72-82%│ LT1-OGC  │ 2.7-3.1│ Apr 10 │
│ Z3   │ Threshold     │ 205-230 W  │ 82-92%│ @OGC ⬅   │ 3.1-3.5│ Apr 10 │
│ Z4   │ VO2max        │ 230-275 W  │92-110%│ >OGC     │ 3.5-4.2│ Apr 10 │
│ Z5   │ Anaerobic     │ 275-340 W  │110-136│          │ 4.2-5.2│ Apr 10 │
│ Z6   │ Neuromuscular │ >340 W     │ >136% │          │ >5.2   │ Apr 10 │
└──────────────────────────────────────────────────────────────────────────┘
✅ Zones personalized using LT1 (180W at 72% CP) and OGC (230W at 92% CP)
💡 W/kg calculated from body weight (66kg)
```

**Zone logic:**
- **If LT1 and OGC available:** Use expanded zones (personalized thresholds)
- **If only CP available:** Use basic zones (% of CP)
- **Both show:** % CP, W/kg, full dates, and edit buttons

---

## 4. ✅ HEART RATE ZONES (3-Tier Priority System)

### **Priority 1: LT1/OGC Test HR (Best)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (from LT1/OGC Test)                                │
│ Source: LT1/OGC Test (Apr 10, 2026) | LT1 HR: 145 bpm | OGC HR: 165│
│                                                              [Edit]  │
├──────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ HR Range     │ % LTHR  │ LT1/OGC  │ Date     │
│──────┼───────────────┼──────────────┼─────────┼──────────┼──────────│
│ Z1   │ Recovery      │ 0-125 bpm    │ <76%    │ <LT1     │ Apr 10   │
│ Z2   │ Aerobic       │ 125-145 bpm  │ 76-88%  │ @LT1 ⬅   │ Apr 10   │
│ Z3   │ Tempo         │ 145-154 bpm  │ 88-93%  │ LT1-OGC  │ Apr 10   │
│ Z4   │ Threshold     │ 154-165 bpm  │ 93-100% │ @OGC ⬅   │ Apr 10   │
│ Z5   │ VO2max        │ 165-178 bpm  │100-108% │ >OGC     │ Apr 10   │
└──────────────────────────────────────────────────────────────────────┘
✅ HR zones derived from LT1/OGC test (most accurate)
```

---

### **Priority 2: Manual LTHR (Fallback)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (from Manual LTHR)                                 │
│ Source: Manual Entry (Apr 5, 2026) | LTHR: 165 bpm         [Edit]  │
├──────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ HR Range     │ % LTHR  │ Date     │           │
│──────┼───────────────┼──────────────┼─────────┼──────────┤           │
│ Z1   │ Recovery      │ 0-124 bpm    │ <75%    │ Apr 5    │           │
│ Z2   │ Aerobic       │ 124-140 bpm  │ 75-85%  │ Apr 5    │           │
│ Z3   │ Tempo         │ 140-149 bpm  │ 85-90%  │ Apr 5    │           │
│ Z4   │ Threshold     │ 149-165 bpm  │ 90-100% │ Apr 5    │           │
│ Z5   │ VO2max        │ 165-182 bpm  │100-110% │ Apr 5    │           │
└──────────────────────────────────────────────────────────────────────┘
💡 For personalized HR zones, upload a LT1/OGC test (FIT file)
```

---

### **Priority 3: Training Zones Calculator (Fallback)**

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (from Training Zones Calculator)                   │
│ Source: Lactate Threshold Zones Calculator (Apr 1, 2026)   [Edit]  │
├──────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ HR Range     │ % Max HR │ Date     │          │
│──────┼───────────────┼──────────────┼──────────┼──────────┤          │
│ Z1   │ Recovery      │ 0-133 bpm    │ <70%     │ Apr 1    │          │
│ Z2   │ Aerobic       │ 133-152 bpm  │ 70-80%   │ Apr 1    │          │
│ Z3   │ Tempo         │ 152-171 bpm  │ 80-90%   │ Apr 1    │          │
│ Z4   │ Threshold     │ 171-181 bpm  │ 90-95%   │ Apr 1    │          │
│ Z5   │ VO2max        │ 181-190 bpm  │ 95-100%  │ Apr 1    │          │
└──────────────────────────────────────────────────────────────────────┘
💡 For more accurate HR zones, add manual LTHR or upload LT1/OGC test
```

**Priority Logic:**
```javascript
function getHRZoneSource(profile) {
  // Priority 1: LT1/OGC test HR (most accurate)
  if (profile.bike_lt1_hr && profile.bike_ogc_hr) {
    return { source: 'LT1/OGC Test', date: profile.bike_lt1_updated, hr_data: {...} };
  }
  
  // Priority 2: Manual LTHR
  if (profile.bike_lthr_manual) {
    return { source: 'Manual LTHR', date: profile.bike_lthr_manual_updated, lthr: profile.bike_lthr_manual };
  }
  
  // Priority 3: Training Zones calculator
  if (profile.hr_zones_bike) {
    return { source: 'Training Zones Calculator', date: profile.hr_zones_updated, zones: profile.hr_zones_bike };
  }
  
  return null; // No HR data
}
```

---

## 5. ✅ ALL-SPORT HR ZONES (Reference from Run Tab)

```
┌──────────────────────────────────────────────────────────────────────┐
│ MULTI-SPORT HEART RATE ZONES                                        │
│ Use the Lactate Threshold Training Zones Calculator for multi-sport │
│                                                    [Open Calculator] │
├──────────────────────────────────────────────────────────────────────┤
│ Sport │ LT HR    │ Z1 (Recovery) │ Z2 (Aerobic) │ Z3 (Tempo)       │
│───────┼──────────┼───────────────┼──────────────┼──────────────────│
│ Bike  │ 165 bpm  │ 0-124 bpm     │ 124-140 bpm  │ 140-149 bpm      │
│ Run   │ 172 bpm  │ 0-129 bpm     │ 129-146 bpm  │ 146-155 bpm      │
│ Swim  │ 158 bpm  │ 0-119 bpm     │ 119-134 bpm  │ 134-142 bpm      │
└──────────────────────────────────────────────────────────────────────┘
💡 Multi-sport zones account for sport-specific HR responses
```

**Source:** Same as Run tab, use `athlete-calculators.html` "Lactate Threshold Training Zones" calculator

---

## 6. ✅ TEST HISTORY TABLES (with Dates)

### **CP Test History:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ CRITICAL POWER TEST HISTORY                           [Add Manual]  │
├──────────────────────────────────────────────────────────────────────┤
│ Date       │ Test Type    │ CP (W) │ W' (kJ) │ 3min  │ 6min  │ 12min│
│────────────┼──────────────┼────────┼─────────┼───────┼───────┼──────│
│ Apr 12, 26 │ 3-point test │ 250    │ 20.5    │ 320W  │ 290W  │ 265W │
│ Mar 15, 26 │ 2-point test │ 245    │ 19.8    │ -     │ 285W  │ 260W │
│ Feb 10, 26 │ 3-point test │ 240    │ 18.5    │ 310W  │ 280W  │ 255W │
└──────────────────────────────────────────────────────────────────────┘
```

---

### **LT1/OGC Test History:**

```
┌──────────────────────────────────────────────────────────────────────┐
│ LT1 / OGC TEST HISTORY                        [Upload FIT File]     │
├──────────────────────────────────────────────────────────────────────┤
│ Date       │ LT1 Power│ LT1 HR │ OGC Power│ OGC HR │ Protocol       │
│────────────┼──────────┼────────┼──────────┼────────┼────────────────│
│ Apr 10, 26 │ 180 W    │ 145    │ 230 W    │ 165    │ Ramp (30W/3min)│
│ Mar 5, 26  │ 175 W    │ 143    │ 225 W    │ 162    │ Ramp (20W/3min)│
│ Jan 20, 26 │ 170 W    │ 140    │ 220 W    │ 160    │ Ramp (30W/3min)│
└──────────────────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ **Full dates** for all test history rows
- ✅ **Editable rows** (inline edit or modal)
- ✅ **Auto-populate from calculators** when "Save to Profile" is clicked
- ✅ **Manual add buttons** for each test type

---

## 7. ✅ CALCULATOR AUTO-SAVE & INTEGRATION

### **6 Calculators with "Save to Profile" Buttons:**

1. **Critical Power Calculator**
   - File: `athlete-calculators.html` (line ~73)
   - Button: `[Save to Profile]`
   - Saves: CP, W', 3min/6min/12min power (with durations + dates)
   
2. **LT1/OGC Analysis Calculator**
   - File: `athlete-calculators.html` (line ~851)
   - Button: `[Save to Profile]` (already exists, needs enhancement)
   - Saves: LT1 power/HR, OGC power/HR, expanded zones
   
3. **Bike Power Zones — Expanded**
   - File: `athlete-calculators.html` (line ~735)
   - Button: `[Save to Profile]` (NEW)
   - Saves: 7 expanded power zones with W/kg
   
4. **VO2max Bike Prescription**
   - File: `athlete-calculators.html` (line ~782)
   - Button: `[Save to Profile]` (NEW)
   - Saves: VO2 interval prescriptions
   
5. **Best Effort Wattage Calculator**
   - File: `athlete-calculators.html` (line ~139)
   - Button: `[Save to Profile]` (NEW)
   - Saves: 1-60 min power targets
   
6. **Lactate Threshold Training Zones**
   - File: `athlete-calculators.html` (line ~503)
   - Button: `[Save to Profile]` (already exists)
   - Saves: HR zones for all 3 sports (Bike, Run, Swim)

**Auto-save workflow:**
```
1. User fills out calculator → clicks "Calculate"
2. Results display with "[Save to Profile]" button
3. User clicks "[Save to Profile]"
4. JavaScript calls PUT /api/athlete-profile/:id with new data
5. Profile updates instantly
6. User navigates to Athlete Profile → Bike tab
7. All data auto-populated from saved profile
```

---

## 8. ✅ INLINE EDIT & MANUAL INPUT

**Every section has edit capability:**

### **Metric Card Edit:**
```javascript
function editCP() {
  // Show inline form:
  // - CP (W): [250] 
  // - W' (kJ): [20.5]
  // - Test Date: [Apr 12, 2026]
  // [Save] [Cancel]
  
  // On save: PUT /api/athlete-profile/:id
  axios.put(`/api/athlete-profile/${athleteId}`, {
    bike_cp: cpValue,
    bike_w_prime: wPrimeValue,
    bike_cp_updated_at: testDate
  });
}
```

### **Power Test Edit (with Duration):**
```javascript
function edit3MinPower() {
  // Show inline form:
  // - Duration (MM:SS): [03:00]
  // - Power (W): [320]
  // - Test Date: [Apr 12, 2026]
  // [Save] [Cancel]
  
  // On save: PUT /api/athlete-profile/:id
  axios.put(`/api/athlete-profile/${athleteId}`, {
    bike_power_3min: powerValue,
    bike_power_3min_duration: durationSeconds, // converted from MM:SS
    bike_power_3min_date: testDate
  });
}
```

### **Manual LTHR Edit:**
```javascript
function editManualLTHR() {
  // Show inline form:
  // - Manual LTHR (bpm): [165]
  // - Updated: [Apr 5, 2026]
  // [Save] [Cancel]
  
  // On save: PUT /api/athlete-profile/:id
  axios.put(`/api/athlete-profile/${athleteId}`, {
    bike_lthr_manual: lthrValue,
    bike_lthr_manual_updated: new Date().toISOString()
  });
}
```

**All edits:**
- ✅ **Inline forms** (not modals)
- ✅ **Instant save** to database (PUT /api/athlete-profile/:id)
- ✅ **Dates included** in all edits
- ✅ **Consistent styling** with Swim tab

---

## 9. ✅ IMPLEMENTATION PHASES

### **Phase 1: ✅ COMPLETE (100%)**
- Database schema (24 new columns)
- API routes (PUT /api/athlete-profile/:id)
- Migration and deployment

### **Phase 2: 🔄 IN PROGRESS (40%)**
- Frontend layout (HTML structure)
- Metric cards, test cards, zone tables
- ✅ Basic structure done
- ⏳ Need to finish HR zones and edit forms

### **Phase 3: ⏳ PENDING (0%)**
- Calculator integration
- 6 "Save to Profile" buttons
- Auto-populate logic

### **Phase 4: ⏳ PENDING (0%)**
- JavaScript display functions
- Zone calculation logic
- Priority HR logic

### **Phase 5: ⏳ PENDING (0%)**
- Inline edit functions
- Manual input forms
- Save handlers

### **Phase 6: ⏳ PENDING (0%)**
- Testing and deployment
- Verification and QA

**Total Estimate:** 14-16 hours
**Progress:** 40% complete (Phases 1 + 2 mostly done)

---

## 10. ✅ KEY FEATURES SUMMARY

| Requirement | Status | Details |
|-------------|--------|---------|
| **% of CP for LT1/OGC** | ✅ Confirmed | Auto-calculated, displayed in metric cards |
| **Two zone sets** | ✅ Confirmed | Basic (CP only) + Expanded (CP+LT1+OGC) |
| **HR zones priority** | ✅ Confirmed | LT1/OGC → Manual LTHR → Training Zones |
| **All-sport HR zones** | ✅ Confirmed | Reference Run tab, use Training Zones calc |
| **Dates included** | ✅ Confirmed | Full dates in all metric cards, tests, zones |
| **Editable durations** | ✅ Confirmed | 3/6/12 min power tests have editable durations |
| **Top metric cards** | ✅ Confirmed | 4 cards: CP, LT1, OGC, W' with full details |
| **Edit in place** | ✅ Confirmed | All sections have inline edit capability |
| **Auto-save from calcs** | ✅ Confirmed | 6 calculators with "Save to Profile" buttons |
| **Mimic Swim tab** | ✅ Confirmed | Same layout, styling, and functionality |

---

## 11. ✅ DATABASE COLUMNS (All Created in Phase 1)

```sql
-- Critical Power & W'
bike_cp INTEGER
bike_w_prime REAL
bike_cp_updated_at TEXT

-- LT1 Power & HR
bike_lt1_power INTEGER
bike_lt1_hr INTEGER
bike_lt1_updated TEXT
bike_lt1_source TEXT

-- OGC Power & HR
bike_ogc_power INTEGER
bike_ogc_hr INTEGER

-- 3/6/12 Min Power Tests
bike_power_3min INTEGER
bike_power_3min_duration INTEGER  -- in seconds
bike_power_3min_date TEXT

bike_power_6min INTEGER
bike_power_6min_duration INTEGER
bike_power_6min_date TEXT

bike_power_12min INTEGER
bike_power_12min_duration INTEGER
bike_power_12min_date TEXT

-- Manual LTHR (fallback)
bike_lthr_manual INTEGER
bike_lthr_manual_updated TEXT

-- Body Weight (for W/kg)
body_weight_kg REAL
```

**All columns exist and are working** ✅

---

## 12. ✅ NEXT STEPS

### **Immediate (Phase 2 Completion - 2 hours):**
1. Finish HR Zones section with 3-tier priority display
2. Add inline edit forms for all metrics
3. Complete power zone table logic (basic vs expanded)
4. Add all-sport HR zones reference section

### **Then (Phase 3 - 3 hours):**
1. Add "Save to Profile" to CP calculator
2. Enhance LT1/OGC calculator save function
3. Add "Save to Profile" to 4 other calculators
4. Test auto-populate workflow

### **Then (Phase 4 - 2 hours):**
1. Write display functions (loadCPTestHistory, etc.)
2. Write zone calculation functions
3. Write HR priority logic
4. Test all display logic

### **Then (Phase 5 - 2 hours):**
1. Write inline edit functions
2. Write save handlers
3. Test all edit flows

### **Finally (Phase 6 - 1 hour):**
1. Full end-to-end testing
2. Deploy to production
3. Verify all URLs and functionality

**Total remaining: ~10 hours**

---

## ✅ CONFIRMATION COMPLETE

**All requirements confirmed:**
- ✅ % of CP for LT1 and OGC
- ✅ Two power zone sets (basic + expanded)
- ✅ Power zones from just CP
- ✅ HR zones with 3-tier priority
- ✅ All-sport HR zones reference
- ✅ Dates on everything
- ✅ Top metric cards
- ✅ Editable durations for power tests
- ✅ Edit in place capability
- ✅ Auto-save from 6 calculators

**Ready to proceed with implementation?** 🚀

---

**Files:**
- Plan: `/home/user/webapp/BIKE_PROFILE_FINAL_CONFIRMATION.md`
- Progress: `/home/user/webapp/BIKE_PROFILE_IMPLEMENTATION_PROGRESS.md`
- Original: `/home/user/webapp/BIKE_PROFILE_CONFIRMED_PLAN.md`

**Current Status:** Phase 1 ✅ Complete, Phase 2 🔄 40% complete
