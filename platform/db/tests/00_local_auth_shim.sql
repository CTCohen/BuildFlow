-- Local stand-in for Supabase's auth schema (never a migration; Supabase provides the real one).
create schema if not exists auth;
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role, bf_admin;
grant execute on function auth.uid() to anon, authenticated, service_role, bf_admin;
