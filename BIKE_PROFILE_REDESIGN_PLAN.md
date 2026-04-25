# 🚴 Bike Profile Tab - Complete Redesign Plan

## 📋 Current State Analysis

### Current Bike Tab Structure (athlete-profile-v3.html, lines 886-1067)
```
✅ EXISTING:
1. CP metric display (flat card)
2. Edit CP form
3. Power Zones table (empty by default)
4. Power Interval Targets table
5. VO2max Bike Prescription display
6. LTHR input + HR Zones table
7. Test History table
8. Toolkit button
9. Saved Calculator Outputs section

❌ MISSING:
- LT1/OGC Analysis results display
- 3/6/12 min test data display
- Expanded power zones (W', MMP, W/kg)
- Heart rate zones from calculators
- Visual styling matching Swim tab
- Auto-save from calculators
- Editable saved results
```

### Bike Calculators Available (athlete-calculators.html)
```
1. ✅ Critical Power (3-point & 2-point)
   - Outputs: CP (watts), W' (kJ), D' (meters for run)
   
2. ✅ Best Effort Wattage Intervals
   - Outputs: Interval powers for 1-60 min
   
3. ✅ Bike Power Zones — Expanded
   - Outputs: 
     * Full zone table (Z1-Z7 with watts ranges)
     * W' (anaerobic capacity in kJ)
     * MMP (Mean Maximal Power) curve
     * W/kg power-to-weight ratios
     * Physiological profiling
   
4. ✅ VO2max Bike Calculator
   - Outputs:
     * Classic VO2 intervals (duration, power, rest)
     * Micro-intervals (short bursts)
     * pVO2max power
   
5. ✅ LT1 / OGC Threshold Analysis (FIT file upload)
   - Outputs:
     * LT1 power (watts) and HR (bpm)
     * OGC power (watts) and HR (bpm)
     * Training zones (Z1-Z5) with power & HR ranges
     * AI coaching interpretation
     * PDF export
     * Stage-by-stage analysis
```

---

## 🎯 Design Goals (Based on Your Request)

### Primary Requirements:
1. **Match Swim Tab Styling** - Use same visual design, colors, and layout
2. **Top Metrics Display** - CP + LT1/OGC results prominently at top
3. **Editable Outputs** - All saved calculator results should be editable
4. **Test History Integration** - 3/6/12 min tests + LT1/OGC tests visible
5. **Auto-Save from Calculators** - Connect calculator "Save" buttons to profile
6. **Heart Rate Data** - Display HR zones from LT1/OGC and manual LTHR
7. **Expanded Zones** - Show W', MMP, W/kg alongside standard power zones

---

## 🎨 Proposed New Layout

### **Section 1: TOP METRICS CARDS** (Similar to Swim CSS card)
```html
<!-- CP Metric Card -->
<div class="metric-card">
  <div class="metric-label">Critical Power (CP)</div>
  <div class="metric-value" id="cpValue">--- W</div>
  <div class="metric-source" id="cpSource">Not set</div>
</div>

<!-- LT1 Metric Card (NEW) -->
<div class="metric-card">
  <div class="metric-label">LT1 Power</div>
  <div class="metric-value" id="lt1PowerValue">--- W</div>
  <div class="metric-source" id="lt1PowerSource">Not set</div>
</div>

<!-- OGC Metric Card (NEW) -->
<div class="metric-card">
  <div class="metric-label">OGC Power</div>
  <div class="metric-value" id="ogcPowerValue">--- W</div>
  <div class="metric-source" id="ogcPowerSource">Not set</div>
</div>

<!-- W' (Anaerobic Capacity) Card (NEW) -->
<div class="metric-card">
  <div class="metric-label">W' (Anaerobic Capacity)</div>
  <div class="metric-value" id="wPrimeValue">--- kJ</div>
  <div class="metric-source" id="wPrimeSource">Not set</div>
</div>
```

**Visual:** 4 cards in a responsive grid (2x2 on desktop, 1 column on mobile)

---

### **Section 2: CP TEST HISTORY** (Similar to CSS Test History)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>Critical Power Test History</h3>
    <p>Track CP tests and power profile changes over time</p>
    <button class="btn btn-sm btn-primary" onclick="addManualCPTest()">
      <i class="fas fa-plus me-1"></i>Add Manual Test
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Test Type</th>
        <th>CP (W)</th>
        <th>W' (kJ)</th>
        <th>Source</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="cpTestHistoryBody">
      <!-- Data from test-history API where calculator_type = 'bike-cp' or 'bike-power' -->
    </tbody>
  </table>
</div>
```

**Data Source:** 
- `/api/athlete-profile/:id/test-history?type=bike-cp`
- Calculator saves via: `POST /api/athlete-profile/:id/test-history` with `calculator_type: 'bike-cp'`

---

### **Section 3: LT1/OGC TEST HISTORY** (NEW - Similar to CSS Test History)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>LT1 / OGC Test History</h3>
    <p>Lactate threshold and oxidative-glycolytic crossover analysis</p>
    <button class="btn btn-sm btn-primary" onclick="openToolkit('bike')">
      <i class="fas fa-upload me-1"></i>Upload FIT File
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>LT1 Power</th>
        <th>LT1 HR</th>
        <th>OGC Power</th>
        <th>OGC HR</th>
        <th>Protocol</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="lt1TestHistoryBody">
      <!-- Data from test-history API where calculator_type = 'bike-lt1-ogc' -->
    </tbody>
  </table>
</div>
```

**Data Structure (from calculator save):**
```json
{
  "calculator_type": "bike-lt1-ogc",
  "test_date": "2026-04-15",
  "data": {
    "lt1_power": 180,
    "lt1_hr": 142,
    "ogc_power": 230,
    "ogc_hr": 165,
    "protocol": "3x8min Recovery Valley",
    "zones": [
      { "zone": "Z1", "name": "Recovery", "power_low": 0, "power_high": 140, "hr_low": 0, "hr_high": 125 },
      { "zone": "Z2", "name": "Aerobic", "power_low": 140, "power_high": 180, "hr_low": 125, "hr_high": 142 },
      // ... etc
    ]
  },
  "source": "calculator"
}
```

---

### **Section 4: 3/6/12 MIN TEST RESULTS** (NEW)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>3/6/12 Minute Power Tests</h3>
    <p>Best effort power tests for critical power calculation</p>
  </div>
  <div style="padding: 16px;">
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      
      <!-- 3 min test -->
      <div class="metric-card" style="background: var(--gray-50);">
        <div class="metric-label">3 min Power</div>
        <div class="metric-value" id="power3minValue">--- W</div>
        <div class="metric-source" id="power3minSource">Not set</div>
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="edit3MinPower()">Edit</button>
      </div>
      
      <!-- 6 min test -->
      <div class="metric-card" style="background: var(--gray-50);">
        <div class="metric-label">6 min Power</div>
        <div class="metric-value" id="power6minValue">--- W</div>
        <div class="metric-source" id="power6minSource">Not set</div>
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="edit6MinPower()">Edit</button>
      </div>
      
      <!-- 12 min test -->
      <div class="metric-card" style="background: var(--gray-50);">
        <div class="metric-label">12 min Power</div>
        <div class="metric-value" id="power12minValue">--- W</div>
        <div class="metric-source" id="power12minSource">Not set</div>
        <button class="btn btn-sm btn-outline-primary mt-2" onclick="edit12MinPower()">Edit</button>
      </div>
      
    </div>
  </div>
</div>
```

**Data Storage:**
- Store in athlete_profiles table: `bike_power_3min`, `bike_power_6min`, `bike_power_12min`
- OR store in test_history with type `'bike-power-test'`

---

### **Section 5: EXPANDED POWER ZONES** (Enhanced version)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>Power Zones (Expanded)</h3>
    <p>Training zones with W', MMP, and W/kg data from Bike Power Zones calculator</p>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Zone</th>
        <th>Name</th>
        <th>Power Range (W)</th>
        <th>% CP</th>
        <th>W/kg</th>
        <th>MMP</th>
      </tr>
    </thead>
    <tbody id="bikeZonesExpandedBody">
      <!-- Zones from "Bike Power Zones — Expanded" calculator -->
      <tr>
        <td>Z1</td>
        <td>Active Recovery</td>
        <td>0 - 142 W</td>
        <td>&lt; 56%</td>
        <td>0 - 2.1</td>
        <td>--</td>
      </tr>
      <!-- ... Z2-Z7 -->
    </tbody>
  </table>
  
  <!-- W' Balance & MMP Curve Display -->
  <div style="padding: 16px; background: var(--gray-50); margin-top: 16px;">
    <h4>Anaerobic Capacity (W')</h4>
    <p><strong id="wPrimeDisplay">20.5 kJ</strong> - Available anaerobic work above CP</p>
    <small class="text-muted">Updated from: Bike Power Zones calculator</small>
  </div>
</div>
```

**Data Source:**
- Calculator: "Bike Power Zones — Expanded"
- Save type: `calculator_type: 'bike-zones-expanded'`
- Data includes: zones array, W', MMP curve, W/kg ratios

---

### **Section 6: HEART RATE ZONES** (Enhanced)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>Heart Rate Zones (Bike)</h3>
    <p>HR zones from LT1/OGC analysis or manual LTHR</p>
    <button class="btn btn-sm btn-secondary" onclick="editManualLTHR()">
      <i class="fas fa-edit me-1"></i>Edit Manual LTHR
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Zone</th>
        <th>Name</th>
        <th>HR Range (bpm)</th>
        <th>% LTHR</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody id="bikeHRZonesBody">
      <!-- HR zones from LT1/OGC test or manual LTHR -->
    </tbody>
  </table>
  
  <!-- Current LTHR Display -->
  <div style="padding: 16px; background: var(--gray-50); margin-top: 16px;">
    <strong>Current LTHR:</strong> <span id="currentLTHR">165 bpm</span>
    <small class="text-muted ml-2">From: LT1/OGC Analysis (2026-04-10)</small>
  </div>
</div>
```

**Data Priority:**
1. Use HR zones from latest LT1/OGC test (most accurate)
2. Fall back to manual LTHR if no LT1/OGC test exists
3. Auto-calculate zones from LTHR if needed

---

### **Section 7: VO2MAX INTERVALS** (Keep existing, enhance)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>VO2max Interval Prescription</h3>
    <p>Precision-designed VO2max intervals from calculator</p>
  </div>
  <div id="vo2BikeDisplay">
    <!-- Display saved VO2 bike calculator results -->
    <!-- Classic intervals + micro-intervals protocols -->
  </div>
</div>
```

---

### **Section 8: BEST EFFORT INTERVALS** (Keep existing, enhance)
```html
<div class="data-table-container mb-3">
  <div class="data-table-header">
    <h3>Best Effort Power Targets</h3>
    <p>Pre-determined interval powers for 1-60 minutes</p>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th>Duration</th>
        <th>Target Power (W)</th>
        <th>% CP</th>
        <th>Training Range (W)</th>
      </tr>
    </thead>
    <tbody id="powerIntervalsBody">
      <!-- Data from Best Effort Wattage calculator -->
    </tbody>
  </table>
</div>
```

---

### **Section 9: QUICK EDIT FORMS** (Collapsible)
```html
<!-- Quick CP Update (like CSS Quick Update) -->
<div class="data-table-container mb-3" id="cpEditForm" style="display: none;">
  <div class="data-table-header">
    <h3>Quick CP Update</h3>
  </div>
  <div style="padding: 16px;">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div>
        <label class="form-label">CP (Watts)</label>
        <input type="number" class="form-control" id="cpInput" placeholder="e.g., 250">
      </div>
      <div>
        <label class="form-label">W' (kJ)</label>
        <input type="number" class="form-control" id="wPrimeInput" placeholder="e.g., 20.5" step="0.1">
      </div>
    </div>
    <button class="btn btn-primary mt-2" onclick="saveCP()">Save CP</button>
    <button class="btn btn-secondary mt-2" onclick="openToolkit('bike')">Open Toolkit</button>
  </div>
</div>
```

---

## 🔗 Calculator Integration (Auto-Save)

### Calculators That Need "Save to Profile" Buttons

#### 1. **Critical Power Calculator**
**Location:** athlete-calculators.html, line ~73  
**Save Function:** `saveCriticalPowerToProfile()`

**Data to Save:**
```javascript
async function saveCriticalPowerToProfile() {
  const cp = document.getElementById('cp-result').value; // watts
  const wPrime = document.getElementById('w-prime-result').value; // kJ
  const testType = "3-point"; // or "2-point"
  
  await axios.post(`/api/athlete-profile/${athleteId}/test-history`, {
    calculator_type: 'bike-cp',
    test_date: new Date().toISOString().split('T')[0],
    data: {
      cp_watts: parseFloat(cp),
      w_prime_kj: parseFloat(wPrime),
      test_type: testType,
      d1: d1, d2: d2, d3: d3, // test distances
      t1: t1, t2: t2, t3: t3  // test times
    },
    source: 'calculator'
  });
  
  // Also update main profile CP
  await axios.put(`/api/athlete-profile/${athleteId}`, {
    bike_cp: parseFloat(cp),
    bike_ftp: parseFloat(cp), // CP = FTP
    bike_cp_source: 'Critical Power Calculator',
    bike_cp_updated: new Date().toISOString()
  });
}
```

**Button HTML:**
```html
<button class="qt2-calc-btn" onclick="saveCriticalPowerToProfile()" style="background: #15803d;">
  💾 Save to Athlete Profile
</button>
```

---

#### 2. **LT1/OGC Analysis Calculator**
**Location:** athlete-calculators.html, line ~851  
**Existing Save Function:** `saveLT1ToProfile()` (line 941)

**Enhance Existing Function:**
```javascript
async function saveLT1ToProfile() {
  const lt1Power = document.getElementById('lt1-power-result').value;
  const lt1HR = document.getElementById('lt1-hr-result').value;
  const ogcPower = document.getElementById('ogc-power-result').value;
  const ogcHR = document.getElementById('ogc-hr-result').value;
  const protocol = document.getElementById('protocol-input').value;
  const zones = getZonesFromTable(); // Extract from results table
  
  await axios.post(`/api/athlete-profile/${athleteId}/test-history`, {
    calculator_type: 'bike-lt1-ogc',
    test_date: new Date().toISOString().split('T')[0],
    data: {
      lt1_power: parseFloat(lt1Power),
      lt1_hr: parseFloat(lt1HR),
      ogc_power: parseFloat(ogcPower),
      ogc_hr: parseFloat(ogcHR),
      protocol: protocol,
      zones: zones, // Array of zone objects
      ai_interpretation: aiTextContent // Optional
    },
    source: 'calculator'
  });
  
  // Update profile with LT1/OGC
  await axios.put(`/api/athlete-profile/${athleteId}`, {
    bike_lt1_power: parseFloat(lt1Power),
    bike_lt1_hr: parseFloat(lt1HR),
    bike_ogc_power: parseFloat(ogcPower),
    bike_ogc_hr: parseFloat(ogcHR),
    bike_lt1_updated: new Date().toISOString()
  });
}
```

---

#### 3. **Bike Power Zones — Expanded**
**Location:** athlete-calculators.html, line ~735  
**Save Function:** `saveBikeZonesExpandedToProfile()` (NEW)

**Data to Save:**
```javascript
async function saveBikeZonesExpandedToProfile() {
  const cp = document.getElementById('zone-cp-input').value;
  const wPrime = document.getElementById('zone-wprime-input').value;
  const weight = document.getElementById('zone-weight-input').value;
  const zones = getExpandedZonesFromTable(); // Z1-Z7 with watts, %, W/kg
  
  await axios.post(`/api/athlete-profile/${athleteId}/calculator-output`, {
    type: 'bike-zones-expanded',
    output: {
      cp: parseFloat(cp),
      w_prime: parseFloat(wPrime),
      weight_kg: parseFloat(weight),
      zones: zones, // Full zone data
      w_per_kg: parseFloat(cp) / parseFloat(weight),
      mmp_curve: mmpData // Optional
    },
    timestamp: new Date().toISOString()
  });
}
```

**Button HTML:**
```html
<button class="qt2-calc-btn" onclick="saveBikeZonesExpandedToProfile()" style="background: #15803d;">
  💾 Save Zones to Profile
</button>
```

---

#### 4. **VO2max Bike Calculator**
**Location:** athlete-calculators.html, line ~782  
**Save Function:** `saveVO2BikeToProfile()` (NEW)

**Data to Save:**
```javascript
async function saveVO2BikeToProfile() {
  const cp = document.getElementById('vo2-cp-input').value;
  const pVO2max = document.getElementById('pvo2max-input').value;
  const classicIntervals = getClassicIntervalsFromResults();
  const microIntervals = getMicroIntervalsFromResults();
  
  await axios.post(`/api/athlete-profile/${athleteId}/calculator-output`, {
    type: 'vo2-bike',
    output: {
      cp: parseFloat(cp),
      pvo2max: parseFloat(pVO2max),
      classic_intervals: classicIntervals,
      micro_intervals: microIntervals
    },
    timestamp: new Date().toISOString()
  });
}
```

---

#### 5. **Best Effort Wattage Intervals**
**Location:** athlete-calculators.html, line ~139  
**Save Function:** `saveBestEffortWattageToProfile()` (NEW)

**Data to Save:**
```javascript
async function saveBestEffortWattageToProfile() {
  const cp = document.getElementById('be-cp-input').value;
  const intervals = getBestEffortIntervalsFromResults(); // 1min, 2min, ... 60min
  
  await axios.post(`/api/athlete-profile/${athleteId}/calculator-output`, {
    type: 'best-effort-wattage',
    output: {
      cp: parseFloat(cp),
      intervals: intervals // Array of {duration_min, power_watts, percent_cp}
    },
    timestamp: new Date().toISOString()
  });
}
```

---

## 🎨 Color Scheme (Match Swim Tab)

### Current Colors from Swim Tab:
```css
:root {
  --primary-blue: #2563eb;      /* Buttons, links */
  --primary-blue-hover: #1d4ed8;
  --gray-50: #f9fafb;            /* Light backgrounds */
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-800: #1f2937;           /* Dark text */
  --success-green: #15803d;      /* Save buttons */
  --warning-yellow: #fbbf24;     /* Warning states */
}
```

### Card Styles:
```css
.metric-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.metric-label {
  font-size: 14px;
  color: var(--gray-600);
  font-weight: 500;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 4px;
}

.metric-source {
  font-size: 13px;
  color: var(--gray-500);
}
```

---

## 📊 Database Schema Updates

### New Columns for `athlete_profiles` Table:
```sql
-- LT1/OGC fields
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_updated DATETIME;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_source TEXT;

-- 3/6/12 min power tests
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min INTEGER;

-- W' (anaerobic capacity)
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime REAL; -- kJ
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated DATETIME;
```

### Use Existing `test_history` and `calculator_output` Tables:
```
✅ test_history table:
- Stores: CP tests, LT1/OGC tests, 3/6/12 min tests
- Fields: calculator_type, test_date, data (JSON), source

✅ calculator_output table:
- Stores: Zones, VO2 prescriptions, best effort intervals
- Fields: type, output (JSON), timestamp
```

---

## 🔧 API Route Updates

### Update `PUT /api/athlete-profile/:id` to Accept New Fields:
```typescript
// src/index.tsx, line ~9200
if (body.bike_lt1_power !== undefined) {
  updates.push('bike_lt1_power = ?');
  values.push(body.bike_lt1_power);
}

if (body.bike_lt1_hr !== undefined) {
  updates.push('bike_lt1_hr = ?');
  values.push(body.bike_lt1_hr);
}

if (body.bike_ogc_power !== undefined) {
  updates.push('bike_ogc_power = ?');
  values.push(body.bike_ogc_power);
}

if (body.bike_ogc_hr !== undefined) {
  updates.push('bike_ogc_hr = ?');
  values.push(body.bike_ogc_hr);
}

if (body.bike_w_prime !== undefined) {
  updates.push('bike_w_prime = ?');
  values.push(body.bike_w_prime);
}

if (body.bike_power_3min !== undefined) {
  updates.push('bike_power_3min = ?');
  values.push(body.bike_power_3min);
}

if (body.bike_power_6min !== undefined) {
  updates.push('bike_power_6min = ?');
  values.push(body.bike_power_6min);
}

if (body.bike_power_12min !== undefined) {
  updates.push('bike_power_12min = ?');
  values.push(body.bike_power_12min);
}
```

---

## ✅ Implementation Checklist

### Phase 1: Database & API (Backend)
- [ ] Add new columns to athlete_profiles table (LT1, OGC, W', 3/6/12 min powers)
- [ ] Update PUT /api/athlete-profile/:id route to accept new fields
- [ ] Test API with Postman/curl

### Phase 2: Bike Profile Tab (Frontend)
- [ ] Replace flat CP card with 4 metric cards (CP, LT1, OGC, W')
- [ ] Add CP Test History table (like CSS Test History)
- [ ] Add LT1/OGC Test History table (NEW)
- [ ] Add 3/6/12 Min Power Tests display (NEW)
- [ ] Enhance Power Zones table with W', MMP, W/kg columns
- [ ] Update HR Zones table to show source (LT1/OGC vs manual)
- [ ] Keep VO2 Intervals section (enhance display)
- [ ] Keep Best Effort Intervals section (enhance display)
- [ ] Add Quick Edit forms (collapsible, like Swim tab)
- [ ] Style everything to match Swim tab colors

### Phase 3: Calculator Integration (Auto-Save)
- [ ] Critical Power calculator: Add `saveCriticalPowerToProfile()` function
- [ ] LT1/OGC calculator: Enhance existing `saveLT1ToProfile()` function
- [ ] Bike Power Zones Expanded: Add `saveBikeZonesExpandedToProfile()` function
- [ ] VO2 Bike calculator: Add `saveVO2BikeToProfile()` function
- [ ] Best Effort Wattage: Add `saveBestEffortWattageToProfile()` function
- [ ] Test all save buttons from calculators

### Phase 4: Display Functions (JavaScript)
- [ ] Write `loadCPTestHistory()` function
- [ ] Write `loadLT1TestHistory()` function
- [ ] Write `displayBikeZonesExpanded()` function
- [ ] Write `displayVO2BikeResults()` function
- [ ] Write `displayBestEffortIntervals()` function
- [ ] Write `displayBikeHRZones()` function (priority: LT1/OGC > manual LTHR)
- [ ] Update `loadAthleteProfile()` to populate all new fields

### Phase 5: Edit & Update Functions
- [ ] Add inline edit for CP Test History rows
- [ ] Add inline edit for LT1/OGC Test History rows
- [ ] Add edit3MinPower(), edit6MinPower(), edit12MinPower() functions
- [ ] Add editManualLTHR() function
- [ ] Test all edit operations

### Phase 6: Testing & Polish
- [ ] Test all calculators → save → profile display flow
- [ ] Test edit operations
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify colors match Swim tab
- [ ] Test with real athlete data
- [ ] Deploy to production

---

## 📸 Visual Mockup (Text-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│ BIKE PROFILE TAB                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────┐│
│  │ Critical     │  │ LT1 Power    │  │ OGC Power    │  │ W'  ││
│  │ Power        │  │              │  │              │  │     ││
│  │ 250 W        │  │ 180 W        │  │ 230 W        │  │20 kJ││
│  │ TP: Apr 12   │  │ LT1: Apr 10  │  │ OGC: Apr 10  │  │Apr10││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ CP TEST HISTORY                        [+ Add Manual Test] ││
│  ├────────────────────────────────────────────────────────────┤│
│  │ Date       │ Type     │ CP (W) │ W' (kJ) │ Source    │ ... ││
│  │ 2026-04-12 │ 3-point  │ 250    │ 20.5    │ Calc      │ Edit││
│  │ 2026-03-20 │ 2-point  │ 245    │ 19.8    │ Manual    │ Edit││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ LT1 / OGC TEST HISTORY              [Upload FIT File]     ││
│  ├────────────────────────────────────────────────────────────┤│
│  │ Date       │ LT1   │ LT1 HR │ OGC   │ OGC HR │ Protocol │ ││
│  │ 2026-04-10 │ 180 W │ 142bpm │ 230 W │ 165bpm │ 3x8 RV   │ ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ 3/6/12 MINUTE POWER TESTS                                  ││
│  ├────────────────────────────────────────────────────────────┤│
│  │  ┌──────────┐   ┌──────────┐   ┌──────────┐              ││
│  │  │ 3 min    │   │ 6 min    │   │ 12 min   │              ││
│  │  │ 320 W    │   │ 290 W    │   │ 265 W    │              ││
│  │  │ Apr 12   │   │ Apr 12   │   │ Apr 12   │              ││
│  │  │ [Edit]   │   │ [Edit]   │   │ [Edit]   │              ││
│  │  └──────────┘   └──────────┘   └──────────┘              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ POWER ZONES (EXPANDED)                                     ││
│  ├────────────────────────────────────────────────────────────┤│
│  │ Zone│ Name    │ Power Range │ % CP │ W/kg │ MMP          ││
│  │ Z1  │ Recovery│ 0-142 W     │ <56% │ 0-2.1│ --           ││
│  │ Z2  │ Aerobic │ 142-180 W   │56-72%│2.1-2.7│ --          ││
│  │ ... │         │             │      │      │              ││
│  │ Z7  │ Neuromuscular│ >340 W │>136% │ >5.1 │ --          ││
│  └────────────────────────────────────────────────────────────┘│
│  │ W' (Anaerobic Capacity): 20.5 kJ                           ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ HEART RATE ZONES (BIKE)                  [Edit Manual LTHR]││
│  ├────────────────────────────────────────────────────────────┤│
│  │ Zone│ Name    │ HR Range    │ % LTHR│ Source              ││
│  │ Z1  │ Recovery│ 0-125 bpm   │ <76%  │ LT1/OGC (Apr 10)    ││
│  │ Z2  │ Aerobic │ 125-142 bpm │76-86% │ LT1/OGC (Apr 10)    ││
│  │ ... │         │             │       │                     ││
│  └────────────────────────────────────────────────────────────┘│
│  │ Current LTHR: 165 bpm (From LT1/OGC Analysis, Apr 10)      ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [VO2max Intervals section - existing]                         │
│  [Best Effort Intervals section - existing]                    │
│  [Open Bike Toolkit button - existing]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary

### What's New vs. Current:
1. ✅ **4 metric cards at top** (CP, LT1, OGC, W') instead of 1
2. ✅ **LT1/OGC Test History table** (NEW)
3. ✅ **3/6/12 min power tests display** (NEW)
4. ✅ **Expanded power zones** with W', MMP, W/kg (enhanced)
5. ✅ **HR zones show source** (LT1/OGC vs manual LTHR)
6. ✅ **Auto-save from 5 calculators** (CP, LT1/OGC, Zones, VO2, Best Effort)
7. ✅ **Editable outputs** (inline edit on all tables)
8. ✅ **Visual design matches Swim tab** (colors, cards, tables)

### Total Work Estimate:
- **Backend:** 2 hours (DB + API routes)
- **Frontend:** 6 hours (HTML + CSS + JS functions)
- **Calculator Integration:** 3 hours (5 save functions)
- **Testing:** 2 hours
- **Total:** ~13 hours

---

## ✅ CONFIRMATION REQUIRED

**Does this plan match your vision?**

Please confirm:
1. ✅ Layout looks good (metric cards → test history → zones → HR zones)
2. ✅ All required calculators are included (CP, LT1/OGC, Zones, VO2, Best Effort)
3. ✅ Colors/styling match Swim tab expectations
4. ✅ Editable outputs functionality is clear
5. ✅ Auto-save from calculators is what you want

**Ready to implement?** Say "YES, implement this plan" and I'll start with Phase 1 (Database & API).
