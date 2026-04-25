# TrainingPeaks OAuth Testing Guide

## 🔧 Prerequisites

Before testing, ensure these redirect URIs are registered in your TrainingPeaks Partner API settings:

```
http://localhost:3000/auth/trainingpeaks/coach/callback
http://localhost:3000/auth/trainingpeaks/athlete/callback
http://127.0.0.1:5000/handle_trainingpeaks_authorization
```

## ⚠️ Important OAuth Rules

1. **Authorization codes expire after ~10 minutes** - You must use the code immediately
2. **Each code can only be used ONCE** - After exchange, the code is invalid
3. **Redirect URIs must match EXACTLY** - Must be registered with TrainingPeaks
4. **Cannot mix Coach and Athlete scopes** - Must choose one mode

## 🧪 Testing Steps

### COACH MODE Testing

1. **Start the OAuth flow:**
   ```bash
   # Open in browser or curl:
   curl -I http://localhost:3000/auth/trainingpeaks/coach
   ```

2. **Copy the Location header URL** and open it in a browser

3. **Authorize on TrainingPeaks** - You'll be redirected back with a code

4. **The callback will automatically exchange the code** for tokens

5. **Check the logs** for debugging:
   ```bash
   pm2 logs angela-coach --nostream
   ```

### ATHLETE MODE Testing

1. **Start the OAuth flow:**
   ```bash
   curl -I http://localhost:3000/auth/trainingpeaks/athlete
   ```

2. **Follow the same steps** as Coach mode above

## 📊 Debugging OAuth Issues

### Check Environment Variables

```bash
cd /home/user/webapp && cat .dev.vars
```

Should show:
```
TP_CLIENT_ID=qt2systems
TP_CLIENT_SECRET=ycU0yO4koSq6y8fbQx4iHsRwrAWJ8kSCG1nwJvXkEQ
TP_REDIRECT_URI_COACH=http://localhost:3000/auth/trainingpeaks/coach/callback
TP_REDIRECT_URI_ATHLETE=http://localhost:3000/auth/trainingpeaks/athlete/callback
```

### Check Logs for Detailed Error Messages

```bash
pm2 logs angela-coach --lines 50
```

Look for:
- `🔄 [OAUTH] Exchanging code for tokens...`
- `Token response status: 200`
- `✅ [OAUTH] Got access token`
- OR `❌ [OAUTH] Error: ...`

### Common Errors

#### "Unexpected end of JSON input"
- **Cause**: Authorization code expired or invalid
- **Fix**: Start fresh OAuth flow, use code immediately

#### "No access token in response"
- **Cause**: Token exchange failed
- **Fix**: Check client_secret, redirect_uri match exactly

#### "Failed to parse token response"
- **Cause**: TrainingPeaks returned HTML error page instead of JSON
- **Fix**: Check redirect URI is registered, code is valid

#### "Requesting access to both coach and athletes accounts is not allowed"
- **Cause**: Mixed scopes in one request
- **Fix**: Use separate /coach or /athlete endpoints

## ✅ Success Indicators

When OAuth works correctly, you'll see:

1. **In browser**: Success page with "Connected as Coach" or athlete name
2. **In logs**: 
   ```
   🔄 [OAUTH] Exchanging code for tokens...
   Token response status: 200
   ✅ [OAUTH] Got access token
   ```
3. **In database**: Token stored in `users` table

## 🔍 Verify Token Storage

```bash
cd /home/user/webapp && npx wrangler d1 execute angela-db --local --command="SELECT tp_athlete_id, email, account_type, created_at FROM users"
```

## 📝 Step-by-Step Fresh Test

1. **Stop and restart the service:**
   ```bash
   cd /home/user/webapp
   pm2 delete angela-coach
   pm2 start ecosystem.config.cjs
   ```

2. **Open in browser (COACH MODE):**
   ```
   http://localhost:3000/auth/trainingpeaks/coach
   ```

3. **Authorize on TrainingPeaks** - Complete the authorization

4. **You'll be redirected back** to `/auth/trainingpeaks/coach/callback?code=...`

5. **Check for success page** - Should say "Connected as Coach"

6. **If error, check logs:**
   ```bash
   pm2 logs angela-coach --nostream
   ```

## 🚀 Next Steps After Successful OAuth

Once you see the success page, you can:

1. **Check stored tokens:**
   ```bash
   npm run db:console:local
   SELECT * FROM users;
   ```

2. **Test the TrainingPeaks API:**
   ```bash
   curl -X POST http://localhost:3000/api/angela/analyze \
     -H "Content-Type: application/json" \
     -d '{"athlete_id": "your_athlete_id"}'
   ```

3. **Deploy to production** (see DEPLOYMENT.md)

## 📞 Support

If OAuth continues to fail:

1. Double-check redirect URIs are registered with TrainingPeaks
2. Verify client_id and client_secret are correct
3. Check TrainingPeaks Partner API status page
4. Contact QT2 Systems if needed

## 🔗 Useful Links

- TrainingPeaks Partner API Docs: https://github.com/TrainingPeaks/PartnersAPI/wiki
- OAuth 2.0 Spec: https://oauth.net/2/
- Current redirect URIs in use:
  - Coach: `http://localhost:3000/auth/trainingpeaks/coach/callback`
  - Athlete: `http://localhost:3000/auth/trainingpeaks/athlete/callback`
