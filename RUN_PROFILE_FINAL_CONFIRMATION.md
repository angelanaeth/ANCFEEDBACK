# 🏃 RUN PROFILE - FINAL CONFIRMED REQUIREMENTS

## 🎯 CONFIRMED - IDENTICAL PATTERN TO BIKE PROFILE

Based on the successful Bike Profile implementation, the Run Profile will follow the **exact same structure and pattern**, adapted for running metrics.

---

## 📋 **RUN vs BIKE - KEY DIFFERENCES**

### **Bike Profile Uses:**
- **Critical Power (CP)** in watts
- **LT1 Power** and **OGC Power** in watts
- **W'** (anaerobic capacity) in kilojoules
- **Power zones** (watts and W/kg)
- **3/6/12 min power tests**

### **Run Profile Will Use:**
- **Critical Speed (CS)** in pace (min:sec/mile or /km)
- **LT1 Pace** and **OGC Pace** in pace
- **D'** (distance prime) in meters
- **Pace zones** (min:sec/mile or /km)
- **3/6/12 min pace tests** or distance-based tests

---

## 1. ✅ TOP METRIC CARDS (4 cards)

### **Run-Specific Metrics:**

```
┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐  ┌──────────────────┐
│ Critical Speed (CS)     │  │ LT1 Pace                │  │ OGC Pace                │  │ D' (Distance)    │
│ 7:30 /mile              │  │ 8:45 /mile              │  │ 7:50 /mile              │  │ 350 meters       │
│ 4:40 /km                │  │ 86% of CS ⬅             │  │ 96% of CS ⬅             │  │ Apr 10, 2026     │
│ Apr 12, 2026            │  │ 5:26 /km                │  │ 4:52 /km                │  │ (from CS test)   │
│ (3-point test)          │  │ Apr 10, 2026            │  │ Apr 10, 2026            │  │ [Edit]           │
│ [Edit]                  │  │ (LT1/OGC test)          │  │ (LT1/OGC test)          │  └──────────────────┘
└─────────────────────────┘  │ [Edit]                  │  │ [Edit]                  │
                             └─────────────────────────┘  └─────────────────────────┘
```

**Features:**
- ✅ **CS (Critical Speed)** displayed in both /mile and /km
- ✅ **LT1 Pace as % CS** auto-calculated (e.g., 86% of CS)
- ✅ **OGC Pace as % CS** auto-calculated (e.g., 96% of CS)
- ✅ **D' (Distance Prime)** in meters
- ✅ **Dual unit display** (both imperial and metric)
- ✅ **Full dates** (e.g., "Apr 12, 2026")
- ✅ **Inline edit buttons** for all metrics
- ✅ **Test source labels**

**Database columns needed:**
- `run_cs` (Critical Speed in seconds per mile)
- `run_cs_source` (test type)
- `run_cs_updated_at` (timestamp)
- `run_lt1_pace` (LT1 pace in seconds per mile)
- `run_lt1_hr` (LT1 heart rate)
- `run_ogc_pace` (OGC pace in seconds per mile)
- `run_ogc_hr` (OGC heart rate)
- `run_lt1_ogc_source` (test protocol)
- `run_lt1_ogc_updated_at` (timestamp)
- `run_d_prime` (D' in meters)
- `run_d_prime_source` (test type)
- `run_d_prime_updated_at` (timestamp)

---

## 2. ✅ PACE TEST CARDS (3/6/12 Minute or Distance Tests)

### **Two Options for Testing:**

**Option A: Time-Based (3/6/12 min)**
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

**Option B: Distance-Based (800m/1600m/3200m)**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ 800m Test       │  │ 1600m Test      │  │ 3200m Test      │
│ 3:15 (time)     │  │ 6:55 (time)     │  │ 14:20 (time)    │
│ 6:28 /mile      │  │ 6:54 /mile      │  │ 7:10 /mile      │
│ 4:02 /km        │  │ 4:17 /km        │  │ 4:27 /km        │
│ Apr 12, 2026    │  │ Apr 12, 2026    │  │ Apr 12, 2026    │
│ [Edit]          │  │ [Edit]          │  │ [Edit]          │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

**Features:**
- ✅ **Editable durations/times** (e.g., 3:15 for 800m)
- ✅ **Pace display** in both /mile and /km
- ✅ **Full dates** for each test
- ✅ **Auto-populate from CS calculator**
- ✅ **Manual edit** capability

**Database columns:**
- `run_pace_3min`, `run_pace_3min_duration`, `run_pace_3min_date`
- `run_pace_6min`, `run_pace_6min_duration`, `run_pace_6min_date`
- `run_pace_12min`, `run_pace_12min_duration`, `run_pace_12min_date`

---

## 3. ✅ TWO TYPES OF PACE ZONES

### **A) BASIC ZONES (from CS only)**

```
┌────────────────────────────────────────────────────────────────────┐
│ PACE ZONES (Basic - from CS only)                                 │
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
💡 For personalized zones, upload a LT1/OGC test
```

**Zone percentages (% CS):**
- ZR: < 79% CS (slower than CS)
- Z1: 79-86% CS
- Z2: 86-94% CS
- Z3: 94-100% CS (at CS)
- Z4: 100-107% CS
- Z5: 107-115% CS
- Z6: > 115% CS

---

### **B) EXPANDED ZONES (from CS + LT1 + OGC)**

```
┌────────────────────────────────────────────────────────────────────┐
│ PACE ZONES (Expanded - Personalized with LT1 & OGC)               │
│ CS: 7:30/mile | LT1: 8:45/mile (86% CS) | OGC: 7:50/mile (96% CS)│
│ Based on LT1/OGC test (Apr 10, 2026)                     [Edit]   │
├────────────────────────────────────────────────────────────────────┤
│ Zone │ Name          │ Pace /mile  │ Pace /km  │ % CS    │ Date   │
│──────┼───────────────┼─────────────┼───────────┼─────────┼────────│
│ ZR   │ Recovery      │ >9:30       │ >5:54     │ <79%    │ Apr 10 │ ← Below LT1
│ Z1   │ Easy          │ 8:45-9:30   │ 5:26-5:54 │ 79-86%  │ Apr 10 │ ← Up to LT1
│ Z2   │ Aerobic       │ 8:10-8:45   │ 5:04-5:26 │ 86-91%  │ Apr 10 │ ← LT1 to mid
│ Z3   │ Tempo         │ 7:50-8:10   │ 4:52-5:04 │ 91-96%  │ Apr 10 │ ← Mid to OGC
│ Z4   │ Threshold     │ 7:20-7:50   │ 4:33-4:52 │ 96-102% │ Apr 10 │ ← Above OGC
│ Z5   │ VO2max        │ 6:50-7:20   │ 4:15-4:33 │102-110% │ Apr 10 │
│ Z6   │ Speed         │ <6:50       │ <4:15     │ >110%   │ Apr 10 │
└────────────────────────────────────────────────────────────────────┘
✅ Expanded zones using LT1 (8:45/mile) and OGC (7:50/mile) thresholds
```

**Zone logic:**
- **ZR**: Below LT1 pace (recovery)
- **Z1**: Up to LT1 pace (easy aerobic)
- **Z2**: LT1 to midpoint between LT1 and OGC (steady aerobic)
- **Z3**: Midpoint to OGC pace (tempo)
- **Z4**: OGC to 107% CS (threshold)
- **Z5**: 107-115% CS (VO2max)
- **Z6**: > 115% CS (speed/anaerobic)

---

## 4. ✅ HEART RATE ZONES (3-Tier Priority)

### **Priority 1: LT1/OGC Test HR** (Most Accurate)
```
Source: LT1/OGC Test (Apr 10, 2026) | LT1 HR: 150 bpm | OGC HR: 170 bpm

┌────────────────────────────────────────────────────────────────────┐
│ Zone │ Name      │ HR Range     │ % LTHR  │ LT1/OGC  │ Date       │
│──────┼───────────┼──────────────┼─────────┼──────────┼────────────│
│ Z1   │ Recovery  │ 0-129 bpm    │ <76%    │ <LT1     │ Apr 10, 26 │
│ Z2   │ Aerobic   │ 129-150 bpm  │ 76-88%  │ @LT1 ✅  │ Apr 10, 26 │
│ Z3   │ Tempo     │ 150-159 bpm  │ 88-94%  │ LT1-OGC  │ Apr 10, 26 │
│ Z4   │ Threshold │ 159-170 bpm  │ 94-100% │ @OGC ✅  │ Apr 10, 26 │
│ Z5   │ VO2max    │ 170-184 bpm  │100-108% │ >OGC     │ Apr 10, 26 │
└────────────────────────────────────────────────────────────────────┘
✅ Priority 1: HR zones derived from LT1/OGC test (most accurate)
```

### **Priority 2: Manual LTHR** (Fallback)
```
Source: Manual Entry | LTHR: 170 bpm

┌────────────────────────────────────────────────────────────────────┐
│ Zone │ Name      │ HR Range     │ % LTHR  │ Date       │
│──────┼───────────┼──────────────┼─────────┼────────────│
│ Z1   │ Recovery  │ 0-128 bpm    │ <75%    │ Apr 10, 26 │
│ Z2   │ Aerobic   │ 128-145 bpm  │ 75-85%  │ Apr 10, 26 │
│ Z3   │ Tempo     │ 145-153 bpm  │ 85-90%  │ Apr 10, 26 │
│ Z4   │ Threshold │ 153-170 bpm  │ 90-100% │ Apr 10, 26 │
│ Z5   │ VO2max    │ 170-187 bpm  │100-110% │ Apr 10, 26 │
└────────────────────────────────────────────────────────────────────┘
⚠️ Priority 2: HR zones from manual LTHR. Upload LT1/OGC test for personalized zones
```

### **Priority 3: Empty State**
```
No HR zones defined. Upload a LT1/OGC test or set manual LTHR.
[Edit] button to add manual LTHR
```

---

## 5. ✅ MULTI-SPORT HR ZONES TABLE

```
┌────────────────────────────────────────────────────────────────────┐
│ Multi-Sport Heart Rate Zones (Side-by-Side Comparison)            │
├────────────────────────────────────────────────────────────────────┤
│ Sport │ LT HR │ Z1        │ Z2        │ Z3        │ Z4        │ Z5        │ Date       │
│───────┼───────┼───────────┼───────────┼───────────┼───────────┼───────────┼────────────│
│ Bike  │ 165   │ 0-125     │ 125-145   │ 145-154   │ 154-165   │ 165-178   │ Apr 10, 26 │
│ Run   │ 170   │ 0-129     │ 129-150   │ 150-159   │ 159-170   │ 170-184   │ Apr 10, 26 │ ✅
│ Swim  │ 155   │ 0-116     │ 116-132   │ 132-140   │ 140-155   │ 155-171   │ ---        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 6. ✅ TEST HISTORY TABLES

### **CS Test History**
```
┌────────────────────────────────────────────────────────────────────┐
│ Critical Speed Test History                                        │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ CS (/mile) │ D' (m) │ 3min  │ 6min  │ 12min │ Actions│
│────────────┼────────────┼────────┼───────┼───────┼───────┼────────│
│ Apr 12, 26 │ 7:30       │ 350    │ 6:30  │ 7:00  │ 7:20  │ [E][D] │
│ Mar 15, 26 │ 7:40       │ 340    │ 6:40  │ 7:10  │ 7:30  │ [E][D] │
│ Feb 10, 26 │ 7:50       │ 330    │ 6:50  │ 7:20  │ 7:40  │ [E][D] │
└────────────────────────────────────────────────────────────────────┘
[Add Manual Test]
```

### **LT1/OGC Test History**
```
┌────────────────────────────────────────────────────────────────────┐
│ LT1/OGC Test History                                               │
├────────────────────────────────────────────────────────────────────┤
│ Date       │ LT1 Pace │ LT1 HR │ OGC Pace │ OGC HR │ Protocol│ Actions│
│────────────┼──────────┼────────┼──────────┼────────┼─────────┼────────│
│ Apr 10, 26 │ 8:45/mi  │ 150    │ 7:50/mi  │ 170    │ Step    │ [E][D] │
│ Mar 5, 26  │ 8:55/mi  │ 148    │ 8:00/mi  │ 168    │ Ramp    │ [E][D] │
│ Jan 20, 26 │ 9:05/mi  │ 145    │ 8:10/mi  │ 165    │ Step    │ [E][D] │
└────────────────────────────────────────────────────────────────────┘
[Add Manual Test]
```

---

## 7. ✅ CALCULATOR INTEGRATION (6 Calculators)

All calculators have **"Save to Profile"** buttons:

1. **Critical Speed Calculator** ✅
   - Saves: CS, D', 3/6/12 min tests with durations and dates
   - Updates: Metric cards, test history

2. **LT1/OGC Pace Analysis** ✅
   - Saves: LT1 pace/HR, OGC pace/HR, protocol, dates
   - Updates: Metric cards, pace zones, HR zones

3. **Run Pace Zones** ✅
   - Saves: CS, D', pace zones
   - Updates: Pace zones table

4. **VO2max Run Intervals** ✅
   - Saves: 4-week interval prescription, target paces
   - Updates: Test history

5. **Best Effort Pace** ✅
   - Saves: Target paces for various distances
   - Updates: Pace intervals table

6. **Training Zones (All Sports)** ✅
   - Saves: HR zones for Bike, Run, Swim
   - Updates: Multi-sport HR zones table

---

## 8. ✅ INLINE EDIT CAPABILITY

Edit forms for:
- **CS** (pace in /mile or /km, date, source)
- **LT1** (pace, HR, date)
- **OGC** (pace, HR, date)
- **D'** (distance in meters, date)
- **3/6/12 min tests** (pace, **duration**, date)
- **Manual LTHR** (HR, date)

---

## 📊 DATABASE SCHEMA (24 new columns)

### **Run-Specific Columns:**

```sql
-- Critical Speed
run_cs                    INTEGER   -- CS in seconds per mile
run_cs_source             TEXT      -- '2-point', '3-point', 'manual'
run_cs_updated_at         TEXT      -- ISO timestamp

-- LT1/OGC
run_lt1_pace              INTEGER   -- LT1 pace in seconds per mile
run_lt1_hr                INTEGER   -- LT1 heart rate (bpm)
run_ogc_pace              INTEGER   -- OGC pace in seconds per mile
run_ogc_hr                INTEGER   -- OGC heart rate (bpm)
run_lt1_ogc_source        TEXT      -- Test protocol
run_lt1_ogc_updated_at    TEXT      -- ISO timestamp

-- Distance Prime
run_d_prime               INTEGER   -- D' in meters
run_d_prime_source        TEXT      -- Test type
run_d_prime_updated_at    TEXT      -- ISO timestamp

-- Pace Tests
run_pace_3min             INTEGER   -- 3-min test pace (sec/mile)
run_pace_3min_duration    INTEGER   -- Actual duration (seconds)
run_pace_3min_updated_at  TEXT      -- ISO timestamp
run_pace_6min             INTEGER   -- 6-min test pace (sec/mile)
run_pace_6min_duration    INTEGER   -- Actual duration (seconds)
run_pace_6min_updated_at  TEXT      -- ISO timestamp
run_pace_12min            INTEGER   -- 12-min test pace (sec/mile)
run_pace_12min_duration   INTEGER   -- Actual duration (seconds)
run_pace_12min_updated_at TEXT      -- ISO timestamp

-- Manual LTHR
run_lthr_manual           INTEGER   -- Manual LTHR (bpm)
run_lthr_manual_updated_at TEXT     -- ISO timestamp
```

---

## 🎯 IMPLEMENTATION PHASES (Same as Bike)

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Database & API (24 columns) | 2h |
| 2 | Frontend Layout (HTML/CSS) | 6h |
| 3 | Calculator Integration (6) | 1h |
| 4 | Display Functions (JS) | 2h |
| 5 | Edit Functions (JS) | 2h |
| 6 | Testing & Deployment | 1h |
| **TOTAL** | **Run Profile Feature** | **14h** |

---

## ✅ CONFIRMED REQUIREMENTS CHECKLIST

- [x] 4 metric cards (CS, LT1 with % CS, OGC with % CS, D')
- [x] Dates everywhere (full dates like "Apr 12, 2026")
- [x] Dual unit display (both /mile and /km)
- [x] Editable zones and inline edit forms
- [x] HR zones with 3-tier priority (LT1/OGC → Manual LTHR → Empty)
- [x] Test history tables (CS and LT1/OGC)
- [x] 3/6/12 min pace tests with editable duration
- [x] Two pace zone sets (basic CS-only and expanded using LT1/OGC)
- [x] All 6 calculators have "Save to Profile" buttons
- [x] Matches Bike and Swim tab layout
- [x] Multi-sport HR zones comparison table
- [x] Duration parsing (MM:SS)
- [x] Error handling and validation

---

## 🚀 READY TO PROCEED?

This plan follows the **exact same successful pattern** as the Bike Profile:
- Same database structure (24 columns)
- Same frontend layout (4 metric cards, test cards, zones, history)
- Same calculator integration (6 calculators)
- Same JavaScript patterns (display, edit, helper functions)
- Same testing approach (comprehensive verification)

**Estimated time**: 14 hours (same as Bike)  
**Expected result**: 100% feature parity with Bike tab, adapted for running metrics

---

**Ready to start Phase 1?** 🏃‍♀️

**Date**: April 15, 2026  
**Status**: ✅ All requirements confirmed, ready for implementation
