# Athlete Profile Redesign Specification

## ✅ Changes Required

### 1. Remove ALL FTP References
- Replace `FTP` with `CP` (Critical Power)
- Update variable names: `ftpValue` → `cpValue`, `ftpInput` → `cpInput`
- Update functions: `saveFTP()` → `saveCP()`, `loadFTPData()` → `loadCPData()`
- Remove `bike_ftp` database field references → use `bike_cp`
- Remove `run_ftp` references → use `run_cs_seconds`

### 2. Remove Duplicate Sections
- ✅ DONE: Removed duplicate "Pace Zones" and "Pace Interval Targets" sections (lines 1191-1249)

---

## 🏊 SWIM TAB - New Structure

### Order:
1. **Test History** (TOP)
2. **CSS Results** (auto-calculated)
3. **Swim Pace Zones** (editable)
4. **Swim Interval Pacing** (editable)
5. **Tools**

### 1. Test History Table
```html
<div class="data-table-container">
  <div class="data-table-header">
    <h3><i class="fas fa-history me-2"></i>Swim Test History</h3>
    <p>Record your timed swim tests. CSS and D' are automatically calculated from your tests.</p>
    <button class="btn btn-sm btn-primary" onclick="addSwimTest()">
      <i class="fas fa-plus"></i> Add Test
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 120px;">Date</th>
        <th style="width: 100px;">Distance (m)</th>
        <th style="width: 100px;">Time</th>
        <th>Notes</th>
        <th style="width: 80px;">Actions</th>
      </tr>
    </thead>
    <tbody id="swimTestsBody">
      <!-- Editable rows with date picker, distance input, time input, notes, delete button -->
    </tbody>
  </table>
</div>
```

### 2. CSS Results (Auto-Calculated)
```html
<div class="metric-card-group">
  <div class="metric-card">
    <div class="metric-label">Critical Swim Speed (CSS)</div>
    <div class="metric-value" id="cssValue">1:30</div>
    <div class="metric-source" id="cssSource">per 100m • Calculated from tests</div>
    <div class="metric-date">Last updated: 2026-04-10</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">D' (Anaerobic Reserve)</div>
    <div class="metric-value" id="swimDPrimeValue">150</div>
    <div class="metric-source">meters</div>
  </div>
</div>
```

### 3. Swim Pace Zones (Editable)
```html
<table class="data-table">
  <tbody id="swimZonesBody">
    <tr>
      <td>Z1</td>
      <td><input type="text" value="Recovery" class="form-control-sm"></td>
      <td><input type="text" value="1:35" class="form-control-sm"></td>
      <td><input type="text" value="1:40" class="form-control-sm"></td>
      <td>90-95%</td>
    </tr>
    <!-- More editable zone rows -->
  </tbody>
</table>
```

---

## 🚴 BIKE TAB - New Structure

### Order:
1. **Test History** (TOP)
2. **CP Results** (auto-calculated)
3. **Power Zones** (editable)
4. **Power Interval Targets** (editable)
5. **VO2max Bike Prescription** (editable)
6. **LTHR + HR Zones** (editable)
7. **Tools**

### 1. Test History Table
```html
<div class="data-table-container">
  <div class="data-table-header">
    <h3><i class="fas fa-history me-2"></i>Bike Test History</h3>
    <p>Record your power tests. CP and W' are automatically calculated from your tests.</p>
    <button class="btn btn-sm btn-primary" onclick="addBikeTest()">
      <i class="fas fa-plus"></i> Add Test
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 120px;">Date</th>
        <th style="width: 150px;">Test Type</th>
        <th style="width: 100px;">Power (W)</th>
        <th>Notes</th>
        <th style="width: 80px;">Actions</th>
      </tr>
    </thead>
    <tbody id="bikeTestsBody">
      <!-- Test Type options: 3-min, 6-min, 12-min, LT1/OGC, 20-min, Ramp -->
      <!-- Editable rows with date picker, dropdown, power input, notes, delete button -->
    </tbody>
  </table>
</div>
```

### 2. CP Results (Auto-Calculated)
```html
<div class="metric-card-group">
  <div class="metric-card">
    <div class="metric-label">Critical Power (CP)</div>
    <div class="metric-value" id="cpValue">265</div>
    <div class="metric-source">watts • Calculated from 3-point test</div>
    <div class="metric-date">Last updated: 2026-04-10</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">W' (Anaerobic Reserve)</div>
    <div class="metric-value" id="wPrimeValue">22.5</div>
    <div class="metric-source">kJ</div>
  </div>
</div>
```

---

## 🏃 RUN TAB - New Structure

### Order:
1. **Test History** (TOP)
2. **CS Results** (auto-calculated)
3. **Pace Zones** (editable)
4. **Pace Interval Targets** (editable)
5. **VO2max Run Prescription** (editable)
6. **Run Power CP** (optional, editable)
7. **LTHR + HR Zones** (editable)
8. **Tools**

### 1. Test History Table
```html
<div class="data-table-container">
  <div class="data-table-header">
    <h3><i class="fas fa-history me-2"></i>Run Test History</h3>
    <p>Record your timed run tests. CS and D' are automatically calculated from your tests.</p>
    <button class="btn btn-sm btn-primary" onclick="addRunTest()">
      <i class="fas fa-plus"></i> Add Test
    </button>
  </div>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 120px;">Date</th>
        <th style="width: 100px;">Distance (m)</th>
        <th style="width: 100px;">Time</th>
        <th>Notes</th>
        <th style="width: 80px;">Actions</th>
      </tr>
    </thead>
    <tbody id="runTestsBody">
      <!-- Editable rows with date picker, distance input, time input, notes, delete button -->
    </tbody>
  </table>
</div>
```

### 2. CS Results (Auto-Calculated)
```html
<div class="metric-card-group">
  <div class="metric-card">
    <div class="metric-label">Critical Speed (CS)</div>
    <div class="metric-value" id="csValue">4:15</div>
    <div class="metric-source">per km • Calculated from tests</div>
    <div class="metric-date">Last updated: 2026-04-10</div>
  </div>
  <div class="metric-card">
    <div class="metric-label">D' (Anaerobic Reserve)</div>
    <div class="metric-value" id="runDPrimeValue">320</div>
    <div class="metric-source">meters</div>
  </div>
</div>
```

---

## 🎨 Editable Tables Design

### All zone and interval tables should be editable:

```html
<table class="data-table editable-table">
  <thead>
    <tr>
      <th>Zone</th>
      <th>Name</th>
      <th>Low</th>
      <th>High</th>
      <th>% of CP</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Z1</td>
      <td><input type="text" value="Recovery" class="form-control-sm"></td>
      <td><input type="number" value="0" class="form-control-sm"></td>
      <td><input type="number" value="172" class="form-control-sm"></td>
      <td>0-65%</td>
    </tr>
    <tr>
      <td>Z2</td>
      <td><input type="text" value="Endurance" class="form-control-sm"></td>
      <td><input type="number" value="172" class="form-control-sm"></td>
      <td><input type="number" value="209" class="form-control-sm"></td>
      <td>65-79%</td>
    </tr>
    <!-- More editable rows -->
  </tbody>
</table>
```

---

## 💾 Data Storage

### LocalStorage Structure:
```javascript
athleteTests = {
  swim: [
    { date: '2026-04-10', distance: 400, time: '6:00', notes: 'Strong test' },
    { date: '2026-04-05', distance: 200, time: '2:50', notes: '' }
  ],
  bike: [
    { date: '2026-04-10', type: '3-min', power: 350, notes: 'All-out effort' },
    { date: '2026-04-10', type: '6-min', power: 300, notes: '' },
    { date: '2026-04-10', type: '12-min', power: 270, notes: '' },
    { date: '2026-04-08', type: 'LT1/OGC', power: 225, notes: 'From FIT file analysis' }
  ],
  run: [
    { date: '2026-04-10', distance: 800, time: '3:20', notes: 'Track test' },
    { date: '2026-04-10', distance: 1600, time: '7:00', notes: '' }
  ]
}
```

---

## 🔢 Auto-Calculation Logic

### Critical Power (CP) Calculation:
```javascript
function calculateCP(tests) {
  // Requires at least 2 tests with different durations
  // CP = (W1*T1 - W2*T2) / (T1 - T2)
  // W' = (W1 - CP) * T1
}
```

### Critical Speed (CS) Calculation:
```javascript
function calculateCS(tests) {
  // Requires at least 2 tests with different distances
  // CS = (D1 - D2) / (T1 - T2)  [meters per second]
  // D' = D1 - CS * T1
}
```

### Critical Swim Speed (CSS) Calculation:
```javascript
function calculateCSS(tests) {
  // Same as CS but display as pace per 100m
  // CSS = (D1 - D2) / (T1 - T2)
  // Convert to pace per 100m
}
```

---

## ✅ Implementation Checklist

- [ ] Remove all FTP references, replace with CP
- [ ] Create Test History tables for each sport
- [ ] Add Add/Delete test functionality
- [ ] Create CP/CS/CSS Results display sections
- [ ] Implement auto-calculation from test data
- [ ] Make all zone tables editable
- [ ] Make all interval tables editable
- [ ] Add save functionality for editable values
- [ ] Style consistently across all tabs
- [ ] Test data persistence (localStorage)
- [ ] Deploy and verify

---

*This specification will guide the complete redesign of the athlete profile page.*
