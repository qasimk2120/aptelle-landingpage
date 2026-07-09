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
