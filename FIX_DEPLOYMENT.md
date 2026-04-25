# How to Fix the "Hello World" Deployment

## The Problem:
Your GitHub repo is connected to Cloudflare, but it's deploying as a **Worker** (showing "Hello World") instead of deploying your full **Pages** application.

## Solution:

### Option 1: Convert to Cloudflare Pages (RECOMMENDED)

1. **Delete the current Worker deployment:**
   - In Cloudflare Dashboard, click on **angela-coach**
   - Go to **Settings** (bottom of left sidebar)
   - Scroll to bottom → **Delete Worker**
   - Confirm deletion

2. **Create a NEW Cloudflare Pages project:**
   - Go back to **Workers & Pages**
   - Click **Create application** → **Pages** → **Connect to Git**
   - Select your **angelanaeth/angela-coach** repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (leave empty)
   - Click **Save and Deploy**

3. **Add bindings after deployment:**
   - Go to Settings → Functions → Bindings
   - Add D1 binding: Variable name `DB`, select `angela-db-production`
   - Add environment variables (same as before)

### Option 2: Redeploy from GitHub (Quick Fix)

The issue might be that Cloudflare is looking at the wrong file or branch. Try this:

1. In Cloudflare, click **angela-coach**
2. Go to **Settings** → **Builds & deployments**
3. Check:
   - **Production branch**: Should be `main`
   - **Build command**: Should be `npm run build`
   - **Build output**: Should be `dist`
4. Go to **Deployments** tab
5. Click **Retry deployment** on the latest one

### Why This Happened:

Cloudflare might have deployed a simple Worker template instead of recognizing your Hono/Pages app. This happens when:
- The deployment configuration isn't set correctly
- The `dist/_worker.js` isn't being found
- The build output structure doesn't match what Cloudflare expects

