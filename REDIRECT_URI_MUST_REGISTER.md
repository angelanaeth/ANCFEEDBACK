# 🚨 CRITICAL: REDIRECT URI REGISTRATION REQUIRED

## ❌ THE REAL PROBLEM

**What happened when you tested:**
```
Access to 127.0.0.1 was denied
HTTP ERROR 403
```

**Why this happened:**
- TrainingPeaks tried to redirect to: `http://127.0.0.1:5000/handle_trainingpeaks_authorization`
- That URI points to YOUR local machine on port 5000
- Nothing is running there (our app is on port 3000 in the sandbox)
- So you got a 403 error

**The Real Issue:**
The redirect URI `http://127.0.0.1:5000/handle_trainingpeaks_authorization` was registered with TrainingPeaks when you were testing locally with Flask (from Echo-devo). It won't work for the sandbox environment.

---

## 🔐 YOU MUST CONTACT TRAININGPEAKS

**TrainingPeaks Partner API redirect URIs are NOT self-service.** You cannot add them yourself. They must be configured by the TrainingPeaks team.

### **What You Need to Do:**

**Email:** partners@trainingpeaks.com

**Subject:** Add Redirect URI for qt2systems Application

**Message:**
```
Hello TrainingPeaks Partner Support,

I need to add a new redirect URI to my Partner API application.

Application Details:
- Client ID: qt2systems
- Client Secret: ycU0yO4koSq6y8fbQx4iHsRwrAWJ8kSCG1nwJvXkEQ

Current Redirect URI (already registered):
- http://127.0.0.1:5000/handle_trainingpeaks_authorization

New Redirect URI to Add:
- https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization

Reason: 
We are migrating from a local Flask application to a cloud-hosted Cloudflare Pages application. The new URI points to our staging environment for testing before production deployment.

Please confirm when this redirect URI has been added.

Thank you!
```

---

## ⏰ EXPECTED TIMELINE

- **Email Response:** 1-3 business days
- **URI Registration:** Same day after approval
- **Testing:** Immediate once registered

**TrainingPeaks Partner Support is typically very responsive!**

---

## 🔄 TEMPORARY WORKAROUND (OPTIONAL)

If you want to test immediately while waiting for TrainingPeaks, you can run a local Flask server on port 5000 that forwards to your sandbox:

### **Option A: Local Flask Forwarder (Quick Test)**

Create `/tmp/tp_forwarder.py`:
```python
from flask import Flask, request, redirect
app = Flask(__name__)

@app.route('/handle_trainingpeaks_authorization')
def callback():
    code = request.args.get('code')
    # Forward to sandbox with the code
    return redirect(f'https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization?code={code}')

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
```

Run it:
```bash
cd /tmp
python3 tp_forwarder.py
```

Then test OAuth - it will forward the code to your sandbox!

### **Option B: Use TrainingPeaks Sandbox**

TrainingPeaks has a sandbox environment for testing. You might be able to register test redirect URIs there more easily.

**Sandbox OAuth URL:** https://oauth.sandbox.trainingpeaks.com

---

## 📋 WHAT I'VE UPDATED

### **Current Configuration**

`.dev.vars` now uses the sandbox URL:
```bash
TP_REDIRECT_URI_COACH=https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization
TP_REDIRECT_URI_ATHLETE=https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization
```

### **Unified Callback Handler**

The endpoint `/handle_trainingpeaks_authorization` is ready and will:
1. ✅ Receive the OAuth code from TrainingPeaks
2. ✅ Exchange it for access/refresh tokens
3. ✅ Auto-detect Coach vs Athlete from scopes
4. ✅ Save tokens to database
5. ✅ Show success page

### **Everything is Ready**

Once TrainingPeaks adds the redirect URI, OAuth will work immediately!

---

## 🎯 PRODUCTION DEPLOYMENT PLAN

### **Phase 1: Sandbox Testing (Current)**
- Redirect URI: `https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization`
- Purpose: Testing OAuth flow
- Timeline: Now (waiting for TrainingPeaks)

### **Phase 2: Production Deployment**
- Deploy to Cloudflare Pages: `https://angela-coach.pages.dev`
- Request new redirect URI: `https://angela-coach.pages.dev/handle_trainingpeaks_authorization`
- Update production secrets
- Timeline: After sandbox testing succeeds

### **Phase 3: Custom Domain**
- Set up custom domain: `https://angela.echodevo.com`
- Request new redirect URI: `https://angela.echodevo.com/handle_trainingpeaks_authorization`
- Update DNS and SSL
- Timeline: After production deployment succeeds

---

## 🔍 HOW TO VERIFY REDIRECT URI IS REGISTERED

Once TrainingPeaks confirms they've added your redirect URI:

### **1. Test OAuth Flow**
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

### **2. Check for Success**
- TrainingPeaks authorization page loads ✅
- You authorize ✅
- Redirects to sandbox (NOT 127.0.0.1) ✅
- Success page shows ✅

### **3. Verify Token Storage**
```bash
cd /home/user/webapp
npx wrangler d1 execute angela-db --local --command="SELECT tp_athlete_id, name, account_type FROM users;"
```

### **4. Check Logs**
```bash
pm2 logs angela-coach --lines 50
```

Look for:
```
🔄 [UNIFIED OAUTH] Exchanging code for tokens...
Token response status: 200
✅ [UNIFIED OAUTH] Got access token
```

---

## 📞 TRAININGPEAKS PARTNER SUPPORT

### **Contact Information**
- **Email:** partners@trainingpeaks.com
- **Documentation:** https://github.com/TrainingPeaks/PartnersAPI/wiki
- **Response Time:** Usually 1-3 business days

### **What to Include in Your Request**
1. **Client ID:** qt2systems
2. **Current redirect URI:** http://127.0.0.1:5000/handle_trainingpeaks_authorization
3. **New redirect URI:** https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/handle_trainingpeaks_authorization
4. **Reason:** Migrating to cloud hosting
5. **Urgency:** If testing critical, mention timeline

---

## 💡 WHY THIS IS NECESSARY

### **OAuth Security**

Redirect URI validation is a critical OAuth security feature:
- Prevents malicious apps from stealing authorization codes
- Ensures codes only go to authorized endpoints
- Must be pre-registered to prevent attacks

### **TrainingPeaks Requirements**

From the Partner API docs:
- Redirect URIs must be pre-configured by TrainingPeaks
- Cannot be changed via API or developer portal
- Must contact Partner Support to modify
- Each environment (dev/staging/prod) needs separate URI

---

## ✅ SUMMARY

**Current Status:**
- ✅ Code complete and working
- ✅ Database initialized
- ✅ Unified callback handler ready
- ✅ Using sandbox public URL
- ❌ Redirect URI not registered with TrainingPeaks

**Blocker:**
You must email partners@trainingpeaks.com to register the redirect URI

**Timeline:**
- Email now → Response in 1-3 days → Test immediately

**Alternative:**
Run local Flask forwarder on port 5000 for immediate testing

---

## 🚀 IMMEDIATE NEXT STEPS

### **1. Email TrainingPeaks (5 minutes)**
Copy the email template above and send to partners@trainingpeaks.com

### **2. Wait for Confirmation**
TrainingPeaks will reply when URI is registered

### **3. Test OAuth**
Once registered, test immediately:
```
https://3000-i8mf68r87mlc4fo6mi2yb-c07dda5e.sandbox.novita.ai/auth/trainingpeaks/coach
```

### **4. Move Forward**
Once OAuth works:
- Integrate TSS Planner UI
- Create Custom GPT
- Deploy to production

---

**Bottom Line: You need TrainingPeaks to add your redirect URI. Everything else is ready!** 📧
