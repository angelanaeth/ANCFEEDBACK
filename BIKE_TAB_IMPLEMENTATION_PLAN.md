# 🚴 BIKE TAB IMPLEMENTATION PLAN

## ✅ CONFIRMATION: Your Bike Power Zones Calculator is CORRECT

**YES** - The Bike Power Zones (Expanded) calculator you shared matches perfectly with the existing implementation in `athlete-calculators.html`.

### Key Features Confirmed:
- **Inputs**: CP, W', body weight (optional), test powers (5s, 1m, 5m, 20m, 60m)
- **Zone Structure**: Uses LT1 (72% CP default) and OGC (87% CP default) as primary boundaries
- **Expanded Zones**: ZR, Sub-LT1, Z1 (Low/Mid/High), Z2 (Low/Mid/High), Sweet Spot, Z3 (Low/Mid/High), CP+
- **Additional Outputs**: W' balance model, max duration calculations, test vs model comparison

## 🎯 CURRENT STATUS

### ✅ COMPLETED
1. **Backend Infrastructure** (100% Complete)
   - ✅ 8 database tables created (migrations/0004_bike_test_history.sql)
   - ✅ POST/GET/DELETE API endpoints for all 8 bike calculators
   - ✅ Tables: bike_cp_history, bike_zones_history, bike_vo2_history, bike_best_effort_history, bike_low_cadence_history, bike_cho_history, bike_training_zones_history, bike_lt1_ogc_history

2. **Bike Tab HTML Structure** (100% Complete)
   - ✅ Created comprehensive bike_tab_new.html with:
     - Main metric cards (CP, W', Power @ VO2max, LT1, OGC)
     - 8 test history tables
     - Edit/delete functionality
     - Manual test entry buttons
     - All JavaScript functions for loading and rendering

### 🔄 IN PROGRESS - Frontend Integration

## 📋 INTEGRATION STEPS (Next Actions)

### Step 1: Add Bike Test History Loading Function
**File**: `public/static/athlete-profile-v3.html`
**Location**: After line 1322 (after `loadSwimCHOHistory();`)

```javascript
// Add this line:
loadBikeTestHistories(); // Load all 8 bike test histories
```

### Step 2: Insert loadBikeTestHistories() Function
**Location**: After the swim history functions (around line 800-900 in the `<script>` section)

**Action**: Copy the entire JavaScript section from `bike_tab_new.html` (lines 408-950) and paste it into athlete-profile-v3.html

### Step 3: Replace Old BIKE Tab HTML
**File**: `public/static/athlete-profile-v3.html`
**Lines to Replace**: 878-1068 (old BIKE tab)
**Replace With**: bike_tab_html_only.html (lines 1-403)

### Step 4: Add CSS Styles
**Location**: In the `<style>` section of athlete-profile-v3.html
**Action**: Copy the CSS from bike_tab_new.html (lines 953-967) and add to the existing styles

### Step 5: Update All 8 Bike Calculator Save Functions
**File**: `public/static/athlete-calculators.html`

#### 5.1 Critical Power Calculator
**Location**: Around line 550 (function `saveCP`)
**Update to**:
```javascript
window.saveCPToProfile = async function() {
  const p1 = parseFloat(document.getElementById('cp-p1')?.value || 0);
  const p5 = parseFloat(document.getElementById('cp-p5')?.value || 0);
  const p20 = parseFloat(document.getElementById('cp-p20')?.value || 0);
  const p60 = parseFloat(document.getElementById('cp-p60')?.value || 0);
  
  const cpResult = window.lastCPResult; // Store this when calculating
  if (!cpResult) {
    alert('Please calculate CP first');
    return;
  }

  // Save to test history
  try {
    const response = await fetch(`/api/athlete-profile/${window.athleteId}/test-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calculator_type: 'bike-cp',
        test_date: new Date().toISOString(),
        cp_watts: cpResult.cp,
        w_prime: cpResult.w_prime,
        test_data: { p1, p5, p20, p60 },
        source: 'calculator'
      })
    });

    if (response.ok) {
      // Also save to profile columns for backward compatibility
      await saveToAthleteProfile('Critical Power', {
        cp: cpResult.cp,
        w_prime: cpResult.w_prime
      }, 'bike');
      
      alert('✅ CP saved successfully!');
      loadAthleteProfile(window.athleteId);
    }
  } catch (error) {
    console.error('Error saving CP:', error);
    alert('❌ Error saving CP');
  }
}
```

#### 5.2 Bike Power Zones (Expanded)
**Location**: Line 2920 (function `saveBPZToProfile`)
**Update to**:
```javascript
window.saveBPZToProfile = async function() {
  const cp = parseFloat(document.getElementById('bpz-cp')?.value || 0);
  const wprime = parseFloat(document.getElementById('bpz-wprime')?.value || 0);
  const bw = parseFloat(document.getElementById('bpz-bw')?.value || 0);
  
  if (cp <= 0 || wprime <= 0) {
    alert('Please calculate Bike Power Zones first');
    return;
  }

  // Calculate LT1 and OGC
  const lt1_watts = Math.round(cp * 0.72);
  const ogc_watts = Math.round(cp * 0.87);

  try {
    const response = await fetch(`/api/athlete-profile/${window.athleteId}/test-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calculator_type: 'bike-zones',
        test_date: new Date().toISOString(),
        cp_watts: cp,
        w_prime: wprime,
        lt1_watts: lt1_watts,
        ogc_watts: ogc_watts,
        body_weight_kg: bw || null,
        zones_data: {
          // Store full zone calculations here
          cp, wprime, lt1_watts, ogc_watts, bw
        },
        source: 'calculator'
      })
    });

    if (response.ok) {
      await saveToAthleteProfile('Bike Power Zones (Expanded)', {
        cp: cp,
        w_prime: wprime
      }, 'bike');
      
      alert('✅ Power zones saved successfully!');
      loadAthleteProfile(window.athleteId);
    }
  } catch (error) {
    console.error('Error saving zones:', error);
    alert('❌ Error saving zones');
  }
}
```

#### 5.3 VO2 Max Intervals (Bike)
**Location**: Search for "saveVO2BikeToProfile" or similar
**Pattern**: Similar to above - capture inputs, save to test history

#### 5.4 Best Effort Wattage
**Location**: Search for "saveBestEffortWattage" 
**Pattern**: Capture interval targets, save to bike-best-effort table

#### 5.5 Low Cadence
**Location**: Search for "saveLowCadence"
**Pattern**: Capture cadence targets, save to bike-low-cadence table

#### 5.6 CHO Burn (Bike)
**Location**: Search for "saveCHOBike" (around line 2700)
**Already Updated**: ✅ This was done in previous commits

#### 5.7 Training Zones (LTHR)
**Location**: Search for "saveTrainingZones"
**Pattern**: Capture HR zones, bike_cp, run_cp

#### 5.8 LT1/OGC Analysis
**Location**: Search for "saveLT1OGC"
**Pattern**: Capture LT1/OGC watts and HR values

## 🎯 TESTING CHECKLIST

After implementation, test each calculator:

### Critical Power
1. Open https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
2. Go to Critical Power tab
3. Enter: P1=400, P5=350, P20=280, P60=250
4. Click Calculate
5. Click "Save to Athlete Profile"
6. Navigate to profile page
7. Verify CP Test History table shows the new test
8. Verify CP metric card updated

### Bike Power Zones (Expanded)
1. Open calculator
2. Enter CP=280, W'=22000, Weight=70kg
3. Calculate zones
4. Save to profile
5. Verify Power Zones History table updated
6. Verify zones display correctly

**Repeat for all 8 calculators**

## 📊 EXPECTED RESULTS

### Profile Page Should Show:
1. **Metric Cards**:
   - CP (watts) - editable
   - W' (joules) - editable
   - Power @ VO2max (watts)
   - LT1 (watts) with % of CP
   - OGC (watts) with % of CP

2. **8 History Tables**:
   - Critical Power Test History
   - Power Zones Test History
   - VO2 Max Intervals History
   - Best Effort Wattage History
   - Low Cadence Strength History
   - CHO Burn History
   - Training Zones (LTHR) History
   - LT1/OGC Analysis History

3. **Each Row Should Have**:
   - Date
   - Key metrics
   - View details button
   - Edit button
   - Delete button

## ⏱️ ESTIMATED TIME

- Step 1-4 (Integration): 30 minutes
- Step 5 (Update calculators): 2 hours
- Testing: 1 hour
- **Total: ~3.5 hours**

## 🚀 DEPLOYMENT

After all changes:
```bash
cd /home/user/webapp && npm run build
cd /home/user/webapp && npx wrangler pages deploy dist --project-name angela-coach
```

## 📝 NOTES

- All backend infrastructure is ready and deployed
- Database tables exist and are functional
- API endpoints are tested and working
- Only frontend integration remains
- This follows the exact same pattern as the SWIM tab (which is 100% complete)

## ✅ SUCCESS CRITERIA

When complete, you should be able to:
1. ✅ Use any of the 8 bike calculators
2. ✅ Click "Save to Profile"
3. ✅ See the test appear in the appropriate history table
4. ✅ Edit or delete any test
5. ✅ See metric cards automatically update from most recent test
6. ✅ Add manual tests via "+ Add Manual Test" buttons
7. ✅ View detailed test data via "View" buttons

---

**STATUS**: Ready for frontend integration. All backend complete. Following proven SWIM tab pattern.
