# Deploy Stirling Ridge Walk App to Vercel

Follow these steps to publish your Stirling Ridge Walk hiking guide app on Vercel (free hosting).

---

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push to GitHub

Your code is already pushed to GitHub. Make sure the PR is merged or deploy directly from your branch.

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** (or Log in) and choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New** → **Project**
5. Find your repository and click **Import**
6. Leave all settings as default:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `.`
   - Build Command: `npm run build`
7. Click **Deploy**
8. Wait 1–2 minutes for the build to finish

### Step 3: Your app is live!

When deployment completes, you'll see:
- **Your live URL:** `https://your-project-xxxxx.vercel.app`
- Anyone can open this URL from any device to use your hiking guide

---

## Option 2: Deploy via CLI (requires Vercel account)

If you have a Vercel account and token:

```bash
# Install Vercel CLI globally (if not installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## What's Included in the App

- **Home Page**: Trail overview, warnings, and quick facts
- **Trail Info**: Comprehensive guide with directions, peaks, and safety info
- **Itinerary**: Day-by-day breakdown (2-day and 3-day options)
- **Interactive Map**: Topographic map with peaks, campsites, and route
- **Gear Checklist**: Interactive checklist with progress tracking

---

## Troubleshooting

### Build fails?

Run locally to check for errors:
```bash
npm run build
```

### 404 error after deployment?

1. Go to Vercel Dashboard → Your Project → Settings
2. Check **Root Directory** is set to `.` or empty
3. Check **Framework Preset** is set to Next.js

### Need to update the app?

1. Make changes locally
2. Run:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel will automatically redeploy

---

## Custom Domain (Optional)

To use your own domain:

1. In Vercel, open your project
2. Go to **Settings** → **Domains**
3. Add your domain and follow the DNS instructions

---

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with OpenTopoMap
- **Hosting**: Vercel (recommended)
