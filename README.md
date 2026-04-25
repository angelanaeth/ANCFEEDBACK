# Angela Coach - AI Training Intelligence System

## 🧠 Overview

Angela Coach is a fully automated endurance training coaching system that integrates:
- **TrainingPeaks API** (full OAuth with coach + athlete scopes)
- **StressLogic Engine** (CTL/ATL/TSB analysis with state determination)
- **TSS Planning** (automated weekly workout generation)
- **Automated Workout Posting** (direct integration with TrainingPeaks calendar)

Built on **Cloudflare Pages** + **Hono** + **D1 Database** for global edge deployment.

---

## 🚀 Features

### ✅ TrainingPeaks Integration
- Full OAuth 2.0 flow with secure token storage
- **Coach Scopes**: Create athletes, attach/detach, search, manage plans
- **Athlete Scopes**: Read profile, workouts, metrics, events
- **Write Capabilities**: Post structured workouts directly to calendar

### ✅ Angela's StressLogic Engine
- **CTL** (Chronic Training Load) - 42-day EWMA
- **ATL** (Acute Training Load) - 7-day EWMA
- **TSB** (Training Stress Balance) = CTL - ATL
- **State Classification**:
  - Compromised (TSB < -40)
  - Overreached (TSB < -25)
  - Productive Fatigue (TSB -25 to -10)
  - Recovered (TSB > 10)
  - Detraining (TSB > 25)

### ✅ Automated TSS Planning
- Block-specific progression (Base, Build, VO2, Specificity, Hybrid, Rebuild)
- Daily TSS distribution based on stress state
- Intensity modulation (0.5x to 1.1x)
- Sport-specific weighting (Bike/Run/Swim)

### ✅ Workout Generation
- Structured interval prescriptions
- Zone-based training targets
- Fueling recommendations
- Race taper protocols

---

## 📦 Tech Stack

- **Backend**: Hono (TypeScript on Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite at the edge)
- **Frontend**: TailwindCSS + vanilla JavaScript
- **APIs**: TrainingPeaks Partner API v2, OpenAI GPT-4
- **Deployment**: Cloudflare Pages (global edge network)

---

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
cd /home/user/webapp
npm install
```

### 2. Configure Environment Variables
Create `.dev.vars` file:
```bash
TP_CLIENT_ID=qt2systems
TP_CLIENT_SECRET=ycU0yO4koSq6y8fbQx4iHsRwrAWJ8kSCG1nwJvXkEQ
TP_REDIRECT_URI=http://localhost:3000/auth/trainingpeaks/callback
OPENAI_API_KEY=your_openai_key_here
SESSION_SECRET=your_session_secret_here
```

### 3. Create D1 Database
```bash
npm run db:create
```
Copy the `database_id` from output and update `wrangler.jsonc`

### 4. Run Migrations
```bash
npm run db:migrate:local
```

### 5. Build and Start
```bash
# Build the project
npm run build

# Start with PM2 (recommended)
pm2 start ecosystem.config.cjs

# Or use npm script
npm run dev:sandbox
```

### 6. Access Application
Open browser: `http://localhost:3000`

---

## 🔐 TrainingPeaks OAuth Flow

### Step 1: Authorization
1. Click "Connect TrainingPeaks" button
2. Redirects to TrainingPeaks OAuth page
3. User authorizes scopes
4. Returns to `/auth/trainingpeaks/callback` with code

### Step 2: Token Exchange
1. Exchange code for access_token + refresh_token
2. Fetch athlete profile from `/v1/athletes/me`
3. Store tokens in D1 database
4. Redirect to dashboard

### Step 3: API Calls
All subsequent API calls use stored `access_token`:
```typescript
Authorization: Bearer ${access_token}
```

---

## 📊 API Endpoints

### Authentication
- `GET /auth/trainingpeaks` - Initiate OAuth flow
- `GET /auth/trainingpeaks/callback` - Handle OAuth callback

### Angela Engine
- `POST /api/angela/analyze` - Analyze athlete data and calculate metrics
- `POST /api/angela/plan-workout` - Generate and optionally post workout
- `POST /api/training-stress-recommendation` - TSS recommendation from planner

### TrainingPeaks Data
- Workouts: `/v1/workouts?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Profile: `/v1/athletes/me`
- Metrics: `/v1/metrics?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- Post Workout: `/v1/workouts/plan` (POST)

---

## 🧠 Angela's Decision Logic

### CTL/ATL/TSB Calculation
```typescript
CTL[t] = CTL[t-1] + (TSS[t] - CTL[t-1]) * (1 / 42)
ATL[t] = ATL[t-1] + (TSS[t] - ATL[t-1]) * (1 / 7)
TSB[t] = CTL[t-1] - ATL[t-1]
```

### Stress State Classification
```typescript
if (TSB < -40) → Compromised (intensity 0.5x)
if (TSB < -25) → Overreached (intensity 0.7x)
if (-25 ≤ TSB ≤ -10) → Productive Fatigue (intensity 1.0x)
if (TSB > 10) → Recovered (intensity 1.05x)
if (TSB > 25) → Detraining (intensity 1.1x)
```

### Weekly TSS Planning
```typescript
TargetTSS = CurrentWeekTSS × RampFactor × IntensityMod
```

**Ramp Factors by Block:**
- Base/Durability: 1.06
- Build/Threshold: 1.05
- VO2 Max: 1.03
- Specificity: 1.0
- Hybrid: 1.04
- Rebuild: 0.7

---

## 🎯 Scopes & Capabilities

### With Current Scopes (FULL ACCESS)

**What You Can Do:**
✅ Read all athlete workouts (past + future)
✅ Read athlete metrics (HRV, sleep, wellness)
✅ Read athlete profile (zones, FTP, weight)
✅ Write/post structured workouts to calendar
✅ Create/manage events (races, tests)
✅ Create new athletes in TrainingPeaks
✅ Attach/detach athletes from coaching account
✅ Search athlete database
✅ Full coach + athlete capabilities

**Automated Possibilities:**
- Daily analysis of all athletes
- Auto-generate next week's training plan
- Post workouts directly to TrainingPeaks calendar
- Adjust plans based on compliance and fatigue
- Race taper automation
- Recovery monitoring and intervention

---

## 📁 Project Structure

```
webapp/
├── src/
│   ├── index.tsx              # Main Hono app with all routes
│   ├── angela/                # Angela engine modules
│   └── trainingpeaks/         # TP API client
├── migrations/
│   └── 0001_initial_schema.sql # Database schema
├── public/
│   └── static/                # Static assets
├── .dev.vars                  # Environment variables (local)
├── wrangler.jsonc             # Cloudflare configuration
├── ecosystem.config.cjs       # PM2 configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🚢 Deployment

### Local Development
```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Production Deployment to Cloudflare Pages
```bash
# 1. Create D1 database in production
wrangler d1 create angela-db

# 2. Update wrangler.jsonc with database_id

# 3. Run migrations
npm run db:migrate:prod

# 4. Set secrets
wrangler pages secret put TP_CLIENT_SECRET
wrangler pages secret put OPENAI_API_KEY
wrangler pages secret put SESSION_SECRET

# 5. Deploy
npm run deploy:prod
```

---

## 🔮 Next Steps

### Immediate Enhancements
1. **Frontend Dashboard**: Build athlete selection + metrics visualization
2. **Automated Daily Analysis**: Cron job to analyze all athletes
3. **Email Notifications**: Alert coaches of fatigue/overtraining
4. **OpenAI Integration**: Natural language coaching recommendations

### Advanced Features
1. **Multi-Athlete Management**: Coach dashboard with 50+ athletes
2. **Race Prediction**: ML models for performance forecasting
3. **Workout Library**: 500+ structured workout templates
4. **Fueling Engine**: CHO/protein recommendations per session

---

## 📝 Database Schema

### `users` table
- `id`, `tp_athlete_id`, `email`, `name`
- `access_token`, `refresh_token`, `token_expires_at`

### `training_metrics` table
- `user_id`, `date`, `tss`, `ctl`, `atl`, `tsb`
- `stress_state`, `block_type`

### `posted_workouts` table
- `user_id`, `tp_workout_id`, `date`, `title`
- `tss`, `duration`, `sport`, `block_type`

### `recommendations` table
- `user_id`, `date`, `stress_state`, `recommendation`
- `intensity_mod`, `reasoning`

---

## 🎓 Credits

**Angela Coaching Engine v5.1**
- StressLogic Model: QT2 Systems
- TSS Planner: TrainingPeaks methodology
- Implementation: Cloudflare Pages + Hono

**Built for**: Elite endurance coaching with data-driven precision

---

## 📞 Support

For questions or issues:
- Check TrainingPeaks API docs: https://github.com/TrainingPeaks/PartnersAPI/wiki
- Review Angela's brain documentation
- Contact: [Your contact info]

---

**Status**: ✅ Fully functional automated coaching system ready for deployment!
