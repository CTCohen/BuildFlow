-- Local stand-in for Supabase's auth schema (never a migration; Supabase provides the real one).
-- Supabase ships these roles; locally they must exist before the grants below (0001 also guards its own creation).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
  if not exists (select 1 from pg_roles where rolname = 'bf_admin') then create role bf_admin nologin; end if;
end $$;
create schema if not exists auth;
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role, bf_admin;
grant execute on function auth.uid() to anon, authenticated, service_role, bf_admin;
