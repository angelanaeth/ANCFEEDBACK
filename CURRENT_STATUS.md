# Echodevo Coach - Current Status & Next Steps

**Date:** January 9, 2026  
**Version:** v5.2  
**Build:** Working & Deployed ✅

## ✅ What's Working

### Core Infrastructure
- ✅ Hono backend with Cloudflare Workers
- ✅ Cloudflare D1 database (4 tables)
- ✅ TrainingPeaks OAuth (Coach & Athlete modes)
- ✅ PM2 process management
- ✅ Git repository with 25+ commits

### TrainingPeaks Integration
- ✅ **FIXED: 404 Error** - Now loading 92 athletes successfully
- ✅ Coach OAuth flow
- ✅ Athlete sync from TrainingPeaks API
- ✅ Multi-athlete support (tested with 92 athletes)
- ✅ Proper field mapping (Id, FirstName, LastName, Email)

### API Endpoints
- ✅ `GET /api/coach/athletes` - List all athletes (working, returns 92 athletes)
- ✅ `GET /api/coach/athlete/:id` - Individual athlete details
- ✅ `POST /api/coach/add-sample-athletes` - Add test data
- ⚠️ `POST /api/athlete/:id/wellness` - Database ready, logic not fully integrated
- ⚠️ `POST /api/fueling/calculate` - Database ready, logic not fully integrated
- ⚠️ `GET /api/athlete/:id/analytics` - Database ready, logic not fully integrated

### UI Pages
- ✅ Home page (`/`) - OAuth connection options
- ✅ Coach Dashboard (`/static/coach`) - Multi-athlete overview
- ✅ Wellness Dashboard (`/static/wellness`) - UI complete, data not integrated
- ✅ TSS Planner - Modal interface

### Database Schema
- ✅ `users` table - Athletes and coaches
- ✅ `training_metrics` table - CTL/ATL/TSB data
- ✅ `posted_workouts` table - Workout history
- ✅ `recommendations` table - AI coaching suggestions
- ✅ `wellness_data` table (v0003) - HRV, sleep, subjective wellness
- ✅ `fueling_plans` table (v0003) - Nutrition calculations
- ✅ `performance_snapshots` table (v0003) - Historical analytics

## ⚠️ What's Not Fully Integrated

### 1. Automated Metrics Calculation
**Status:** Database ready, calculation logic not automated

**What's Missing:**
- Automatic CTL/ATL/TSB calculation from workout history
- Daily recalculation job
- StressLogic 5-state classification (Compromised, Overreached, Productive, Recovered, Detraining)

**Current State:**
- Athletes show CTL/ATL/TSB = 0
- Stress_state = "Unknown"
- Metrics must be manually updated via API

**Implementation Needed:**
```typescript
// Fetch workouts from TrainingPeaks
// Calculate CTL using EWMA (tau=42)
// Calculate ATL using EWMA (tau=7)
// Calculate TSB = CTL - ATL
// Classify stress state
// Store in training_metrics table
```

### 2. HRV & Wellness Monitoring
**Status:** UI complete, database ready, data ingestion not automated

**What's Missing:**
- Integration with wearables (Whoop, Oura, Garmin)
- Manual entry form backend integration
- HRV baseline tracking
- Readiness score calculation

**Current State:**
- Wellness page loads but shows no data
- Database table `wellness_data` exists
- API endpoint defined but not tested

**Implementation Needed:**
- Connect wellness form to POST endpoint
- Implement HRV ratio calculation
- Add readiness score logic
- Display historical trends

### 3. Fueling Calculator
**Status:** UI complete, database ready, calculation logic defined

**What's Missing:**
- Integration with athlete profiles (weight, sweat rate)
- Sport-specific recommendations
- Product database

**Current State:**
- Fueling page loads but shows sample data
- Database table `fueling_plans` exists
- Calculation formulas defined but not connected

**Implementation Needed:**
- Connect form inputs to calculation engine
- Store calculated plans in database
- Generate 15-minute fueling schedules
- Add product recommendations

### 4. Performance Analytics
**Status:** UI complete with Chart.js, data queries not implemented

**What's Missing:**
- 90-day CTL/ATL/TSB trend charts
- Training load progression
- Stress state history
- Peak fitness tracking

**Current State:**
- Analytics page shows placeholder charts
- Database queries defined but return empty

**Implementation Needed:**
- Query last 90 days of training_metrics
- Calculate weekly averages
- Generate Chart.js data arrays
- Add statistical summaries

### 5. Workout Posting to TrainingPeaks
**Status:** API endpoint defined, not tested

**What's Missing:**
- Workout template library
- TSS estimation
- Block-based workout generation
- Actual POST to TrainingPeaks API

**Current State:**
- UI shows workout posting form
- Database table `posted_workouts` exists
- TrainingPeaks API credentials configured

**Implementation Needed:**
- Test TrainingPeaks POST endpoint
- Implement workout builder
- Add TSS auto-calculation
- Store posted workouts

### 6. Intervals.icu Integration
**Status:** Not started

**What's Missing:**
- OAuth flow for Intervals.icu
- Data sync from Intervals.icu
- Dual-source data management (TP + Intervals)

**Implementation Needed:**
- Add Intervals.icu OAuth
- Implement data fetching
- Normalize data format
- Merge with TrainingPeaks data

## 🔧 Quick Fixes Needed

### Priority 1: Make Athletes Show Real Data
**Time Estimate:** 2-3 hours

1. Fetch workout history from TrainingPeaks for each athlete
2. Calculate CTL/ATL/TSB for last 90 days
3. Classify stress state
4. Update `training_metrics` table
5. Display on coach dashboard

**Code Location:** `src/index.tsx` - Add to `/api/coach/sync-athletes` endpoint

### Priority 2: Connect Wellness Form
**Time Estimate:** 1 hour

1. Wire up wellness form submit button
2. POST data to `/api/athlete/:id/wellness`
3. Calculate readiness score
4. Display confirmation message

**Code Location:** `public/static/wellness` - Add form handler

### Priority 3: Enable Fueling Calculator
**Time Estimate:** 1-2 hours

1. Wire up fueling form submit button
2. Calculate carbs/fluids/sodium/caffeine
3. Generate 15-minute schedule
4. Display results table

**Code Location:** `public/static/wellness` - Add calculation handler

## 📊 Test Data Status

### Current Test Athletes
- **Source:** TrainingPeaks API
- **Count:** 92 athletes
- **Sample:** Angela 1A, Zaven 1Norigian, Hussein Ahmad, etc.

### Sample Data Added
- 5 local athletes (SAMPLE-001 through SAMPLE-005)
- Coach account configured
- No historical metrics yet

## 🚀 Deployment Status

### Sandbox Environment
- **URL:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
- **Status:** ✅ Running
- **Process Manager:** PM2 (online, PID varies)
- **Database:** Local D1 (angela-db)

### Production Deployment
- **Status:** Not deployed yet
- **Platform:** Cloudflare Pages (ready)
- **Domain:** TBD
- **Database:** Production D1 needs creation

## 📝 Documentation Status

### Complete
- ✅ COACH_DASHBOARD_GUIDE.md
- ✅ COMPLETE_ECHODEVO_INTEGRATION.md
- ✅ WELLNESS_ANALYTICS_GUIDE.md
- ✅ TRAININGPEAKS_FIX.md (just added)
- ✅ QUICK_REFERENCE.md
- ✅ README.md

### Needs Update
- ⚠️ API endpoint documentation (add wellness/fueling/analytics)
- ⚠️ Database schema documentation (add v0003 tables)
- ⚠️ Deployment guide (add production steps)

## 🎯 Immediate Action Items

1. **Test TrainingPeaks Workout Sync** (30 min)
   - Fetch historical workouts
   - Verify data format
   - Test pagination

2. **Implement Automated Metrics** (2-3 hours)
   - Add StressLogic calculation
   - Store in training_metrics
   - Update dashboard display

3. **Wire Wellness Forms** (1 hour)
   - Connect form submit handlers
   - Test data storage
   - Verify readiness calculation

4. **Add Performance Charts** (1-2 hours)
   - Query last 90 days
   - Generate Chart.js datasets
   - Display on wellness page

5. **Test Multi-Athlete Scaling** (30 min)
   - Verify performance with 92 athletes
   - Check for rate limiting
   - Optimize queries if needed

## 💡 Recommendations

### Short Term (This Week)
1. **Get Real Metrics Showing** - Priority #1
2. **Test Wellness Data Entry** - Validate database schema
3. **Connect Fueling Calculator** - Show working calculations
4. **Add Performance Charts** - Make analytics page functional

### Medium Term (Next Week)
1. **Intervals.icu Integration** - Add second data source
2. **Automated Daily Sync** - Background job for metrics
3. **Workout Posting** - Enable coach workflow
4. **Mobile Responsive** - Optimize for phone/tablet

### Long Term (Next Month)
1. **Production Deployment** - Move to Cloudflare Pages
2. **Custom Domain** - Set up echodevo.app or similar
3. **Wearable Integration** - Whoop, Oura, Garmin
4. **Custom ChatGPT** - Deploy Echodevo Coach GPT

## 🔗 Key URLs

- **Coach Dashboard:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/coach
- **Wellness Dashboard:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/static/wellness
- **API Base:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api
- **GitHub:** https://github.com/echodevo/angela-engine (if configured)

---

**Last Updated:** January 9, 2026  
**Next Review:** After implementing Priority 1-3 items  
**Status:** Production-Ready Infrastructure, Needs Feature Completion
