# 🏊 SWIM TAB REDESIGN - Implementation Status

**Date**: April 13, 2026  
**Status**: 🚧 IN PROGRESS

---

## ✅ COMPLETED

### 1. Database Schema
- ✅ Created `css_test_history` table
- ✅ Created `swim_interval_history` table
- ✅ Created `swim_cho_history` table
- ✅ Applied migration locally

### 2. Backend API Endpoints
- ✅ POST `/api/athlete-profile/:id/test-history` - Add test
- ✅ GET `/api/athlete-profile/:id/test-history/:calculator_type` - Get history
- ✅ PUT `/api/athlete-profile/:id/test-history/:test_id` - Edit test
- ✅ DELETE `/api/athlete-profile/:id/test-history/:test_id` - Delete test

### 3. Calculator Integration
- ✅ Updated `saveSwimCSSToProfile()` to save to test history
- ✅ Modified `renderSwimCS()` to accept test times
- ✅ Updated `calcCSS2()` to pass T200/T400 times
- ✅ Saves full test data (T200, T400, CSS, pace)

### 4. Deployment
- ✅ Built and deployed to Cloudflare Pages
- ✅ Latest: https://bf092f4c.angela-coach.pages.dev

---

## 🚧 IN PROGRESS

### 5. Profile Page UI Redesign
**New SWIM Tab Structure**:

```
1. CSS Metric Card (Current CSS display)
   - Shows most recent CSS value
   - Source & date

2. CSS Test History Table
   - Columns: Date | T200 Time | T400 Time | CSS | Source | Actions
   - Shows ALL CSS tests over time
   - Edit/Delete buttons for each test
   - "Add Manual Test" button

3. Quick CSS Update Form
   - For manual CSS updates
   - Links to Toolkit

4. Swim Interval Pacing History
   - Columns: Date | CSS Input | Zones | Source | Actions
   - Shows all interval pacing calculations

5. CHO Burn (Swim) History
   - Columns: Date | Weight | Intensity | Duration | Carb Burn/hr | Actions
   - Shows all CHO burn tests

6. Current Swim Pace Zones
   - Shows zones based on current CSS

7. Swim Tools
   - Open Toolkit button
   - Open Swim Planner button
```

---

## ⏳ PENDING

### 6. JavaScript Functions Needed
- [ ] `loadCSSTestHistory()` - Fetch and display CSS tests
- [ ] `renderCSSTestHistory(tests)` - Render test table
- [ ] `addManualCSSTest()` - Show form to add manual test
- [ ] `editCSSTest(testId)` - Edit existing test
- [ ] `deleteCSSTest(testId)` - Delete test
- [ ] `loadSwimIntervalHistory()` - Fetch interval history
- [ ] `loadSwimCHOHistory()` - Fetch CHO burn history
- [ ] Update `saveCSS()` to also save to test history
- [ ] Update `loadCSSData()` to load test history

### 7. Swim Planner Integration
- [ ] Ensure CSS from profile syncs to Swim Planner
- [ ] Test data flow between pages

### 8. Testing
- [ ] Test CSS calculator saves to history
- [ ] Test manual CSS update
- [ ] Test edit/delete functionality
- [ ] Test profile → planner sync
- [ ] Verify most recent test = current CSS

---

## 📋 Next Steps

1. **Replace SWIM tab HTML** in athlete-profile-v3.html
2. **Add JavaScript functions** for test history management
3. **Update loadAthleteProfile()** to load test histories
4. **Test end-to-end** workflow
5. **Deploy and verify**

---

## 🎯 Expected User Flow

### Adding a CSS Test (Calculator):
1. User opens Swim Toolkit
2. Enters T200 = 2:30, T400 = 5:15
3. Clicks Calculate
4. Sees CSS = 1:23/100m
5. Clicks "Save to Profile"
6. **SAVES TO**:
   - `css_test_history` table (full test data)
   - `athlete_profiles.swim_pace_per_100m` (current CSS)
7. Returns to profile
8. **SEES**:
   - CSS metric updated to 1:23/100m
   - New entry in CSS Test History table
   - Test shows: 4/13/2026 | 2:30 | 5:15 | 1:23 | Calculator | [Edit] [Delete]

### Manual CSS Update:
1. User clicks "Quick CSS Update"
2. Enters 1:25
3. Clicks "Save CSS"
4. **SAVES TO**:
   - `css_test_history` table (CSS only, no test times)
   - `athlete_profiles.swim_pace_per_100m` (current CSS)
5. **SEES**:
   - CSS metric updated to 1:25/100m
   - New entry in CSS Test History table
   - Entry shows: 4/13/2026 | - | - | 1:25 | Manual | [Edit] [Delete]

### Editing a Test:
1. User clicks "Edit" on a test
2. Modal/form opens with current values
3. User updates T200 from 2:30 to 2:28
4. Clicks "Save"
5. **UPDATES**:
   - Test entry in `css_test_history`
   - If this is the most recent test, updates current CSS
6. **SEES**:
   - Updated values in table
   - CSS metric updated if it was the most recent

### Deleting a Test:
1. User clicks "Delete" on a test
2. Confirmation dialog appears
3. User confirms
4. **DELETES**:
   - Test entry from `css_test_history`
   - If this was the most recent, sets CSS to next most recent test
6. **SEES**:
   - Test removed from table
   - CSS metric updated to next most recent test

---

## 🔄 Data Flow

```
Calculator → Test History API → Database → Profile Page

1. Swimmer Calcuator:
   - Calls saveSwimCSSToProfile(css, dPrime, t200, t400)
   - Posts to /api/athlete-profile/:id/test-history
   - Saves to css_test_history table
   - Updates athlete_profiles.swim_pace_per_100m

2. Profile Page Load:
   - Calls loadAthleteProfile()
   - Gets current CSS from athlete_profiles
   - Calls loadCSSTestHistory()
   - Gets /api/athlete-profile/:id/test-history/css
   - Renders CSS Test History table

3. Swim Planner:
   - Reads CSS from athlete_profiles.swim_pace_per_100m
   - Uses same athlete_id
   - Auto-syncs when CSS updated
```

---

**Current Status**: Backend complete ✅, Frontend UI redesign in progress 🚧

**Next**: Complete profile page JavaScript functions and test end-to-end
