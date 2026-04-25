# 🌐 ANGELA COACH - PUBLIC ACCESS

## ✅ YOUR APP IS LIVE AND ONLINE!

### 🔗 Public URL
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
```

**This URL works from ANY device** - your computer, phone, tablet, anywhere!

---

## 🚀 Quick Start - Test OAuth NOW

### Option 1: Coach Mode (Manage Athletes)

**Click this link:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

**What happens:**
1. ✅ Redirects to TrainingPeaks authorization page
2. ✅ You click "Authorize"
3. ✅ Redirects back with success page
4. ✅ Tokens stored in database

**Coach Capabilities:**
- Manage all athletes in coaching account
- Post workouts to athlete calendars
- Create training plans
- Attach/detach athletes
- View all athlete data

---

### Option 2: Athlete Mode (Personal Data)

**Click this link:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete
```

**What happens:**
1. ✅ Redirects to TrainingPeaks authorization page
2. ✅ You click "Authorize"
3. ✅ Redirects back with success page showing your name
4. ✅ Tokens stored in database

**Athlete Capabilities:**
- View your profile
- Read your workouts
- Access workout details
- View events
- Read metrics (TSS, CTL, ATL, TSB)

---

## 📱 Access From Anywhere

### From Your Computer
Just click the links above or paste them in any browser!

### From Your Phone
1. Copy the URL: `https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai`
2. Paste in Safari/Chrome
3. Click "Connect as Coach" or "Connect as Athlete"

### Share With Others
Send them the public URL - they can test it too!

---

## 🔐 Important Security Note

⚠️ **CRITICAL:** Before OAuth will work, you MUST register these redirect URIs in your TrainingPeaks Partner API settings:

```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach/callback
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete/callback
```

**How to register:**
1. Log in to TrainingPeaks Partner Portal
2. Go to your application settings
3. Add both redirect URIs above
4. Save changes
5. Wait a few minutes for propagation
6. Then test OAuth!

---

## 🧪 Test the Homepage First

Before testing OAuth, verify the app is working:

**Homepage:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
```

You should see:
- Angela Coach header
- Two buttons: "Connect as Coach" and "Connect as Athlete"
- Features grid showing StressLogic, Planning, TrainingPeaks Sync

---

## 🔍 Available Endpoints

### Public Pages
- **Homepage:** `/`
- **Coach OAuth Start:** `/auth/trainingpeaks/coach`
- **Athlete OAuth Start:** `/auth/trainingpeaks/athlete`
- **Coach OAuth Callback:** `/auth/trainingpeaks/coach/callback`
- **Athlete OAuth Callback:** `/auth/trainingpeaks/athlete/callback`

### API Endpoints (After OAuth)
- **POST /api/angela/analyze** - Analyze athlete training stress
- **POST /api/angela/plan-workout** - Generate workout recommendations
- **POST /api/intervals/connect** - Connect Intervals.icu account
- **POST /api/intervals/analyze** - Analyze Intervals.icu data

---

## 📊 After Successful OAuth

### Check Token Storage

SSH into sandbox:
```bash
cd /home/user/webapp
npm run db:console:local
SELECT tp_athlete_id, email, account_type, created_at FROM users;
```

### View Logs

```bash
pm2 logs angela-coach --lines 20
```

Look for:
```
🔄 [OAUTH] Exchanging code for tokens...
Token response status: 200
✅ [OAUTH] Got access token
```

### Test API

```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/angela/analyze \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "your_athlete_id"}'
```

---

## 🛠️ Troubleshooting

### "This site can't be reached"
- ✅ **FIXED!** Use the public URL above, NOT localhost
- The app runs in a sandbox, accessible via the public URL

### OAuth "Redirect URI mismatch"
- Register the redirect URIs in TrainingPeaks Partner Portal
- Must match EXACTLY (including https://)

### "Authorization code expired"
- Codes expire after 10 minutes
- Start fresh OAuth flow from the beginning

### App Not Loading
```bash
# Check service status
pm2 status

# Restart if needed
pm2 restart angela-coach

# View logs
pm2 logs angela-coach --nostream
```

---

## 🎯 Next Steps

### 1. Test OAuth (5 minutes)
Click the Coach or Athlete OAuth link above

### 2. Verify Token Storage (2 minutes)
Check the database for stored tokens

### 3. Test API Endpoints (5 minutes)
Use the Angela analyze endpoint with your athlete data

### 4. Build Frontend UI (Next Phase)
Integrate the TSS Planner UI (tss_planner.html/js)

### 5. Deploy to Production (When Ready)
See DEPLOYMENT.md for Cloudflare Pages deployment

---

## 📞 Support

### Documentation
- **README.md** - System overview
- **DEPLOYMENT.md** - Production deployment guide
- **OAUTH_TESTING.md** - Detailed OAuth testing
- **OAUTH_ISSUE.md** - Common OAuth problems

### Logs & Debugging
```bash
# Service status
pm2 status

# View logs
pm2 logs angela-coach --nostream

# Restart service
pm2 restart angela-coach

# Build project
npm run build
```

---

## 🎉 Summary

**Your Angela Coach system is:**
✅ **LIVE** - Accessible from anywhere
✅ **ONLINE** - Public sandbox URL
✅ **READY** - OAuth configured for testing
✅ **INTEGRATED** - TrainingPeaks + Intervals.icu

**Next Action:**
Click this link to test Coach OAuth:
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

**Remember:** Register the redirect URIs in TrainingPeaks Partner Portal first!
