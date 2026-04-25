# 📅 TEST DATES AUDIT - SWIM, BIKE, RUN

## ✅ CURRENT STATUS OF TEST DATES

### **SWIM TAB** ✅

#### **Main Metric Card**
- ✅ `css_updated_at` - Exists in database
- Display: Shows date on CSS card

#### **Test History Tables**
- ✅ `css_test_history` table has `test_date` column
- ✅ `swim_interval_history` table has `test_date` column
- ✅ `swim_cho_history` table has `test_date` column

**SWIM STATUS**: ✅ **COMPLETE** - All dates present

---

### **BIKE TAB** ✅

#### **Main Metric Cards**
- ✅ `bike_cp_updated_at` - Bike CP updated timestamp
- ✅ `bike_lt1_ogc_updated_at` - LT1/OGC updated timestamp
- ✅ `bike_w_prime_updated_at` - W' updated timestamp
- ✅ `bike_lthr_manual_updated_at` - Manual LTHR updated

#### **3/6/12 Min Test Dates**
- ✅ `bike_power_3min_date` - DATE column (exists!)
- ✅ `bike_power_6min_date` - DATE column (exists!)
- ✅ `bike_power_12min_date` - DATE column (exists!)

#### **Test History Tables**
- ✅ `cp_test_history` table has `test_date` column
- ✅ `bike_zones_history` table has `test_date` column
- ✅ `bike_vo2_history` table has `test_date` column
- ✅ `bike_best_effort_history` table has `test_date` column
- ✅ `bike_low_cadence_history` table has `test_date` column
- ✅ `bike_cho_history` table has `test_date` column
- ✅ `bike_training_zones_history` table has `test_date` column
- ✅ `lt1_ogc_test_history` table has `test_date` column

**BIKE STATUS**: ✅ **COMPLETE** - All dates present including 3/6/12 min tests

---

### **RUN TAB** ⚠️ **NEEDS DATES ADDED**

#### **Main Metric Cards** (Need timestamps)
- ❌ `run_cs_updated_at` - NEEDS TO BE ADDED
- ❌ `run_lt1_updated_at` - NEEDS TO BE ADDED
- ❌ `run_ogc_updated_at` - NEEDS TO BE ADDED
- ❌ `run_d_prime_updated_at` - NEEDS TO BE ADDED
- ❌ `run_lthr_manual_updated_at` - NEEDS TO BE ADDED

#### **3/6/12 Min Test Dates** (Need DATE columns)
- ❌ `run_pace_3min_date` - NEEDS TO BE ADDED
- ❌ `run_pace_6min_date` - NEEDS TO BE ADDED
- ❌ `run_pace_12min_date` - NEEDS TO BE ADDED

#### **Test History Tables** (Need to be created)
- ❌ `run_cs_history` table - NEEDS TO BE CREATED with `test_date`
- ✅ `run_pace_zones_history` - Already exists with `test_date`
- ✅ `run_vo2_history` - Already exists with `test_date`
- ✅ `run_best_effort_history` - Already exists with `test_date`
- ✅ `run_cho_history` - Already exists with `test_date`
- ✅ `run_training_zones_history` - Already exists with `test_date`

**RUN STATUS**: ⚠️ **INCOMPLETE** - Missing date columns for main metrics and 3/6/12 min tests

---

## 📊 COMPLETE DATABASE SCHEMA FOR RUN (WITH DATES)

### **Updated Run Profile Schema (21 columns total)**

```sql
-- Critical Speed
run_cs                    INTEGER   -- CS in seconds per mile
run_cs_source             TEXT      -- 'calculator', 'manual'
run_cs_updated_at         TEXT      -- ✅ TIMESTAMP (NEW)

-- Distance Prime
run_d_prime               INTEGER   -- D' in meters
run_d_prime_source        TEXT      -- 'calculator', 'manual'
run_d_prime_updated_at    TEXT      -- ✅ TIMESTAMP (NEW)

-- Pace Tests (3/6/12 min) with DATES
run_pace_3min             INTEGER   -- 3-min pace (sec/mile)
run_pace_3min_duration    INTEGER   -- Duration (seconds)
run_pace_3min_date        TEXT      -- ✅ DATE (NEW)

run_pace_6min             INTEGER   
run_pace_6min_duration    INTEGER   
run_pace_6min_date        TEXT      -- ✅ DATE (NEW)

run_pace_12min            INTEGER   
run_pace_12min_duration   INTEGER   
run_pace_12min_date       TEXT      -- ✅ DATE (NEW)

-- LT1/OGC (Manual entry only) with timestamps
run_lt1_pace              INTEGER   -- LT1 pace (sec/mile)
run_lt1_updated_at        TEXT      -- ✅ TIMESTAMP (NEW)

run_ogc_pace              INTEGER   -- OGC pace (sec/mile)
run_ogc_updated_at        TEXT      -- ✅ TIMESTAMP (NEW)

-- Manual LTHR with timestamp
run_lthr_manual           INTEGER   -- Manual LTHR (bpm)
run_lthr_manual_updated_at TEXT     -- ✅ TIMESTAMP (NEW)
```

**Total: 21 columns** (was 18, added 3 date columns + 5 timestamp columns)

---

## 📋 MIGRATIONS NEEDED FOR RUN

### **Add Missing Date/Timestamp Columns**

```sql
-- Add timestamp columns for main metrics
ALTER TABLE athlete_profiles ADD COLUMN run_cs_updated_at TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_d_prime_updated_at TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_lt1_updated_at TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_ogc_updated_at TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_lthr_manual_updated_at TEXT;

-- Add date columns for 3/6/12 min tests
ALTER TABLE athlete_profiles ADD COLUMN run_pace_3min_date TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_6min_date TEXT;
ALTER TABLE athlete_profiles ADD COLUMN run_pace_12min_date TEXT;
```

---

## ✅ VERIFICATION CHECKLIST

### **SWIM**
- [x] CSS has updated_at timestamp
- [x] All history tables have test_date
- [x] Dates displayed on metric cards
- [x] Dates displayed in test history

### **BIKE**
- [x] CP has updated_at timestamp
- [x] LT1/OGC have updated_at timestamps
- [x] W' has updated_at timestamp
- [x] 3/6/12 min tests have DATE columns ✅
- [x] All history tables have test_date
- [x] Dates displayed on metric cards ✅
- [x] Dates displayed on test cards ✅
- [x] Dates displayed in test history

### **RUN** (TO BE FIXED)
- [ ] CS needs updated_at timestamp ❌
- [ ] D' needs updated_at timestamp ❌
- [ ] LT1/OGC need updated_at timestamps ❌
- [ ] 3/6/12 min tests need DATE columns ❌
- [ ] Manual LTHR needs updated_at timestamp ❌
- [x] Some history tables have test_date (zones, vo2, etc.)
- [ ] CS test history table needs to be created ❌
- [ ] Dates need to be displayed on metric cards ❌
- [ ] Dates need to be displayed on test cards ❌

---

## 🎯 ACTION PLAN FOR RUN PROFILE

### **Phase 1: Database & API (Updated)**

**Add 8 new date/timestamp columns:**
1. `run_cs_updated_at` - When CS was last updated
2. `run_d_prime_updated_at` - When D' was last updated
3. `run_lt1_updated_at` - When LT1 was last updated
4. `run_ogc_updated_at` - When OGC was last updated
5. `run_lthr_manual_updated_at` - When LTHR was last updated
6. `run_pace_3min_date` - Date of 3 min test
7. `run_pace_6min_date` - Date of 6 min test
8. `run_pace_12min_date` - Date of 12 min test

**Total Run columns: 21** (was 18, now includes all dates)

### **Phase 2: Frontend Layout**

**Display dates on ALL metric cards:**
- CS card: "Apr 12, 2026"
- LT1 card: "Apr 10, 2026"
- OGC card: "Apr 10, 2026"
- D' card: "Apr 10, 2026"

**Display dates on ALL test cards:**
- 3 min test: "Apr 12, 2026"
- 6 min test: "Apr 12, 2026"
- 12 min test: "Apr 12, 2026"

**Display dates in test history table:**
- Date column for each test row
- Format: "Apr 12, 2026" or "MM/DD/YYYY"

---

## ✅ UPDATED RUN PROFILE TIME ESTIMATE

| Phase | Task | Time |
|-------|------|------|
| 1 | Database & API (21 columns with dates) | 2h |
| 2 | Frontend Layout (with date displays) | 5h |
| 3 | Calculator Integration (3) | 1h |
| 4 | Display Functions (with date formatting) | 1.5h |
| 5 | Edit Functions (with date handling) | 1.5h |
| 6 | Testing & Deployment | 1h |
| **TOTAL** | | **12h** |

**Slightly longer (was 11.5h)** because we're adding proper date handling throughout.

---

## 🚀 READY TO START WITH COMPLETE DATE SUPPORT?

**This ensures Run Profile has:**
- ✅ Full date parity with Bike Profile
- ✅ Dates on all metric cards
- ✅ Dates on all 3/6/12 min test cards
- ✅ Dates in all test history tables
- ✅ Timestamp tracking for all updates
- ✅ Consistent with Swim and Bike tabs

**Shall I proceed with Phase 1 (Database & API with all date columns)?** 🏃‍♀️

---

**Date**: April 15, 2026  
**Status**: ✅ Date requirements confirmed for Swim, Bike, and Run  
**Updated Plan**: Run Profile with complete date/timestamp support
