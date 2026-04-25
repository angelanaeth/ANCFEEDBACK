# Deployment Debugging

## Current Situation:
- URL: https://angela-coach.angelanaeth16.workers.dev/
- Shows: "Hello World"
- Build succeeds, but wrong code is deployed

## The Problem:
The `.workers.dev` subdomain suggests this is a **Cloudflare Worker**, NOT a **Cloudflare Pages** project.

Workers and Pages are DIFFERENT deployment types in Cloudflare:
- **Workers**: Single JavaScript file, uses wrangler.toml/wrangler.jsonc
- **Pages**: Full-stack apps, uses dist/ folder with _worker.js

Your project is structured for **Pages**, but deployed as a **Worker**.

## The Solution:

You need to **DELETE the Worker** and create a **NEW Pages project**.

### Step-by-Step Fix:

1. **Go to Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Click **Workers & Pages** in left sidebar
3. Click on **angela-coach**
4. Look at the left sidebar - do you see:
   - "Quick edit" = It's a Worker (WRONG)
   - "Deployments" = It's Pages (CORRECT)

If you see "Quick edit", then it's a Worker and needs to be deleted.

### To Delete Worker and Create Pages:

1. In **angela-coach** Worker, go to **Settings** (bottom of left sidebar)
2. Scroll to very bottom
3. Click **Delete Worker**
4. Confirm deletion

5. Go back to **Workers & Pages** main page
6. Click **Create application**
7. Choose **Pages** tab
8. Click **Connect to Git**
9. Select **angelanaeth/angela-coach** repository
10. Configure:
    - Framework preset: None (or Hono if available)
    - Build command: `npm run build`
    - Build output directory: `dist`
11. Click **Save and Deploy**

This will create a NEW URL like:
- `https://angela-coach.pages.dev`
- `https://[hash].angela-coach.pages.dev`

## Why This Happened:

When you first deployed, Cloudflare might have created a Worker instead of a Pages project because:
- The repository structure wasn't recognized as Pages
- The deployment was done via `wrangler deploy` (Worker command) instead of `wrangler pages deploy`
- The project name matched an existing Worker

## After Creating Pages Project:

Add the D1 binding:
1. Go to new Pages project → Settings → Functions
2. Scroll to **D1 database bindings**
3. Add binding: Variable name `DB`, select `angela-db-production`

Add environment variables:
1. Settings → Environment variables
2. Add all the TP_* variables and secrets

