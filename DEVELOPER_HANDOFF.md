# 🚀 Angela Coach - Developer Handoff

**Date**: 2026-02-05  
**Project**: Angela Naeth Coaching Platform  
**Tech Stack**: TypeScript, Hono, Cloudflare Pages/Workers  

---

## 📦 Project Access

### GitHub Repository
```
https://github.com/angelanaeth/angela-coach
```

**To get access**:
1. Send your GitHub username to Angela
2. She'll add you as a collaborator
3. Accept the invitation email
4. Clone the repo:
   ```bash
   git clone https://github.com/angelanaeth/angela-coach.git
   cd angela-coach
   ```

### Project Backup (Alternative)
If you need the files immediately:
```
https://www.genspark.ai/api/files/s/tZX6qalx
```
Download this tar.gz file (67 MB) and extract:
```bash
tar -xzf angela-coach-for-developer-2026-02-05.tar.gz
cd webapp
```

---

## 🏗️ Project Structure

```
angela-coach/
├── src/
│   └── index.tsx              # Main Hono app (8600+ lines)
├── public/
│   └── static/
│       ├── coach.html         # Coach dashboard
│       ├── athlete-profile.html
│       ├── tp-connect-production.html  # TP OAuth flow
│       ├── app.js             # Frontend JavaScript
│       └── styles.css         # Custom styles
├── migrations/                # D1 database migrations
│   ├── 0001_complete_schema.sql
│   ├── 0007_add_tp_queue_tracking_columns.sql
│   └── 0008_fix_users_nullable_tokens.sql
├── wrangler.jsonc            # Cloudflare configuration
├── package.json              # Dependencies & scripts
├── ecosystem.config.cjs      # PM2 config (sandbox only)
├── vite.config.ts            # Vite build config
├── .gitignore
└── README.md

Documentation Files (created today):
├── FUEL_IMPROVEMENTS_PROPOSAL.md
├── FUEL_DATE_RANGE_COMPLETE.md
├── FUEL_FIX_CRITICAL.md
├── TP_OAUTH_FIX.md
├── TAPER_LOGIC_ANALYSIS.md
└── angela_brain.txt          # Angela's coaching knowledge base
```

---

## 🔧 Setup Instructions

### 1. Prerequisites
```bash
node -v    # Requires Node.js 18+
npm -v     # Requires npm 8+
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Local Development)

Create `.dev.vars` file:
```env
# TrainingPeaks OAuth
TP_CLIENT_ID=qt2systems
TP_CLIENT_SECRET=your_secret_here
TP_AUTH_URL=https://oauth.trainingpeaks.com
TP_TOKEN_URL=https://oauth.trainingpeaks.com/oauth/token
TP_API_BASE_URL=https://api.trainingpeaks.com
TP_REDIRECT_URI_COACH=https://angela-coach.pages.dev/handle_trainingpeaks_authorization
TP_REDIRECT_URI_ATHLETE=https://angela-coach.pages.dev/handle_trainingpeaks_authorization
```

**Important**: Ask Angela for `TP_CLIENT_SECRET` - it's stored in Cloudflare secrets.

### 4. Local Development

**Option A: Sandbox/Testing** (uses PM2):
```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 logs --nostream
```

**Option B: Vite Dev Server** (for frontend only):
```bash
npm run dev
```

**Option C: Wrangler Pages Dev** (full Cloudflare environment):
```bash
npm run dev:sandbox
```

### 5. Database Setup (D1 Local)

```bash
# Apply migrations to local D1 database
npm run db:migrate:local

# Seed with test data (optional)
npm run db:seed

# Reset database (danger!)
npm run db:reset
```

---

## 🚀 Deployment

### Production Deployment to Cloudflare Pages

**Prerequisites**:
1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Get API token from Angela (or use Deploy tab in Genspark)

**Deploy Command**:
```bash
npm run deploy:prod
```

This will:
1. Build the project (`npm run build`)
2. Deploy to Cloudflare Pages
3. URL: https://angela-coach.pages.dev

**First-time deployment**:
```bash
# Create Cloudflare Pages project
npx wrangler pages project create angela-coach \
  --production-branch main

# Deploy
npm run deploy:prod
```

### Production Database Migrations

```bash
# Apply migrations to production D1
npm run db:migrate:prod

# Check production database
npm run db:console:prod
```

---

## 🔑 Secrets & Environment Variables

### Cloudflare Secrets (Production)

Set via Wrangler:
```bash
# TrainingPeaks secret
npx wrangler pages secret put TP_CLIENT_SECRET --project-name angela-coach

# List all secrets
npx wrangler pages secret list --project-name angela-coach
```

### Environment Variables (wrangler.jsonc)

Already configured in `wrangler.jsonc`:
```json
{
  "vars": {
    "TP_CLIENT_ID": "qt2systems",
    "TP_AUTH_URL": "https://oauth.trainingpeaks.com",
    "TP_TOKEN_URL": "https://oauth.trainingpeaks.com/oauth/token",
    "TP_API_BASE_URL": "https://api.trainingpeaks.com",
    "TP_REDIRECT_URI_COACH": "https://angela-coach.pages.dev/handle_trainingpeaks_authorization",
    "TP_REDIRECT_URI_ATHLETE": "https://angela-coach.pages.dev/handle_trainingpeaks_authorization"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "angela-coach-production",
      "database_id": "9597d96f-1e8f-476f-b1bf-ab0c8b4e5602"
    }
  ]
}
```

---

## 📚 Key Features Implemented

### 1. Fueling Workflow ✅
- **Endpoint**: `POST /api/fuel/next-week`
- **What it does**: 
  - Fetches planned workouts from TrainingPeaks
  - Calculates CHO requirements based on athlete profile
  - Creates "FUELING GUIDANCE" workouts
  - Updates Pre-Activity Comments with CHO values
- **Date Ranges**: Next Week (default), Rest of Week, All Future
- **Sports**: SWIM, BIKE, RUN only (excludes strength)
- **Location**: Uses `PreActivityComment` field (NOT Description)
- **Delete Logic**: Automatically deletes old fueling workouts before creating new ones

### 2. TrainingPeaks OAuth ✅
- **Flow**: Manual OAuth with callback URL copy/paste
- **Page**: `/static/tp-connect-production.html`
- **Endpoints**: 
  - `/api/tp-auth/coach` - Initiate OAuth
  - `/handle_trainingpeaks_authorization` - Callback handler
  - `/api/tp-callback-manual` - Manual code exchange
- **Scopes**: Coach scopes (athletes, workouts, plans)

### 3. Athlete Profile Management ✅
- **Endpoint**: `POST /api/coach/athlete/:athleteId/profile`
- **Fields**: weight_kg, cp_watts, cs_run_seconds, swim_pace_per_100, lactate_threshold_hr
- **Validation**: Toast notifications on save
- **Persistence**: Saves to `athlete_profiles` table
- **Usage**: Fueling calculations use these values

### 4. Date Range Selector ✅
- **UI**: Red "FUEL" badge + dropdown + "Go" button
- **Options**: 
  - Next Week (Mon-Sun of NEXT week) - DEFAULT
  - Rest of This Week (Today-Sunday)
  - All Future (Today through 90 days)
- **Backend**: Accepts `date_range` parameter

### 5. TSS Planner Integration ✅
- **Button**: Links to Echo-devo dashboard
- **URL**: https://echodevo.com/dashboard/
- **Future**: Deep-link with athlete ID when Echo-devo adds support

---

## 🗄️ Database Schema

### Key Tables

**users** - Athletes and coaches
```sql
id, tp_athlete_id, email, name, account_type, 
access_token, refresh_token, token_expires_at, 
created_at, updated_at
```

**athlete_profiles** - Athlete metrics for fueling
```sql
id, user_id, weight_kg, cp_watts, cs_run_seconds, 
swim_pace_per_100m, lactate_threshold_hr, updated_at
```

**tp_write_queue** - Pending fueling workouts
```sql
id, user_id, workout_id, workout_date, workout_title, 
workout_type, fuel_carb, fuel_fluid, fuel_sodium, 
status, created_at, updated_at
```

**wellness_data** - Daily HRV, sleep, mood tracking
```sql
id, user_id, date, hrv_rmssd, sleep_hours, mood, 
energy, fatigue, created_at
```

---

## 🐛 Known Issues & Limitations

### TrainingPeaks API
- **Rate Limits**: ~1000 requests/hour (be careful with bulk operations)
- **OAuth Tokens**: Expire after 90 days, need refresh
- **Callback URL**: Must match exactly: `https://angela-coach.pages.dev/handle_trainingpeaks_authorization`

### Cloudflare Workers Limitations
- **CPU Time**: 10ms per request (free), 30ms (paid) - no long-running tasks
- **Memory**: 128MB limit
- **Bundle Size**: 10MB compressed
- **No Node.js APIs**: Cannot use `fs`, `child_process`, etc.

### Current Bugs
- None reported! Recent fixes:
  - ✅ Fixed user_id vs athlete_id in fuel queue
  - ✅ Fixed TP OAuth redirect URI
  - ✅ Fixed dashboard layout
  - ✅ Profile saves persist correctly

---

## 📖 Important Documentation

### Recently Created (Read These!)

1. **FUEL_FIX_CRITICAL.md** - Critical bug fix for fuel queue processing
2. **TP_OAUTH_FIX.md** - TrainingPeaks OAuth redirect URI fix
3. **FUEL_DATE_RANGE_COMPLETE.md** - Date range selector & profile save docs
4. **TAPER_LOGIC_ANALYSIS.md** - Taper calculator formulas
5. **angela_brain.txt** - Angela's coaching philosophy & athlete knowledge

### Key Code Files to Study

1. **src/index.tsx** (8600+ lines)
   - Lines 7534-7800: Fuel next week endpoint
   - Lines 8052-8300: processFuelQueue (writes to TrainingPeaks)
   - Lines 5838-6100: calculateFueling (CHO calculations)
   - Lines 4144-4240: TP OAuth manual callback
   - Lines 1904-1950: Profile save endpoint

2. **public/static/coach.html**
   - Lines 478-510: FUEL controls UI
   - Lines 1933-2000: fuelWithRange() JavaScript function

---

## 🧪 Testing Checklist

### Before Production Deployment

- [ ] Test TP OAuth flow (connect new athlete)
- [ ] Test fueling for all 3 date ranges
- [ ] Verify profile saves persist after logout
- [ ] Check console for athlete profile values in fueling logs
- [ ] Test with all 3 sports (swim, bike, run)
- [ ] Verify old fueling workouts are deleted
- [ ] Check TrainingPeaks shows "FUELING GUIDANCE" at top of day
- [ ] Verify Pre-Activity Comments contain CHO values
- [ ] Test database migrations on staging first
- [ ] Check PM2 logs for errors: `pm2 logs --nostream`

---

## 📞 Key Contacts

**Project Owner**: Angela Naeth  
**GitHub**: https://github.com/angelanaeth  
**Production URL**: https://angela-coach.pages.dev  

**External Services**:
- TrainingPeaks API: https://github.com/TrainingPeaks/PartnersAPI/wiki
- Cloudflare Pages: https://pages.cloudflare.com/
- Echo-devo Dashboard: https://echodevo.com/dashboard/

---

## 🔄 Recent Changes (Last 24 Hours)

**Commit History**:
```
9d657fa - Improve dashboard layout - separate FUEL controls row
7bb4aa7 - Fix TrainingPeaks OAuth redirect URI - use production URL
358a195 - Add FUEL label to date range selector + confirm delete logic
d5843c3 - Add date range selector for fueling + profile save confirmation
80c9f3e - Fuel ONLY Swim/Bike/Run workouts + appear at TOP of calendar
b4b0753 - Remove emojis from fueling workouts
e6c0432 - CRITICAL FIX: Use user_id instead of athlete_id for fuel queue
5017fec - Add TSS Planner button linking to Echo-devo
```

**What's Working Now**:
- ✅ Fueling posts to TrainingPeaks (fixed user_id bug)
- ✅ TP OAuth uses correct redirect URI
- ✅ FUEL controls have clear label
- ✅ Profile saves persist
- ✅ Date range selector works
- ✅ Only SBR workouts fueled (no strength)
- ✅ Fueling appears at top of calendar
- ✅ Old fueling workouts deleted automatically

---

## 🚀 Next Steps for Developer

### Immediate Tasks (Week 1)
1. [ ] Get added to GitHub repo as collaborator
2. [ ] Clone repo and install dependencies
3. [ ] Get TP_CLIENT_SECRET from Angela
4. [ ] Run local development server
5. [ ] Review key code files (index.tsx, coach.html)
6. [ ] Read all documentation files
7. [ ] Test fueling flow end-to-end

### Short-term Tasks (Week 2-4)
1. [ ] Add deep-link support to TSS Planner button
2. [ ] Implement custom date picker for fueling
3. [ ] Add bulk fueling for all athletes
4. [ ] Profile history tracking
5. [ ] Auto-refuel when profile changes

### Long-term Improvements
1. [ ] Add unit tests
2. [ ] Set up CI/CD pipeline
3. [ ] Add error monitoring (Sentry?)
4. [ ] Performance optimization
5. [ ] Mobile-responsive UI improvements

---

## ❓ Questions?

**For Code Questions**:
- Check documentation files in repo
- Review TrainingPeaks API docs: https://github.com/TrainingPeaks/PartnersAPI/wiki
- Check Cloudflare Workers docs: https://developers.cloudflare.com/workers/

**For Business/Product Questions**:
- Contact Angela directly

**For Emergency Issues**:
- Check PM2 logs: `pm2 logs --nostream`
- Check Cloudflare Pages dashboard: https://dash.cloudflare.com/
- Review recent commits for fixes

---

## 🎯 Success Criteria

You'll know everything is working when:
1. ✅ You can clone and run the project locally
2. ✅ TrainingPeaks OAuth connects successfully
3. ✅ Fueling workouts appear in TrainingPeaks calendar
4. ✅ Profile saves persist after logout
5. ✅ All 3 date ranges work correctly
6. ✅ Console shows correct athlete profile values
7. ✅ No errors in PM2 logs
8. ✅ Production deployment succeeds

---

**Welcome to the Angela Coach project! 🚀**

This is a production app serving real athletes, so please test thoroughly in local/staging before deploying to production. The documentation is comprehensive - take time to read through it all!

Good luck! 💪
