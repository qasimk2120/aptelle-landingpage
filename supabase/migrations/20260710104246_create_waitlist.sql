create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (
    email = lower(btrim(email))
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and length(email) < 254
  ),
  lang text not null default 'en' check (lang in ('en', 'fr', 'de', 'ar')),
  source text not null default 'landing' check (source = 'landing'),
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

revoke all on table public.waitlist from anon, authenticated;
