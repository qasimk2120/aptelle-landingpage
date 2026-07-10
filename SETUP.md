# Aptelle waitlist setup

The landing page stores waitlist emails in Supabase. The browser cannot touch the table at all: every signup goes through the `waitlist-signup` Edge Function, which verifies a Cloudflare Turnstile token server-side, validates the email, ignores duplicates and returns the same generic response either way. The Turnstile secret lives in Supabase secrets and never reaches the repo or the browser.

## 1. Create and link the Supabase project

Create the Aptelle project in the [Supabase dashboard](https://supabase.com/dashboard), then from the landing-page repository run:

```powershell
Set-Location "F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage"
npx supabase login
npx supabase projects list
npx supabase link --project-ref <your-project-ref>
```

`npx supabase` works even when the downloaded CLI executable is not added to your `PATH`. If you later add it to `PATH`, `supabase ...` is equivalent.

## 2. Apply the database migration

The repository owns the schema in [supabase/migrations/20260710104246_create_waitlist.sql](supabase/migrations/20260710104246_create_waitlist.sql). Push it to the linked project:

```powershell
npx supabase db push
```

The migration creates `public.waitlist` with a case-insensitive unique email index, server-owned timestamp, strict language/source checks, and row-level security. All direct table access is revoked from `anon` and `authenticated`; only the Edge Function (service role) can write.

## 3. Set up Cloudflare Turnstile

Create a Turnstile widget in the [Cloudflare dashboard](https://dash.cloudflare.com/) under **Turnstile > Add widget**:

- Domain: `aptelle.com` (add `localhost` for local testing)
- Widget mode: Managed

This gives a **site key** (public, goes in `.env` and GitHub secrets) and a **secret key** (server only). Store the secret in Supabase:

```powershell
npx supabase secrets set TURNSTILE_SECRET=<your-turnstile-secret>
```

The function fails closed: without `TURNSTILE_SECRET` it rejects all signups. For local dev without Turnstile, set `ALLOW_UNVERIFIED_SIGNUPS=true` in the local function env only, never in production.

## 4. Deploy the Edge Function

```powershell
npx supabase functions deploy waitlist-signup
```

`verify_jwt` is already `false` in `supabase/config.toml`, so the public form can call it. Quick check (expects `{"ok":false}` with 400 because the token is missing):

```powershell
curl -i -X POST "https://<your-project-ref>.supabase.co/functions/v1/waitlist-signup" -H "Content-Type: application/json" -d '{"email":"probe@example.com","lang":"en","token":""}'
```

## 5. Configure the site

Copy `.env.example` to `.env` and fill the values:

```powershell
Copy-Item .env.example .env
```

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_TURNSTILE_SITE_KEY`

For GitHub Pages, add the same three names under **GitHub repository > Settings > Secrets and variables > Actions**. Until those build secrets exist, the form still confirms to the visitor but does not store the email.

## 6. Verify locally

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

## 7. Email acknowledgement (Resend)

The `waitlist-signup` function sends one localized acknowledgement from `hello@aptelle.com` to each NEW signup. Duplicates never trigger email, so resubmitting an address cannot spam an inbox. Sending is skipped entirely until `RESEND_API_KEY` exists, and a Resend failure never blocks the signup itself.

Setup, all free tier:

1. Create an account at [resend.com](https://resend.com) and add the domain `aptelle.com` (apex, not a subdomain, so mail comes from hello@aptelle.com). Region does not matter for volume this low.
2. Add the DNS records Resend shows into Cloudflare as **DNS only** (grey cloud). They live on Resend's own subdomains and do not touch the existing MX/SPF used by Cloudflare Email Routing.
3. Wait for the domain to verify in Resend, then create an API key and store it:

```powershell
npx supabase secrets set RESEND_API_KEY=<your-resend-api-key>
npx supabase functions deploy waitlist-signup --use-api
```

No mailbox is needed for sending. For replies to hello@aptelle.com, use Cloudflare Email Routing (free) to forward that address to a personal inbox.
