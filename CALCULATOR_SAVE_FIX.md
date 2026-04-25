# Athlete Calculator Save Functions - Fix Complete

**Date**: 2026-04-15
**Status**: ✅ FIXED & DEPLOYED

---

## 🐛 Problem

User was getting JavaScript errors when clicking "Save to Athlete Profile" buttons on swim calculators:

```
Uncaught ReferenceError: saveSwimIntervalToProfile is not defined
Uncaught ReferenceError: saveCHOSwimToProfile is not defined
Uncaught ReferenceError: saveSwimCSSToProfile is not defined
```

### Root Cause

The save functions were defined **inside other functions** (local scope), making them inaccessible to onclick handlers which run in global scope.

**Example of the problem:**
```javascript
function calcSIP() {
  // ... calculator logic ...
  
  // Button with onclick handler
  renderResult('<button onclick="saveSwimIntervalToProfile()">Save</button>');
  
  // ❌ PROBLEM: Function defined in local scope
  async function saveSwimIntervalToProfile() {
    // ... save logic ...
  }
}
```

When the button is clicked, JavaScript looks for `saveSwimIntervalToProfile` in **global scope**, but it only exists in the local scope of `calcSIP()`.

---

## ✅ Solution

Moved all save functions to **global scope** by:

1. Defining them **outside** any parent functions
2. Placed them in a dedicated section after `saveToAthleteProfile()`
3. Used direct DOM access (`document.getElementById`) instead of scoped helper functions

### Functions Fixed

1. **`saveSwimIntervalToProfile()`** - Swim Interval Pacing calculator
2. **`saveCHOSwimToProfile()`** - CHO Burn (Swim) calculator  
3. **`saveSwimCSSToProfile(css, dPrime, t200, t400)`** - Critical Swim Speed calculator

---

## 🔧 Technical Changes

### File Modified
- **Path**: `/home/user/webapp/public/static/athlete-calculators.html`
- **Location**: Lines ~1770-1850 (new global save functions section)

### Code Structure

**BEFORE (❌ Broken):**
```javascript
<script>
(function() {
  function calcSIP() {
    // Calculator logic
    renderButton('onclick="saveSwimIntervalToProfile()"');
    
    // ❌ Nested function - not accessible!
    async function saveSwimIntervalToProfile() {
      await fetch('/api/...');
    }
  }
})();
</script>
```

**AFTER (✅ Fixed):**
```javascript
<script>
// Global scope - accessible everywhere!
async function saveSwimIntervalToProfile() {
  const cssMin = parseFloat(document.getElementById('sip-cs-min').value);
  const cssSec = parseFloat(document.getElementById('sip-cs-sec').value);
  const css = cssMin * 60 + cssSec;
  
  await fetch(`/api/athlete-profile/${window.athleteId}/test-history`, {
    method: 'POST',
    body: JSON.stringify({ calculator_type: 'swim-intervals', data: {...} })
  });
  
  await saveToAthleteProfile('Swim Interval Pacing', {...}, 'swim');
}

(function() {
  function calcSIP() {
    // Calculator logic
    renderButton('onclick="saveSwimIntervalToProfile()"'); // ✅ Now works!
  }
})();
</script>
```

---

## 📊 What Gets Saved

### 1. Swim Interval Pacing (CSS zones)
**Saves to:**
- Test history: `/api/athlete-profile/{id}/test-history`
- Calculator output: `/api/athlete-profile/{id}/calculator-output`

**Data:**
```json
{
  "calculator_type": "swim-intervals",
  "test_date": "2026-04-15",
  "data": {
    "css_seconds": 75,
    "intervals": {
      "zr": 83,   // Recovery (CSS + 8s)
      "z1": 80,   // Zone 1 (CSS + 5s)
      "z2": 77,   // Zone 2 (CSS + 2s)
      "cs": 75,   // CSS pace
      "fast": 72, // 5% faster (CSS - 3s)
      "faster": 69 // 10% faster (CSS - 6s)
    }
  }
}
```

### 2. CHO Burn (Swim)
**Saves to:**
- Test history: `/api/athlete-profile/{id}/test-history`
- Calculator output: `/api/athlete-profile/{id}/calculator-output`

**Data:**
```json
{
  "calculator_type": "swim-cho",
  "test_date": "2026-04-15",
  "data": {
    "weight_lbs": 165,
    "distance_meters": 3000,
    "pace": 1.5,
    "nature": "moderate",
    "cho_burned": 245.5
  }
}
```

### 3. Critical Swim Speed (CSS)
**Saves to:**
- Test history: `/api/athlete-profile/{id}/test-history`
- Calculator output: `/api/athlete-profile/{id}/calculator-output`

**Data:**
```json
{
  "calculator_type": "swim-css",
  "test_date": "2026-04-15",
  "data": {
    "css_pace_per_100m": 75,
    "css_mps": 1.333,
    "d_prime": 12.5,
    "t200": 150,
    "t400": 330
  }
}
```

---

## ✅ Test Results

**Production URL**: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194&sport=swim

### Test Cases Verified:

1. **Swim Interval Pacing Calculator**
   - ✅ Enter CSS pace (e.g., 1:15)
   - ✅ Click "Calculate"
   - ✅ Click "💾 Save to Athlete Profile"
   - ✅ Success message appears
   - ✅ Data saved to profile

2. **CHO Burn (Swim) Calculator**
   - ✅ Enter weight, distance, pace
   - ✅ Click "Calculate"
   - ✅ Click "💾 Save to Athlete Profile"
   - ✅ Success message appears
   - ✅ Data saved to profile

3. **Critical Swim Speed Calculator**
   - ✅ Enter test distances and times
   - ✅ Click "Calculate"
   - ✅ Click "💾 Save to Profile"
   - ✅ Success message appears
   - ✅ Data saved to profile

---

## 🌐 Deployment Info

**Latest Deploy**: https://dc3ebb6b.angela-coach.pages.dev
**Production**: https://angela-coach.pages.dev
**Commit**: d6f8efd

---

## 📋 Testing Checklist

To verify the fix works:

1. **Open calculator page**:
   ```
   https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194&sport=swim
   ```

2. **Test Swim Interval Pacing**:
   - Scroll to "Swim Interval Pacing" calculator
   - Enter CSS pace (e.g., 1:15)
   - Click "Calculate"
   - Verify "💾 Save to Athlete Profile" button appears
   - Click the button
   - Should see: "✅ Saved Swim Interval Pacing to profile!"

3. **Test CHO Burn (Swim)**:
   - Scroll to "CHO Burn - Swim" calculator
   - Enter: Weight=165 lbs, Distance=3000m, Pace=1.5
   - Select Nature: Moderate
   - Click "Calculate"
   - Click "💾 Save to Athlete Profile"
   - Should see: "✅ Saved CHO Burn (Swim) to profile!"

4. **Test Critical Swim Speed**:
   - Scroll to "Critical Swim Speed" calculator
   - Enter: 200m in 2:30, 400m in 5:30
   - Click "Calculate"
   - Click "💾 Save to Profile"
   - Should see: "✅ Saved Critical Swim Speed to profile!"

5. **Verify in Profile**:
   - Open: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194
   - Click "Test History" tab
   - Should see new entries with today's date
   - Click on an entry to see full data

---

## 🔍 Console Verification

Open browser DevTools (F12) and check console logs:

**Expected logs when saving:**
```
💾 Saving Swim Interval Pacing outputs to profile: {...}
✅ Saved swim intervals to test history
✅ Saved to athlete profile successfully
✅ Saved Swim Interval Pacing to profile!
```

**No errors should appear!**

---

## 📝 Summary

- **Problem**: Save functions undefined in global scope
- **Solution**: Moved 3 save functions to global scope
- **Impact**: All swim calculator save buttons now work
- **Status**: ✅ Deployed to production

All calculator save functions are now working correctly! 🎉
