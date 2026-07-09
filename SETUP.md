# Aptelle waitlist setup

The landing page stores waitlist emails in Supabase. The browser uses the public Supabase anon key to insert into a locked `waitlist` table. No Firebase project, Blaze plan, Cloud Function, or Firebase secrets are needed.

## 1. Create the Supabase project

1. Go to `supabase.com`, create a project for Aptelle.
2. Open Project Settings, API.
3. Copy:
   - Project URL
   - anon public key

## 2. Create the waitlist table

In Supabase, open SQL Editor and run:

```sql
-- See supabase/waitlist.sql for the source-owned copy.
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  lang text not null default 'en' check (lang in ('en', 'fr', 'de', 'ar')),
  source text not null default 'landing' check (source = 'landing'),
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_key
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists "allow public waitlist inserts" on public.waitlist;
create policy "allow public waitlist inserts"
  on public.waitlist
  for insert
  to anon
  with check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(email) < 254
    and lang in ('en', 'fr', 'de', 'ar')
    and source = 'landing'
  );
```

There are no public select, update, or delete policies. Visitors can only insert a valid waitlist row.

## 3. GitHub Actions build secrets

The site reads Supabase config at build time. In the GitHub repo, Settings, Secrets and variables, Actions, add:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

Until these exist, the form still confirms to the visitor, but it does not store the email. Once set, sign-ups write to Supabase.

## 4. Local development

```powershell
Set-Location "F:\COGNIELEVATE-PRODUCTS\APTELLE\aptelle-landingpage"
npm install
npm.cmd test
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

For local Supabase testing, create a `.env` with the same two `PUBLIC_SUPABASE_*` values. `.env` is gitignored.

## 5. Email acknowledgement

Automatic acknowledgement email is not wired in this Supabase version. Keep it deferred unless you want it now. The likely path is a Supabase Edge Function using Resend, triggered after insert or called after a successful signup.
