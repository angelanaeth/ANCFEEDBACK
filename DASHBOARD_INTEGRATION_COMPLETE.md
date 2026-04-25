# ✅ COMPLETE INTEGRATION: Dashboard → Profile → Calculators

## 🎯 Full System Flow

### System Architecture
```
┌─────────────────────────────────────────────────┐
│      https://angela-coach.pages.dev             │
│              (Coach Dashboard)                   │
│  - Multi-athlete view                           │
│  - Athlete selection                            │
│  - "View Profile" button                        │
│  - "Coach Toolkit" button (NEW: with athlete ID)│
└─────────────┬───────────────────────────────────┘
              │
              ├─► View Profile
              │   /static/athlete-profile-v3.html?athlete={id}
              │   └─► Shows: Swim/Bike/Run zones, races, metrics
              │       └─► "Open Toolkit" buttons per sport
              │           └─► Links to calculators with athlete ID
              │
              └─► Coach Toolkit (Direct)
                  /static/athlete-calculators.html?athlete={id}
                  └─► Auto-fills with athlete profile data
                      └─► Calculate → Save back to profile
                          └─► Updates TrainingPeaks zones
```

---

## ✅ Updated Components

### 1. Coach Dashboard (`coach.html`)
**URL**: https://angela-coach.pages.dev/static/coach.html

**Changes Made**:
- ✅ "Coach Toolkit" button now includes athlete ID: `?athlete=${athlete.id}`
- Athletes displayed with action buttons:
  - "View Profile" → `/static/athlete-profile-v3.html?athlete={id}`
  - "Coach Toolkit" → `/static/athlete-calculators.html?athlete={id}` (NEW)
  - "Race Pacing" → Race calculator
  - "Taper" → Taper calculator

### 2. Athlete Profile (`athlete-profile-v3.html`)
**URL**: `/static/athlete-profile-v3.html?athlete={id}`

**Features**:
- ✅ Displays athlete data (CP, CS, CSS, zones)
- ✅ Shows TrainingPeaks races
- ✅ "Open Toolkit" buttons for Swim/Bike/Run
- ✅ Links include: `?athlete={id}&sport={sport}`
- ✅ "Sync to TrainingPeaks" button for zones

### 3. Coach Toolkit (`athlete-calculators.html`)
**Rebranded**: "Angela Naeth Coaching" → **"EchoDevo Coach Toolkit"**

**Changes Made**:
- ✅ Title: "EchoDevo Calculators"
- ✅ Header: "EchoDevo" logo + "Coach Toolkit" tagline
- ✅ Main title: "EchoDevo Coach Toolkit"
- ✅ Auto-fills from athlete profile when `?athlete={id}` present
- ✅ Blue athlete banner shows name + metrics
- ✅ "Save to Profile" buttons for CP, CS (Run), CSS calculators
- ✅ All fields remain editable

---

## 🔗 Complete User Journey

### Journey 1: From Coach Dashboard
```
1. Coach opens: https://angela-coach.pages.dev
   └─► Redirects to /static/coach.html

2. Coach sees list of athletes
   └─► Clicks athlete card or "View Profile" button
       └─► Opens: /static/athlete-profile-v3.html?athlete=2

3. In Athlete Profile:
   └─► Views athlete zones, races, metrics
       └─► Clicks "Open Toolkit (Bike)" button
           └─► Opens: /static/athlete-calculators.html?athlete=2&sport=bike

4. In Coach Toolkit:
   └─► Sees blue banner: "🏃 Athlete: Angela 1A  🚴 CP: 265W"
       └─► Calculator inputs auto-filled with profile data
           └─► Calculates new values
               └─► Clicks "💾 Save to Athlete Profile"
                   └─► Green toast: "✅ Saved to Angela 1A's profile"
                       └─► Returns to profile to see updated values
```

### Journey 2: Direct Toolkit Access
```
1. Coach opens: https://angela-coach.pages.dev
   └─► Redirects to /static/coach.html

2. Coach sees athlete card
   └─► Clicks "Coach Toolkit" button
       └─► Opens: /static/athlete-calculators.html?athlete=2

3. Toolkit opens with athlete context
   └─► Blue banner shows athlete name + metrics
       └─► All calculators auto-filled
           └─► Calculate → Save to profile
```

---

## 📊 Data Flow

```
┌──────────────────────┐
│  Coach Dashboard     │ (Select Athlete)
└──────────┬───────────┘
           │
           ├─► 🔵 Route A: View Profile First
           │   │
           │   ├─► Athlete Profile
           │   │   └─► Display zones, races, metrics
           │   │       └─► Click "Open Toolkit (Sport)"
           │   │
           │   └─► Coach Toolkit
           │       └─► Auto-fill from profile
           │           └─► Calculate
           │               └─► Save back to profile
           │
           └─► 🔵 Route B: Direct to Toolkit
               │
               └─► Coach Toolkit
                   └─► Auto-fill from profile
                       └─► Calculate
                           └─► Save back to profile

┌──────────────────────┐
│  Athlete Profile     │ (Master Data Source)
│  - Bike CP, W', FTP  │
│  - Run CS, D'        │
│  - Swim CSS, D'      │
│  - TrainingPeaks     │
└──────────┬───────────┘
           │
           ├─► Read: Auto-fill calculators
           ├─► Write: Save calculated results
           └─► Sync: Push zones to TrainingPeaks
```

---

## 🧪 Testing Instructions

### Test 1: Dashboard → Profile → Toolkit Flow
```bash
1. Open: https://angela-coach.pages.dev
2. ✅ Verify: Redirects to /static/coach.html
3. Click any athlete card or "View Profile"
4. ✅ Verify: Opens athlete-profile-v3.html?athlete={id}
5. Click "Open Toolkit (Bike)" button
6. ✅ Verify: Opens athlete-calculators.html?athlete={id}&sport=bike
7. ✅ Verify: Page title is "EchoDevo Calculators"
8. ✅ Verify: Header shows "EchoDevo" + "Coach Toolkit"
9. ✅ Verify: Blue athlete banner appears
10. ✅ Verify: Calculator inputs auto-filled
```

### Test 2: Dashboard → Direct Toolkit Flow
```bash
1. Open: https://angela-coach.pages.dev
2. Click "Coach Toolkit" button on athlete card
3. ✅ Verify: Opens athlete-calculators.html?athlete={id}
4. ✅ Verify: Athlete banner shows correct name
5. ✅ Verify: Inputs auto-filled
```

### Test 3: Save to Profile
```bash
1. In Coach Toolkit with athlete ID
2. Go to "Critical Power" calculator
3. Enter values and click "Calculate"
4. Click "💾 Save to Athlete Profile"
5. ✅ Verify: Green toast appears
6. ✅ Verify: Message says "Saved to [athlete name]'s profile"
7. Return to athlete profile
8. ✅ Verify: Updated CP value displayed
```

---

## 🚀 URLs

### Production (Cloudflare Pages)
- **Base**: https://angela-coach.pages.dev
- **Coach Dashboard**: https://angela-coach.pages.dev/static/coach.html
- **Athlete Profile**: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete={id}
- **Coach Toolkit**: https://angela-coach.pages.dev/static/athlete-calculators.html?athlete={id}

### Development (Sandbox)
- **Base**: https://3000-i8mf68r87mlc4fo6mi2yb-82b888ba.sandbox.novita.ai
- **Coach Dashboard**: /static/coach.html
- **Athlete Profile**: /static/athlete-profile-v3.html?athlete=2
- **Coach Toolkit**: /static/athlete-calculators.html?athlete=2

---

## 📝 Changes Summary

### Files Modified:
1. ✅ `public/static/coach.html`
   - Updated "Coach Toolkit" link to include `?athlete=${athlete.id}`

2. ✅ `public/static/athlete-calculators.html`
   - Changed title: "Angela Naeth Coaching" → "EchoDevo"
   - Changed header tagline: "Training Calculators" → "Coach Toolkit"
   - Changed main title: "Angela Naeth Coaching Training Calculators" → "EchoDevo Coach Toolkit"
   - Added athlete profile auto-fill integration
   - Added "Save to Profile" buttons

3. ✅ `public/static/athlete-profile-v3.html`
   - Already has "Open Toolkit" buttons with athlete ID

---

## 🎨 Branding Complete

| Element | Old | New |
|---------|-----|-----|
| Page Title | Angela Naeth Coaching Calculators | **EchoDevo Calculators** |
| Header | Angela Naeth Coaching | **EchoDevo** |
| Tagline | Training Calculators | **Coach Toolkit** |
| Main Title | Angela Naeth Coaching Training Calculators | **EchoDevo Coach Toolkit** |
| Dashboard Button | Coach Toolkit (no athlete ID) | **Coach Toolkit** (with athlete ID) |

---

## ✅ Status Checklist

- ✅ Dashboard lists athletes
- ✅ "View Profile" button works
- ✅ "Coach Toolkit" button includes athlete ID
- ✅ Profile displays athlete data
- ✅ Profile "Open Toolkit" buttons work
- ✅ Toolkit page rebranded to "EchoDevo"
- ✅ Toolkit auto-fills from profile
- ✅ Toolkit displays athlete banner
- ✅ Save to Profile buttons work
- ✅ TrainingPeaks integration active
- ✅ Git commits complete
- ✅ Build successful
- ✅ Service running

---

## 🎉 Integration Complete!

**The complete system now works from dashboard → profile → calculators with full data flow!**

1. ✅ Coach views athletes on dashboard
2. ✅ Can go directly to toolkit OR view profile first
3. ✅ Toolkit auto-fills with athlete data
4. ✅ Calculators can save results back to profile
5. ✅ TrainingPeaks integration syncs zones
6. ✅ All branding updated to "EchoDevo Coach Toolkit"

**Production URL**: https://angela-coach.pages.dev

---

*Last Updated: 2026-04-12*
*Commit Hash: 97549ca*
