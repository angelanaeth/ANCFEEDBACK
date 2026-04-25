# 🏃 RUN PROFILE - REVISED CONFIRMED PLAN

## 🎯 CLARIFICATIONS BASED ON FEEDBACK

### **What Calculators Actually Exist:**
1. ✅ **Critical Speed (Run)** - EXISTS but NO save button yet
2. ✅ **CHO Burn (Run)** - EXISTS with save button (`saveCHORunToProfile()`)
3. ✅ **VO₂ Intervals (Run)** - EXISTS with save button (`saveVO2RunToProfile()`)

**Note**: No LT1/OGC calculator exists for Run yet → All LT1/OGC will be **manual entry only**

---

## 📊 SIMPLIFIED STRUCTURE

### **1. TOP METRIC CARDS (4 cards)**

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐
│ Critical Speed (CS)     │  │ LT1 Pace                │  │ OGC Pace                │  │ D' (Distance)    │
│ 7:30 /mile              │  │ 8:45 /mile              │  │ 7:50 /mile              │  │ 350 meters       │
│ 4:40 /km                │  │ 86% of CS ⬅             │  │ 96% of CS ⬅             │  │ Apr 10, 2026     │
│ Apr 12, 2026            │  │ 5:26 /km                │  │ Apr 10, 2026            │  │ (manual entry)   │
│ (CS calculator)         │  │ Apr 10, 2026            │  │ (manual entry)          │  │ [Edit]           │
│ [Edit]                  │  │ (manual entry)          │  │ [Edit]                  │  └──────────────────┘
└─────────────────────────┘  │ [Edit]                  │  └─────────────────────────┘
                             └─────────────────────────┘
```

**Features:**
- ✅ CS from calculator (when we add save button) OR manual entry
- ✅ LT1 & OGC: **Manual entry only** (no calculator yet)
- ✅ D' from calculator OR manual entry
- ✅ % CS auto-calculated for LT1 and OGC
- ✅ Dual units (/mile and /km)

---

### **2. PACE TEST CARDS (3 tests)**

**Higher priority - show these prominently:**

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 3 Min Test      │  │ 6 Min Test      │  │ 12 Min Test     │
│ 6:30 /mile      │  │ 7:00 /mile      │  │ 7:20 /mile      │
│ 4:02 /km        │  │ 4:21 /km        │  │ 4:33 /km        │
│ Duration: 3:00  │  │ Duration: 6:00  │  │ Duration: 12:00 │
│ Apr 12, 2026    │  │ Apr 12, 2026    │  │ Apr 12, 2026    │
│ [Edit]          │  │ [Edit]          │  │ [Edit]          │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Priority: HIGH** - Show these tests prominently at top of Run tab
- Auto-populate from CS calculator (when save added)
- Manual edit capability

---

### **3. PACE ZONES (BASIC ONLY - Manual Entry)**

Since no LT1/OGC calculator exists, we'll only implement **BASIC zones from CS**:

```
┌────────────────────────────────────────────────────────────────────┐
│ PACE ZONES (from CS)                                               │
│ Based on CS: 7:30/mile (4:40/km) (Apr 12, 2026)          [Edit]   │
├────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ Pace /mile  │ Pace /km  │ % CS    │ Date   │
│──────┼───────────────┼─────────────┼───────────┼─────────┼────────│
│ ZR   │ Recovery      │ >9:30       │ >5:54     │ <79%    │ Apr 12 │
│ Z1   │ Easy          │ 8:45-9:30   │ 5:26-5:54 │ 79-86%  │ Apr 12 │
│ Z2   │ Aerobic       │ 8:00-8:45   │ 4:58-5:26 │ 86-94%  │ Apr 12 │
│ Z3   │ Tempo         │ 7:30-8:00   │ 4:40-4:58 │ 94-100% │ Apr 12 │
│ Z4   │ Threshold     │ 7:00-7:30   │ 4:21-4:40 │100-107% │ Apr 12 │
│ Z5   │ VO2max        │ 6:30-7:00   │ 4:02-4:21 │107-115% │ Apr 12 │
│ Z6   │ Speed         │ <6:30       │ <4:02     │ >115%   │ Apr 12 │
└────────────────────────────────────────────────────────────────────┘
```

**Auto-calculate from CS** - Generate all 7 zones using % of CS
**Manual edit** - Allow inline editing of zone boundaries

**NO expanded zones** (no LT1/OGC calculator available)

---

### **4. HEART RATE ZONES (SIMPLIFIED - NO 3-TIER)**

**Based on your feedback, simplified to just Manual LTHR:**

```
┌────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (Run)                                             │
│ Based on Manual LTHR: 170 bpm (Apr 10, 2026)            [Edit]    │
├────────────────────────────────────────────────────────────────────┤
│ Zone │ Name      │ HR Range     │ % LTHR  │ Date       │
│──────┼───────────┼──────────────┼─────────┼────────────│
│ Z1   │ Recovery  │ 0-128 bpm    │ <75%    │ Apr 10, 26 │
│ Z2   │ Aerobic   │ 128-145 bpm  │ 75-85%  │ Apr 10, 26 │
│ Z3   │ Tempo     │ 145-153 bpm  │ 85-90%  │ Apr 10, 26 │
│ Z4   │ Threshold │ 153-170 bpm  │ 90-100% │ Apr 10, 26 │
│ Z5   │ VO2max    │ 170-187 bpm  │100-110% │ Apr 10, 26 │
└────────────────────────────────────────────────────────────────────┘
```

**Simple approach:**
- Manual LTHR entry only
- 5 HR zones calculated from % LTHR
- No 3-tier priority (too complex without LT1/OGC test data)

---

### **5. CS TEST HISTORY**

```
┌────────────────────────────────────────────────────────────────────┐
│ Critical Speed Test History                                        │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ CS (/mile) │ D' (m) │ 3min  │ 6min  │ 12min │ Actions│
│────────────┼────────────┼────────┼───────┼───────┼───────┼────────│
│ Apr 12, 26 │ 7:30       │ 350    │ 6:30  │ 7:00  │ 7:20  │ [E][D] │
│ Mar 15, 26 │ 7:40       │ 340    │ 6:40  │ 7:10  │ 7:30  │ [E][D] │
└────────────────────────────────────────────────────────────────────┘
[Add Manual Test]
```

---

### **6. CALCULATOR INTEGRATION**

**Only 3 calculators (2 have save buttons already):**

1. ✅ **Critical Speed Calculator** - Will ADD save button
   - Saves: CS, D', 3/6/12 min tests
   - Function: `saveCSToProfile()` (NEW)

2. ✅ **CHO Burn (Run)** - Already has save button
   - Saves: CHO workout data
   - Function: `saveCHORunToProfile()` (EXISTS)

3. ✅ **VO₂ Intervals (Run)** - Already has save button
   - Saves: VO2 interval prescription
   - Function: `saveVO2RunToProfile()` (EXISTS)

**Total: 3 calculators** (not 6 like Bike)

---

## 📊 REVISED DATABASE SCHEMA (Simpler - ~18 columns)

```sql
-- Critical Speed
run_cs                    INTEGER   -- CS in seconds per mile
run_cs_source             TEXT      -- 'calculator', 'manual'
run_cs_updated_at         TEXT      -- ISO timestamp

-- Distance Prime
run_d_prime               INTEGER   -- D' in meters
run_d_prime_source        TEXT      -- 'calculator', 'manual'
run_d_prime_updated_at    TEXT      -- ISO timestamp

-- Pace Tests (3/6/12 min)
run_pace_3min             INTEGER   -- 3-min pace (sec/mile)
run_pace_3min_duration    INTEGER   -- Duration (seconds)
run_pace_3min_updated_at  TEXT      
run_pace_6min             INTEGER   
run_pace_6min_duration    INTEGER   
run_pace_6min_updated_at  TEXT      
run_pace_12min            INTEGER   
run_pace_12min_duration   INTEGER   
run_pace_12min_updated_at TEXT      

-- LT1/OGC (Manual entry only)
run_lt1_pace              INTEGER   -- LT1 pace (sec/mile)
run_lt1_updated_at        TEXT      
run_ogc_pace              INTEGER   -- OGC pace (sec/mile)
run_ogc_updated_at        TEXT      

-- Manual LTHR
run_lthr_manual           INTEGER   -- Manual LTHR (bpm)
run_lthr_manual_updated_at TEXT     
```

**Total: 18 columns** (simplified from 24)

---

## 🎯 REVISED IMPLEMENTATION PLAN

| Phase | Description | Time | Notes |
|-------|-------------|------|-------|
| 1 | Database & API (18 columns) | 1.5h | Fewer columns than Bike |
| 2 | Frontend Layout (HTML/CSS) | 5h | Simpler (no expanded zones, no 3-tier HR) |
| 3 | Calculator Integration (3 only) | 1h | Add CS save, verify 2 existing |
| 4 | Display Functions (JS) | 1.5h | Basic zones only, simpler HR |
| 5 | Edit Functions (JS) | 1.5h | Fewer edit forms |
| 6 | Testing & Deployment | 1h | Same testing rigor |
| **TOTAL** | **Run Profile Feature** | **11.5h** | Simpler than Bike (was 14h) |

---

## ✅ REVISED REQUIREMENTS CHECKLIST

### **What We're Building:**
- [x] 4 metric cards (CS, LT1, OGC, D')
- [x] CS and D' from calculator (will add save button)
- [x] LT1 and OGC: **manual entry only**
- [x] % CS auto-calculated for LT1 and OGC
- [x] 3/6/12 min pace tests with editable duration (HIGH PRIORITY)
- [x] Basic pace zones from CS (7 zones)
- [x] **NO expanded zones** (no LT1/OGC calculator)
- [x] Simple HR zones from manual LTHR only
- [x] **NO 3-tier HR priority** (too complex without test data)
- [x] CS test history table
- [x] Inline edit for all metrics
- [x] Dual units (/mile and /km)
- [x] Matches Bike/Swim tab styling

### **What We're NOT Building:**
- ❌ Expanded pace zones (no LT1/OGC calculator)
- ❌ LT1/OGC test history (manual entry only, not enough for history)
- ❌ 3-tier HR zone priority (no test data to support it)
- ❌ Multi-sport HR zones (can add later if needed)

---

## 🚀 READY TO START?

**Simplified from original plan:**
- 18 database columns (not 24)
- 3 calculators (not 6)
- Basic zones only (no expanded)
- Simple HR zones (no 3-tier priority)
- 11.5 hours estimated (not 14)

**Focus on:**
- ✅ CS and tests prominently displayed
- ✅ Simple, clear zone calculations
- ✅ Manual entry for LT1/OGC (no calculator needed)
- ✅ Clean, working implementation

---

## 📝 EXACT CALCULATORS TO CONNECT

### **1. Critical Speed Calculator** (NEW save button needed)
**Location**: `data-tab="critical-speed-run"`  
**Function to create**: `saveCSToProfile()`  
**Saves**: CS, D', 3/6/12 min pace tests

### **2. CHO Burn (Run)** (Already has save)
**Location**: `data-tab="cho-run"`  
**Function**: `saveCHORunToProfile()` ✅ EXISTS  
**Saves**: CHO workout data

### **3. VO₂ Intervals (Run)** (Already has save)
**Location**: `data-tab="vo2-run"`  
**Function**: `saveVO2RunToProfile()` ✅ EXISTS  
**Saves**: VO2 interval prescription

---

**Shall I proceed with this simplified, realistic plan?** 🏃‍♀️

**Date**: April 15, 2026  
**Status**: ✅ Revised based on feedback, ready to start
