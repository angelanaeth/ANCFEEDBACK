# 🔄 TrainingPeaks Sync - What's ACTUALLY Working

**Date**: 2026-04-13  
**Status**: Clarification Document  

---

## ✅ WHAT'S ALREADY SYNCING FROM TRAININGPEAKS

### 1. **Coach Dashboard** (`/static/coach.html`)

**Endpoint**: `GET /api/coach/athlete/:athleteId`  
**TrainingPeaks API Called**: `GET /v1/athlete/{athleteId}` and `/v2/coach/athletes/{athleteId}`

**Data Syncing Correctly** ✅:
- Athlete Name
- Athlete Email
- Athlete ID
- **FTP** (Functional Threshold Power) - displayed in dashboard
- **LTHR** (Lactate Threshold Heart Rate) - displayed in dashboard
- **Weight** - displayed in dashboard
- Gender
- Recent workouts (90 days)
- Training metrics history
- Wellness data (HRV, sleep, resting HR)
- CTL/ATL/TSB (fitness/fatigue/form)

**How It Works**:
```javascript
// Coach clicks on athlete in dashboard
openAthleteDetail(athleteId) → 
  axios.get('/api/coach/athlete/${athleteId}') →
    fetch TP API '/v1/athlete/${athleteId}' →
      Returns athlete.ftp, athlete.lactate_threshold_heart_rate, etc.
        → Displays in modal
```

✅ **This is working perfectly!**

---

### 2. **Metrics Endpoint** (Backend Available)

**Endpoint**: `GET /api/trainingpeaks/metrics/:athleteId`  
**TrainingPeaks API Called**: `GET /v1/athlete/{athleteId}/settings`

**Data Available** ✅:
```javascript
{
  cp: data.FunctionalThresholdPower || data.CriticalPower,  // Bike CP/FTP
  cs: data.ThresholdPace,                                     // Run threshold pace
  css: null                                                   // Swim (TP doesn't have)
}
```

**Status**: ❌ **Endpoint exists but NOT CALLED by athlete profile page**

---

### 3. **Race Data** (Backend Available)

**Endpoint**: `GET /api/trainingpeaks/races/:athleteId`  
**TrainingPeaks API Called**: `GET /v1/athlete/{athleteId}/events`

**Data Available** ✅:
- Race dates
- Race names
- Race types
- Race locations

**Status**: ❌ **Endpoint exists but NOT DISPLAYED in athlete profile page**

---

## ❌ WHAT'S **NOT** SYNCING TO ATHLETE PROFILE

### Problem: Athlete Profile Page is Isolated

**Current Flow**:
```
Coach Dashboard (coach.html)
  ├─ ✅ Fetches athlete data from TP
  ├─ ✅ Shows FTP, LTHR, weight
  └─ ✅ Displays training metrics

Athlete Profile Page (athlete-profile-v3.html)
  ├─ ❌ Does NOT fetch from TP
  ├─ ❌ Only shows data from OUR database (athlete_profiles table)
  └─ ❌ Relies 100% on manual calculator entry
```

**The Disconnect**:
1. Coach dashboard shows TP data ✅
2. Athlete profile does NOT import TP data ❌
3. Athletes must enter data via our calculators ❌
4. No auto-sync between TP → our database ❌

---

## 🔴 THE ACTUAL GAP

### What We Need to Fix:

**Problem**: The athlete profile page (`athlete-profile-v3.html`) loads ONLY from our `athlete_profiles` database table. It never calls the TrainingPeaks APIs.

**Current Profile Loading**:
```javascript
// athlete-profile-v3.html line ~1299
async function loadAthleteProfile() {
  // Gets data from OUR database only
  const response = await axios.get(`/api/athlete-profile/${athleteId}`);
  currentAthlete = response.data;
  
  // This data comes from athlete_profiles table
  // NOT from TrainingPeaks!
}
```

**What's Missing**:
```javascript
// We need to ADD this:
async function syncFromTrainingPeaks() {
  // 1. Call our TP metrics endpoint
  const metrics = await axios.get(`/api/trainingpeaks/metrics/${athleteId}`);
  
  // 2. Update our database with TP data
  await axios.patch(`/api/athlete-profile/${athleteId}`, {
    bike_cp: metrics.data.cp,          // From TP
    bike_ftp: metrics.data.cp,         // From TP
    run_cs_seconds: metrics.data.cs,   // From TP
    // ... etc
  });
  
  // 3. Reload profile
  await loadAthleteProfile();
}
```

---

## 📊 SUMMARY: What Works vs What Doesn't

| Feature | Coach Dashboard | Athlete Profile | Status |
|---------|----------------|-----------------|--------|
| **View TP Athletes** | ✅ Working | N/A | ✅ |
| **View FTP from TP** | ✅ Working | ❌ Not synced | 🟡 |
| **View LTHR from TP** | ✅ Working | ❌ Not synced | 🟡 |
| **View Weight from TP** | ✅ Working | ❌ Not synced | 🟡 |
| **View Training Metrics** | ✅ Working | ❌ Not synced | 🟡 |
| **View Races from TP** | ❌ Fetched but not shown | ❌ Not shown | 🔴 |
| **Import CP/FTP to Profile** | N/A | ❌ Missing | 🔴 |
| **Import CS to Profile** | N/A | ❌ Missing | 🔴 |
| **Auto-sync on load** | N/A | ❌ Missing | 🔴 |
| **Manual "Sync" button** | N/A | ❌ Missing | 🔴 |

---

## 🎯 WHAT YOU ASKED: "What are we wanting to sync?"

**Answer**: We want to sync TrainingPeaks metrics **TO** the athlete profile page.

**Specifically**:

### From TrainingPeaks → Our Athlete Profile:

1. **Bike Metrics**:
   - `FunctionalThresholdPower` → `bike_cp` and `bike_ftp`
   - `CriticalPower` → `bike_cp`
   - Mark as source: "TrainingPeaks"

2. **Run Metrics**:
   - `ThresholdPace` → `run_cs_seconds`
   - Convert to seconds per mile
   - Mark as source: "TrainingPeaks"

3. **Athlete Data**:
   - `Weight` → `weight_kg`
   - `LactateThresholdHeartRate` → `lactate_threshold_hr`
   - `MaxHeartRate` → `max_hr`

4. **Race Goals** (future):
   - Upcoming races → display in profile
   - Target race selection
   - Goal times

---

## 💡 WHY THIS MATTERS

### Current User Experience (Frustrating):

1. Coach logs into TrainingPeaks ✅
2. Coach logs into our system ✅
3. Coach sees athlete FTP in **our** dashboard (from TP) ✅
4. Coach opens athlete profile page ❌
5. Profile shows "FTP: ---" ❌
6. Coach must **manually calculate** FTP in our calculator ❌
7. Coach enters same FTP that's **already** in TrainingPeaks ❌
8. Data now exists in **both** places ❌

### Ideal User Experience (Simple):

1. Coach logs into TrainingPeaks ✅
2. Coach logs into our system ✅
3. Coach opens athlete profile page ✅
4. Click "Sync from TrainingPeaks" button ✅
5. FTP, CP, LTHR auto-populate from TP ✅
6. Coach can now use advanced calculators ✅
7. No duplicate data entry ✅

---

## 🚀 SOLUTION

### Option 1: Add "Sync from TrainingPeaks" Button (Recommended)

**Add to athlete profile page**:
```html
<!-- In athlete-profile-v3.html -->
<button onclick="syncFromTrainingPeaks()" class="btn btn-primary">
  🔄 Sync from TrainingPeaks
</button>
<small>Last synced: <span id="last-sync">Never</span></small>
```

```javascript
async function syncFromTrainingPeaks() {
  try {
    // 1. Fetch metrics from TP
    const metrics = await axios.get(`/api/trainingpeaks/metrics/${athleteId}`);
    
    // 2. Update profile with TP data
    await axios.patch(`/api/athlete-profile/${athleteId}`, {
      bike_cp: metrics.data.cp,
      bike_ftp: metrics.data.cp,
      bike_cp_source: 'TrainingPeaks',
      bike_cp_updated: new Date().toISOString(),
      run_cs_seconds: metrics.data.cs,
      run_cs_source: 'TrainingPeaks',
      run_cs_updated: new Date().toISOString()
    });
    
    // 3. Reload profile
    await loadAthleteProfile();
    alert('✅ Synced from TrainingPeaks!');
    
    // 4. Update last sync time
    document.getElementById('last-sync').textContent = new Date().toLocaleString();
  } catch (error) {
    alert('❌ Sync failed');
  }
}
```

**Estimate**: 2-3 hours to implement

---

### Option 2: Auto-Sync on Page Load (Alternative)

Auto-fetch TP metrics whenever profile loads:
```javascript
async function loadAthleteProfile() {
  // Load from our DB
  const profile = await axios.get(`/api/athlete-profile/${athleteId}`);
  
  // Also fetch from TP in background
  const tpMetrics = await axios.get(`/api/trainingpeaks/metrics/${athleteId}`);
  
  // Merge TP data if available
  if (tpMetrics.data.cp && !profile.data.bike_cp) {
    profile.data.bike_cp = tpMetrics.data.cp;
    profile.data.bike_cp_source = 'TrainingPeaks (auto-synced)';
  }
  
  // Continue with profile display
  currentAthlete = profile.data;
  updateMetricCards();
}
```

**Pros**: Seamless, no extra button  
**Cons**: Slower page load, extra API calls

---

## ✅ CONCLUSION

**You asked**: "I have TP syncing to the dashboard and profile?"

**Answer**: 
- ✅ **Dashboard**: YES, syncing perfectly
- ❌ **Profile**: NO, not syncing (but could be with 2-3 hours work)

**The backend endpoints exist**, we just need to **wire them up** to the athlete profile page.

---

## 🎯 RECOMMENDATION

**Add a "Sync from TrainingPeaks" button** to the athlete profile page that:
1. Fetches FTP/CP/LTHR from TrainingPeaks
2. Updates the athlete_profiles database
3. Refreshes the metric cards
4. Shows "Last synced" timestamp

**Why**: This gives coaches control over when to sync, prevents automatic overwrites of calculator data, and provides transparency.

**Time**: 2-3 hours to implement and test

**Want me to add this now?** 🚀
