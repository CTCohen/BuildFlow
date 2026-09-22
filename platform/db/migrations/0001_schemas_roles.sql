-- 0001: schemas and roles. Supabase already provides anon, authenticated, service_role and the auth schema;
-- the guarded blocks below make the same migration run on a plain local Postgres.
create extension if not exists pgcrypto;

do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
  if not exists (select 1 from pg_roles where rolname = 'bf_admin') then create role bf_admin nologin; end if;
end $$;

create schema if not exists app;
create schema if not exists admin;

-- customers: app schema only, never admin
grant usage on schema app to authenticated, service_role, bf_admin;
-- admin schema: nobody but the backend and Tyler. anon/authenticated get no usage.
revoke all on schema admin from public, anon, authenticated;
grant usage on schema admin to service_role, bf_admin;
revoke all on schema app from anon;

create or replace function app.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create table if not exists app.schema_migrations (version text primary key, applied_at timestamptz not null default now());
