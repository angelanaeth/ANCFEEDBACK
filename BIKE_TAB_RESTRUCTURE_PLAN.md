# Bike Tab Restructure Plan

## Current Problem
The Bike tab has test history tables that should NOT be there. Tests should be in the Athlete Calculators page, NOT the profile.

## CORRECT Bike Tab Structure

```
┌─────────────────────────────────────────────────────────────┐
│ BIKE TAB                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│ │ CP        │ │ LT1 Power │ │ OGC Power │ │ W'        │   │
│ │ 184 W     │ │ --- W     │ │ --- W     │ │ 10.1 kJ   │   │
│ │ 2.8 W/kg  │ │           │ │           │ │ 155 J/kg  │   │
│ │ [Edit]    │ │ [Edit]    │ │ [Edit]    │ │ [Edit]    │   │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                               │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ 🧮 Bike Calculators & Tests                           │   │
│ │ Use the Bike Toolkit to run tests and calculators.   │   │
│ │ Save results back to this profile.                   │   │
│ │ [Open Bike Toolkit]                                   │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                               │
│ ▶ Power Zones (Collapsed)                       [▼]          │
│   └─ When expanded:                                          │
│      • Zone Type: [Basic (4) ▼ | Expanded (13)]             │
│      • [Calculate Zones from Current CP]                     │
│      • Zones Table (editable boundaries)                     │
│      • ZR: <120 W (<65%)                                     │
│      • Z1: 120-145 W (65-79%)                                │
│      • Z2: 145-164 W (79-89%)                                │
│      • Z3: 164-184 W (89-100%)                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## What to REMOVE

**DELETE these entire sections from Bike tab:**
1. ❌ "Critical Power Test History" table (lines ~1057-1085)
2. ❌ "LT1/OGC Test History" table (lines ~1087-1116)
3. ❌ "3/6/12 Minute Power Tests" cards (lines ~1118-1240)
4. ❌ "Best Effort Power Targets" table
5. ❌ "VO2max Bike Prescription" section
6. ❌ "Low Cadence Power Targets" table
7. ❌ "CHO Burn Rates" table
8. ❌ "Training Zones History" table

## What to KEEP

**KEEP these sections:**
1. ✅ 4 Metric Cards (CP, LT1, OGC, W') with Edit buttons
2. ✅ Edit forms (inline, collapsed)
3. ✅ Power Zones table (move to collapsible section)

## What to ADD

**ADD new sections:**
1. ✅ "Bike Calculators & Tests" card with link to Toolkit
2. ✅ Collapsible Power Zones section with:
   - Toggle to expand/collapse
   - Dropdown: Basic (4 zones) | Expanded (13 zones)
   - "Calculate Zones from Current CP" button
   - Zones table with editable boundaries
   - Auto-populate from Bike Power Zones calculator

## Implementation Steps

1. **Remove test history tables** - Delete lines 1057-1500 (approximately)
2. **Add Bike Tools card** - After metric cards, add toolkit link
3. **Make zones collapsible** - Wrap zones table in collapsible div
4. **Add zone type selector** - Dropdown for Basic/Expanded
5. **Add calculate button** - Button to generate zones from CP
6. **Update JavaScript** - Add toggle function, calculate function
7. **Same for Run tab** - Apply identical structure

## JavaScript Functions Needed

```javascript
// Toggle power zones visibility
function toggleBikePowerZones() {
  const content = document.getElementById('bikePowerZonesContent');
  const icon = document.getElementById('bikePowerZonesToggle');
  if (content.style.display === 'none') {
    content.style.display = 'block';
    icon.style.transform = 'rotate(90deg)';
  } else {
    content.style.display = 'none';
    icon.style.transform = 'rotate(0deg)';
  }
}

// Calculate zones from current CP
function calculateBikePowerZones() {
  if (!currentAthlete || !currentAthlete.bike_cp) {
    alert('Please set your CP first');
    return;
  }
  
  const zoneType = document.getElementById('bikeZoneType').value;
  const cp = currentAthlete.bike_cp;
  const lt1 = currentAthlete.bike_lt1_power;
  const ogc = currentAthlete.bike_ogc_power;
  
  if (zoneType === 'expanded' && (!lt1 || !ogc)) {
    alert('Expanded zones require LT1 and OGC. Use Basic zones or set LT1/OGC first.');
    return;
  }
  
  // Call existing generateAndDisplayPowerZones() function
  generateAndDisplayPowerZones();
  
  // Show zones section
  document.getElementById('bikePowerZonesContent').style.display = 'block';
  document.getElementById('bikePowerZonesToggle').style.transform = 'rotate(90deg)';
}
```

## Run Tab - Same Structure

Apply the EXACT same structure to the Run tab:
- 4 metric cards: CS, LT1 Pace, OGC Pace, D'
- "Run Calculators & Tests" card
- Collapsible "Pace Zones" section (5 zones: ZR, Z1-Z4)
- Remove all test history tables

## Benefits

1. ✅ **Cleaner UI** - Only essential metrics on profile
2. ✅ **Clear separation** - Tests in Toolkit, results in Profile
3. ✅ **Coach control** - Manual edit for all fields
4. ✅ **Flexible zones** - Choose Basic or Expanded
5. ✅ **Auto-populate** - Calculator can set zones automatically
6. ✅ **Editable** - Coach can adjust zone boundaries
