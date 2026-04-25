# ✅ EXPANDED BIKE POWER ZONES - IMPLEMENTED

**Date:** April 16, 2026  
**Status:** DEPLOYED TO PRODUCTION ✅  
**Deployment:** https://7e29688c.angela-coach.pages.dev

---

## What Was Added

### BIKE POWER ZONES NOW SUPPORT TWO MODES

The Bike profile now intelligently switches between basic and expanded zones based on available data:

---

## MODE 1: BASIC 4-ZONE SYSTEM

**When:** No LT1 or OGC data available (just CP)  
**Matches:** Training Zones calculator exactly

| Zone | Name | % of CP |
|------|------|---------|
| **ZR** | Recovery | < 65% |
| **Z1** | Aerobic | 65-79% |
| **Z2** | Tempo | 79-89% |
| **Z3** | Threshold | 89-100% |

**Example with 280W CP:**
- ZR: < 182 W
- Z1: 182-221 W
- Z2: 221-249 W
- Z3: 249-280 W

---

## MODE 2: EXPANDED SUB-ZONE SYSTEM

**When:** LT1 AND OGC values are set in profile  
**Matches:** Bike Power Zones — Expanded calculator exactly

### 13 Precision Sub-Zones:

#### ZR - Recovery
- < 65% CP
- Active recovery, no adaptation stimulus

#### Z1 - Aerobic Base (4 sub-zones)
**Based on:** 65% CP → LT1 (default 72% CP)

1. **Sub-LT1**: 55% → LT1 - Foundation volume, fat-oxidation dominant
2. **Low-Z1**: 65% → 1/3 of Z1 span - Easy aerobic, long rides
3. **Mid-Z1**: 1/3 → 2/3 of Z1 span - Moderate aerobic stimulus
4. **High-Z1**: 2/3 → LT1 - Upper aerobic, approaches LT1

#### Z2 - Threshold Band (3 sub-zones)
**Based on:** LT1 → OGC (default 87% CP)

5. **Low-Z2**: LT1 → 1/3 of Z2 span - Just above LT1, IM race pace
6. **Mid-Z2**: 1/3 → 2/3 of Z2 span - Threshold band, 70.3 race power
7. **High-Z2**: 2/3 → OGC - Upper threshold, approaching OGC

#### Sweet Spot
8. **Sweet Spot**: OGC ± 2% (85-89% CP) - High-value threshold stimulus

#### Z3 - Glycolytic (3 sub-zones)
**Based on:** OGC → CP

9. **Low-Z3**: OGC → 1/3 of Z3 span - Just above OGC, CHO dominant
10. **Mid-Z3**: 1/3 → 2/3 of Z3 span - High glycolytic, hard intervals
11. **High-Z3**: 2/3 → CP - Near CP, maximum sustainable

#### CP+ - Above Critical Power
12. **CP+**: 104-106% CP - VO2max / anaerobic intervals

---

## Example: 280W CP with LT1 and OGC

**Given:**
- CP: 280 W
- LT1: 202 W (72% CP)
- OGC: 244 W (87% CP)

**Expanded Zones:**

| Zone | Name | Watts | % CP | Description |
|------|------|-------|------|-------------|
| ZR | Recovery | < 181 W | < 65% | Active recovery |
| **Z1 AEROBIC BASE** | | | | |
| Sub-LT1 | Sub-LT1 Base | 154-201 W | 55-72% | Foundation volume |
| Low-Z1 | Z1 Low | 182-188 W | 65-67% | Easy aerobic |
| Mid-Z1 | Z1 Mid | 189-195 W | 68-70% | Moderate aerobic |
| High-Z1 | Z1 High | 196-201 W | 70-72% | Upper aerobic |
| **Z2 THRESHOLD BAND** | | | | |
| Low-Z2 | Z2 Low | 202-216 W | 72-77% | Just above LT1 |
| Mid-Z2 | Z2 Mid | 217-230 W | 78-82% | Threshold band |
| High-Z2 | Z2 High | 231-243 W | 83-87% | Upper threshold |
| **SWEET SPOT** | | | | |
| Sweet Spot | Sweet Spot | 238-249 W | 85-89% | High-value TH |
| **Z3 GLYCOLYTIC** | | | | |
| Low-Z3 | Z3 Low | 244-256 W | 87-91% | CHO dominant |
| Mid-Z3 | Z3 Mid | 257-268 W | 92-96% | High glycolytic |
| High-Z3 | Z3 High | 269-279 W | 96-100% | Near CP |
| **CP+** | | | | |
| CP+ | Critical Power+ | 291-297 W | 104-106% | VO2max intervals |

---

## How Athletes Get Expanded Zones

### Step 1: Use Bike Power Zones Calculator

1. **Navigate:** Athlete Calculators → "Bike Power Zones — Expanded"
2. **Enter:**
   - Critical Power (CP): e.g., 280 W
   - W' (Anaerobic Capacity): e.g., 22000 J
   - Body Weight (optional): e.g., 70 kg
   - Test Powers (optional): 5s, 1min, 5min, 20min, 60min
3. **Click:** "Calculate All"

### Step 2: Calculator Auto-Calculates

**Defaults (when no FIT file uploaded):**
- LT1 = 72% of CP (e.g., 202 W)
- OGC = 87% of CP (e.g., 244 W)

**With LT1/OGC Analysis:**
- Upload FIT file in "LT1 / OGC Analysis" tab
- Get personalized LT1 and OGC from actual test
- Use those values instead of defaults

### Step 3: Save to Profile

1. **Click:** "💾 Save to Athlete Profile" button
2. **System saves:**
   - `bike_cp`: 280 W
   - `bike_w_prime`: 22000 J
   - `bike_lt1_power`: 202 W (with source and date)
   - `bike_ogc_power`: 244 W (with source and date)
3. **Confirmation:** Alert shows all saved values

### Step 4: View Expanded Zones in Profile

1. **Navigate:** Athlete Profile → Bike Tab
2. **Scroll to:** Power Zones table
3. **See:** 13 expanded sub-zones automatically displayed
4. **Footer shows:** "Expanded zones using LT1 (202 W) and OGC (244 W)"

---

## Technical Implementation

### Database Fields

**Existing fields now used for expanded zones:**
```sql
bike_lt1_power INTEGER           -- LT1 power in watts
bike_lt1_source TEXT              -- Source (Bike Power Zones Calculator / Manual)
bike_lt1_updated TEXT             -- Last updated timestamp
bike_ogc_power INTEGER            -- OGC power in watts
bike_ogc_source TEXT              -- Source
bike_ogc_updated TEXT             -- Last updated timestamp
```

### Frontend Logic

**File:** `athlete-profile-v3.html` line ~3330

```javascript
function generateAndDisplayPowerZones() {
  const cp = currentAthlete.bike_cp;
  const lt1 = currentAthlete.bike_lt1_power;
  const ogc = currentAthlete.bike_ogc_power;
  
  if (lt1 && ogc) {
    // EXPANDED ZONES MODE
    // Calculate 13 sub-zones based on LT1 and OGC
    // Display with group separators
  } else {
    // BASIC 4-ZONE MODE
    // Display ZR, Z1, Z2, Z3 only
  }
}
```

### Calculator Save Function

**File:** `athlete-calculators.html` line ~3219

```javascript
window.saveBPZToProfile = async function() {
  const cp = parseFloat(...);
  const wprime = parseFloat(...);
  const lt1_watts = Math.round(cp * 0.72);  // Default
  const ogc_watts = Math.round(cp * 0.87);  // Default
  
  // PUT /api/athlete-profile/:id
  const profileData = {
    bike_cp,
    bike_w_prime,
    bike_lt1_power: lt1_watts,      // NEW
    bike_lt1_source: 'Bike Power Zones Calculator',
    bike_lt1_updated: new Date().toISOString(),
    bike_ogc_power: ogc_watts,      // NEW
    bike_ogc_source: 'Bike Power Zones Calculator',
    bike_ogc_updated: new Date().toISOString()
  };
  
  await fetch('/api/athlete-profile/:id', { method: 'PUT', body: JSON.stringify(profileData) });
}
```

---

## Automatic Mode Switching

**The profile intelligently switches modes:**

1. **User enters CP only** (via CP calculator or manual)
   - Profile displays: 4 basic zones (ZR, Z1-Z3)
   - Footer: "For expanded zones, use Bike Power Zones calculator"

2. **User uses Bike Power Zones calculator**
   - Calculator saves: CP, W', LT1, OGC
   - Profile detects: LT1 and OGC exist
   - Profile displays: 13 expanded sub-zones
   - Footer: "Expanded zones using LT1 and OGC"

3. **User can switch back to basic**
   - Clear LT1/OGC fields manually
   - Profile reverts to 4 basic zones

---

## Visual Differences

### Basic Mode (4 zones)
```
Zone  Name         Range          % CP
─────────────────────────────────────────
ZR    Recovery     < 182 W        < 65%
Z1    Aerobic      182-221 W      65-79%
Z2    Tempo        221-249 W      79-89%
Z3    Threshold    249-280 W      89-100%
```

### Expanded Mode (13 sub-zones)
```
Zone         Name              Range          % CP
──────────────────────────────────────────────────
ZR           Recovery          < 181 W        < 65%
── Z1 · Aerobic Base ──
Sub-LT1      Sub-LT1 Base      154-201 W      55-72%
Low-Z1       Z1 Low            182-188 W      65-67%
Mid-Z1       Z1 Mid            189-195 W      68-70%
High-Z1      Z1 High           196-201 W      70-72%
── Z2 · Threshold Band ──
Low-Z2       Z2 Low            202-216 W      72-77%
Mid-Z2       Z2 Mid            217-230 W      78-82%
High-Z2      Z2 High           231-243 W      83-87%
── Sweet Spot & Z3 ──
Sweet Spot   Sweet Spot        238-249 W      85-89%
Low-Z3       Z3 Low            244-256 W      87-91%
Mid-Z3       Z3 Mid            257-268 W      92-96%
High-Z3      Z3 High           269-279 W      96-100%
── CP+ ──
CP+          Critical Power+   291-297 W      104-106%
```

---

## Run Zones (Unchanged)

**Run zones remain 5-zone system:**
- ZR: < 75% speed
- Z1: 75-85% speed
- Z2: 85-95% speed
- Z3: 95-100% speed
- Z4: 100-110% speed

No expanded sub-zones for run (uses speed % not power %)

---

## Benefits of Expanded Zones

### For Coaches
1. **Precision targeting:** 13 zones vs 4 zones
2. **Better prescription:** "Mid-Z2" more specific than "Z2"
3. **Individualized:** Based on LT1/OGC from actual tests
4. **Progressive:** Track fitness by watching LT1/OGC shift

### For Athletes
1. **Clearer targets:** Know exactly where to ride
2. **Sweet spot identified:** No guessing at 85-89% CP
3. **Race pace zones:** Olympic (Low-Z3), 70.3 (Mid-Z2), IM (Low-Z2)
4. **Training variety:** 13 distinct training zones

---

## Deployment Status

✅ **LIVE NOW:**
- Production: https://angela-coach.pages.dev
- Latest: https://7e29688c.angela-coach.pages.dev

✅ **Files Updated:**
- `athlete-profile-v3.html` (zone generation function)
- `athlete-calculators.html` (save function)

✅ **GitHub:**
- Commit db9eadd pushed
- Repo: https://github.com/angelanaeth/Block-Race-Planner

---

## How to Verify

1. **Go to:** Athlete Profile → Bike Tab
2. **Without LT1/OGC:** See 4 basic zones (ZR, Z1-Z3)
3. **Use:** Bike Power Zones calculator, enter CP + W', click Calculate
4. **Click:** "💾 Save to Athlete Profile"
5. **Return to profile:** Now see 13 expanded sub-zones
6. **Compare:** Open calculator zones table vs profile zones → match exactly!

---

## Next Steps

### For Enhanced Accuracy
Use **LT1 / OGC Analysis** tab:
1. Upload FIT file from recovery-valley or step test
2. Get personalized LT1 and OGC thresholds
3. Save to profile → even more accurate expanded zones

### For Athletes Without Power Data
1. Start with basic 4 zones (estimate CP from FTP)
2. Do Critical Power test → update to real CP
3. Eventually do LT1/OGC test → unlock expanded zones

---

**Summary:** Bike profile now matches your Bike Power Zones calculator exactly, with automatic switching between basic and expanded modes! 🎯
