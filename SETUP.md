# Aptelle waitlist setup

The landing page stores waitlist emails in Supabase. The browser has a public key that can only insert valid waitlist rows; it cannot read, change, or delete the list. No Firebase project, Blaze plan, Cloud Function, or Firebase secrets are needed.

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

The migration creates `public.waitlist` with a case-insensitive unique email index, server-owned timestamp, strict language/source checks, and row-level security. The anonymous web client receives `INSERT` only. There are no public select, update, or delete privileges or policies.

## 3. Configure the site

Copy `.env.example` to `.env` and fill the two public API values from **Project Settings > API**:

```powershell
Copy-Item .env.example .env
```

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

For GitHub Pages, add the same names under **GitHub repository > Settings > Secrets and variables > Actions**. Until those build secrets exist, the form still confirms to the visitor but does not store the email.

## 4. Verify locally

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

## 5. Email acknowledgement

Automatic acknowledgement email remains deferred. The likely future path is a Supabase Edge Function using Resend, invoked after a successful signup.
