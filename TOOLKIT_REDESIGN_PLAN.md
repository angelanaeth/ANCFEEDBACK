# 🎨 TOOLKIT REDESIGN PLAN - March 29, 2026

## ✅ COMPLETED: STEP 1

**Removed Toolkit Access Restriction**
- ✅ Deleted lines 2254-2257 that blocked dashboard access
- ✅ Users can now open toolkit from:
  - Dashboard (athlete list)
  - Profile page
- ✅ Deployed: https://80756f24.angela-coach.pages.dev

---

## 🚧 IN PROGRESS: STEPS 2 & 3

### **STEP 2: Redesign ALL Toolkit Calculators**

**Goal:** Match the beautiful flat design from athlete-profile-v3.html

**Current State:**
- athlete-calculators.html has outdated Bootstrap styling
- Inconsistent with profile page aesthetics
- Tabs use old nav-tabs style

**Target Design (from athlete-profile-v3.html):**

```css
/* Key Design Elements */
--primary: #2563eb;
--text-primary: #1f2937;
--text-secondary: #6b7280;
--border: #e5e7eb;
--bg-gray: #f9fafb;
--bg-white: #ffffff;

/* Flat metric cards */
.flat-metric-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px 20px;
}

/* Clean data tables */
.data-table-container {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 20px;
}

/* Sport-colored tabs */
.tab[data-sport="swim"].active {
  border-bottom-color: #06b6d4; /* Cyan */
}
.tab[data-sport="bike"].active {
  border-bottom-color: #f59e0b; /* Orange */
}
.tab[data-sport="run"].active {
  border-bottom-color: #ef4444; /* Red */
}
```

**Calculators to Redesign:**

1. **Swim Calculators:**
   - CSS Calculator
   - Swim Pace Zones
   - Swim Intervals

2. **Bike Calculators:**
   - CP/FTP Calculator
   - Power Zones
   - Power Intervals
   - VO2 Bike Calculator (title/header only)

3. **Run Calculators:**
   - CS/Threshold Calculator
   - Pace Zones
   - Pace Intervals
   - VO2 Run Calculator (title/header + functionality fix)

---

### **STEP 3: Fix VO2 Run Calculator Functionality**

**Current Status:**
- ✅ Button ID fixed: `prescribe-btn-run` (unique from bike)
- ✅ Event listener properly attached
- ✅ Save function exists: `saveVO2Run()`
- ✅ Prescription object created with workout_1 and workout_2
- ✅ Save button shows after calculation

**Code Analysis:**
```javascript
// Line 4259: Event listener attached
document.getElementById('prescribe-btn-run').addEventListener('click', function() {
  // ... calculation logic
  
  // Line 4288: Prescription object created
  currentVO2RunPrescription = {
    cs_pace_per_mile: csPace,
    vvo2_pace_per_mile: vvo2Pace,
    d_prime: dp,
    durability: durability,
    burn_rate: data.burnRate,
    time_to_exhaustion: data.timeToEx,
    max_rep_duration: data.maxRepDur,
    gap_ms: data.gapMs,
    profile_type: data.profileType,
    profile_label: data.profileLabel,
    d_prime_label: data.dpLabel,
    workout_1: { ... },
    workout_2: { ... }
  };
  
  // Line 4321: Save button shown
  document.getElementById('save-vo2-run-btn').style.display = 'block';
  
  // Line 4323: Results rendered
  renderResults(data);
});

// Line 2995: Save function
async function saveVO2Run() {
  if (!athleteId) {
    alert('No athlete ID provided. Cannot save.');
    return;
  }
  
  if (!currentVO2RunPrescription) {
    alert('Please calculate VO2 Run prescription first');
    return;
  }
  
  try {
    await axios.put(`/api/athlete-profile/${athleteId}`, {
      vo2_run_prescription: JSON.stringify(currentVO2RunPrescription),
      vo2_run_source: 'toolkit',
      vo2_run_updated_at: new Date().toISOString()
    });
    showSuccess('vo2-run-success');
  } catch (error) {
    alert('Error saving: ' + (error.response?.data?.error || error.message));
  }
}
```

**The calculator appears to be correctly implemented!**

**To Test:**
1. Open toolkit: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194
2. Go to VO2 Run Calculator tab
3. Enter CS pace (e.g., 7:30)
4. Enter vVO2max pace (e.g., 6:45)
5. Enter D' (e.g., 400 yards)
6. Click "Prescribe" → should show results
7. Click "Save to Athlete Profile" → should save to database

If it's not working, the issue might be:
- JavaScript error preventing calculation
- renderResults function not defined for run
- Results div not visible

---

## 📋 REDESIGN IMPLEMENTATION PLAN

### **Phase 1: Extract & Apply Profile CSS**

1. Copy CSS variables from athlete-profile-v3.html
2. Copy component styles:
   - `.flat-metric-card`
   - `.data-table-container`
   - `.tab` styles with sport colors
   - `.btn` styles
   - Form input styles

### **Phase 2: Update HTML Structure**

**For each calculator tab:**

**Before (old Bootstrap):**
```html
<div class="card">
  <div class="card-header">
    <h5>Critical Power Calculator</h5>
  </div>
  <div class="card-body">
    <div class="form-group">
      <label>CP (watts)</label>
      <input class="form-control" type="number">
    </div>
  </div>
</div>
```

**After (new flat design):**
```html
<div class="flat-metric-card">
  <div class="metric-label">Critical Power (CP)</div>
  <div class="metric-value" id="cpValue">---</div>
  <div class="metric-source">Not calculated</div>
</div>

<div class="data-table-container">
  <div class="data-table-header">
    <h3>Calculate CP</h3>
    <p>Enter your power values</p>
  </div>
  <div style="padding: 16px;">
    <div class="form-group">
      <label class="form-label">CP (watts)</label>
      <input type="number" class="form-control" placeholder="e.g., 250">
    </div>
  </div>
</div>
```

### **Phase 3: Update VO2 Calculator Headers**

**VO2 Bike & Run tabs need consistent styling:**

```html
<!-- Current header -->
<div class="tab-header">
  <h2>VO2 Max Interval Calculator (Bike)</h2>
</div>

<!-- New header (match profile) -->
<div class="data-table-header">
  <h3><i class="fas fa-heartbeat me-2"></i>VO2 Max Interval Calculator (Bike)</h3>
  <p>Calculate VO2max intervals based on CP and W'</p>
</div>
```

---

## 🎯 USER REQUIREMENTS CHECK

- [x] Remove toolkit access restriction → **COMPLETE**
- [ ] Redesign all calculators to match profile → **IN PROGRESS**
- [ ] Update VO2 Bike/Run titles → **PENDING**
- [ ] Verify VO2 Run calculator works → **TESTING NEEDED**

---

## 📦 FILES TO MODIFY

**Primary File:**
- `public/static/athlete-calculators.html` (~4345 lines)

**Sections:**
- Lines 1-200: CSS styles
- Lines 200-2250: HTML structure (tabs, calculators)
- Lines 2250-4345: JavaScript functions

**Complexity:**
- Large file, requires careful editing
- Multiple calculator sections
- Must preserve all JavaScript functionality
- Only update CSS and HTML structure

---

## ⚠️ RISKS & CONSIDERATIONS

1. **Breaking JavaScript:** Be careful not to change IDs/classes used by JS
2. **Large file size:** 4345 lines, easy to make mistakes
3. **Testing required:** Each calculator must be tested after redesign
4. **VO2 calculators:** Keep layout, only update header styling

---

## 🚀 RECOMMENDED APPROACH

Given the scope, I recommend:

**Option A: Full Redesign (Time: ~2 hours)**
- Completely rewrite athlete-calculators.html
- Apply all profile CSS
- Test every calculator
- Ensure VO2 Run works

**Option B: Incremental Updates (Time: ~30 min)**
- Apply CSS variables only
- Update tab styling
- Update VO2 headers
- Test VO2 Run functionality
- Keep existing HTML structure mostly intact

**Option C: Priority Fix (Time: ~10 min)**
- Just fix VO2 Run if broken
- Update VO2 titles to match
- Skip full redesign

---

## 💡 RECOMMENDATION

I suggest **Option B (Incremental)** because:
1. Lower risk of breaking JavaScript
2. Gets you 80% of the visual improvement
3. Focuses on VO2 calculators (your priority)
4. Can do full redesign later if needed

**Would you like me to proceed with Option B?**
