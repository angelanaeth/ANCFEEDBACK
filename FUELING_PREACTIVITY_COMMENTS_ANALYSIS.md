# Fueling Pre-Activity Comments - Complete Analysis & Fix

## 📋 Summary from TrainingPeaks Support

**Official Guidance from TrainingPeaks:**
> "Recommendation would be to use the workouts:plan endpoint separately from the planned workout, and enter the fueling recommendation in the description or pre-activity comments."

**Key Field:** `PreActivityComments` (singular, not plural)
- Source: https://github.com/TrainingPeaks/PartnersAPI/wiki/Workouts-Object
- Available for: **Basic and Premium Athletes**
- Accessible via: **ANY workout endpoint** (GET, POST, PUT, PATCH)
- Field name: `PreActivityComment` (note: singular in documentation)

---

## 🔍 Current Implementation Analysis

### What We're Doing RIGHT NOW ❌

**Location:** `processFuelQueue()` in `/home/user/webapp/src/index.tsx` (lines 8122-8172)

**Current Approach:**
1. ✅ Create consolidated daily "FUELING GUIDANCE" workout (working)
2. ❌ **Update individual workout `Description` field** (WRONG FIELD!)

**Current Code (Lines 8150-8161):**
```typescript
// Use PATCH to /v2/workouts/plan/{id} for FAST partial updates
const updateUrl = `${TP_API_BASE_URL}/v2/workouts/plan/${item.workout_id}`;
const updateResponse = await fetch(updateUrl, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    Description: newDescription  // ❌ WRONG! Updates Description, not PreActivityComment
  })
});
```

**What This Does:**
- Fetches existing workout Description
- Strips out any old fueling guidance
- Prepends new fueling guidance to Description
- **Problem:** Modifies the main workout description (where coach writes instructions)
- **Issue:** Overwrites/modifies coach's workout plan details

---

## ✅ What We SHOULD Be Doing

### Correct Approach: Use `PreActivityComment` Field

**According to TrainingPeaks API:**
- Field name: `PreActivityComment` (from Workouts Object wiki)
- Purpose: Separate field specifically for pre-activity notes
- Location: Shows up in athlete's workout view BEFORE they start
- Coach-only: Can only be entered by coach, athlete can read but not edit

**Correct Implementation:**
```typescript
// Use PATCH to /v2/workouts/plan/{id}
const updateUrl = `${TP_API_BASE_URL}/v2/workouts/plan/${item.workout_id}`;
const updateResponse = await fetch(updateUrl, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    PreActivityComment: `⚡ FUELING GUIDANCE ⚡\nCHO: ${item.fuel_carb}g/hr`  // ✅ CORRECT!
  })
});
```

**Benefits:**
1. ✅ **Doesn't modify workout Description** (preserves coach's workout plan)
2. ✅ **Separate field** specifically designed for pre-activity notes
3. ✅ **Athlete can see it** before workout starts
4. ✅ **Coach-controlled** (athlete can't edit)
5. ✅ **Clean separation** of concerns

---

## 🔧 Required Changes

### Change 1: Update `processFuelQueue()` Function

**File:** `/home/user/webapp/src/index.tsx`
**Lines:** 8122-8172

**Current Logic (REMOVE):**
```typescript
// First, fetch the existing workout to get its current description
const fetchUrl = `${TP_API_BASE_URL}/v2/workouts/plan/${item.workout_id}`;
const fetchResponse = await fetch(fetchUrl, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

let existingDescription = '';
if (fetchResponse.ok) {
  const existingWorkout = await fetchResponse.json();
  existingDescription = existingWorkout.Description || '';
}

// Remove any existing fueling guidance from description
existingDescription = existingDescription.replace(/⚡ FUELING GUIDANCE ⚡[\s\S]*?(?=\n\n|$)/g, '').trim();

// Build new fueling comment block
const fuelingCommentBlock = `⚡ FUELING GUIDANCE ⚡\nCHO: ${item.fuel_carb}g`;

// Prepend fueling guidance to existing description
const newDescription = existingDescription 
  ? `${fuelingCommentBlock}\n\n${existingDescription}`
  : fuelingCommentBlock;
```

**New Logic (REPLACE WITH):**
```typescript
// Build fueling guidance for PreActivityComment field
const fuelingGuidance = `⚡ FUELING GUIDANCE ⚡\nCHO: ${item.fuel_carb}g/hr`;
```

**Old PATCH Request:**
```typescript
body: JSON.stringify({
  Description: newDescription  // ❌ WRONG
})
```

**New PATCH Request:**
```typescript
body: JSON.stringify({
  PreActivityComment: fuelingGuidance  // ✅ CORRECT
})
```

---

## 📊 Comparison: Before vs After

### Before (Current - WRONG)

**What Happens:**
1. Coach creates workout: "3x20min @ FTP\nZone 4 intervals\nCadence 90-95rpm"
2. Angela fueling runs
3. **Workout Description becomes:**
   ```
   ⚡ FUELING GUIDANCE ⚡
   CHO: 85g

   3x20min @ FTP
   Zone 4 intervals
   Cadence 90-95rpm
   ```
4. **Problem:** Original workout instructions are modified/overwritten

### After (Proposed - CORRECT)

**What Happens:**
1. Coach creates workout: "3x20min @ FTP\nZone 4 intervals\nCadence 90-95rpm"
2. Angela fueling runs
3. **Workout Description stays the same:**
   ```
   3x20min @ FTP
   Zone 4 intervals
   Cadence 90-95rpm
   ```
4. **PreActivityComment field gets:**
   ```
   ⚡ FUELING GUIDANCE ⚡
   CHO: 85g/hr
   ```
5. **Result:** Athlete sees BOTH workout instructions AND fueling guidance

---

## 🎯 TrainingPeaks UI - Where It Shows Up

### PreActivityComment Field Location

**In TrainingPeaks Web/Mobile:**
1. Athlete opens planned workout
2. **PreActivityComment** appears in dedicated section
3. Shows BEFORE workout description
4. Clearly labeled as "Pre-Activity Comments" or similar
5. Athlete knows this is coach's pre-workout guidance

**Typical Flow:**
```
┌─────────────────────────────────────┐
│ Workout: Bike - Threshold Intervals│
├─────────────────────────────────────┤
│ Pre-Activity Comments:              │
│ ⚡ FUELING GUIDANCE ⚡               │
│ CHO: 85g/hr                         │
├─────────────────────────────────────┤
│ Description:                        │
│ 3x20min @ FTP                       │
│ Zone 4 intervals                    │
│ Cadence 90-95rpm                    │
└─────────────────────────────────────┘
```

---

## 🚀 Implementation Steps

### Step 1: Update processFuelQueue Function
- Remove Description fetching/modification logic
- Use `PreActivityComment` field directly
- Simplify code (no need to fetch existing workout)

### Step 2: Update Fueling Format
- Current: `CHO: 85g` (per workout)
- New: `CHO: 85g/hr` (per hour rate)
- More useful for athletes during workout

### Step 3: Test with Real Workout
- Create test workout in TrainingPeaks
- Run fueling calculation
- Verify PreActivityComment appears correctly
- Confirm Description is unchanged

### Step 4: Deploy to Production
- Build and deploy to Cloudflare Pages
- Test with real athlete account
- Verify both coach and athlete can see PreActivityComments

---

## 📝 API Field Naming Confusion

**WARNING:** TrainingPeaks API has inconsistent naming!

**In Documentation:**
- Wiki shows: `PreActivityComment` (singular)
- Some examples show: `PreActivityComments` (plural)

**Safe Approach:**
- Try `PreActivityComment` first (matches wiki)
- If that fails, try `PreActivityComments`
- Log both attempts for debugging

**Test Code:**
```typescript
// Try singular first
let payload = { PreActivityComment: fuelingGuidance };
let response = await fetch(updateUrl, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});

// If 400 error, try plural
if (response.status === 400) {
  payload = { PreActivityComments: fuelingGuidance };
  response = await fetch(updateUrl, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}
```

---

## ✅ Confirmation Checklist

Before implementing, confirm:

- [x] **Correct field**: `PreActivityComment` (from TrainingPeaks wiki)
- [x] **Correct endpoint**: `/v2/workouts/plan/{id}` (PATCH)
- [x] **Correct scope**: Coach account with write permissions
- [x] **Correct format**: Simple text string, no HTML
- [x] **No Description modification**: Preserves coach's workout instructions
- [x] **Separate display**: Shows as pre-activity note, not in workout description

---

## 🎯 Expected Outcome

**After Implementation:**

1. **Consolidated Daily Fueling Workout:**
   - Title: "⚡ FUELING GUIDANCE"
   - Description: Summary of all workouts for the day with CHO needs
   - ✅ Already working

2. **Individual Workout PreActivityComments:**
   - Field: `PreActivityComment`
   - Content: "⚡ FUELING GUIDANCE ⚡\nCHO: 85g/hr"
   - Visible to: Athlete (read-only)
   - ✅ NEW - To be implemented

3. **Workout Description:**
   - Field: `Description`
   - Content: Original coach's workout instructions (UNCHANGED)
   - ✅ Preserved, not modified

**Result:** Clean separation of fueling guidance and workout instructions!

---

## 🔗 References

- TrainingPeaks Workouts Object: https://github.com/TrainingPeaks/PartnersAPI/wiki/Workouts-Object
- TrainingPeaks API v2: https://api.trainingpeaks.com/v2/
- Current Implementation: `/home/user/webapp/src/index.tsx` (lines 8122-8172)

---

## 📞 Next Steps

**Ready to implement?**

1. Confirm: Use `PreActivityComment` field (singular)
2. Update: `processFuelQueue()` function
3. Remove: Description fetching/modification logic
4. Test: With real TrainingPeaks workout
5. Deploy: To production

**Let's fix this now! Should I proceed with the implementation?** 🚀
