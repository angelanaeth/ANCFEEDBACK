# ⚠️ CRITICAL: REGISTER REDIRECT URIs WITH TRAININGPEAKS

## 🚨 Why OAuth Is Failing

Your OAuth is returning **400 Bad Request** because TrainingPeaks doesn't recognize your redirect URIs.

**What we fixed:**
✅ Changed token request from JSON to `application/x-www-form-urlencoded` (OAuth 2.0 standard)
✅ Added detailed error logging
✅ Using correct public sandbox URL

**What you need to do:**
❌ **Register redirect URIs with TrainingPeaks** (CRITICAL!)

---

## 📋 STEP-BY-STEP: Register Redirect URIs

### Step 1: Log in to TrainingPeaks Partner Portal

Visit: https://www.trainingpeaks.com/partners/

Use your QT2 Systems / TrainingPeaks developer account.

### Step 2: Find Your Application

Look for your application with:
- **Client ID:** `qt2systems`
- **Client Secret:** `ycU0yO4koSq6y8fbQx4iHsRwrAWJ8kSCG1nwJvXkEQ`

### Step 3: Add Redirect URIs

In your application settings, find **"Redirect URIs"** or **"Callback URLs"** section.

Add these **TWO** redirect URIs:

```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach/callback
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete/callback
```

**IMPORTANT:**
- ✅ Include `https://`
- ✅ Match EXACTLY (case-sensitive)
- ✅ No trailing slashes
- ✅ Use the full sandbox URL

### Step 4: Save Changes

Click **"Save"** or **"Update"** in the TrainingPeaks portal.

### Step 5: Wait for Propagation

Wait **5-10 minutes** for changes to propagate across TrainingPeaks servers.

### Step 6: Test OAuth Again

After waiting, test the OAuth flow:

**Coach Mode:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

**Athlete Mode:**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete
```

---

## 🔍 How to Verify Registration

### Check TrainingPeaks Developer Console

In your TrainingPeaks application settings, you should see:

```
Redirect URIs:
✅ https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach/callback
✅ https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete/callback
```

### Test OAuth Authorization (Should Work Now)

1. Click Coach OAuth link
2. Should redirect to TrainingPeaks authorization page
3. Click "Authorize"
4. Should redirect back to your app
5. Should see **"✅ Authorization Successful"** page

---

## 🐛 Debugging After Registration

### If OAuth Still Fails:

**1. Check Logs for Detailed Error:**
```bash
pm2 logs angela-coach --lines 50
```

Look for:
```
Token response status: 400
Token response body: <error details>
```

**2. Common Errors:**

#### Error: "invalid_grant"
- **Cause:** Authorization code expired or already used
- **Fix:** Start fresh OAuth flow

#### Error: "redirect_uri_mismatch"
- **Cause:** Redirect URI not registered or doesn't match exactly
- **Fix:** Double-check registration, wait 5-10 minutes

#### Error: "invalid_client"
- **Cause:** Client ID or Secret is wrong
- **Fix:** Verify credentials in `.dev.vars`

#### Error: "unauthorized_client"
- **Cause:** Application doesn't have required permissions
- **Fix:** Check scopes in TrainingPeaks app settings

---

## 📞 Contact TrainingPeaks Support

If registration isn't working:

**Email:** partners@trainingpeaks.com
**Subject:** "Need to register redirect URIs for qt2systems application"

**Message Template:**
```
Hi TrainingPeaks Partner Support,

I need to register the following redirect URIs for my application:

Client ID: qt2systems

Redirect URIs:
- https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach/callback
- https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete/callback

Please confirm when these are registered.

Thank you!
```

---

## 🔄 Alternative: Test with Already-Registered URI

If you have a redirect URI already registered with TrainingPeaks, we can temporarily use that for testing.

**Tell me what redirect URI is already registered**, and I'll update the code to use it.

For example, if you have:
```
http://127.0.0.1:5000/handle_trainingpeaks_authorization
```

I can update the code to use that temporarily.

---

## ✅ After Successful Registration

Once redirect URIs are registered and OAuth works:

### 1. Verify Token Storage
```bash
cd /home/user/webapp
npm run db:console:local
SELECT tp_athlete_id, email, account_type FROM users;
```

### 2. Test Angela API
```bash
curl -X POST https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/api/angela/analyze \
  -H "Content-Type: application/json" \
  -d '{"athlete_id": "your_athlete_id"}'
```

### 3. Build Frontend UI

Integrate the TSS Planner UI (tss_planner.html/js) with your authenticated backend.

---

## 📊 What's Working Now

✅ **Public URL:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
✅ **OAuth Endpoints:** `/auth/trainingpeaks/coach` and `/auth/trainingpeaks/athlete`
✅ **Token Exchange:** Using correct `application/x-www-form-urlencoded` format
✅ **Error Logging:** Detailed debugging information
✅ **Database:** D1 ready to store tokens

**Missing:**
❌ **Redirect URIs not registered** in TrainingPeaks Partner Portal

---

## 🎯 ACTION REQUIRED

**Do this NOW:**

1. Log in to TrainingPeaks Partner Portal
2. Find your application settings
3. Add the two redirect URIs above
4. Save changes
5. Wait 5-10 minutes
6. Test OAuth again

**OR**

Tell me what redirect URI is already registered, and I'll update the code to use it temporarily.

---

## 📁 Files Updated

- **src/index.tsx** - OAuth token exchange using form-urlencoded
- **.dev.vars** - Public sandbox redirect URIs
- **This file** - Registration instructions

---

## 🔗 Quick Links

- **Homepage:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai
- **Coach OAuth:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
- **Athlete OAuth:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/athlete
- **TrainingPeaks Partner Portal:** https://www.trainingpeaks.com/partners/

---

**Next Step:** Register the redirect URIs in TrainingPeaks Partner Portal, then test OAuth again!
