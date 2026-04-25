# 🔐 Angela-Coach Webapp - Platform Credentials & Configuration

## 📋 Quick Summary

**Platform:** Cloudflare Pages (Serverless Edge Platform)  
**Project Name:** angela-coach  
**Repository:** https://github.com/angelanaeth/angela-coach  
**Production URL:** https://angela-coach.pages.dev  
**Latest Deploy:** https://a91b45d3.angela-coach.pages.dev  

---

## 🏗️ Platform Architecture

### Deployment Stack
- **Frontend:** HTML/CSS/JavaScript (static files)
- **Backend Framework:** Hono (TypeScript)
- **Build Tool:** Vite
- **Deployment:** Cloudflare Pages
- **CLI Tool:** Wrangler

### Current Data Storage
- **No database yet** - All workout data stored as JavaScript objects in HTML
- **10,716 workout variations** embedded in swim-planner.html (13MB file)
- Future: Will migrate to Cloudflare D1 or external database API

---

## 🔑 Access Requirements

### 1. Cloudflare Account

**Required for:**
- Viewing deployment dashboard
- Managing environment variables
- Configuring API tokens
- Deploying updates

**Access Steps:**
1. Go to https://dash.cloudflare.com/
2. Login with Angela's Cloudflare credentials
3. Navigate to: Pages → angela-coach

**API Token (for deployments):**
- Location: My Profile → API Tokens
- Required Permissions: "Edit Cloudflare Pages"
- Used by: Wrangler CLI for deployments
- **Status:** ⚠️ Not yet configured in current session

### 2. GitHub Repository

**Repository Details:**
- URL: https://github.com/angelanaeth/angela-coach
- Owner: angelanaeth
- Visibility: Private
- Branch: main
- Latest Commit: 242833a

**Access Required:**
- GitHub username: angelanaeth
- Repository access: Owner permissions
- Clone command: `git clone https://github.com/angelanaeth/angela-coach.git`

### 3. Local Development Setup

**Prerequisites:**
```bash
# Node.js version 18 or higher
node --version  # Should show v18.x or higher

# Install dependencies
cd angela-coach
npm install

# Build project
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist --project-name angela-coach
```

---

## 🗄️ Database Integration

### Current Status: ❌ NO DATABASE

All workout data is currently stored as static JavaScript objects embedded in the HTML file. This works for the current use case but should be migrated to a proper database for:
- User-specific workouts
- Dynamic data updates
- Scalability

### Option A: Cloudflare D1 (Recommended)

**Pros:**
- Native Cloudflare integration
- Serverless SQLite database
- Global distribution
- Free tier available

**Setup Steps:**
```bash
# Create database
npx wrangler d1 create angela-coach-db

# Update wrangler.jsonc
{
  "d1_databases": [{
    "binding": "DB",
    "database_name": "angela-coach-db",
    "database_id": "your-database-id-here"
  }]
}

# Run migrations
npx wrangler d1 migrations apply angela-coach-db
```

### Option B: Third-Party Database (Alternative)

**Options:**
- Supabase (PostgreSQL) - https://supabase.com
- PlanetScale (MySQL) - https://planetscale.com
- MongoDB Atlas - https://www.mongodb.com/cloud/atlas

**Integration:**
- Store API keys as Cloudflare Secrets
- Access via REST API from backend
- No direct database connection (use HTTP endpoints)

---

## 🔐 Environment Variables & Secrets

### Current Status: ❌ NO SECRETS CONFIGURED

### How to Add Secrets

**Method 1: Cloudflare Dashboard**
1. Go to https://dash.cloudflare.com/
2. Navigate to: Pages → angela-coach → Settings → Environment Variables
3. Add variables for Production and Preview environments

**Method 2: Wrangler CLI**
```bash
# Add a secret
npx wrangler pages secret put API_KEY --project-name angela-coach

# List secrets
npx wrangler pages secret list --project-name angela-coach

# Delete a secret
npx wrangler pages secret delete API_KEY --project-name angela-coach
```

### Expected Secrets (Future Implementation)

```bash
# TrainingPeaks API Integration
TRAININGPEAKS_API_KEY=your-api-key-here
TRAININGPEAKS_CLIENT_ID=your-client-id
TRAININGPEAKS_CLIENT_SECRET=your-client-secret

# Database (if using external)
DATABASE_URL=your-database-connection-string

# Authentication
JWT_SECRET=your-jwt-secret-key
API_SECRET=your-api-secret
```

---

## 📁 Project Structure

```
angela-coach/
├── src/
│   └── index.tsx              # Hono backend entry point
├── public/
│   └── static/
│       ├── coach.html         # Main dashboard
│       ├── swim-planner.html  # Swim workout planner (13MB)
│       └── app.js             # Frontend JavaScript
├── dist/                      # Build output (deployed)
│   ├── _worker.js            # Compiled backend
│   ├── _routes.json          # Routing config
│   └── static/               # Static files
├── css_tt_test_workouts.csv  # TT test data (3.5MB)
├── non_css_tt_test_workouts.csv  # Non-CSS TT tests (64KB)
├── wrangler.jsonc            # Cloudflare configuration
├── package.json              # Dependencies
├── vite.config.ts            # Build configuration
├── tsconfig.json             # TypeScript config
└── ecosystem.config.cjs      # PM2 config (dev only)
```

---

## 🛠️ Configuration Files

### wrangler.jsonc
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "angela-coach",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"]
}
```

### package.json (Key Scripts)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "deploy": "npm run build && wrangler pages deploy dist",
    "deploy:prod": "npm run build && wrangler pages deploy dist --project-name angela-coach"
  },
  "dependencies": {
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "4.20250705.0",
    "@hono/vite-cloudflare-pages": "^0.4.2",
    "vite": "^5.0.0",
    "wrangler": "^3.78.0",
    "typescript": "^5.0.0"
  }
}
```

---

## 📊 Current Implementation Status

### ✅ Completed Features

- **Swim Workout Library**
  - 51 CSS pace levels (1:10 to 2:00)
  - 4,970 CSS workout entries
  - 42 non-paced workout entries
  - 5,612 CSS TT test entries
  - 92 non-CSS TT test entries
  - **Total: 10,716 workout variations**

- **User Interface**
  - Swim planner with calendar view
  - Workout selection dropdowns
  - Three library types: CSS, Non-Paced, Swim Tests
  - Yardage selection (2000-3500 yards)
  - Week-based scheduling

- **Deployment**
  - GitHub repository initialized
  - Code committed and versioned
  - Deployed to Cloudflare Pages
  - Production URL active

### ❌ Not Yet Implemented

- Cloudflare API token configuration
- Database integration
- TrainingPeaks API backend
- User authentication
- Environment variables/secrets
- Data persistence (currently static)

---

## 🚀 Deployment Process

### Current Deployment Method

```bash
# 1. Build the project
cd /home/user/webapp
npm run build

# 2. Deploy to Cloudflare
npx wrangler pages deploy dist --project-name angela-coach

# 3. Commit to GitHub
git add -A
git commit -m "Description of changes"
git push origin main
```

### Deployment Requirements

1. **Cloudflare API Token** (required)
   - Must be configured before first deployment
   - Stored securely in Cloudflare account

2. **Git Repository Access** (for version control)
   - GitHub credentials for angelanaeth account
   - Push access to private repository

3. **Node.js Environment** (for building)
   - Node.js v18+
   - npm or yarn package manager

---

## 🔒 Security Best Practices

### ✅ Currently Implemented

- No hardcoded API keys in code
- No database passwords in repository
- .gitignore configured for sensitive files
- Private GitHub repository
- Static data (no sensitive user information)

### 📋 Recommendations for Future

1. **Use Cloudflare Secrets** for all API keys
2. **Implement JWT authentication** for user sessions
3. **Add rate limiting** to API endpoints
4. **Use HTTPS** for all communications (already enforced by Cloudflare)
5. **Implement CORS** properly for frontend-backend communication
6. **Add input validation** for all user inputs
7. **Use environment-specific configs** (dev/staging/prod)

---

## 📞 Support & Resources

### Cloudflare Documentation
- Pages: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- D1 Database: https://developers.cloudflare.com/d1/

### Framework Documentation
- Hono: https://hono.dev/
- Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/

### Project Information
- Development Environment: Novita AI Sandbox
- Project Location: /home/user/webapp/
- GitHub: https://github.com/angelanaeth/angela-coach
- Latest Commit: 242833a
- Production: https://angela-coach.pages.dev

---

## 📝 Action Items for Handoff

### Immediate (Required for Full Access)

- [ ] Provide Cloudflare account credentials
- [ ] Provide GitHub account credentials
- [ ] Configure Cloudflare API token
- [ ] Verify deployment access

### Short-term (For Backend Development)

- [ ] Decide on database solution (D1 vs external)
- [ ] Set up TrainingPeaks API credentials
- [ ] Configure environment variables
- [ ] Implement user authentication

### Long-term (For Scalability)

- [ ] Migrate workout data to database
- [ ] Add user management system
- [ ] Implement workout sync with TrainingPeaks
- [ ] Add analytics and monitoring
- [ ] Set up automated deployments via GitHub Actions

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-26  
**Prepared By:** AI Development Assistant  
**For:** Angela Naeth Coaching Platform
