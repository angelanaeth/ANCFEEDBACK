# Complete Calculator Audit & Testing

**Date**: April 13, 2026  
**Production URL**: https://angela-coach.pages.dev/  
**Latest Deployment**: https://6415fff4.angela-coach.pages.dev

## Critical Fixes Applied

### 1. Database Schema - Missing Columns Added ✅
**Problem**: Backend tried to save to non-existent columns  
**Solution**: Created migration `0002_add_calculator_columns.sql`

Added columns:
- `bike_interval_targets` - Best Effort Wattage calculator
- `run_interval_targets` - Best Effort Pace calculator
- `swim_interval_pacing` - Swim Interval Pacing calculator
- `low_cadence_targets` - Low Cadence calculator
- `cho_burn_data` - CHO Burn calculators (swim/bike/run)
- `training_zones` - Training Zones calculator
- `bike_power_zones_detailed` - Bike Power Zones (Expanded) calculator
- `lt1_ogc_analysis` - LT1/OGC Threshold Analysis calculator

**Migration Status**: ✅ Applied to local database

### 2. Frontend Save Functions ✅
**Problem**: Some save functions not exposed globally  
**Solution**: Added `window.saveBEPToProfile` and `window.saveBPZToProfile`

## Calculator Testing Checklist

### SWIM TAB (3 calculators)

#### 1. Critical Swim Speed (CSS)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=swim
- **Save Function**: `saveSwimCSSToProfile()`
- **Database Column**: `swim_pace_zones`
- **Test Steps**:
  1. Enter T200 and T400 times
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CSS value
- **Status**: ⏳ NEEDS TESTING

#### 2. Swim Interval Pacing
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=swim
- **Save Function**: `saveSwimIntervalsToProfile()`
- **Database Column**: `swim_interval_pacing`
- **Test Steps**:
  1. Enter CSS pace
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved intervals
- **Status**: ⏳ NEEDS TESTING

#### 3. CHO Burn (Swim)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=swim
- **Save Function**: `saveCHOSwimToProfile()`
- **Database Column**: `cho_burn_data`
- **Test Steps**:
  1. Enter weight, intensity, duration
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CHO data
- **Status**: ⏳ NEEDS TESTING

### BIKE TAB (7 calculators)

#### 1. Critical Power (CP)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `saveCPToProfile()`
- **Database Column**: `bike_cp`, `bike_w_prime`
- **Test Steps**:
  1. Enter P1, P5, P20, P60 values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CP and W' values
- **Status**: ⏳ NEEDS TESTING

#### 2. Best Effort Wattage
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `window.saveBEPToProfile()` (Bike version)
- **Database Column**: `bike_interval_targets`
- **Test Steps**:
  1. Enter CP and W' values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved targets
- **Status**: ⏳ NEEDS TESTING

#### 3. Low Cadence
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `saveLowCadenceToProfile()`
- **Database Column**: `low_cadence_targets`
- **Test Steps**:
  1. Enter CP and cadence values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved targets
- **Status**: ⏳ NEEDS TESTING

#### 4. CHO Burn (Bike)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `saveCHOBikeToProfile()`
- **Database Column**: `cho_burn_data`
- **Test Steps**:
  1. Enter weight, power, duration
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CHO data
- **Status**: ⏳ NEEDS TESTING

#### 5. Training Zones
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `saveTrainingZonesToProfile()`
- **Database Column**: `training_zones`
- **Test Steps**:
  1. Enter LTHR value
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved zones
- **Status**: ⏳ NEEDS TESTING

#### 6. Bike Power Zones (Expanded)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `window.saveBPZToProfile()`
- **Database Column**: `bike_power_zones_detailed`
- **Test Steps**:
  1. Enter CP and W' values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved detailed zones
- **Status**: ⏳ NEEDS TESTING

#### 7. VO2 Max Intervals (Bike)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=bike
- **Save Function**: `saveVO2BikeToProfile()`
- **Database Column**: `vo2_bike_prescription`
- **Test Steps**:
  1. Enter CP, W', and pVO2max values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved VO2 prescription
- **Status**: ⏳ NEEDS TESTING

### RUN TAB (6 calculators)

#### 1. Critical Speed (CS)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `saveRunCSToProfile()`
- **Database Column**: `run_cs_seconds`, `run_d_prime`
- **Test Steps**:
  1. Enter T1200, T2400, T3600 times
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CS and D' values
- **Status**: ⏳ NEEDS TESTING

#### 2. Best Effort Pace
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `window.saveBEPToProfile()` (Run version)
- **Database Column**: `run_interval_targets`
- **Test Steps**:
  1. Enter CS and D' values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved targets
- **Status**: ⏳ NEEDS TESTING

#### 3. CHO Burn (Run)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `saveCHORunToProfile()`
- **Database Column**: `cho_burn_data`
- **Test Steps**:
  1. Enter weight, pace, duration
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved CHO data
- **Status**: ⏳ NEEDS TESTING

#### 4. VO2 Max Intervals (Run)
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `saveVO2RunToProfile()`
- **Database Column**: `vo2_run_prescription`
- **Test Steps**:
  1. Enter CS, vVO2, and distance values
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved VO2 prescription
- **Status**: ⏳ NEEDS TESTING

#### 5. LT1/OGC Threshold Analysis
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `saveLT1ToProfile()`
- **Database Column**: `lt1_ogc_analysis`
- **Test Steps**:
  1. Upload FIT file or enter manual data
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved analysis
- **Status**: ⏳ NEEDS TESTING

#### 6. Run Pace Zones
- **URL**: https://angela-coach.pages.dev/static/athlete-calculators?athlete=427194&sport=run
- **Save Function**: `saveRunPaceZonesToProfile()`
- **Database Column**: `run_pace_zones`
- **Test Steps**:
  1. Enter CS value
  2. Click Calculate
  3. Click "Save to Profile"
  4. Check profile for saved zones
- **Status**: ⏳ NEEDS TESTING

## Profile Display Testing

### Athlete Profile Page
**URL**: https://angela-coach.pages.dev/static/athlete-profile-v3?athlete=427194

### Test Each Tab:

#### Swim Tab
- [ ] CSS value displays correctly
- [ ] Swim zones table populated
- [ ] Swim intervals table populated
- [ ] "Saved Calculator Outputs" section shows all swim calculators
- [ ] Edit CSS form works
- [ ] Save CSS button works
- [ ] Manual edits tracked separately from calculator

#### Bike Tab
- [ ] CP value displays correctly (NOT "FTP")
- [ ] Power zones table populated
- [ ] Interval targets table populated
- [ ] VO2max section populated
- [ ] LTHR/HR zones table populated
- [ ] "Saved Calculator Outputs" section shows all bike calculators
- [ ] Edit CP form works
- [ ] Save CP button works
- [ ] Manual edits tracked separately from calculator

#### Run Tab
- [ ] CS value displays correctly
- [ ] Pace zones table populated
- [ ] Interval targets table populated
- [ ] LTHR/HR zones table populated
- [ ] "Saved Calculator Outputs" section shows all run calculators
- [ ] Edit CS form works
- [ ] Save CS button works
- [ ] Manual edits tracked separately from calculator

## Known Issues Fixed

1. ✅ **HTTP 500: no such column: bike_cp** - Fixed by checking database schema
2. ✅ **HTTP 500: no such column: zones_updated_at** - Fixed by removing reference
3. ✅ **Undefined saveBEPToProfile** - Fixed by exposing globally
4. ✅ **Undefined saveBPZToProfile** - Fixed by exposing globally
5. ✅ **Missing database columns** - Fixed by migration 0002
6. ✅ **TypeError: Cannot set properties of null** - Fixed by adding null checks

## Testing Instructions

### For Each Calculator:
1. Open the calculator URL with athlete=427194
2. Fill in required inputs
3. Click Calculate button
4. Verify results display correctly
5. Click "Save to Profile" button
6. Look for success message
7. Open profile page (https://angela-coach.pages.dev/static/athlete-profile-v3?athlete=427194)
8. Navigate to appropriate tab (Swim/Bike/Run)
9. Check "Saved Calculator Outputs" section
10. Verify the calculator output appears with:
    - Calculator name
    - Value summary
    - Source: "Calculator"
    - Date stamp

### Integration Test Flow:
1. **Start Fresh**: Open profile page
2. **Swim Test**: Run CSS calculator → Save → Verify in profile
3. **Bike Test**: Run CP calculator → Save → Verify in profile
4. **Run Test**: Run CS calculator → Save → Verify in profile
5. **Manual Edit Test**: Edit CP manually → Save → Verify source shows "Manual"
6. **Calculator Update Test**: Re-run CP calculator with different values → Save → Verify update

## Production Checklist

- [x] Database migration applied locally
- [ ] Database migration applied to production (via `--remote` flag)
- [x] Frontend code deployed to Cloudflare Pages
- [x] Backend code deployed to Cloudflare Pages
- [ ] All 16 calculators tested end-to-end
- [ ] Profile display tested for all tabs
- [ ] Manual edit vs calculator source tracking verified
- [ ] Browser console errors checked
- [ ] Network errors checked

## Next Steps

1. **Test All 16 Calculators** - Systematically test each one
2. **Apply Migration to Production DB** - Run migration with `--remote` flag
3. **Document Any Issues** - Note any remaining problems
4. **User Acceptance Testing** - Have Angela test real athlete workflows

---

**Status**: 🔧 Database Fixed, Ready for Systematic Testing  
**Last Updated**: 2026-04-13 11:05 UTC
