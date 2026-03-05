# Skramblehouse West Side — Pre-Sale Landing Page

Hero + countdown + 4-field form. Saves signups to Supabase, sends email via Resend.

## Setup

### 1. Supabase table

Run this in your Supabase SQL Editor:

```sql
CREATE TABLE presale_signups (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name   text NOT NULL,
  last_name    text NOT NULL,
  email        text NOT NULL UNIQUE,
  presale_code text,
  created_at   timestamptz DEFAULT now()
);

-- No public SELECT — keep signups private
ALTER TABLE presale_signups ENABLE ROW LEVEL SECURITY;
-- (no policies = table is locked down; only service role key can read/write)
```

### 2. Environment variables

Copy `.env.local.example` → `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NOTIFY_EMAIL` | The email address that receives signup notifications |
| `EMAIL_FROM` | Verified sender in Resend (e.g. `noreply@skramblehouse.com`) |

### 3. Resend domain verification

Add DNS records for `skramblehouse.com` in Resend → Domains.  
Until the domain is verified, use Resend's sandbox: set `EMAIL_FROM=onboarding@resend.dev`  
(only delivers to the account owner's email during sandbox mode).

### 4. Hero image

Drop your image into `public/hero.jpg`.  
Optionally add `public/logo.png` (logo overlaid on hero).

### 5. Deploy

```bash
npm run dev          # local
vercel deploy --prod # manual
```

Or push to `master` → GitHub Actions auto-deploys.

### 6. Vercel GitHub Secrets

```
VERCEL_TOKEN      → vercel.com → Account Settings → Tokens
VERCEL_ORG_ID     → vercel.com → Team Settings → General
VERCEL_PROJECT_ID → vercel.com → Project → Settings → General
```

Set all 5 env vars in Vercel → Project → Settings → Environment Variables (Production).

## Notes

- Form auto-closes once 100 spots are filled
- Duplicate email check prevents double signups
- Email notification is non-blocking (won't fail the form if email fails)
- To serve at `skramblehouse.com/westside`: add a rewrite in your main site or point the subdomain `westside.skramblehouse.com` to this Vercel project
