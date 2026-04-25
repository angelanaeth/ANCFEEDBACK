# Athlete Action Buttons & Profile Page - Complete

## ✅ Implementation Status: COMPLETE

### What Was Added

#### 1. **Athlete Header Action Buttons** (Dashboard)
Added 4 action buttons to every athlete dashboard:

**Location:** Top-right of athlete header (below name/email/ID)

**Buttons:**
1. 🔵 **Profile** (Info button) → `/static/athlete-profile?athlete={id}`
2. 🟢 **TSS Planner** (Success button) → Opens TSS Planner modal
3. 🟡 **Wellness** (Warning button) → `/static/wellness?athlete={id}`
4. 🟣 **GPT Brain** (Primary button) → Opens Echodevo GPT (external)

**Layout:**
- Responsive flex layout with gap
- Small button size (btn-sm) for compact design
- Wraps on smaller screens
- Color-coded for quick identification

#### 2. **Athlete Profile Page** (New)
Comprehensive athlete profile management page

**URL:** `/static/athlete-profile?athlete={athlete_id}`

**Features:**
- ✅ Profile header with avatar and quick stats
- ✅ 4 quick stat cards: CTL, Age, FTP, LTHR
- ✅ 5 main sections:
  1. Basic Information
  2. Physical Metrics
  3. Performance Metrics
  4. Training Goals
  5. Additional Notes
- ✅ "Coming Soon" features preview
- ✅ Auto-loads athlete data from dashboard
- ✅ Save/Cancel buttons

---

## 📊 Athlete Dashboard - Action Buttons

### Button Configuration

```html
<div class="d-flex gap-2 justify-content-end flex-wrap">
  <!-- Profile Button (Info) -->
  <a href="/static/athlete-profile?athlete=${athlete.id}" class="btn btn-info btn-sm">
    <i class="fas fa-user-edit me-1"></i>Profile
  </a>
  
  <!-- TSS Planner Button (Success) -->
  <a href="#" onclick="openTSSPlanner('${athlete.id}'); return false;" class="btn btn-success btn-sm">
    <i class="fas fa-calendar-alt me-1"></i>TSS Planner
  </a>
  
  <!-- Wellness Button (Warning) -->
  <a href="/static/wellness?athlete=${athlete.id}" class="btn btn-warning btn-sm">
    <i class="fas fa-heartbeat me-1"></i>Wellness
  </a>
  
  <!-- GPT Brain Button (Primary) -->
  <a href="https://chatgpt.com/g/g-69620c7454588191a659a39ce4b9a7d1-echodevo-trainingpeaks-coach-v5" target="_blank" class="btn btn-primary btn-sm">
    <i class="fas fa-robot me-1"></i>GPT Brain
  </a>
</div>
```

### Button Behavior

| Button | Color | Icon | Action | Opens |
|--------|-------|------|--------|-------|
| **Profile** | Info (Blue) | user-edit | Navigate | Athlete Profile page |
| **TSS Planner** | Success (Green) | calendar-alt | Modal | TSS Planner modal |
| **Wellness** | Warning (Orange) | heartbeat | Navigate | Wellness page |
| **GPT Brain** | Primary (Purple) | robot | New Tab | Echodevo GPT |

---

## 👤 Athlete Profile Page

### URL Structure
```
/static/athlete-profile?athlete={athlete_id}
```

**Example:**
```
/static/athlete-profile?athlete=427194
```

### Page Sections

#### 1. **Profile Header**
- Circular avatar with user icon
- Athlete name (h2)
- Email address
- Sport discipline badge

#### 2. **Quick Stats** (4 Cards)
- **Current CTL** - Latest fitness level
- **Age** - Athlete age
- **FTP** - Functional Threshold Power (watts)
- **LTHR** - Lactate Threshold Heart Rate (bpm)

#### 3. **Basic Information Section**
Form fields:
- Full Name (text)
- Email (email)
- Age (number)
- Gender (select: Male/Female/Other)
- Sport Discipline (select: Triathlon/Running/Cycling/Swimming/Duathlon)

#### 4. **Physical Metrics Section**
Form fields:
- Weight (kg) - decimal allowed
- Height (cm)
- Body Fat % (optional)

#### 5. **Performance Metrics Section**
Form fields:
- **FTP** - Functional Threshold Power (watts)
  - Help text: "20-min test average power × 0.95"
- **LTHR** - Lactate Threshold Heart Rate (bpm)
  - Help text: "20-min test average heart rate"
- **Run Threshold Pace** (min/km)
  - Format: MM:SS (e.g., "4:30")
- **Swim Threshold Pace** (min/100m)
  - Format: MM:SS (e.g., "1:30")

#### 6. **Training Goals Section**
Form fields:
- **Primary Goal** (select):
  - Build Aerobic Base
  - Improve Threshold Power
  - Increase VO2 Max
  - Race Preparation
  - Maintenance
- **Target Race Date** (date picker, optional)
- **Race Type** (text, optional) - e.g., "Ironman 70.3", "Marathon"
- **Weekly Training Hours Available** (number, decimal)

#### 7. **Additional Notes Section**
Text areas:
- **Medical History / Injuries** - Relevant medical info, past injuries, limitations
- **Training Preferences** - Morning/evening, preferred workouts, dislikes
- **Coach Notes** - Internal notes about the athlete

#### 8. **Action Buttons**
- **Save Profile** (Primary, Large) - Saves all form data
- **Cancel** (Secondary, Large) - Returns to dashboard

#### 9. **Coming Soon Features**
Info alert showing future features:
- Training History Charts (visual trends)
- Goal Progress Tracking
- Personal Records (PRs)
- Equipment Tracker (bike/shoe mileage)
- Photo Gallery (race photos)

---

## 🔄 Data Flow

### Profile Page Load
```
User clicks "Profile" button
  ↓
Navigate to /static/athlete-profile?athlete=427194
  ↓
Page extracts athlete_id from URL params
  ↓
Calls POST /api/gpt/fetch with athlete_id
  ↓
Backend returns athlete data + metrics
  ↓
Frontend populates:
  - Profile header (name, email, sport)
  - Quick stats (CTL, age, FTP, LTHR)
  - Form fields (all available data)
  ↓
Page displayed, ready for editing
```

### Save Profile (TODO - Backend)
```
User edits form fields
  ↓
Clicks "Save Profile"
  ↓
JavaScript collects all form data
  ↓
Currently: Shows alert with collected data
  ↓
TODO: POST to /api/athlete/profile
  ↓
Backend saves to database
  ↓
Success message or error handling
```

---

## 🎨 Visual Design

### Color Scheme
- **Profile Button**: Info (Blue) - `#3b82f6`
- **TSS Planner**: Success (Green) - `#10b981`
- **Wellness**: Warning (Orange) - `#f59e0b`
- **GPT Brain**: Primary (Purple) - `#667eea`

### Layout
- Clean, modern design with card-based sections
- Responsive grid (2 columns on desktop, stacked on mobile)
- Professional form styling with help text
- Hover effects on stat cards
- Consistent spacing and shadows

### Typography
- Headings: Section titles with icons
- Labels: Uppercase, small, gray
- Stats: Large, bold, primary color
- Help text: Small, muted gray

---

## 🧪 Testing

### Test Athlete Action Buttons

1. **Open Dashboard:**
   ```
   https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach
   ```

2. **Select Athlete:** Choose "Angela 1A - 427194"

3. **Locate Action Buttons:** Top-right of athlete header

4. **Test Each Button:**

   **Profile Button:**
   - Click → Should navigate to `/static/athlete-profile?athlete=427194`
   - Page should load with athlete data
   - Quick stats should show: CTL ~78, FTP 250, LTHR 165
   - Form should be populated with available data

   **TSS Planner Button:**
   - Click → Should open TSS Planner modal
   - Modal should have athlete context
   - Can plan weekly TSS

   **Wellness Button:**
   - Click → Should navigate to `/static/wellness?athlete=427194`
   - Wellness form should be pre-filled with athlete ID
   - Can log HRV, sleep, subjective metrics

   **GPT Brain Button:**
   - Click → Should open Echodevo GPT in new tab
   - External ChatGPT interface
   - Can analyze athlete with GPT

### Test Profile Page

1. **Direct URL:**
   ```
   https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/athlete-profile?athlete=427194
   ```

2. **Verify Loading:**
   - Should show loading spinner initially
   - Then populate with athlete data
   - No errors in console

3. **Check Data Population:**
   - Name: "Athlete 427194" or actual name
   - Quick stats visible (CTL, Age, FTP, LTHR)
   - Form fields have values from API

4. **Test Form Interaction:**
   - Edit any field
   - Click "Save Profile"
   - Should show alert with collected data
   - (Backend save to be implemented)

5. **Test Cancel:**
   - Click "Cancel" button
   - Should return to `/static/coach`

---

## 📋 Profile Data Structure

### Form Data Collected (saveProfile function)

```javascript
{
  athlete_id: "427194",
  
  // Basic Information
  name: "Angela Naeth",
  email: "angela@example.com",
  age: 35,
  gender: "female",
  sport: "triathlon",
  
  // Physical Metrics
  weight_kg: 62.0,
  height_cm: 168,
  body_fat_percent: 14.5,
  
  // Performance Metrics
  ftp: 250,
  lactate_threshold_hr: 165,
  run_threshold_pace: "4:30",
  swim_threshold_pace: "1:30",
  
  // Training Goals
  primary_goal: "race",
  target_race_date: "2026-06-15",
  race_type: "Ironman 70.3",
  weekly_training_hours: 12.0,
  
  // Additional Notes
  medical_notes: "Previous knee injury...",
  training_preferences: "Prefers morning workouts...",
  coach_notes: "Strong swimmer, working on run endurance..."
}
```

---

## 🔮 Future Enhancements

### Backend Integration (Next Steps)

1. **Create Profile Database Table:**
```sql
CREATE TABLE athlete_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tp_athlete_id TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  weight_kg REAL,
  height_cm INTEGER,
  body_fat_percent REAL,
  ftp INTEGER,
  lactate_threshold_hr INTEGER,
  run_threshold_pace TEXT,
  swim_threshold_pace TEXT,
  primary_goal TEXT,
  target_race_date DATE,
  race_type TEXT,
  weekly_training_hours REAL,
  medical_notes TEXT,
  training_preferences TEXT,
  coach_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

2. **Backend Endpoints:**
```typescript
// GET /api/athlete/:athleteId/profile
// - Fetch full athlete profile
// - Merge with TrainingPeaks data

// POST /api/athlete/:athleteId/profile
// - Save/update athlete profile
// - Return updated profile

// PUT /api/athlete/:athleteId/profile
// - Update specific fields
```

3. **Enhanced Features:**
- Training history charts (performance over time)
- Goal progress tracking with visual indicators
- Personal records (PR) tracking per discipline
- Equipment mileage tracker (bikes, shoes)
- Photo gallery for race achievements
- File attachments (lab test results, etc.)

---

## 📝 Files Changed

### Modified Files
- `public/static/coach.html` - Added 4 action buttons to athlete header

### New Files
- `public/static/athlete-profile.html` - Complete athlete profile page (18KB)

---

## 🎯 Summary

**Status: FULLY OPERATIONAL** ✅

### What Works Now:

1. ✅ **4 Action Buttons on Every Athlete Dashboard:**
   - Profile (Blue) → Athlete profile page
   - TSS Planner (Green) → Opens TSS Planner modal
   - Wellness (Orange) → Wellness tracking page
   - GPT Brain (Purple) → External GPT analysis

2. ✅ **Comprehensive Athlete Profile Page:**
   - Auto-loads athlete data from API
   - 5 form sections for complete athlete info
   - Quick stats display (CTL, Age, FTP, LTHR)
   - Professional, clean design
   - Save/Cancel functionality (save backend pending)
   - "Coming Soon" features preview

3. ✅ **Seamless Navigation:**
   - Dashboard → Profile → Dashboard
   - Dashboard → TSS Planner → Dashboard
   - Dashboard → Wellness → Dashboard
   - Dashboard → GPT Brain (new tab)

### What's Next (Backend Implementation):

- [ ] Create `athlete_profiles` database table
- [ ] Implement `GET /api/athlete/:athleteId/profile` endpoint
- [ ] Implement `POST /api/athlete/:athleteId/profile` endpoint
- [ ] Add training history charts
- [ ] Add goal progress tracking
- [ ] Add personal records (PRs) tracking

---

**Dashboard URL:** https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/coach

**Profile URL Example:** https://3000-i8mf68r87mlc4fo6mi2yb-ad490db5.sandbox.novita.ai/static/athlete-profile?athlete=427194

**Last Updated:** 2026-01-11  
**Version:** v5.5  
**Commit:** 12b6b0d
