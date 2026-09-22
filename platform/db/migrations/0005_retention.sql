-- 0005: data retention/deletion workflows (System 11 section 1 + BUILD_TASKS.md §8).
-- Numbers are exactly what legal/SPEC-11-compliance-security.md states (verified against the file, not assumed):
--   cancelled customer -> 90 days then delete; unconverted lead -> 12 months then delete/anonymize;
--   crm_sync_log 90 days; crm_conflict_log 30 days (both already listed in platform/CONTRACT.md's entity map,
--   not previously implemented anywhere); deletion-on-request -> fulfilled within 45 days.
-- Two workflows, same shape as 0004_monitoring.sql: decisions live here in SQL (testable with psql); the
-- scheduled-job runner and the request/fulfill calls live in platform/retention/retention.mjs.
--
-- Open questions this migration does NOT resolve by guessing (logged to operations/TYLER_QUEUE.md instead):
--   - "cancelled" is read here as app.customers.churn_date (not app.subscriptions.canceled_at) — the contract
--     has both and the spec doesn't say which is authoritative.
--   - unconverted-lead retention: spec says "delete/anonymize" (either); this implementation anonymizes
--     (keeps the row, nulls PII) rather than hard-deleting, because anonymized rows still feed lead-scoring
--     analytics and hard delete is irreversible.
--   - a customer with payment history cannot be hard-deleted (admin.payment_transactions FK-restricts them,
--     and financial records need their own retention the spec never states) — this implementation anonymizes
--     the customer row and deletes their other data instead of hard-deleting, and flags that on the row.

create table admin.deletion_requests (
  id uuid primary key default gen_random_uuid(),
  subject_type text not null check (subject_type in ('customer','lead')),
  subject_id uuid not null,
  source text not null default 'subject' check (source in ('subject','admin','retention-schedule')),
  status text not null default 'pending' check (status in ('pending','fulfilled','failed')),
  requested_at timestamptz not null default now(),
  due_at timestamptz not null,                  -- requested_at + 45 days (CCPA fulfillment window)
  fulfilled_at timestamptz,
  method text,                                   -- 'hard_deleted' | 'anonymized_kept_financial_records' | 'anonymized' | 'scheduled-retention-purge'
  notes text,
  created_at timestamptz not null default now()
);
create index on admin.deletion_requests (status, due_at);
create index on admin.deletion_requests (subject_type, subject_id);

alter table admin.deletion_requests enable row level security;
alter table admin.deletion_requests force row level security;
create policy admin_all on admin.deletion_requests for all to bf_admin using (true) with check (true);
grant select, insert, update, delete on admin.deletion_requests to bf_admin, service_role;

-- Log a deletion request (from a customer/lead directly, or raised by an admin). Fulfillment window is fixed
-- at 45 days per legal/SPEC-11-compliance-security.md section 1 ("deletes on request (45 days)").
create or replace function admin.request_deletion(
  p_subject_type text, p_subject_id uuid, p_source text default 'subject', p_now timestamptz default now()
) returns uuid language sql as $$
  insert into admin.deletion_requests (subject_type, subject_id, source, requested_at, due_at)
  values (p_subject_type, p_subject_id, p_source, p_now, p_now + interval '45 days')
  returning id
$$;

-- Hard-delete a customer and everything FK-cascades from them (websites, form_submissions, reviews,
-- crm_integrations, subscriptions, crm_sync_log, crm_conflict_log, customer_users, admin.customer_admin —
-- see platform/CONTRACT.md `on delete cascade`). If they have payment history, admin.payment_transactions'
-- plain FK blocks the hard delete (by design — see open question above): fall back to anonymizing the
-- customer row and deleting everything else instead.
create or replace function admin.purge_customer(p_customer_id uuid, p_now timestamptz default now())
returns jsonb language plpgsql as $$
declare v_method text; v_had_payments boolean;
begin
  select exists(select 1 from admin.payment_transactions where customer_id = p_customer_id) into v_had_payments;

  if v_had_payments then
    update app.customers
       set name = 'deleted-customer', email = p_customer_id::text || '@deleted.invalid', domain = null,
           deleted_at = coalesce(deleted_at, p_now)
     where id = p_customer_id;
    delete from app.websites where customer_id = p_customer_id;
    delete from app.form_submissions where customer_id = p_customer_id;
    delete from app.reviews where customer_id = p_customer_id;
    delete from app.crm_integrations where customer_id = p_customer_id;
    delete from app.subscriptions where customer_id = p_customer_id;
    delete from app.crm_sync_log where customer_id = p_customer_id;
    delete from app.crm_conflict_log where customer_id = p_customer_id;
    delete from app.customer_users where customer_id = p_customer_id;
    delete from admin.customer_admin where customer_id = p_customer_id;
    v_method := 'anonymized_kept_financial_records';
  else
    delete from app.customers where id = p_customer_id;
    v_method := 'hard_deleted';
  end if;

  return jsonb_build_object('customer_id', p_customer_id, 'method', v_method);
end $$;

-- Null every PII field on a lead, keep the row (score, status, vertical, timestamps survive for pipeline
-- analytics). This is the "anonymize" half of the spec's "delete/anonymize" — see open question above.
create or replace function admin.anonymize_lead(p_lead_id uuid, p_now timestamptz default now())
returns jsonb language plpgsql as $$
begin
  update admin.leads
     set name = null, email = null, phone = null, company = null, title = null,
         location = null, website_url = null, intent_signals = '[]'::jsonb,
         deleted_at = p_now
   where id = p_lead_id;
  return jsonb_build_object('lead_id', p_lead_id, 'method', 'anonymized');
end $$;

-- Fulfill one deletion request: dispatch to the right purge routine, stamp it, and record whether the
-- 45-day SLA was met. Idempotent — calling twice on an already-fulfilled request is a no-op, not an error.
create or replace function admin.fulfill_deletion_request(p_id uuid, p_now timestamptz default now())
returns jsonb language plpgsql as $$
declare r admin.deletion_requests%rowtype; v_result jsonb;
begin
  select * into r from admin.deletion_requests where id = p_id for update;
  if not found then raise exception 'no such deletion request %', p_id; end if;
  if r.status = 'fulfilled' then
    return jsonb_build_object('request_id', r.id, 'status', 'already_fulfilled');
  end if;

  if r.subject_type = 'customer' then
    v_result := admin.purge_customer(r.subject_id, p_now);
  else
    v_result := admin.anonymize_lead(r.subject_id, p_now);
  end if;

  update admin.deletion_requests
     set status = 'fulfilled', fulfilled_at = p_now, method = v_result->>'method'
   where id = p_id;

  return v_result || jsonb_build_object('request_id', r.id, 'sla_met', p_now <= r.due_at);
end $$;

-- Pending requests already past their 45-day due_at — for the alert dispatcher (System 13) to raise on.
create or replace function admin.overdue_deletion_requests(p_now timestamptz default now())
returns table (id uuid, subject_type text, subject_id uuid, due_at timestamptz)
language sql as $$
  select id, subject_type, subject_id, due_at
    from admin.deletion_requests
   where status = 'pending' and due_at < p_now
   order by due_at
$$;

-- Scheduled job core (run nightly by platform/retention/retention.mjs): purge/anonymize everything past its
-- stated retention window. Returns counts so the caller can log a real number, not just "it ran".
create or replace function admin.purge_expired_data(p_now timestamptz default now())
returns jsonb language plpgsql as $$
declare v_customers int := 0; v_leads int := 0; v_sync_log int; v_conflict_log int; c record;
begin
  for c in
    select id from app.customers
     where deleted_at is null and churn_date is not null and churn_date < p_now - interval '90 days'
  loop
    perform admin.purge_customer(c.id, p_now);
    insert into admin.deletion_requests (subject_type, subject_id, source, status, requested_at, due_at, fulfilled_at, method)
    values ('customer', c.id, 'retention-schedule', 'fulfilled', p_now, p_now, p_now, 'scheduled-retention-purge');
    v_customers := v_customers + 1;
  end loop;

  for c in
    select id from admin.leads
     where deleted_at is null
       and status <> 'converted'
       and coalesce(last_contacted_at, updated_at, created_at) < p_now - interval '12 months'
  loop
    perform admin.anonymize_lead(c.id, p_now);
    v_leads := v_leads + 1;
  end loop;

  with d as (delete from app.crm_sync_log where created_at < p_now - interval '90 days' returning 1)
    select count(*) into v_sync_log from d;
  with d as (delete from app.crm_conflict_log where created_at < p_now - interval '30 days' returning 1)
    select count(*) into v_conflict_log from d;

  return jsonb_build_object('customers_purged', v_customers, 'leads_anonymized', v_leads,
                             'crm_sync_log_deleted', v_sync_log, 'crm_conflict_log_deleted', v_conflict_log);
end $$;

revoke all on function admin.request_deletion(text, uuid, text, timestamptz) from public;
revoke all on function admin.purge_customer(uuid, timestamptz) from public;
revoke all on function admin.anonymize_lead(uuid, timestamptz) from public;
revoke all on function admin.fulfill_deletion_request(uuid, timestamptz) from public;
revoke all on function admin.overdue_deletion_requests(timestamptz) from public;
revoke all on function admin.purge_expired_data(timestamptz) from public;
grant execute on function admin.request_deletion(text, uuid, text, timestamptz) to service_role, bf_admin;
grant execute on function admin.purge_customer(uuid, timestamptz) to service_role, bf_admin;
grant execute on function admin.anonymize_lead(uuid, timestamptz) to service_role, bf_admin;
grant execute on function admin.fulfill_deletion_request(uuid, timestamptz) to service_role, bf_admin;
grant execute on function admin.overdue_deletion_requests(timestamptz) to service_role, bf_admin;
grant execute on function admin.purge_expired_data(timestamptz) to service_role, bf_admin;
