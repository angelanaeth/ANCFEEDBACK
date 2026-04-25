# 🎉 TRAININGPEAKS OAUTH - READY TO TEST!

## ✅ FIXED: Using Pre-Registered Redirect URI

**Previously:** Trying to use sandbox URL (not registered)
**Now:** Using `http://127.0.0.1:5000/handle_trainingpeaks_authorization` (already registered!)

---

## 🚀 TEST OAUTH NOW - 3 STEPS

### **Step 1: Start OAuth Flow**

Click this link (or paste in browser):
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

### **Step 2: What Will Happen**

1. **Redirects to TrainingPeaks** authorization page
2. **You log in** with your TrainingPeaks account (if not already logged in)
3. **You authorize** the scopes requested
4. **TrainingPeaks redirects to:** `http://127.0.0.1:5000/handle_trainingpeaks_authorization?code=...`
5. **Our handler catches it** at `/handle_trainingpeaks_authorization`
6. **Exchanges code for tokens**
7. **Saves to database**
8. **Shows success page**

### **Step 3: Verify Success**

Check the database for saved tokens:
```bash
cd /home/user/webapp
npx wrangler d1 execute angela-db --local --command="SELECT tp_athlete_id, name, account_type, created_at FROM users;"
```

---

## 📊 HOW IT WORKS

### **Unified Callback Handler**

I added a new route `/handle_trainingpeaks_authorization` that:
- Works with the pre-registered redirect URI
- Automatically detects Coach vs Athlete based on granted scopes
- Handles token exchange using correct `application/x-www-form-urlencoded` format
- Saves tokens to database with proper account_type
- Shows success/error pages

### **Smart Scope Detection**

```typescript
// Determine account type based on scopes
const isCoach = tokens.scope && tokens.scope.includes('coach:')
const accountType = isCoach ? 'coach' : 'athlete'
```

If the granted scopes include `coach:*`, it's a coach account.
Otherwise, it's treated as an athlete account.

---

## 🔗 OAUTH FLOW DIAGRAM

```
User clicks "Connect as Coach"
    ↓
Redirects to TrainingPeaks authorize
    ↓
User authorizes scopes
    ↓
TrainingPeaks redirects back with code
    ↓
http://127.0.0.1:5000/handle_trainingpeaks_authorization?code=ABC123
    ↓
Our unified handler catches it
    ↓
Exchanges code for access/refresh tokens
    ↓
Checks scopes to determine coach/athlete
    ↓
Saves tokens to database
    ↓
Shows success page!
```

---

## 🧪 TESTING BOTH MODES

### **Coach Mode**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

**Scopes Requested:**
- `coach:athletes`
- `coach:attach-athletes`
- `coach:create-athletes`
- `coach:detach-athletes`
- `coach:search-athletes`
- `coach:plans`
- `workouts:read`
- `workouts:details`
- `workouts:plan`
- `events:read`
- `events:write`

### **Athlete Mode**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete
```

**Scopes Requested:**
- `athlete:profile`
- `workouts:read`
- `workouts:details`
- `events:read`
- `metrics:read`

---

## 🔍 DEBUGGING

### **Check Logs**
```bash
pm2 logs angela-coach --lines 50
```

**Look for:**
```
🔄 [UNIFIED OAUTH] Exchanging code for tokens...
Token response status: 200
Granted scopes: coach:athletes coach:...
✅ [UNIFIED OAUTH] Got access token
```

### **Check Database**
```bash
npx wrangler d1 execute angela-db --local --command="SELECT * FROM users;"
```

### **Test Callback Endpoint Directly**
```bash
curl https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization
```

Should show: "No authorization code received" error (expected - needs code parameter)

---

## ⚠️ IMPORTANT NOTES

### **Redirect URI Mismatch?**

If you still get "redirect_uri_mismatch", it means:
1. The URI `http://127.0.0.1:5000/handle_trainingpeaks_authorization` is NOT registered
2. OR it's registered differently (check for trailing slash, http vs https, etc.)

**Solution:** Contact TrainingPeaks support to confirm what redirect URIs are registered for `qt2systems`

### **Authorization Codes Expire**

OAuth codes expire after **60 minutes** according to TrainingPeaks docs.
If you wait too long between authorization and callback, you'll get `invalid_grant` error.

**Solution:** Complete the flow quickly!

### **Cannot Request Both Coach and Athlete Scopes**

TrainingPeaks limitation: You can request EITHER coach scopes OR athlete scopes, but not both in the same request.

**Solution:** We have separate flows for Coach and Athlete modes!

---

## 📝 CONFIGURATION

### **Environment Variables (.dev.vars)**
```bash
TP_CLIENT_ID=qt2systems
TP_CLIENT_SECRET=ycU0yO4koSq6y8fbQx4iHsRwrAWJ8kSCG1nwJvXkEQ
TP_REDIRECT_URI_COACH=http://127.0.0.1:5000/handle_trainingpeaks_authorization
TP_REDIRECT_URI_ATHLETE=http://127.0.0.1:5000/handle_trainingpeaks_authorization
TP_AUTH_URL=https://oauth.trainingpeaks.com
TP_TOKEN_URL=https://oauth.trainingpeaks.com/oauth/token
TP_API_BASE_URL=https://api.trainingpeaks.com
```

**Note:** Using production OAuth URLs (not sandbox) because your credentials are for production.

---

## 🎯 SUCCESS CRITERIA

### **You'll know OAuth works when:**
1. ✅ You click the Coach OAuth link
2. ✅ TrainingPeaks authorization page loads
3. ✅ You authorize the scopes
4. ✅ Redirects back to Angela Coach
5. ✅ Shows "Authorization Successful" page
6. ✅ Database contains your tokens:
   ```bash
   npx wrangler d1 execute angela-db --local --command="SELECT * FROM users;"
   ```
7. ✅ Logs show successful token exchange

---

## 🚀 NEXT STEPS AFTER OAUTH WORKS

### **1. Test TrainingPeaks API**
```bash
# Get the access token from database
TOKEN=$(npx wrangler d1 execute angela-db --local --command="SELECT access_token FROM users LIMIT 1;" | grep -o 'gAAAA[^"]*')

# Test fetching athlete profile
curl -H "Authorization: Bearer $TOKEN" https://api.trainingpeaks.com/v1/athletes/me
```

### **2. Test Angela Analyze Endpoint**
```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/angela/analyze \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "coach_account"}'
```

### **3. Integrate TSS Planner UI**
- Add modal to homepage
- Connect to backend API
- Test workout recommendations

### **4. Deploy to Production**
- Create production Cloudflare Pages project
- Set up custom domain
- Configure production secrets

---

## 📚 REFERENCE DOCUMENTATION

### **TrainingPeaks Partner API**
- Main Wiki: https://github.com/TrainingPeaks/PartnersAPI/wiki
- OAuth Docs: https://github.com/TrainingPeaks/PartnersAPI/wiki/OAuth
- API Endpoints: https://github.com/TrainingPeaks/PartnersAPI/wiki/API-Endpoints

### **Key Facts from TrainingPeaks Docs**
- Authorization codes expire in 60 minutes
- Access tokens expire in 10 minutes (600 seconds)
- Must use HTTPS for all requests
- Token exchange requires `application/x-www-form-urlencoded`
- Redirect URI must match EXACTLY what's registered

---

## ✅ SUMMARY

**What Changed:**
- ✅ Added unified callback handler at `/handle_trainingpeaks_authorization`
- ✅ Using pre-registered redirect URI: `http://127.0.0.1:5000/handle_trainingpeaks_authorization`
- ✅ Auto-detects Coach vs Athlete based on granted scopes
- ✅ Proper token exchange format (form-urlencoded)
- ✅ Database ready with all tables

**Status:**
- ✅ Code complete and deployed
- ✅ Service running
- ✅ Database initialized
- ⏳ Ready for testing!

**Next Action:**
**TEST IT NOW!** Click this link:
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

---

**OAuth should work now because we're using the pre-registered redirect URI!** 🚀
