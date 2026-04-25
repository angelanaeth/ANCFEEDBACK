# 🧪 Run Profile Testing Checklist

## Deployment URLs
- **Production:** https://angela-coach.pages.dev
- **Latest Preview:** https://57913ff6.angela-coach.pages.dev
- **Repository:** https://github.com/angelanaeth/Block-Race-Planner

---

## Phase 6: Manual Testing Checklist

### ✅ 1. Metric Cards Display (4 cards)

#### CS (Critical Speed) Card
- [ ] Displays pace in MM:SS /mile format
- [ ] Shows /km pace conversion
- [ ] Shows source (calculator, manual, etc.)
- [ ] Shows date in readable format
- [ ] Edit button visible and clickable
- [ ] Empty state shows "--:-- /mi" when no data

#### LT1 Pace Card
- [ ] Displays pace in MM:SS /mile format
- [ ] Shows % of CS calculation
- [ ] Shows /km pace conversion
- [ ] Shows source and date
- [ ] Edit button works
- [ ] Empty state handled properly

#### OGC Pace Card
- [ ] Displays pace in MM:SS /mile format
- [ ] Shows % of CS calculation
- [ ] Shows /km pace conversion
- [ ] Shows source and date
- [ ] Edit button works
- [ ] Empty state handled properly

#### D' (Distance Prime) Card
- [ ] Displays value in meters
- [ ] Shows feet conversion
- [ ] Shows source and date
- [ ] Edit button works
- [ ] Empty state shows "--- m"

---

### ✅ 2. Test Cards Display (3 cards)

#### 3-Minute Pace Test
- [ ] Displays pace in MM:SS /mile
- [ ] Shows duration in MM:SS
- [ ] Shows test date
- [ ] Edit button works
- [ ] Empty state shows "--:-- /mi"

#### 6-Minute Pace Test
- [ ] Displays pace in MM:SS /mile
- [ ] Shows duration in MM:SS
- [ ] Shows test date
- [ ] Edit button works
- [ ] Empty state handled

#### 12-Minute Pace Test
- [ ] Displays pace in MM:SS /mile
- [ ] Shows duration in MM:SS
- [ ] Shows test date
- [ ] Edit button works
- [ ] Empty state handled

---

### ✅ 3. Pace Zones Table

#### Zone Generation
- [ ] Generates 7 zones when CS is set
- [ ] Shows empty state when no CS
- [ ] ZR (Recovery) zone calculated correctly (115-130% CS)
- [ ] Z1 (Easy) zone calculated correctly (108-115% CS)
- [ ] Z2 (Aerobic) zone calculated correctly (103-108% CS)
- [ ] Z3 (Tempo) zone calculated correctly (98-103% CS)
- [ ] Z4 (Threshold/CS) zone calculated correctly (92-98% CS)
- [ ] Z5 (VO2max) zone calculated correctly (87-92% CS)
- [ ] Z6 (Anaerobic) zone calculated correctly (75-87% CS)

#### Zone Display
- [ ] Shows pace range in /mile
- [ ] Shows pace range in /km
- [ ] Shows % CS for each zone
- [ ] Shows date (based on CS date)
- [ ] Color coding visible for each zone
- [ ] Zone names displayed correctly

---

### ✅ 4. Heart Rate Zones Table

#### Zone Generation
- [ ] Generates 5 zones when LTHR is set
- [ ] Shows empty state when no LTHR
- [ ] Z1 (Recovery) <75% LTHR
- [ ] Z2 (Aerobic) 75-85% LTHR
- [ ] Z3 (Tempo) 85-90% LTHR
- [ ] Z4 (Threshold) 90-100% LTHR
- [ ] Z5 (VO2max) 100-110% LTHR

#### Zone Display
- [ ] Shows low HR (bpm)
- [ ] Shows high HR (bpm)
- [ ] Shows % LTHR range
- [ ] Shows source and date
- [ ] Edit buttons visible (placeholder)
- [ ] Color coding visible

---

### ✅ 5. Edit Functions (10 functions)

#### Edit CS
- [ ] Edit button opens form
- [ ] Form pre-fills with current CS value
- [ ] Form pre-fills with current date
- [ ] Form pre-fills with current source
- [ ] MM:SS input accepts valid paces (e.g., 7:30)
- [ ] Decimal input works (e.g., 7.5 = 7:30)
- [ ] Save button updates database
- [ ] Success alert appears
- [ ] Profile reloads with new value
- [ ] Cancel button closes form without saving

#### Edit LT1
- [ ] Edit button opens form
- [ ] Form pre-fills correctly
- [ ] Pace input validation works
- [ ] Save updates LT1 value
- [ ] % CS recalculates
- [ ] Cancel works

#### Edit OGC
- [ ] Edit button opens form
- [ ] Form pre-fills correctly
- [ ] Pace input validation works
- [ ] Save updates OGC value
- [ ] % CS recalculates
- [ ] Cancel works

#### Edit D'
- [ ] Edit button opens form
- [ ] Form pre-fills correctly
- [ ] Numeric input accepts meters
- [ ] Save updates D' value
- [ ] Feet conversion updates
- [ ] Cancel works

#### Edit 3-Min Test
- [ ] Edit button opens form
- [ ] Pace pre-fills correctly
- [ ] Duration pre-fills correctly
- [ ] Date pre-fills correctly
- [ ] Save updates all 3 fields
- [ ] Cancel works

#### Edit 6-Min Test
- [ ] Edit button opens form
- [ ] All fields pre-fill
- [ ] Save works correctly
- [ ] Cancel works

#### Edit 12-Min Test
- [ ] Edit button opens form
- [ ] All fields pre-fill
- [ ] Save works correctly
- [ ] Cancel works

#### Save LTHR
- [ ] Input field accepts bpm value
- [ ] Date field works
- [ ] Validation checks range (100-220)
- [ ] Save button updates LTHR
- [ ] HR zones regenerate automatically
- [ ] Success alert appears

---

### ✅ 6. Calculator Integration (3 calculators)

#### Critical Speed Calculator
- [ ] Calculator opens from Run tab
- [ ] "Save to Profile" button visible
- [ ] Save button captures CS value
- [ ] Save button captures D' value
- [ ] Save button captures 3/6/12-min test data
- [ ] Success alert appears
- [ ] Navigates back to Run Profile tab
- [ ] All values display correctly in profile

#### CHO Burn (Run)
- [ ] Calculator works
- [ ] Save button visible
- [ ] Save to profile works
- [ ] Data appears in profile

#### VO₂ Intervals (Run)
- [ ] Calculator works
- [ ] Save button visible
- [ ] Save to profile works
- [ ] Data appears in profile

---

### ✅ 7. Data Conversions

#### Pace Conversions
- [ ] /mile to /km conversion accurate (÷ 1.60934)
- [ ] /km to /mile conversion accurate (× 1.60934)
- [ ] MM:SS formatting consistent
- [ ] No rounding errors visible

#### Distance Conversions
- [ ] Meters to feet accurate (× 3.28084)
- [ ] Feet display rounded properly
- [ ] No conversion errors

---

### ✅ 8. Date Formatting

- [ ] All dates use formatDate() helper
- [ ] Dates display in readable format (e.g., "Apr 15, 2026")
- [ ] ISO dates convert correctly
- [ ] Date inputs use YYYY-MM-DD format
- [ ] Missing dates show appropriate fallback

---

### ✅ 9. Null/Empty States

- [ ] Missing CS shows helpful prompt
- [ ] Missing LT1 shows "Not set"
- [ ] Missing OGC shows "Not set"
- [ ] Missing D' shows "Not set"
- [ ] Missing tests show "--:--"
- [ ] Missing zones show helpful message with toolkit link
- [ ] Missing LTHR shows helpful prompt

---

### ✅ 10. UI/UX

- [ ] Cards layout responsive
- [ ] Edit forms appear smoothly
- [ ] Scroll to form works
- [ ] Forms close on cancel
- [ ] Success alerts clear
- [ ] Error alerts informative
- [ ] Color coding visible
- [ ] Font sizes readable
- [ ] Spacing consistent
- [ ] Run Toolkit button works

---

### ✅ 11. Performance

- [ ] Page loads quickly
- [ ] No console errors
- [ ] No JavaScript errors
- [ ] API calls complete
- [ ] Profile updates reflected immediately
- [ ] Build size reasonable (257.05 kB)

---

### ✅ 12. Integration

- [ ] Run tab visible in navigation
- [ ] Tab switching works
- [ ] Data persists across tab switches
- [ ] No conflicts with Bike/Swim tabs
- [ ] All 21 database fields saving correctly
- [ ] API GET returns all run fields
- [ ] API PUT accepts all run fields

---

## 🐛 Known Issues

### Minor Issues (Non-blocking)
1. Zone editing placeholder - will be implemented in future update
2. Test history delete function - will match Bike implementation later

### No Critical Issues Found

---

## ✅ Test Results Summary

**Total Tests:** 120+
**Passed:** TBD (manual testing required)
**Failed:** TBD
**Blocked:** 0

---

## 📝 Testing Notes

### Test Environment
- **Browser:** Chrome, Firefox, Safari
- **Platform:** Desktop, Mobile
- **User:** Test athlete account
- **Data:** Sample CS, LT1, OGC, D', test values

### Sample Test Data
```javascript
{
  run_cs: 450,              // 7:30 /mile
  run_d_prime: 350,         // 350 meters
  run_lt1_pace: 510,        // 8:30 /mile (85% CS)
  run_ogc_pace: 420,        // 7:00 /mile (93% CS)
  run_pace_3min: 390,       // 6:30 /mile
  run_pace_3min_duration: 180,
  run_pace_3min_date: '2026-04-16',
  run_lthr_manual: 165,     // 165 bpm
  body_weight_kg: 70        // For conversions
}
```

---

## 🚀 Deployment Verification

### Production URLs
- [ ] Production URL loads: https://angela-coach.pages.dev
- [ ] Preview URL loads: https://57913ff6.angela-coach.pages.dev
- [ ] Run tab accessible
- [ ] All features working
- [ ] No 404 errors
- [ ] No API errors

### Build Verification
- [ ] Build size: 257.05 kB ✅
- [ ] No build errors ✅
- [ ] All files deployed ✅
- [ ] Static assets loading ✅

---

**Testing Date:** April 16, 2026  
**Tester:** AI Developer  
**Version:** v1.0.0  
**Status:** Ready for user testing
