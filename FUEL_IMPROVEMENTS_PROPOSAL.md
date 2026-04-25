# FUEL WORKOUTS - PROPOSED IMPROVEMENTS

## 📋 ISSUE 1: DATE RANGE SELECTION

### Current Behavior
- **"Fuel Next Week"** button always fuels Monday-Sunday of NEXT week
- No flexibility to choose different date ranges
- Hardcoded date calculation

### Proposed Solution: Date Range Dropdown

#### UI Design
**Replace single "Fuel Next Week" button with:**

```
┌─────────────────────────────────────────────┐
│  [Fuel Workouts ▼]  [Generate Fueling]     │
└─────────────────────────────────────────────┘
```

**Dropdown Options:**
1. **Next Week (Mon-Sun)** ← Current default
2. **Rest of This Week** (Today → Sunday)
3. **All Future Planned Workouts** (Today → 90 days ahead)
4. **Custom Date Range** (opens date picker modal)

#### Example UI Code
```html
<div class="d-flex gap-2 align-items-center">
  <select id="fuel-date-range-${athlete.id}" class="form-select form-select-sm" style="width: 200px;">
    <option value="next-week">Next Week (Mon-Sun)</option>
    <option value="rest-of-week">Rest of This Week</option>
    <option value="all-future">All Future Workouts</option>
    <option value="custom">Custom Range...</option>
  </select>
  <button onclick="fuelWorkouts('${athlete.id}')" class="btn btn-danger btn-sm">
    <i class="fas fa-bolt me-1"></i>Generate Fueling
  </button>
</div>
```

#### Backend Changes

**Current API:**
```typescript
POST /api/fuel/next-week
Body: { athlete_id: "427194" }
```

**New API:**
```typescript
POST /api/fuel/generate
Body: { 
  athlete_id: "427194",
  date_range: "next-week" | "rest-of-week" | "all-future" | "custom",
  start_date?: "2026-01-23",  // for custom range
  end_date?: "2026-02-15"      // for custom range
}
```

#### Date Calculation Logic

**1. Next Week (Mon-Sun) - Current Behavior**
```typescript
const today = new Date();
const nextMonday = new Date(today);
nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7);
const nextSunday = new Date(nextMonday);
nextSunday.setDate(nextMonday.getDate() + 6);
```

**2. Rest of This Week (Today → Sunday)**
```typescript
const today = new Date();
const thisSunday = new Date(today);
thisSunday.setDate(today.getDate() + (7 - today.getDay()));
```

**3. All Future Planned Workouts (Today → 90 days)**
```typescript
const today = new Date();
const futureDate = new Date(today);
futureDate.setDate(today.getDate() + 90);
```

**4. Custom Range**
- User provides start_date and end_date
- Validate dates (start < end, max 90 days apart)

---

## 📋 ISSUE 2: ATHLETE PROFILE NOT SAVING/PERSISTING

### Current Problems
1. **Profile saves but doesn't persist after logout**
2. **Fueling may not use latest profile values**
3. **No visible confirmation that profile was saved**

### Root Cause Analysis

#### Database Schema Check
```sql
-- athlete_profiles table structure (from migration 0001)
CREATE TABLE athlete_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  weight_kg REAL,
  height_cm REAL,
  ftp_watts INTEGER,
  cp_watts INTEGER,
  cs_run_seconds INTEGER,
  swim_pace_per_100m INTEGER,
  lactate_threshold_hr INTEGER,
  max_hr INTEGER,
  resting_hr INTEGER,
  vo2_max REAL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Note:** Missing `updated_at` column but code tries to use it!

#### Save Endpoint Status
**Location:** `/api/coach/athlete/:athleteId/profile` (line 1904)

**Current Flow:**
1. ✅ Receives profile data
2. ✅ Validates inputs
3. ✅ Gets user_id from tp_athlete_id
4. ✅ UPSERT into athlete_profiles
5. ✅ Returns updated profile

**Issue:** Database schema might be missing `updated_at` column

#### Fuel Endpoint Profile Usage
**Location:** `/api/fuel/next-week` (line 7626-7632)

**Current Flow:**
```typescript
const athleteResult = await DB.prepare(`
  SELECT ap.weight_kg, ap.cp_watts, ap.cs_run_seconds, ap.swim_pace_per_100m as swim_pace_per_100
  FROM users u
  LEFT JOIN athlete_profiles ap ON u.id = ap.user_id
  WHERE u.tp_athlete_id = ?
`).bind(athlete_id).first();
```

**Uses Profile Data:**
- ✅ weight_kg → For fueling calculations
- ✅ cp_watts → For bike fueling (power-based)
- ✅ cs_run_seconds → For run fueling (pace-based)
- ✅ swim_pace_per_100 → For swim fueling

**If no profile exists:** Creates default values (line 7636-7658)

---

### Solution 1: Fix Database Schema

**Problem:** `updated_at` column might not exist in production database

**Migration Needed:**
```sql
-- Add updated_at column if missing
ALTER TABLE athlete_profiles ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
```

**Update Save Endpoint (line 1942):**
```typescript
// Add timestamp
updates.push('updated_at = ?')
values.push(new Date().toISOString())  // This will FAIL if column doesn't exist!
```

**Action Required:**
1. Check if `updated_at` column exists in production athlete_profiles table
2. If not, run migration to add it
3. Or remove `updated_at` from save logic (simpler)

---

### Solution 2: Add Profile Save Confirmation UI

**Current:** No visual feedback after saving profile

**Proposed:** Add toast notification

```javascript
// After successful profile save
function saveProfile(athleteId) {
  const data = {
    weight_kg: $('#weight_kg').val(),
    cp_watts: $('#cp_watts').val(),
    cs_run_seconds: $('#cs_run_seconds').val(),
    swim_pace_per_100: $('#swim_pace_per_100').val()
  };
  
  axios.post(`/api/coach/athlete/${athleteId}/profile`, data)
    .then(response => {
      // Show success toast
      showToast('success', 'Profile Saved!', 'Athlete profile updated successfully');
      
      // Log for debugging
      console.log('Saved profile:', response.data.profile);
    })
    .catch(error => {
      showToast('error', 'Save Failed', error.response?.data?.error || 'Could not save profile');
    });
}

function showToast(type, title, message) {
  // Bootstrap toast or simple alert
  alert(`${title}: ${message}`);  // Simple version
}
```

---

### Solution 3: Verify Profile is Used in Fueling

**Add Debug Logging:**

```typescript
// In fuel endpoint (after line 7676)
console.log(`👤 Athlete profile: Weight=${athleteProfile.weight_kg}kg, CP=${athleteProfile.cp_watts}W, CS=${athleteProfile.cs_run_seconds}s/mile, Swim=${athleteProfile.swim_pace_per_100}s/100`);

// In calculateFueling function (before returning)
console.log(`🔬 Calculated fueling for ${workout.Title}: CHO=${fuel.carb}g (using weight=${athleteProfile.weight_kg}kg)`);
```

This will confirm profile values are being used.

---

### Solution 4: Profile Persistence Test

**Test Flow:**
1. Save profile with specific values (e.g., Weight=75kg, CP=300W)
2. Refresh page → profile should show saved values
3. Logout and login → profile should STILL show saved values
4. Generate fueling → logs should show it used saved values

**If profile doesn't persist after logout:**
- Issue is likely with database WRITE (save endpoint)
- Check production database for the saved record

**Query to check:**
```sql
-- Check if profile exists
SELECT u.tp_athlete_id, ap.* 
FROM users u 
LEFT JOIN athlete_profiles ap ON u.id = ap.user_id 
WHERE u.tp_athlete_id = '427194';
```

---

## 🎯 RECOMMENDED IMPLEMENTATION PLAN

### Phase 1: Fix Profile Saving (Priority 1)

**Step 1: Check Database Schema**
```sql
-- In Cloudflare D1 console
PRAGMA table_info(athlete_profiles);
```

**Look for:** Does `updated_at` column exist?

**If NO:**
- Remove `updated_at` from save endpoint code
- OR add migration to create column

**Step 2: Add Save Confirmation UI**
- Toast notification on success
- Error message on failure
- Console log saved values

**Step 3: Test Profile Persistence**
- Save profile
- Refresh page (should persist)
- Logout/login (should persist)
- Check database directly

---

### Phase 2: Add Date Range Selection (Priority 2)

**Step 1: Update UI**
- Replace button with dropdown + button
- Add date range options
- Style to match existing buttons

**Step 2: Update API**
- Add `date_range` parameter to fuel endpoint
- Support: next-week, rest-of-week, all-future, custom
- Validate date ranges

**Step 3: Update Date Calculation Logic**
- Add functions for each date range type
- Keep existing "next week" as default
- Add max limit (90 days) for safety

---

## 📝 QUESTIONS FOR CONFIRMATION

### Issue 1: Date Range Selection

**1. Which date ranges do you want?**
- [x] Next Week (Mon-Sun) ← Current
- [ ] Rest of This Week (Today → Sunday)
- [ ] All Future Planned Workouts
- [ ] Custom Date Range (date picker)
- [ ] Other: _______________

**2. UI Preference:**
- Option A: Dropdown + Button (as shown above)
- Option B: Multiple buttons (Next Week | Rest of Week | All Future)
- Option C: Modal with radio buttons

**3. Default Selection:**
- Keep "Next Week" as default?
- Or change to "Rest of This Week"?

---

### Issue 2: Profile Saving

**1. What specific values aren't saving?**
- Weight?
- CP (Bike Power)?
- CS (Run Pace)?
- Swim Pace?
- All of them?

**2. When do you notice the issue?**
- After refreshing the page?
- After logging out and back in?
- When generating fueling?

**3. Test for me:**
- Go to athlete profile
- Save a specific value (e.g., Weight = 75kg)
- Tell me what you entered
- Then check if it's still there after refresh

---

## 🚀 READY TO IMPLEMENT

**Option A: Fix Profile FIRST (30 minutes)**
- Critical for accurate fueling
- Then add date ranges

**Option B: Add Date Ranges FIRST (1 hour)**
- More visible feature
- Profile fix can wait

**Option C: Do BOTH (1.5 hours)**
- Fix profile saving
- Add date range selection
- Full solution

**Which option do you choose?** Tell me and I'll start immediately! 🎯
