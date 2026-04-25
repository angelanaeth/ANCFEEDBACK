# 🏃 RUN PROFILE - COMPLETE FINAL PLAN

## ✅ ALL REQUIREMENTS CONFIRMED

### **1. EDITING ACCESS ✅**
**Every metric and test has inline edit capability:**
- CS metric card → [Edit] button → Edit form
- D' metric card → [Edit] button → Edit form
- LT1 metric card → [Edit] button → Edit form
- OGC metric card → [Edit] button → Edit form
- 3 min test → [Edit] button → Edit form (pace, duration, date)
- 6 min test → [Edit] button → Edit form (pace, duration, date)
- 12 min test → [Edit] button → Edit form (pace, duration, date)
- Manual LTHR → [Edit] button → Edit form
- Pace zones → Manual edit capability
- Test history rows → [Edit] button on each row

**Total: 10+ inline edit functions** (same as Bike)

---

### **2. DELETION ACCESS ✅**
**Every test history row has delete capability:**
- CS test history → [Delete] button on each row
- Calculator outputs → [Delete] button on each saved result
- Confirmation dialog before deletion
- Updates profile after deletion

**Delete functions:**
- `deleteRunCSTest(testId)` - Delete CS test from history
- `deleteRunCalculatorOutput(testId, type)` - Delete any saved calculator result
- All deletions update the UI immediately

---

### **3. CALCULATOR INTEGRATION ✅**
**All 3 Run calculators connect to profile with "Save to Profile" buttons:**

#### **Calculator 1: Critical Speed (Run)**
- **Location**: Bike Toolkit → Critical Speed (Run) tab
- **Save Button**: "💾 Save to Athlete Profile" (WILL ADD)
- **Function**: `saveCSToProfile()` (NEW)
- **What it saves**:
  - `run_cs` (Critical Speed in sec/mile)
  - `run_d_prime` (Distance Prime in meters)
  - `run_pace_3min` + `run_pace_3min_duration` + `run_pace_3min_date`
  - `run_pace_6min` + `run_pace_6min_duration` + `run_pace_6min_date`
  - `run_pace_12min` + `run_pace_12min_duration` + `run_pace_12min_date`
  - Source: 'Critical Speed Calculator'
  - Timestamps for all fields
- **Updates**: CS card, D' card, 3/6/12 min test cards, CS test history

#### **Calculator 2: CHO Burn (Run)**
- **Location**: Bike Toolkit → CHO Burn (Run) tab
- **Save Button**: "💾 Save to Athlete Profile" ✅ EXISTS
- **Function**: `saveCHORunToProfile()` ✅ EXISTS
- **What it saves**: CHO workout data to `run_cho_history` table
- **Updates**: Run CHO history section

#### **Calculator 3: VO₂ Intervals (Run)**
- **Location**: Bike Toolkit → VO₂ Intervals (Run) tab
- **Save Button**: "💾 Save to Athlete Profile" ✅ EXISTS
- **Function**: `saveVO2RunToProfile()` ✅ EXISTS
- **What it saves**: VO2 interval prescription to `run_vo2_history` table
- **Updates**: Run VO2 prescription section

---

### **4. AUTO-UPDATE WHEN SAVED ✅**
**When "Save to Profile" is clicked:**

1. **Calculator sends data** via POST to `/api/athlete-profile/:id/test-history`
2. **API saves to database** (athlete_profiles table + history tables)
3. **Success response** returned to calculator
4. **Calculator shows alert**: "✅ Saved to Run Profile!"
5. **User navigates** to Athlete Profile → Run tab
6. **Profile auto-loads** latest data from database
7. **UI updates** showing new values:
   - Metric cards refresh with new CS, D', LT1, OGC
   - Test cards refresh with new 3/6/12 min paces and dates
   - Test history table adds new row
   - Dates update to current test date

**Flow:**
```
Calculator → Click "Save" → API → Database → Success → 
Navigate to Profile → Load data → Display updated numbers ✅
```

---

## 📊 COMPLETE DATABASE SCHEMA (21 columns)

```sql
-- Critical Speed with timestamp
run_cs                     INTEGER   -- CS in seconds per mile
run_cs_source              TEXT      -- 'calculator', 'manual'
run_cs_updated_at          TEXT      -- Timestamp

-- Distance Prime with timestamp
run_d_prime                INTEGER   -- D' in meters
run_d_prime_source         TEXT      -- 'calculator', 'manual'
run_d_prime_updated_at     TEXT      -- Timestamp

-- 3 Min Pace Test with DATE
run_pace_3min              INTEGER   -- Pace in sec/mile
run_pace_3min_duration     INTEGER   -- Duration in seconds
run_pace_3min_date         TEXT      -- Test date

-- 6 Min Pace Test with DATE
run_pace_6min              INTEGER   -- Pace in sec/mile
run_pace_6min_duration     INTEGER   -- Duration in seconds
run_pace_6min_date         TEXT      -- Test date

-- 12 Min Pace Test with DATE
run_pace_12min             INTEGER   -- Pace in sec/mile
run_pace_12min_duration    INTEGER   -- Duration in seconds
run_pace_12min_date        TEXT      -- Test date

-- LT1 Pace with timestamp (Manual entry)
run_lt1_pace               INTEGER   -- LT1 pace in sec/mile
run_lt1_updated_at         TEXT      -- Timestamp

-- OGC Pace with timestamp (Manual entry)
run_ogc_pace               INTEGER   -- OGC pace in sec/mile
run_ogc_updated_at         TEXT      -- Timestamp

-- Manual LTHR with timestamp
run_lthr_manual            INTEGER   -- Manual LTHR in bpm
run_lthr_manual_updated_at TEXT      -- Timestamp
```

**Total: 21 columns**

---

## 📋 COMPLETE EDIT FUNCTIONS (10 functions)

### **1. editRunCS() / saveRunCSEdit()**
- Edit CS value, date, source
- Recalculates pace zones
- Updates CS test history

### **2. editRunDPrime() / saveRunDPrimeEdit()**
- Edit D' value, date, source
- Updates D' card

### **3. editRunLT1() / saveRunLT1Edit()**
- Edit LT1 pace, date
- Recalculates % CS
- Updates LT1 card

### **4. editRunOGC() / saveRunOGCEdit()**
- Edit OGC pace, date
- Recalculates % CS
- Updates OGC card

### **5. editRun3MinTest() / saveRun3MinEdit()**
- Edit 3 min pace, duration (MM:SS), date
- Updates test card

### **6. editRun6MinTest() / saveRun6MinEdit()**
- Edit 6 min pace, duration (MM:SS), date
- Updates test card

### **7. editRun12MinTest() / saveRun12MinEdit()**
- Edit 12 min pace, duration (MM:SS), date
- Updates test card

### **8. editRunLTHR() / saveRunLTHREdit()**
- Edit manual LTHR, date
- Recalculates HR zones

### **9. editRunPaceZone() / saveRunPaceZone()**
- Edit individual pace zone boundaries
- Manual zone customization

### **10. editRunTestHistory() / saveRunTestHistoryEdit()**
- Edit historical test data
- Update test history row

---

## 🗑️ DELETE FUNCTIONS (2 functions)

### **1. deleteRunCSTest(testId)**
```javascript
async function deleteRunCSTest(testId) {
  if (!confirm('Delete this CS test from history?')) return;
  
  const response = await fetch(`/api/athlete-profile/${athleteId}/test-history/${testId}`, {
    method: 'DELETE',
    body: JSON.stringify({ calculator_type: 'critical-speed-run' })
  });
  
  if (response.ok) {
    alert('✅ Test deleted');
    loadRunTestHistories(); // Reload
  }
}
```

### **2. deleteRunCalculatorOutput(testId, type)**
```javascript
async function deleteRunCalculatorOutput(testId, type) {
  if (!confirm('Delete this saved result?')) return;
  
  const response = await fetch(`/api/athlete-profile/${athleteId}/test-history/${testId}`, {
    method: 'DELETE',
    body: JSON.stringify({ calculator_type: type })
  });
  
  if (response.ok) {
    alert('✅ Deleted');
    loadRunCalculatorOutputs(); // Reload
  }
}
```

---

## 🔗 CALCULATOR SAVE IMPLEMENTATION

### **Critical Speed Calculator - NEW Save Button**

**Add to calculator HTML:**
```javascript
// In renderCS() function, after results display:
if (window.athleteId) {
  html += `
    <div style="margin-top: 24px; text-align: center;">
      <button onclick="saveCSToProfile()" 
              style="background:#10b981; color:#fff; padding:12px 24px; 
                     font-size:16px; border-radius:6px; border:none; cursor:pointer;">
        💾 Save to Athlete Profile
      </button>
    </div>
  `;
}
```

**Save function:**
```javascript
async function saveCSToProfile() {
  if (!window.athleteId) {
    alert('Please log in to save to profile');
    return;
  }
  
  // Get calculated values from CS calculator
  const cs = calculateCS(); // Your CS calculation result
  const dPrime = calculateDPrime(); // Your D' calculation
  const tests = {
    test_3min: document.getElementById('test3min').value,
    duration_3min: document.getElementById('duration3min').value,
    test_6min: document.getElementById('test6min').value,
    duration_6min: document.getElementById('duration6min').value,
    test_12min: document.getElementById('test12min').value,
    duration_12min: document.getElementById('duration12min').value
  };
  
  const profileData = {
    run_cs: cs,
    run_cs_source: 'Critical Speed Calculator',
    run_cs_updated_at: new Date().toISOString(),
    run_d_prime: dPrime,
    run_d_prime_source: 'Critical Speed Calculator',
    run_d_prime_updated_at: new Date().toISOString(),
    run_pace_3min: tests.test_3min,
    run_pace_3min_duration: tests.duration_3min,
    run_pace_3min_date: new Date().toISOString().split('T')[0],
    run_pace_6min: tests.test_6min,
    run_pace_6min_duration: tests.duration_6min,
    run_pace_6min_date: new Date().toISOString().split('T')[0],
    run_pace_12min: tests.test_12min,
    run_pace_12min_duration: tests.duration_12min,
    run_pace_12min_date: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch(`/api/athlete-profile/${window.athleteId}/test-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calculator_type: 'critical-speed-run',
        test_date: new Date().toISOString().split('T')[0],
        data: profileData,
        source: 'Critical Speed Calculator'
      })
    });
    
    if (response.ok) {
      alert('✅ Saved to Run Profile! Navigate to Athlete Profile → Run tab to see updated values.');
    } else {
      alert('❌ Save failed. Please try again.');
    }
  } catch (err) {
    alert('❌ Error saving to profile');
  }
}
```

---

## 🎯 COMPLETE FEATURE LIST

### **Metric Cards (4)**
- [x] CS card with pace (/mile, /km), date, source, [Edit]
- [x] D' card with meters, date, source, [Edit]
- [x] LT1 card with pace, % CS, date, [Edit]
- [x] OGC card with pace, % CS, date, [Edit]

### **Test Cards (3)**
- [x] 3 min test with pace, duration (MM:SS), date, [Edit]
- [x] 6 min test with pace, duration (MM:SS), date, [Edit]
- [x] 12 min test with pace, duration (MM:SS), date, [Edit]

### **Zones & HR**
- [x] Basic pace zones (7 zones from CS)
- [x] Simple HR zones (5 zones from manual LTHR)
- [x] Auto-calculate zones when CS/LTHR change

### **Test History**
- [x] CS test history table
- [x] Date, CS, D', 3/6/12 min tests columns
- [x] [Edit] and [Delete] buttons on each row

### **Calculator Integration (3)**
- [x] Critical Speed → "Save to Profile" button (NEW)
- [x] CHO Burn (Run) → "Save to Profile" button (EXISTS)
- [x] VO₂ Intervals (Run) → "Save to Profile" button (EXISTS)

### **Edit Functions (10)**
- [x] Edit CS, D', LT1, OGC, LTHR
- [x] Edit 3/6/12 min tests
- [x] Edit pace zones
- [x] Edit test history rows

### **Delete Functions (2)**
- [x] Delete CS tests from history
- [x] Delete calculator outputs

### **Auto-Update**
- [x] Click "Save to Profile" in calculator
- [x] Data saves to database
- [x] Navigate to Run tab
- [x] Numbers update automatically ✅

---

## ⏱️ IMPLEMENTATION TIME: 12 HOURS

| Phase | Task | Time |
|-------|------|------|
| 1 | Database & API (21 columns) | 2h |
| 2 | Frontend Layout (cards, forms, history) | 5h |
| 3 | Calculator Integration (add CS save, verify 2) | 1h |
| 4 | Display Functions (load, format, calculate zones) | 1.5h |
| 5 | Edit Functions (10 edit, 2 delete) | 1.5h |
| 6 | Testing & Deployment (verify save→update flow) | 1h |
| **TOTAL** | | **12h** |

---

## ✅ FINAL CONFIRMATION CHECKLIST

**Everything has:**
- [x] **Editing access** - 10 inline edit functions
- [x] **Deletion access** - Delete buttons on all history rows
- [x] **Calculator save buttons** - All 3 calculators save to profile
- [x] **Auto-update numbers** - Save → Database → Profile → Display ✅
- [x] **Dates everywhere** - All metrics and tests have dates
- [x] **Test history** - Table with edit/delete
- [x] **Dual units** - Both /mile and /km display
- [x] **% CS calculations** - LT1 and OGC show % CS
- [x] **Zone auto-calc** - Zones recalculate when CS changes
- [x] **Matches Bike/Swim** - Same layout and patterns

---

## 🚀 READY TO START?

**This plan includes EVERYTHING:**
- ✅ Edit access on every metric
- ✅ Delete access on every test
- ✅ All 3 calculators save to profile
- ✅ Numbers update automatically when saved
- ✅ Complete date tracking
- ✅ Same quality as Bike Profile

**Shall I proceed with Phase 1 (Database & API)?** 🏃‍♀️

---

**Date**: April 16, 2026  
**Status**: ✅ Complete plan confirmed with edit, delete, save, and auto-update
**Estimate**: 12 hours
