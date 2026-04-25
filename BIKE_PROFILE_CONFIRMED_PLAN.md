# ✅ BIKE PROFILE TAB - CONFIRMED IMPLEMENTATION PLAN

## 🎯 ALL REQUIREMENTS CONFIRMED

Based on your clarifications, here's the complete plan:

---

## 1. METRIC CARDS AT TOP (Enhanced with Relationships)

### **4 Cards with Additional Data:**

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│ Critical Power   │  │ LT1 Power        │  │ OGC Power        │  │ W' (kJ)      │
│ 250 W            │  │ 180 W            │  │ 230 W            │  │ 20.5 kJ      │
│                  │  │ 72% of CP ⬅      │  │ 92% of CP ⬅      │  │              │
│ Apr 12, 2026 ✅  │  │ Apr 10, 2026 ✅  │  │ Apr 10, 2026 ✅  │  │ Apr 10, 2026 │
│ (3-point test)   │  │ (LT1/OGC test)   │  │ (LT1/OGC test)   │  │              │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────┘
```

**Key Features:**
- ✅ **Full dates** (like Swim tab: "Apr 12, 2026")
- ✅ **LT1 as % of CP** auto-calculated (e.g., "72% of CP")
- ✅ **OGC as % of CP** auto-calculated (e.g., "92% of CP")
- ✅ **Test source** shown (e.g., "3-point test", "LT1/OGC test")
- ✅ **W' in metric card** at top

**Auto-calculation:**
```javascript
if (lt1_power && cp) {
  lt1_percent = Math.round((lt1_power / cp) * 100) + '% of CP';
}
if (ogc_power && cp) {
  ogc_percent = Math.round((ogc_power / cp) * 100) + '% of CP';
}
```

---

## 2. TWO TYPES OF POWER ZONES

### **A) BASIC POWER ZONES (from CP only - when NO LT1/OGC)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ POWER ZONES (Basic - from CP only)                                 │
│ CP: 250W (Apr 12, 2026) | No LT1/OGC test yet                      │
├─────────────────────────────────────────────────────────────────────┤
│ Zone│ Name              │ Power Range │ % CP    │ Date    │ Actions │
│ ZR  │ Recovery          │ 0-140 W     │ <56%    │ Apr 12  │ Edit    │
│ Z1  │ Endurance         │ 140-175 W   │ 56-70%  │ Apr 12  │ Edit    │
│ Z2  │ Tempo             │ 175-213 W   │ 70-85%  │ Apr 12  │ Edit    │
│ Z3  │ Threshold         │ 213-250 W   │ 85-100% │ Apr 12  │ Edit    │
│ Z4  │ VO2max            │ 250-300 W   │100-120% │ Apr 12  │ Edit    │
│ Z5  │ Anaerobic         │ 300-375 W   │120-150% │ Apr 12  │ Edit    │
│ Z6  │ Neuromuscular     │ >375 W      │ >150%   │ Apr 12  │ Edit    │
└─────────────────────────────────────────────────────────────────────┘
💡 For more accurate zones, upload a LT1/OGC test (FIT file)
```

**Zone Formula (% of CP):**
```
ZR: < 56% CP
Z1: 56-70% CP
Z2: 70-85% CP
Z3: 85-100% CP (at CP)
Z4: 100-120% CP
Z5: 120-150% CP
Z6: > 150% CP
```

---

### **B) EXPANDED POWER ZONES (from CP + LT1 + OGC - more accurate)**

```
┌─────────────────────────────────────────────────────────────────────────┐
│ POWER ZONES (EXPANDED - LT1/OGC Personalized)                          │
│ CP: 250W (Apr 12) | LT1: 180W (72% CP) | OGC: 230W (92% CP) | Apr 10  │
├─────────────────────────────────────────────────────────────────────────┤
│ Zone│ Name          │ Power Range│ % CP  │ LT1/OGC  │ W/kg  │ Actions │
│ ZR  │ Recovery      │ 0-140 W    │ <56%  │ <LT1     │ 0-2.1 │ Edit    │
│ Z1  │ Aerobic Base  │ 140-180 W  │ 56-72%│ @LT1 ⬅   │ 2.1-2.7│ Edit   │
│ Z2  │ Tempo         │ 180-205 W  │ 72-82%│ LT1-OGC  │ 2.7-3.1│ Edit   │
│ Z3  │ Threshold     │ 205-230 W  │ 82-92%│ @OGC ⬅   │ 3.1-3.5│ Edit   │
│ Z4  │ VO2max        │ 230-275 W  │92-110%│ >OGC     │ 3.5-4.1│ Edit   │
│ Z5  │ Anaerobic     │ 275-340 W  │110-136│          │ 4.1-5.1│ Edit   │
│ Z6  │ Neuromuscular │ >340 W     │ >136% │          │ >5.1   │ Edit   │
└─────────────────────────────────────────────────────────────────────────┘
✅ Zones personalized using LT1 (180W) and OGC (230W) thresholds
💡 W/kg calculated from body weight (66kg)
```

**Zone Formula (using LT1/OGC):**
```javascript
if (lt1_power && ogc_power && cp) {
  ZR: 0 - (lt1_power * 0.78)         // Below LT1
  Z1: (lt1_power * 0.78) - lt1_power // Up to LT1
  Z2: lt1_power - (ogc_power * 0.89) // LT1 to OGC
  Z3: (ogc_power * 0.89) - ogc_power // At OGC (threshold)
  Z4: ogc_power - (cp * 1.10)        // Above OGC
  Z5: (cp * 1.10) - (cp * 1.36)      // Anaerobic
  Z6: > (cp * 1.36)                  // Neuromuscular
}
```

**W/kg Calculation:**
```javascript
if (body_weight_kg) {
  w_per_kg_z1 = Math.round((z1_high / body_weight_kg) * 10) / 10;
  // Display: "2.7 W/kg"
}
```

---

## 3. HEART RATE ZONES (Priority: LT1/OGC → Manual LTHR → Training Zones Calculator)

### **Priority 1: LT1/OGC Test HR Data (BEST)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (Bike)                                            │
│ Source: LT1/OGC Test (Apr 10, 2026) ✅                             │
│ LT1 HR: 142 bpm | OGC HR: 165 bpm (Threshold)                     │
├─────────────────────────────────────────────────────────────────────┤
│ Zone│ Name          │ HR Range    │ % LTHR│ LT1/OGC   │ Date  │ Edit│
│ ZR  │ Recovery      │ 0-125 bpm   │ <76%  │ <LT1      │ Apr10 │ ✏️  │
│ Z1  │ Aerobic Base  │ 125-142 bpm │ 76-86%│ @LT1 ⬅    │ Apr10 │ ✏️  │
│ Z2  │ Tempo         │ 142-154 bpm │86-93% │ LT1-OGC   │ Apr10 │ ✏️  │
│ Z3  │ Threshold     │ 154-165 bpm │93-100%│ @OGC ⬅    │ Apr10 │ ✏️  │
│ Z4  │ VO2max        │ 165-180 bpm │100+%  │ >OGC      │ Apr10 │ ✏️  │
└─────────────────────────────────────────────────────────────────────┘
✅ Most accurate HR zones from LT1/OGC threshold test
```

**HR Zone Formula (from LT1/OGC):**
```javascript
if (bike_lt1_hr && bike_ogc_hr) {
  LTHR = bike_ogc_hr; // OGC = threshold HR
  
  ZR:  0 - (LTHR * 0.76)             // <76% LTHR
  Z1:  (LTHR * 0.76) - bike_lt1_hr   // 76-86%, up to LT1 HR
  Z2:  bike_lt1_hr - (LTHR * 0.93)   // 86-93%, LT1 to near OGC
  Z3:  (LTHR * 0.93) - bike_ogc_hr   // 93-100%, at OGC/threshold
  Z4:  bike_ogc_hr and above         // 100%+, VO2max zone
}
```

---

### **Priority 2: Manual LTHR (fallback if no LT1/OGC)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (Bike)                                            │
│ Source: Manual LTHR (Apr 5, 2026) - Calculator                     │
│ LTHR: 165 bpm (manually entered)                                   │
├─────────────────────────────────────────────────────────────────────┤
│ Zone│ Name          │ HR Range    │ % LTHR│ Source    │ Date  │ Edit│
│ ZR  │ Recovery      │ 0-124 bpm   │ <75%  │ Manual    │ Apr 5 │ ✏️  │
│ Z1  │ Endurance     │ 124-140 bpm │ 75-85%│ Manual    │ Apr 5 │ ✏️  │
│ Z2  │ Tempo         │ 140-149 bpm │85-90% │ Manual    │ Apr 5 │ ✏️  │
│ Z3  │ Threshold     │ 149-165 bpm │90-100%│ Manual    │ Apr 5 │ ✏️  │
│ Z4  │ VO2max        │ 165-182 bpm │100+%  │ Manual    │ Apr 5 │ ✏️  │
└─────────────────────────────────────────────────────────────────────┘
💡 For more accurate HR zones, upload a LT1/OGC test (FIT file)
[Edit Manual LTHR] button
```

**HR Zone Formula (from Manual LTHR):**
```javascript
if (!bike_lt1_hr && bike_lthr_manual) {
  LTHR = bike_lthr_manual;
  
  ZR: 0 - (LTHR * 0.75)
  Z1: (LTHR * 0.75) - (LTHR * 0.85)
  Z2: (LTHR * 0.85) - (LTHR * 0.90)
  Z3: (LTHR * 0.90) - LTHR
  Z4: LTHR and above
}
```

---

### **Priority 3: Training Zones Calculator (HR from that calculator)**

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEART RATE ZONES (Bike)                                            │
│ Source: Training Zones Calculator (Apr 3, 2026)                    │
│ Threshold HR: 165 bpm (from calculator)                            │
├─────────────────────────────────────────────────────────────────────┤
│ Zone│ Name          │ HR Range    │ % Threshold│ Date  │ Edit      │
│ ZR  │ Recovery      │ 0-125 bpm   │ ≤76%       │ Apr 3 │ ✏️        │
│ Z1  │ Aerobic       │ 132-142 bpm │ 80-86%     │ Apr 3 │ ✏️        │
│ Z2  │ Tempo         │ 142-154 bpm │ 86-93%     │ Apr 3 │ ✏️        │
│ Z3  │ Threshold     │ 154-165 bpm │ 93-100%    │ Apr 3 │ ✏️        │
└─────────────────────────────────────────────────────────────────────┘
From: Training Zones calculator (all-sport zones)
```

**Training Zones Calculator HR Zones:**
```
ZR: ≤76% Threshold
Z1: 80-86% Threshold
Z2: 86-93% Threshold
Z3: 93-100% Threshold
```

---

## 4. POWER TESTS (3/6/12 min) - Editable with Dates & Durations

```
┌─────────────────────────────────────────────────────────────────────┐
│ POWER TESTS (Best Efforts)                                         │
│ Used for Critical Power calculation                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────┐ │
│  │ 3 min Power Test   │  │ 6 min Power Test   │  │ 12 min Power │ │
│  │ 320 W              │  │ 290 W              │  │ 265 W        │ │
│  │ Duration: 3:00 ✏️  │  │ Duration: 6:00 ✏️  │  │Duration: 12  │ │
│  │ Apr 12, 2026 ✅    │  │ Apr 12, 2026 ✅    │  │ Apr 12, 2026 │ │
│  │ [Edit]             │  │ [Edit]             │  │ [Edit]       │ │
│  └────────────────────┘  └────────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

**Editable Fields:**
- ✅ **Power (watts)** - e.g., "320 W"
- ✅ **Duration** - e.g., "3:00" (3 min), "6:00" (6 min), "12:00" (12 min)
  - Can edit to custom durations (e.g., "3:30", "5:45", "10:00")
- ✅ **Date** - full date format "Apr 12, 2026"
- ✅ **Edit button** - click to edit inline

**Data Structure:**
```json
{
  "test_type": "power-test",
  "duration_seconds": 180,  // 3 min
  "power_watts": 320,
  "test_date": "2026-04-12",
  "source": "manual" // or "calculator"
}
```

**Edit Form (inline):**
```html
<div class="edit-form" style="display: none;">
  <label>Duration (mm:ss)</label>
  <input type="text" value="3:00" id="duration-input" placeholder="mm:ss">
  
  <label>Power (watts)</label>
  <input type="number" value="320" id="power-input">
  
  <label>Date</label>
  <input type="date" value="2026-04-12" id="date-input">
  
  <button onclick="savePowerTest()">Save</button>
  <button onclick="cancelEdit()">Cancel</button>
</div>
```

---

## 5. AUTO-POPULATE FROM CALCULATORS + SAVE TO PROFILE

### **Workflow:**

```
User Flow:
1. Open Calculator (athlete-calculators.html?athlete=427194&sport=bike)
2. Enter data (e.g., 3/6/12 min powers for CP test)
3. Click "Calculate" → Results appear
4. Click "💾 Save to Athlete Profile" ← AUTO-POPULATE PROFILE
5. Go to Athlete Profile → Data is already there! ✅
6. Can still edit inline if needed
```

### **Calculators That Auto-Save:**

#### **A) Critical Power Calculator**
**Saves:**
- CP (watts)
- W' (kJ)
- 3/6/12 min test powers
- Test date
- Test type (3-point or 2-point)

**Button:**
```html
<button class="qt2-calc-btn" style="background: #15803d;" onclick="saveCriticalPowerToProfile()">
  💾 Save to Athlete Profile
</button>
```

**Function:**
```javascript
async function saveCriticalPowerToProfile() {
  const cp = parseFloat(document.getElementById('cp-result').textContent);
  const wPrime = parseFloat(document.getElementById('w-prime-result').textContent);
  const d1 = parseFloat(document.getElementById('cp3-d1').value); // 3 min
  const t1 = parseFloat(document.getElementById('cp3-t1').value); // 320W
  const d2 = parseFloat(document.getElementById('cp3-d2').value); // 6 min
  const t2 = parseFloat(document.getElementById('cp3-t2').value); // 290W
  const d3 = parseFloat(document.getElementById('cp3-d3').value); // 12 min
  const t3 = parseFloat(document.getElementById('cp3-t3').value); // 265W
  
  // Save to test_history
  await axios.post(`/api/athlete-profile/${window.athleteId}/test-history`, {
    calculator_type: 'bike-cp',
    test_date: new Date().toISOString().split('T')[0],
    data: {
      cp_watts: cp,
      w_prime_kj: wPrime,
      test_type: '3-point',
      test_3min: { duration_sec: d1 * 60, power_watts: t1 },
      test_6min: { duration_sec: d2 * 60, power_watts: t2 },
      test_12min: { duration_sec: d3 * 60, power_watts: t3 }
    },
    source: 'calculator'
  });
  
  // Update main profile
  await axios.put(`/api/athlete-profile/${window.athleteId}`, {
    bike_cp: cp,
    bike_ftp: cp,
    bike_w_prime: wPrime,
    bike_power_3min: t1,
    bike_power_6min: t2,
    bike_power_12min: t3,
    bike_cp_updated: new Date().toISOString()
  });
  
  alert('✅ Saved CP test to profile!');
}
```

---

#### **B) LT1/OGC Analysis Calculator (enhance existing)**
**Saves:**
- LT1 power & HR
- OGC power & HR
- Protocol type
- Zones (Z1-Z5 with power & HR ranges)
- Test date

**Button:** Already exists (line 941), enhance it

**Function:**
```javascript
async function saveLT1ToProfile() {
  const lt1Power = parseFloat(document.getElementById('lt1-power').textContent);
  const lt1HR = parseFloat(document.getElementById('lt1-hr').textContent);
  const ogcPower = parseFloat(document.getElementById('ogc-power').textContent);
  const ogcHR = parseFloat(document.getElementById('ogc-hr').textContent);
  const protocol = document.getElementById('protocol-name').textContent;
  const zones = extractZonesFromTable(); // Get zones data
  
  // Save to test_history
  await axios.post(`/api/athlete-profile/${window.athleteId}/test-history`, {
    calculator_type: 'bike-lt1-ogc',
    test_date: new Date().toISOString().split('T')[0],
    data: {
      lt1_power: lt1Power,
      lt1_hr: lt1HR,
      ogc_power: ogcPower,
      ogc_hr: ogcHR,
      protocol: protocol,
      zones: zones // [{zone: 'Z1', power_low: 0, power_high: 180, hr_low: 0, hr_high: 142}, ...]
    },
    source: 'calculator'
  });
  
  // Update main profile
  await axios.put(`/api/athlete-profile/${window.athleteId}`, {
    bike_lt1_power: lt1Power,
    bike_lt1_hr: lt1HR,
    bike_ogc_power: ogcPower,
    bike_ogc_hr: ogcHR,
    bike_lt1_updated: new Date().toISOString()
  });
  
  alert('✅ Saved LT1/OGC test to profile!');
}
```

---

#### **C) Bike Power Zones — Expanded Calculator (NEW save function)**
**Saves:**
- CP, W'
- Body weight
- Full zone table (Z1-Z7 with watts, %, W/kg)
- MMP curve (optional)

**Button:**
```html
<button class="qt2-calc-btn" style="background: #15803d;" onclick="saveBikeZonesExpandedToProfile()">
  💾 Save Zones to Profile
</button>
```

---

#### **D) VO2max Bike Calculator (NEW save function)**
**Saves:**
- CP, pVO2max
- Classic VO2 intervals (duration, power, rest)
- Micro-intervals protocol

**Button:**
```html
<button class="qt2-calc-btn" style="background: #15803d;" onclick="saveVO2BikeToProfile()">
  💾 Save VO2 Prescription to Profile
</button>
```

---

#### **E) Best Effort Wattage Intervals (NEW save function)**
**Saves:**
- CP
- Interval powers for 1-60 min
- % CP for each interval

**Button:**
```html
<button class="qt2-calc-btn" style="background: #15803d;" onclick="saveBestEffortWattageToProfile()">
  💾 Save Intervals to Profile
</button>
```

---

#### **F) Training Zones Calculator (ALREADY HAS SAVE BUTTON)**
**Existing Button (line 674):**
```html
<button onclick="saveTrainingZonesToProfile()">
  💾 Save All Zones to Athlete Profile
</button>
```

**Saves:**
- Bike CP & power zones
- Run CP/CS & pace zones
- Swim CSS & pace zones
- HR zones (Threshold HR)

**Already implemented - just enhance to save more data**

---

## 6. EDIT IN PLACE + SAVE

### **Edit Behavior:**
1. User clicks "Edit" button on any row/card
2. Inline form appears (replaces display values)
3. User changes values
4. Clicks "Save" → updates database
5. Form hides, display values update

### **Example: Edit 3 min Power Test**

**Before Edit (Display Mode):**
```html
<div class="metric-card" id="test-3min-display">
  <div class="metric-label">3 min Power Test</div>
  <div class="metric-value">320 W</div>
  <div class="metric-source">Duration: 3:00 • Apr 12, 2026</div>
  <button class="btn btn-sm" onclick="edit3MinPowerTest()">Edit</button>
</div>
```

**After Clicking "Edit" (Edit Mode):**
```html
<div class="metric-card" id="test-3min-edit" style="display: block;">
  <label>Duration (mm:ss)</label>
  <input type="text" value="3:00" id="edit-3min-duration">
  
  <label>Power (watts)</label>
  <input type="number" value="320" id="edit-3min-power">
  
  <label>Date</label>
  <input type="date" value="2026-04-12" id="edit-3min-date">
  
  <button class="btn btn-primary" onclick="save3MinPowerTest()">Save</button>
  <button class="btn btn-secondary" onclick="cancelEdit3Min()">Cancel</button>
</div>
```

**Save Function:**
```javascript
async function save3MinPowerTest() {
  const duration = document.getElementById('edit-3min-duration').value; // "3:00"
  const power = parseInt(document.getElementById('edit-3min-power').value); // 320
  const date = document.getElementById('edit-3min-date').value; // "2026-04-12"
  
  // Convert duration to seconds
  const [mins, secs] = duration.split(':');
  const duration_seconds = (parseInt(mins) * 60) + parseInt(secs);
  
  // Update database
  await axios.put(`/api/athlete-profile/${window.athleteId}`, {
    bike_power_3min: power,
    bike_power_3min_duration: duration_seconds,
    bike_power_3min_date: date
  });
  
  // Update display
  document.getElementById('test-3min-display').style.display = 'block';
  document.getElementById('test-3min-edit').style.display = 'none';
  document.querySelector('#test-3min-display .metric-value').textContent = power + ' W';
  document.querySelector('#test-3min-display .metric-source').textContent = 
    `Duration: ${duration} • ${formatDate(date)}`;
  
  alert('✅ 3 min power test updated!');
}
```

---

## 7. DATABASE SCHEMA UPDATES

### **New Columns for `athlete_profiles` Table:**

```sql
-- LT1/OGC fields
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_power INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_ogc_hr INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_updated DATETIME;
ALTER TABLE athlete_profiles ADD COLUMN bike_lt1_source TEXT; -- 'LT1/OGC test', 'manual', etc.

-- 3/6/12 min power tests
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min_duration INTEGER; -- seconds (e.g., 180 = 3:00)
ALTER TABLE athlete_profiles ADD COLUMN bike_power_3min_date DATE;

ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min_duration INTEGER; -- seconds
ALTER TABLE athlete_profiles ADD COLUMN bike_power_6min_date DATE;

ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min INTEGER;
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min_duration INTEGER; -- seconds
ALTER TABLE athlete_profiles ADD COLUMN bike_power_12min_date DATE;

-- W' (anaerobic capacity)
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime REAL; -- kJ (e.g., 20.5)
ALTER TABLE athlete_profiles ADD COLUMN bike_w_prime_updated DATETIME;

-- Manual LTHR (fallback)
ALTER TABLE athlete_profiles ADD COLUMN bike_lthr_manual INTEGER; -- bpm
ALTER TABLE athlete_profiles ADD COLUMN bike_lthr_manual_updated DATETIME;

-- Body weight for W/kg calculations
ALTER TABLE athlete_profiles ADD COLUMN body_weight_kg REAL; -- kg (e.g., 66.0)
```

### **Existing Tables (Use These):**
- ✅ `test_history` - CP tests, LT1/OGC tests, power tests
- ✅ `calculator_output` - Zones, VO2 prescriptions, intervals

---

## 8. API ROUTE UPDATES

### **Update `PUT /api/athlete-profile/:id`** (src/index.tsx, line ~9200)

Add support for all new fields:

```typescript
// LT1/OGC
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

// W'
if (body.bike_w_prime !== undefined) {
  updates.push('bike_w_prime = ?');
  values.push(body.bike_w_prime);
}

// 3/6/12 min power tests
if (body.bike_power_3min !== undefined) {
  updates.push('bike_power_3min = ?');
  values.push(body.bike_power_3min);
}
if (body.bike_power_3min_duration !== undefined) {
  updates.push('bike_power_3min_duration = ?');
  values.push(body.bike_power_3min_duration);
}
if (body.bike_power_3min_date !== undefined) {
  updates.push('bike_power_3min_date = ?');
  values.push(body.bike_power_3min_date);
}

// Repeat for 6min and 12min
// ... (same pattern)

// Manual LTHR
if (body.bike_lthr_manual !== undefined) {
  updates.push('bike_lthr_manual = ?');
  values.push(body.bike_lthr_manual);
}

// Body weight
if (body.body_weight_kg !== undefined) {
  updates.push('body_weight_kg = ?');
  values.push(body.body_weight_kg);
}
```

---

## 9. COMPLETE CONFIRMED PLAN SUMMARY

### ✅ **1. Metric Cards (Enhanced)**
- 4 cards: CP, LT1, OGC, W'
- LT1 & OGC show **% of CP**
- **Full dates** (like Swim tab)
- Test source shown

### ✅ **2. Two Types of Power Zones**
- **Basic Zones** (from CP only) - generic % CP
- **Expanded Zones** (from CP + LT1 + OGC) - personalized with LT1/OGC thresholds
- Both show **full dates**
- Both have **Edit buttons**

### ✅ **3. HR Zones (3-tier priority)**
- **Priority 1:** LT1/OGC test HR data (most accurate)
- **Priority 2:** Manual LTHR (fallback)
- **Priority 3:** Training Zones calculator HR
- Always show **source** and **date**

### ✅ **4. Power Tests (3/6/12 min)**
- Display as **3 cards**
- **Editable durations** (e.g., 3:00, 6:00, 12:00)
- **Editable power** (watts)
- **Full dates** (like Swim tab)
- **Edit in place** with Save/Cancel

### ✅ **5. Auto-Populate from Calculators**
- Click "💾 Save to Profile" in calculator
- Data **auto-populates** in profile
- Can still **edit inline** after auto-populate

### ✅ **6. Edit Behavior**
- Click "Edit" → inline form appears
- Change values → Click "Save"
- Updates database immediately
- Display refreshes with new values

### ✅ **7. Training Zones Calculator (HR Zones)**
- Use HR zones from "Training Zones" calculator
- Save HR zones to profile
- Show in Bike profile HR Zones table
- Include in priority logic (Priority 3)

---

## 🚀 READY TO IMPLEMENT?

**Confirm this plan:**
- ✅ Metric cards with % of CP and dates
- ✅ Basic Power Zones (CP only) + Expanded Power Zones (LT1/OGC)
- ✅ HR Zones priority: LT1/OGC → Manual LTHR → Training Zones calc
- ✅ 3/6/12 min power tests with editable durations
- ✅ Auto-populate from 6 calculators (CP, LT1/OGC, Zones, VO2, Best Effort, Training Zones)
- ✅ Edit in place with Save/Cancel
- ✅ W' in top metric card
- ✅ Full dates everywhere (like Swim tab)

**Say "YES, IMPLEMENT" and I'll start with Phase 1: Database schema + API routes!**

Estimated time: 13-15 hours total work
