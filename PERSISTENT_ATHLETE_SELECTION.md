# Persistent Athlete Selection

## Overview
The dashboard now remembers your selected athlete across all tabs and pages. You no longer need to re-select the athlete every time you navigate between different sections.

## How It Works

### 1. Athlete Selection Storage
When you select an athlete from the dropdown in the main dashboard (`/static/coach`):
- The athlete ID is stored in `localStorage.selectedAthleteId`
- This persists across browser tabs and page reloads
- The ID is also included in URL parameters for all navigation links

### 2. Auto-Loading
When you return to the dashboard:
1. **Priority 1**: Checks URL parameter `?athlete=ATHLETE_ID`
2. **Priority 2**: Falls back to `localStorage.selectedAthleteId`
3. **Auto-loads**: If an athlete ID is found, automatically loads their dashboard

### 3. Cross-Page Navigation
All navigation links now preserve the selected athlete:

#### From Dashboard to Other Pages
- **Echodevo Insight**: `/static/echodevo-insight?athlete=ATHLETE_ID`
- **Athlete Profile**: `/static/athlete-profile?athlete=ATHLETE_ID`
- **Wellness**: `/static/wellness?athlete=ATHLETE_ID`
- **TSS Planner**: Modal preserves athlete context

#### Return to Dashboard
All "Back to Dashboard" buttons now include the athlete ID:
- Returns to: `/static/coach?athlete=ATHLETE_ID`
- Dashboard auto-loads the athlete (no need to re-select)

## Updated Pages

### 1. Coach Dashboard (`coach.html`)
**Changes:**
- Stores athlete ID in localStorage on selection
- Checks URL parameter and localStorage on page load
- Auto-loads athlete if found
- Clears localStorage when no athlete selected

**Functions Added:**
- Enhanced `loadFullAthleteDashboard()` to store athlete ID
- Enhanced `loadAthletes()` to auto-load stored athlete
- Enhanced `DOMContentLoaded` to check URL and localStorage

### 2. Athlete Profile (`athlete-profile.html`)
**Changes:**
- "Back to Dashboard" button now includes athlete ID
- Stores athlete ID in localStorage when page loads
- Returns to dashboard with athlete pre-selected

**Functions Added:**
- `returnToDashboard()` - navigates back with athlete ID

### 3. Echodevo Insight (`echodevo-insight.html`)
**Changes:**
- "Back to Dashboard" button now includes athlete ID
- Stores athlete ID in localStorage when page loads
- Returns to dashboard with athlete pre-selected

**Functions Added:**
- `returnToDashboard()` - navigates back with athlete ID

### 4. Wellness (`wellness.html`)
**Changes:**
- "Back to Dashboard" button now includes athlete ID
- Checks URL parameter and localStorage on page load
- Auto-selects athlete in dropdown if found
- Stores athlete ID in localStorage when athlete changes

**Functions Added:**
- `returnToDashboard()` - navigates back with athlete ID
- Enhanced `DOMContentLoaded` to check URL and localStorage
- Enhanced `loadWellnessData()` to store athlete ID

## User Experience

### Before This Update
1. Select athlete → View dashboard
2. Click "Athlete Profile" → View profile
3. Click "Back to Dashboard" → **Have to re-select athlete** ❌
4. Click "Wellness" → **Have to re-select athlete** ❌
5. Repeat for every navigation...

### After This Update
1. Select athlete → View dashboard ✅
2. Click "Athlete Profile" → View profile ✅
3. Click "Back to Dashboard" → **Athlete already loaded!** ✅
4. Click "Wellness" → **Athlete already selected!** ✅
5. Click "Echodevo Insight" → **Athlete already loaded!** ✅
6. Refresh page → **Athlete still selected!** ✅
7. Open new tab → **Athlete still remembered!** ✅

## Technical Implementation

### localStorage API
```javascript
// Store athlete ID
localStorage.setItem('selectedAthleteId', athleteId);

// Retrieve athlete ID
const athleteId = localStorage.getItem('selectedAthleteId');

// Clear athlete ID
localStorage.removeItem('selectedAthleteId');
```

### URL Parameters
```javascript
// Read athlete ID from URL
const urlParams = new URLSearchParams(window.location.search);
const athleteId = urlParams.get('athlete');

// Navigate with athlete ID
window.location.href = `/static/coach?athlete=${athleteId}`;
```

### Return to Dashboard Pattern
```javascript
function returnToDashboard() {
  const athleteId = currentAthleteId || localStorage.getItem('selectedAthleteId');
  if (athleteId) {
    window.location.href = `/static/coach?athlete=${athleteId}`;
  } else {
    window.location.href = '/static/coach';
  }
}
```

## Benefits

1. **Better UX**: No need to constantly re-select athletes
2. **Faster Workflow**: Navigate freely between sections
3. **Persistent State**: Athlete selection survives page reloads
4. **URL Sharing**: Can share direct links with athlete pre-selected
5. **Multi-Tab Support**: Same athlete across multiple browser tabs

## Testing

### Test Scenario 1: Basic Navigation
1. Open `/static/coach`
2. Select athlete "Angela 1A" (ID: 427194)
3. Click "Athlete Profile"
   - ✅ URL should be `/static/athlete-profile?athlete=427194`
4. Click "Back to Dashboard"
   - ✅ Should return to `/static/coach?athlete=427194`
   - ✅ Angela 1A should be pre-selected
   - ✅ Dashboard should auto-load

### Test Scenario 2: Cross-Tab Persistence
1. Open `/static/coach` in Tab 1
2. Select athlete "Angela 1A"
3. Open `/static/coach` in Tab 2
   - ✅ Angela 1A should be pre-selected
   - ✅ Dashboard should auto-load

### Test Scenario 3: Page Refresh
1. Open `/static/coach`
2. Select athlete "Angela 1A"
3. Refresh the page
   - ✅ Angela 1A should be pre-selected
   - ✅ Dashboard should auto-load

### Test Scenario 4: Direct URL Access
1. Navigate directly to `/static/athlete-profile?athlete=427194`
   - ✅ Profile should load for Angela 1A
2. Click "Back to Dashboard"
   - ✅ Should return with athlete pre-selected

## Files Modified

1. `/home/user/webapp/public/static/coach.html`
   - Enhanced athlete selection storage
   - Auto-load from URL/localStorage

2. `/home/user/webapp/public/static/athlete-profile.html`
   - Added returnToDashboard() function
   - Store athlete ID on page load

3. `/home/user/webapp/public/static/echodevo-insight.html`
   - Added returnToDashboard() function
   - Store athlete ID on page load

4. `/home/user/webapp/public/static/wellness.html`
   - Added returnToDashboard() function
   - Auto-select athlete from URL/localStorage
   - Store athlete ID on selection

## Status

✅ **COMPLETE** - All pages now support persistent athlete selection

Last Updated: 2026-01-12
