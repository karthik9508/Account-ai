# Google OAuth Setup Guide

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. **Create a Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: `Account AI` (or your app name)
   - Click "Create"

3. **Enable OAuth consent screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Select **External** → Click "Create"
   - Fill in:
     - App name: `Account AI`
     - User support email: Your email
     - Developer contact email: Your email
   - Click "Save and Continue" through all steps

4. **Create OAuth Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Account AI Web Client`
   - Add **Authorized redirect URIs**:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
     (Replace `YOUR_PROJECT_ID` with your Supabase project ID)
   - Click "Create"
   - **Copy the Client ID and Client Secret**

---

## Step 2: Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)

2. Select your project

3. Go to **Authentication** → **Providers**

4. Find **Google** and click to expand

5. Toggle **Enable Sign in with Google** to ON

6. Paste your credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

7. Click **Save**

---

## Step 3: Update .env.local

Add this line to your `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

For production, change to your actual domain:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

---

## Step 4: Test

1. Start your app: `npm run dev`
2. Go to `/login` or `/signup`
3. Click **"Continue with Google"**
4. You should be redirected to Google, then back to your dashboard

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Redirect mismatch | Ensure redirect URI in Google Console matches Supabase callback URL exactly |
| 400 Bad Request | Check Client ID/Secret are copied correctly |
| Popup blocked | Allow popups for your site |

---

## Finding Your Supabase Callback URL

Your callback URL format is:
```
https://[PROJECT_ID].supabase.co/auth/v1/callback
```

Find your Project ID in Supabase Dashboard → Settings → General
