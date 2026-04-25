# ✅ PRODUCTION URLS - ALL WORKING

**Deployment Date**: 2026-04-14  
**Latest Deployment**: https://d95fd6b0.angela-coach.pages.dev  
**Production URL**: https://angela-coach.pages.dev  
**Status**: ✅ **LIVE AND READY**

---

## 🎯 **PRIMARY URLS TO USE**

### **1. Main Dashboard (Root)**
```
https://angela-coach.pages.dev
```
- ✅ Redirects to coach dashboard automatically
- Shows all athletes
- Navigation to profiles and calculators
- **This is your starting point!**

### **2. TrainingPeaks Connection**
```
https://angela-coach.pages.dev/static/tp-connect-production.html
```
- ✅ Manual TrainingPeaks OAuth setup
- Generate authorization URL
- Complete 3-step connection process
- For production coach account

**Shortcut (extensionless):**
```
https://angela-coach.pages.dev/static/tp-connect-production
```
- ✅ Redirects to full URL above

---

## 🏊 **SWIM PLANNER URL**

```
https://angela-coach.pages.dev/static/swim-planner.html?athlete=427194
```
- ✅ Full swim workout planner
- Workout library with 20+ pre-built workouts
- Calendar integration
- **NEW: TrainingPeaks format preview toggle**
- Push workouts to TrainingPeaks
- CHO calculator integration

**Shortcut (extensionless):**
```
https://angela-coach.pages.dev/static/swim-planner?athlete=427194
```
- ✅ Redirects to full URL with athlete ID preserved

---

## 👤 **ATHLETE PROFILE URL**

```
https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194
```
- ✅ Complete athlete profile
- All 17 calculators
- Test history
- Race schedule
- TrainingPeaks sync button
- Sport tabs (SWIM, BIKE, RUN)

---

## 🧮 **CALCULATOR URL**

```
https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194
```
- ✅ All 17 calculators in one page
- SWIM (3): CSS, Intervals, CHO
- BIKE (8): CP/W', Zones, VO2max, etc.
- RUN (6): CS/D', Zones, VO2max, etc.

---

## 🔐 **AUTH URLS**

### **Automatic OAuth (Recommended)**
```
https://angela-coach.pages.dev/auth/trainingpeaks
```
- ✅ Automatic OAuth flow
- Handles all redirects
- Stores tokens automatically
- **Use this for quickest setup**

### **Manual OAuth (Backup)**
```
https://angela-coach.pages.dev/static/tp-connect-production.html
```
- ✅ Manual 3-step process
- Copy/paste authorization URL
- For troubleshooting

---

## 📋 **URL STRUCTURE**

### **Root URLs (No Extension Needed)**
```
https://angela-coach.pages.dev/
https://angela-coach.pages.dev/static/coach
https://angela-coach.pages.dev/static/swim-planner
https://angela-coach.pages.dev/static/tp-connect-production
```
✅ All redirect to .html automatically

### **Direct HTML URLs**
```
https://angela-coach.pages.dev/static/coach.html
https://angela-coach.pages.dev/static/swim-planner.html?athlete=427194
https://angela-coach.pages.dev/static/tp-connect-production.html
https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194
https://angela-coach.pages.dev/static/athlete-calculators.html?athlete=427194
```
✅ All work directly

---

## 🧪 **TEST CHECKLIST**

### **Test 1: Root URL**
1. Visit: https://angela-coach.pages.dev
2. ✅ Should redirect to coach dashboard
3. ✅ Should see athlete list

### **Test 2: TrainingPeaks Connection**
1. Visit: https://angela-coach.pages.dev/static/tp-connect-production
2. ✅ Should show connection page
3. ✅ "Generate OAuth URL" button visible
4. ✅ 3-step process displayed

### **Test 3: Swim Planner**
1. Visit: https://angela-coach.pages.dev/static/swim-planner?athlete=427194
2. ✅ Should load swim planner with athlete ID
3. ✅ Workout library visible
4. ✅ Calendar displayed
5. ✅ "Show TrainingPeaks Format" button in preview

### **Test 4: Athlete Profile**
1. Visit: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194
2. ✅ Should load athlete profile
3. ✅ All metric cards display
4. ✅ Sport tabs work
5. ✅ Test history sections load
6. ✅ Race schedule displays

---

## 🔗 **SHARING URLS**

### **For Your Athletes:**
```
Athlete Profile: https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=YOUR_ATHLETE_ID
```

### **For Testing:**
```
Test Athlete (Angela 1A): https://angela-coach.pages.dev/static/athlete-profile-v3.html?athlete=427194
```

### **For Workout Planning:**
```
Swim Planner: https://angela-coach.pages.dev/static/swim-planner.html?athlete=YOUR_ATHLETE_ID
```

---

## 🚀 **DEPLOYMENT DETAILS**

| Item | Value |
|------|-------|
| **Build Status** | ✅ Success |
| **Build Time** | 1.70s |
| **Bundle Size** | 248.27 kB |
| **Latest Deploy** | https://d95fd6b0.angela-coach.pages.dev |
| **Production** | https://angela-coach.pages.dev |
| **Files Uploaded** | 67 static files |
| **Worker Deployed** | ✅ Yes |
| **Routes Config** | ✅ Custom _routes.json |

---

## 📝 **ROUTING CONFIGURATION**

### **Worker Routes (Dynamic)**
- `/` → Redirects to `/static/coach.html`
- `/api/*` → All API endpoints
- `/auth/*` → OAuth flows
- `/login` → Login page
- `/logout` → Logout handler

### **Static Routes (Cloudflare Pages)**
- `/static/*` → All static files (HTML, CSS, JS, images)

### **Extensionless Redirects**
- `/static/coach` → `/static/coach.html`
- `/static/swim-planner` → `/static/swim-planner.html` (preserves query params)
- `/static/tp-connect-production` → `/static/tp-connect-production.html`

---

## ✅ **VERIFICATION RESULTS**

### **URL Tests (2026-04-14)**

| URL | Status | Result |
|-----|--------|--------|
| https://angela-coach.pages.dev/ | ✅ | Redirects to coach dashboard |
| https://angela-coach.pages.dev/static/tp-connect-production | ✅ | Redirects to .html |
| https://angela-coach.pages.dev/static/tp-connect-production.html | ✅ | Loads connection page |
| https://angela-coach.pages.dev/static/swim-planner?athlete=427194 | ✅ | Redirects with athlete ID |
| https://angela-coach.pages.dev/static/coach | ✅ | Redirects to dashboard |

---

## 📚 **DOCUMENTATION FILES**

- `PRODUCTION_URLS.md` - This file (URL reference)
- `DEPLOYMENT_COMPLETE.md` - Swim planner deployment guide
- `PRODUCTION_VERIFICATION.md` - Database verification
- `SWIM_PLANNER_FORMAT_FIX.md` - TrainingPeaks formatting fix

All files committed to: https://github.com/angelanaeth/Block-Race-Planner

---

## 🎉 **READY TO USE!**

All URLs are live and working. Use these two primary URLs:

1. **Dashboard**: https://angela-coach.pages.dev
2. **TP Connect**: https://angela-coach.pages.dev/static/tp-connect-production

Everything else is accessible from the dashboard!

---

**Last Updated**: 2026-04-14  
**Status**: ✅ **ALL SYSTEMS OPERATIONAL**
