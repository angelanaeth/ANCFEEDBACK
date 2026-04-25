# 🚨 OAUTH NOT WORKING - HERE'S WHY

## The Problem

Your URL: `http://localhost:3000/auth/trainingpeaks/coach/callback?code=3uX2%21IAAA...`

**THIS CODE HAS EXPIRED!** ⏰

OAuth authorization codes:
- ✅ Valid for: ~10 minutes after authorization
- ❌ Can only be used: ONCE
- ⚠️ Your code is: TOO OLD (has been sitting in browser history)

## The Solution - 3 Easy Steps

### Step 1: Open This URL (Fresh Start)

```
http://localhost:3000/auth/trainingpeaks/coach
```

This will redirect you to TrainingPeaks authorization page.

### Step 2: Authorize on TrainingPeaks

- Click "Authorize" on the TrainingPeaks page
- You'll be redirected back AUTOMATICALLY
- The code will be exchanged for tokens IMMEDIATELY

### Step 3: Check Success

You should see a success page that says:

```
✅ Authorization Successful

Connected as: Coach
You can now manage all athletes in your coaching account
```

## ⚠️ IMPORTANT REDIRECT URI REGISTRATION

**Before testing**, verify these redirect URIs are registered in your TrainingPeaks Partner API settings:

```
http://localhost:3000/auth/trainingpeaks/coach/callback
http://localhost:3000/auth/trainingpeaks/athlete/callback
```

If not registered, the OAuth flow will fail!

## Testing Both Modes

### Coach Mode (Manage Athletes)
```
http://localhost:3000/auth/trainingpeaks/coach
```

Scopes:
- coach:athletes
- coach:attach-athletes  
- coach:create-athletes
- workouts:plan
- events:write

### Athlete Mode (Personal Data)
```
http://localhost:3000/auth/trainingpeaks/athlete
```

Scopes:
- athlete:profile
- workouts:read
- metrics:read
- events:read

## Debugging if Still Fails

### Check Logs
```bash
pm2 logs angela-coach --lines 20
```

Look for:
- `🔄 [OAUTH] Exchanging code for tokens...`
- `Token response status: 200`
- `✅ [OAUTH] Got access token`

### Common Issues

1. **"Unexpected end of JSON input"**
   - Code expired - start fresh

2. **"No access token in response"**
   - Redirect URI not registered
   - Client secret wrong

3. **"Cannot mix coach and athlete"**
   - Use separate endpoints
   - Don't request both scope types

## Quick Test Commands

```bash
# Test Coach OAuth redirect
curl -I http://localhost:3000/auth/trainingpeaks/coach

# Test Athlete OAuth redirect  
curl -I http://localhost:3000/auth/trainingpeaks/athlete

# Check service is running
curl http://localhost:3000

# View logs
pm2 logs angela-coach --nostream
```

## 🎯 ACTION REQUIRED

**DO THIS NOW:**

1. Copy this URL: `http://localhost:3000/auth/trainingpeaks/coach`
2. Paste in browser
3. Authorize on TrainingPeaks
4. Wait for automatic redirect
5. Should see success page!

**DO NOT** reuse old codes from browser history!

## Still Having Issues?

If you continue to see errors after following the steps above:

1. Check `/home/user/webapp/OAUTH_TESTING.md` for detailed debugging
2. Verify redirect URIs are registered with TrainingPeaks
3. Check `.dev.vars` has correct credentials
4. Review PM2 logs for exact error messages

## What Changed?

✅ Fixed:
- Separate Coach and Athlete OAuth flows
- Detailed error logging
- Better error messages
- Separate redirect URIs

✅ Environment Variables:
- `TP_REDIRECT_URI_COACH` - Coach callback URL
- `TP_REDIRECT_URI_ATHLETE` - Athlete callback URL

✅ Endpoints:
- `/auth/trainingpeaks/coach` - Coach OAuth start
- `/auth/trainingpeaks/coach/callback` - Coach callback
- `/auth/trainingpeaks/athlete` - Athlete OAuth start
- `/auth/trainingpeaks/athlete/callback` - Athlete callback
