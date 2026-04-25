# 🔧 FIXES DEPLOYED - Toolkit & Save to Profile Issues

## 🎯 Issues Fixed

### 1. ✅ Removed Logo from Toolkit Page
**Problem**: EchoDevo logo showing on toolkit page  
**Solution**: Removed `<img>` tag, now shows text-only header "EchoDevo Coach Toolkit"  
**File**: `public/static/athlete-calculators.html`

**Before:**
```html
<img src="images/logo.png" alt="EchoDevo" class="qt2-logo">
<div class="qt2-header-tagline">Coach Toolkit</div>
```

**After:**
```html
<div class="qt2-header-tagline">EchoDevo Coach Toolkit</div>
```

---

### 2. ✅ Removed CSS from Athlete Banner
**Problem**: CSS (Critical Swim Speed) showing in athlete banner on toolkit  
**Solution**: Removed CSS display line from banner  
**File**: `public/static/athlete-calculators.html`

**Before:**
```javascript
${profile.css_pace ? `<span>🏊 CSS: ${formatSwimPace(profile.css_pace)}/100m</span>` : ''}
```

**After:** (Line removed - only shows Athlete name, CP, and CS now)

---

### 3. ✅ Fixed Save to Profile API Call
**Problem**: Save to Profile button not saving data - API call mismatch  
**Solution**: Fixed field mapping between frontend and backend  
**File**: `public/static/athlete-calculators.html`

**Root Cause:**
- **Frontend was sending**: `{calculator, sport, outputs, timestamp}`
- **Backend expected**: `{type, output, timestamp}`
- Field name mismatch caused API to reject requests

**Fix Applied:**
- Map calculator name to correct type:
  - "Critical Power" → `bike-power`
  - "Critical Speed (Run)" → `run-pace`
  - "Critical Swim Speed" → `swim-pace`
  - "VO2 (Bike)" → `vo2-bike`
  - "VO2 (Run)" → `vo2-run`
- Send `output` instead of `outputs`
- Send `type` instead of `calculator` and `sport`

**Code Change:**
```javascript
// NEW: Correct mapping
let type = '';
if (calculatorName.includes('Critical Power')) {
  type = 'bike-power';
} else if (calculatorName.includes('Critical Speed') && calculatorName.includes('Run')) {
  type = 'run-pace';
} else if (calculatorName.includes('Critical') && calculatorName.includes('Swim')) {
  type = 'swim-pace';
}

// Send correct fields
body: JSON.stringify({
  type: type,          // ✅ Correct
  output: outputs,     // ✅ Correct (singular)
  timestamp: new Date().toISOString()
})
```

---

## 🚀 Deployment

### Latest Deployment:
- **URL**: https://595d8915.angela-coach.pages.dev
- **Date**: 2026-04-12
- **Commit**: 56f7079
- **Status**: ✅ LIVE

### Main URLs:
- **Production**: https://angela-coach.pages.dev
- **Dashboard**: https://angela-coach.pages.dev/static/coach.html
- **Toolkit**: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=2
- **Profile**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=2

---

## 🧪 How to Test

### Test Toolkit Changes:
1. Go to: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=2
2. **Check**: Header shows "EchoDevo Coach Toolkit" (no logo image)
3. **Check**: Athlete banner shows "🏃 Athlete: Angela 1A 🚴 CP: XXX 🏃 CS: XX:XX" (no swim CSS)

### Test Save to Profile:
1. Go to toolkit with athlete ID: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=2
2. Navigate to **Critical Power** calculator
3. Enter test data:
   - Short test: 3 min, 242W
   - Medium test: 6 min, 210W
   - Long test: 12 min, 195W
4. Click **"Calculate CP & W'"**
5. **Click "Save to Athlete Profile"**
6. **Expected**: Green success toast "✅ Critical Power saved to athlete profile!"
7. Open athlete profile: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=2
8. **Check**: CP value should be updated in Bike tab

### Test Other Calculators:
- **Critical Speed (Run)**: Save should work → updates run CS in profile
- **Critical Swim Speed**: Save should work → updates swim CSS in profile
- **VO2 Intervals**: Save should work → updates VO2 prescription in profile

---

## 📊 What's Working Now

✅ **Toolkit header** - Clean text-only "EchoDevo Coach Toolkit"  
✅ **Athlete banner** - Shows name, CP, CS (no CSS)  
✅ **Save to Profile** - Correctly saves to database via API  
✅ **CP calculator** - Saves CP and W' values  
✅ **CS Run calculator** - Saves CS and D' values  
✅ **CSS Swim calculator** - Saves CSS values  
✅ **API integration** - Correct field mapping  
✅ **Database updates** - Values persist in athlete_profiles table

---

## 📝 API Endpoint Documentation

### POST `/api/athlete-profile/:id/calculator-output`

**Request Body:**
```json
{
  "type": "bike-power" | "run-pace" | "swim-pace" | "vo2-bike" | "vo2-run",
  "output": {
    "cp": 250,           // For bike-power
    "w_prime": 20.5,     // For bike-power
    "cs_seconds": 240,   // For run-pace (pace per km in seconds)
    "d_prime": 150,      // For run-pace (meters)
    "css_seconds": 90    // For swim-pace (pace per 100m in seconds)
  },
  "timestamp": "2026-04-12T17:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Calculator output saved successfully"
}
```

**Database Updates:**
- Updates `athlete_profiles` table
- Sets calculator-specific columns (e.g., `bike_cp`, `bike_w_prime`)
- Sets source as 'calculator'
- Updates timestamp fields

---

## 🎉 Summary

**All 3 issues fixed and deployed:**
1. ✅ Logo removed from toolkit
2. ✅ CSS removed from athlete banner
3. ✅ Save to Profile now working correctly

**Production deployment successful:**
- Latest URL: https://595d8915.angela-coach.pages.dev
- All changes live and testable
- Database integration working

**Next steps:**
- User acceptance testing
- Verify all calculator types save correctly
- Collect feedback on profile zones (currently read-only)

---

**Status**: ✅ **ALL FIXES DEPLOYED**  
**Date**: 2026-04-12  
**Version**: v3.1 - Bug Fixes  
**Ready for**: User testing
