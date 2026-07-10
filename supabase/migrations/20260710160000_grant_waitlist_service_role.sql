-- New Supabase projects do not expose new tables to Data API roles without
-- explicit grants (auto_expose_new_tables is off by default). The Edge
-- Function writes through PostgREST as service_role, so it needs insert plus
-- select for the return=representation duplicate detection. anon and
-- authenticated stay fully revoked; service_role bypasses RLS by design.
grant usage on schema public to service_role;
grant insert, select on table public.waitlist to service_role;
