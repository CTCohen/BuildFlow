-- 0003: row-level security and grants (System 11 section 4; contract "Access model")

-- who is the caller? Supabase: auth.uid(). Local tests provide a shim auth.uid() (see tests/00_local_auth_shim.sql).
create or replace function app.current_customer_id() returns uuid
language sql stable security definer set search_path = app, pg_temp as $$
  select cu.customer_id from app.customer_users cu where cu.user_id = auth.uid() limit 1
$$;
revoke all on function app.current_customer_id() from public;
grant execute on function app.current_customer_id() to authenticated, service_role, bf_admin;

-- ---- default deny: strip everything, then grant narrowly ----
revoke all on all tables in schema app from anon, authenticated;
revoke all on all tables in schema admin from anon, authenticated, public;

-- ---- customers: select only, own rows ----
alter table app.customers enable row level security;
alter table app.customer_users enable row level security;
alter table app.websites enable row level security;
alter table app.form_submissions enable row level security;
alter table app.reviews enable row level security;
alter table app.crm_integrations enable row level security;
alter table app.subscriptions enable row level security;
alter table app.crm_sync_log enable row level security;
alter table app.crm_conflict_log enable row level security;
-- force RLS even for the table owner so a misconfigured owner connection cannot leak
alter table app.customers force row level security;
alter table app.customer_users force row level security;
alter table app.websites force row level security;
alter table app.form_submissions force row level security;
alter table app.reviews force row level security;
alter table app.crm_integrations force row level security;
alter table app.subscriptions force row level security;
alter table app.crm_sync_log force row level security;
alter table app.crm_conflict_log force row level security;

create policy own_row on app.customers for select to authenticated
  using (id = app.current_customer_id() and deleted_at is null);
create policy own_rows on app.customer_users for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.websites for select to authenticated using (customer_id = app.current_customer_id() and deleted_at is null);
create policy own_rows on app.form_submissions for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.reviews for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.crm_integrations for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.subscriptions for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.crm_sync_log for select to authenticated using (customer_id = app.current_customer_id());
create policy own_rows on app.crm_conflict_log for select to authenticated using (customer_id = app.current_customer_id());

-- Tyler: reads every customer row. service_role has BYPASSRLS.
create policy admin_read on app.customers for select to bf_admin using (true);
create policy admin_read on app.customer_users for select to bf_admin using (true);
create policy admin_read on app.websites for select to bf_admin using (true);
create policy admin_read on app.form_submissions for select to bf_admin using (true);
create policy admin_read on app.reviews for select to bf_admin using (true);
create policy admin_read on app.crm_integrations for select to bf_admin using (true);
create policy admin_read on app.subscriptions for select to bf_admin using (true);
create policy admin_read on app.crm_sync_log for select to bf_admin using (true);
create policy admin_read on app.crm_conflict_log for select to bf_admin using (true);

-- column-level grants for customers: no token, no Stripe ids
grant select on app.customers to authenticated;
grant select on app.customer_users to authenticated;
grant select on app.websites to authenticated;
grant select on app.form_submissions to authenticated;
grant select on app.reviews to authenticated;
grant select (id, customer_id, crm_type, sync_status, last_sync_at, leads_sent, sync_errors_count, created_at, updated_at)
  on app.crm_integrations to authenticated;                      -- NOT auth_token_encrypted
grant select (id, customer_id, tier, billing_cycle, monthly_price_cents, next_billing_date, payment_status, canceled_at)
  on app.subscriptions to authenticated;                         -- billing summary only
grant select on app.crm_sync_log to authenticated;
grant select on app.crm_conflict_log to authenticated;

-- backend and Tyler
grant select, insert, update, delete on all tables in schema app to service_role;
grant select on all tables in schema app to bf_admin;
grant execute on all functions in schema app to service_role, bf_admin;

-- ---- admin schema: Tyler and the backend only ----
alter table admin.admins enable row level security;
alter table admin.customer_admin enable row level security;
alter table admin.lead_warehouse enable row level security;
alter table admin.leads enable row level security;
alter table admin.prospects enable row level security;
alter table admin.demos enable row level security;
alter table admin.agent_runs enable row level security;
alter table admin.outbound_campaign_runs enable row level security;
alter table admin.payment_transactions enable row level security;
alter table admin.events enable row level security;
alter table admin.health_check_log enable row level security;
alter table admin.business_metrics_log enable row level security;
alter table admin.alerts enable row level security;

do $$ declare t text; begin
  for t in select tablename from pg_tables where schemaname = 'admin' loop
    execute format('create policy admin_all on admin.%I for all to bf_admin using (true) with check (true)', t);
  end loop;
end $$;

grant select, insert, update, delete on all tables in schema admin to bf_admin, service_role;
grant usage on all sequences in schema admin to bf_admin, service_role;
alter default privileges in schema admin grant select, insert, update, delete on tables to bf_admin, service_role;
alter default privileges in schema admin grant usage on sequences to bf_admin, service_role;
