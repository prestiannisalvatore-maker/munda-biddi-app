# Deploy Munda Biddi App to the Internet

Follow these steps to publish your app on Vercel (free hosting).

---

## Step 1: Create a GitHub account (if you don't have one)

1. Go to [github.com](https://github.com)
2. Click **Sign up**
3. Create your account

---

## Step 2: Create a new repository on GitHub

1. Log in to GitHub
2. Click the **+** icon (top right) → **New repository**
3. Repository name: `munda-biddi-app` (or any name you like)
4. Choose **Public**
5. **Do NOT** check "Add a README" (your project already has files)
6. Click **Create repository**

---

## Step 3: Push your project to GitHub

Open Terminal and run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd "/Users/salvatoreprestianni/fitness app/new-project"

git init
git add .
git commit -m "Initial commit - Munda Biddi Trail app"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/munda-biddi-app.git
git push -u origin main
```

When prompted, enter your GitHub username and password.  
*(For password, use a Personal Access Token if you have 2FA enabled – create one at GitHub → Settings → Developer settings → Personal access tokens)*

---

## Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up** and choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New** → **Project**
5. Find your `munda-biddi-app` repository and click **Import**
6. Leave all settings as default (Framework: Next.js, Root Directory: .)
7. Click **Deploy**
8. Wait 1–2 minutes for the build to finish

---

## Step 5: Your app is live

When deployment completes, you'll see:

- **Your live URL:** `https://munda-biddi-app-xxxxx.vercel.app`  
  (or similar – Vercel shows it on the project page)

- Anyone can open this URL from any computer to use your app.

---

## Optional: Custom domain

To use your own domain (e.g. `mundabiddi.yourname.com`):

1. In Vercel, open your project
2. Go to **Settings** → **Domains**
3. Add your domain and follow the DNS instructions

---

## Troubleshooting

**Build fails?**  
- Check the build logs in Vercel  
- Ensure `npm run build` works locally

**Need to update the app?**  
- Make changes locally, then run:
  ```bash
  git add .
  git commit -m "Your update message"
  git push
  ```
- Vercel will automatically redeploy
