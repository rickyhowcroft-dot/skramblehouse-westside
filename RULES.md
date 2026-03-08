# RULES.md — Skramblehouse West Side

> **Review this file before brainstorming, planning, or implementing anything in this project.**

---

## 🔍 Pre-Work Checklist

Before touching any code:
- [ ] Read this file top to bottom
- [ ] Check that Resend domain verification is still active before touching email flow
- [ ] Confirm `RESEND_API_KEY` and `NOTIFY_EMAIL` are set in Vercel
- [ ] `metadata` exports cannot coexist with `'use client'` — use a separate `layout.tsx` for SEO metadata on client pages

---

## 🐛 Issues Log

### Resolved

| # | Issue | Root Cause | Fix | Commit |
|---|-------|-----------|-----|--------|
| 1 | Resend email not sending | Old restricted key (`re_EWDF2pXL_...`) persisted in Vercel despite claimed update (20h-old timestamp revealed this) | Force-removed and re-added full-access key `re_fcrtAbz1_...` | — |
| 2 | Presale page SEO metadata missing | `metadata` export can't coexist with `'use client'` directive | Created `app/westside/presale/layout.tsx` as server component to hold metadata | — |
| 3 | Multiple email recipients not working | `NOTIFY_EMAIL` was a single string; Resend `to` expects an array | `lib/email.ts` splits on comma, trims, filters empty | — |
| 4 | Resend `new Resend(key)` at module level caused crashes | Module-level init ran before env vars were available | Moved `new Resend(key)` inside the function body | — |
| 5 | `skramblehouse.com` homepage not routing correctly | DNS/alias not configured on Vercel | Set ALIAS to `cname.vercel-dns.com.`; Resend DNS records added via Vercel Management API | — |

---

## 🔒 Security Rules

1. **`RESEND_API_KEY` is server-side only** — never in client code or git.
2. **`NOTIFY_EMAIL` is server-side only** — contains operator email addresses.
3. **Supabase `presale_signups` table has RLS enabled with no public policies** — reads require service role key. Never expose service role key client-side.
4. **Presale code validation is server-side** — do not validate presale codes in client JS.
5. **No user passwords or payment data** — this is a pre-sale signup only. Keep scope minimal.

---

## ⚠️ Known Gotchas

- **Resend key verification**: after updating `RESEND_API_KEY` in Vercel, always verify the new key is live by checking `vercel env ls` timestamp. The old key can persist if the update silently fails.
- **`NOTIFY_EMAIL` is comma-separated**: `lib/email.ts` splits on `,` — to add recipients, append `existing@email.com,new@email.com` with no spaces around the comma (trim handles it).
- **`metadata` + `'use client'` don't mix** — any page using client hooks needs a sibling `layout.tsx` for its SEO metadata.
- **Vercel project ID**: `prj_b6rihMUdQ8VAamcwmHfJsriMpdA0`
- **Supabase project**: shared `fnxyorriiytdskxpedir` — migrate `presale_signups` to a dedicated Skramblehouse project if needed long-term.
- **DNS on Vercel nameservers**: all DNS (including Resend DKIM/MX/SPF) managed via Vercel. Don't change nameservers.
- **Hero images**: `public/storefront.jpg` (homepage), `public/hero.jpg` (presale page). Replace via Vercel deployment only.

---

## 🏗️ Architecture Reminders

- **Stack**: Next.js 16 on Vercel + Supabase (shared project) + Resend for email
- **Deploy**: push `main` → GitHub Actions → `vercel deploy --prod`
- **Repo**: `rickyhowcroft-dot/skramblehouse-westside`, `main` branch
- **Live URLs**: `skramblehouse.com` (homepage), `skramblehouse.com/westside/presale` (presale form)
- **Email**: `noreply@skramblehouse.com` via Resend; notifies `Theskramblehouseofgolfroc@gmail.com` + `rickyhowcroft@gmail.com`
- **Presale signups**: stored in `presale_signups` table; 10 signups as of 3/5-6/2026
