-- 0002: tables, per platform/CONTRACT.md v1.0.0

-- ================= app schema (customer-visible) =================
create table app.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  domain text,
  tier text not null check (tier in ('micro','smb','mid-market')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  churn_date timestamptz,
  deleted_at timestamptz
);

create table app.customer_users (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  user_id uuid not null unique,               -- Supabase auth.users.id
  role text not null default 'owner' check (role in ('owner')),
  created_at timestamptz not null default now()
);
create index on app.customer_users (customer_id);

create table app.websites (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  domain text,
  subdomain_fallback text,
  client_json jsonb not null check (client_json->>'slug' = slug),
  ssl_certificate_expires_at timestamptz,
  deployed_at timestamptz,
  last_updated_at timestamptz,
  feature_toggles jsonb not null default '{}'::jsonb,
  customer_edit_count int not null default 0,
  last_customer_edit_at timestamptz,
  bundle_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on app.websites (customer_id);

create table app.form_submissions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  website_id uuid not null references app.websites(id) on delete cascade,
  prospect_name text,
  prospect_email text,
  prospect_phone text,
  message text,
  submitted_at timestamptz not null default now(),
  synced_to_crm_at timestamptz,
  crm_sync_status text not null default 'pending' check (crm_sync_status in ('pending','synced','failed')),
  crm_error_message text
);
create index on app.form_submissions (customer_id, submitted_at desc);
create index on app.form_submissions (crm_sync_status) where crm_sync_status <> 'synced';

create table app.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  website_id uuid not null references app.websites(id) on delete cascade,
  source text not null check (source in ('google','yelp','trustpilot')),
  author_name text,
  rating int not null check (rating between 1 and 5),
  text text,
  url text,
  reviewed_at timestamptz,
  synced_at timestamptz not null default now(),
  customer_response text,
  unique (website_id, source, url)
);
create index on app.reviews (customer_id);

create table app.crm_integrations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  crm_type text not null check (crm_type in ('hubspot','jobber','servicetitan','housecall-pro','successware')),
  auth_token_encrypted bytea,
  sync_status text not null default 'active' check (sync_status in ('active','failed','paused','error')),
  last_sync_at timestamptz,
  leads_sent int not null default 0,
  sync_errors_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (customer_id, crm_type)
);

create table app.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  stripe_subscription_id text not null unique,
  stripe_price_id text,
  tier text not null check (tier in ('micro','smb','mid-market')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','annual')),
  monthly_price_cents int not null check (monthly_price_cents >= 0),
  billing_cycle_start timestamptz,
  billing_cycle_end timestamptz,
  next_billing_date timestamptz,
  payment_status text not null default 'active' check (payment_status in ('active','past_due','canceled','unpaid')),
  launch_cohort text not null default 'standard' check (launch_cohort in ('launch','standard')),
  created_at timestamptz not null default now(),
  canceled_at timestamptz,
  cancellation_reason text
);
create index on app.subscriptions (customer_id);

create table app.crm_sync_log (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  integration_id uuid not null references app.crm_integrations(id) on delete cascade,
  form_submission_id uuid references app.form_submissions(id) on delete set null,
  attempt int not null default 1,
  status text not null check (status in ('success','failed','retrying')),
  http_status int,
  error_message text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now()
);
create index on app.crm_sync_log (customer_id, created_at desc);

create table app.crm_conflict_log (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id) on delete cascade,
  integration_id uuid not null references app.crm_integrations(id) on delete cascade,
  field text not null,
  old_value text,
  new_value text,
  winner text not null check (winner in ('crm','fornax','flagged')),
  reason text,
  confidence numeric(4,3) check (confidence between 0 and 1),
  created_at timestamptz not null default now()
);
create index on app.crm_conflict_log (customer_id, created_at desc);

-- denormalized customer_id on children must match the website's owner
create or replace function app.check_child_customer() returns trigger language plpgsql as $$
begin
  if not exists (select 1 from app.websites w where w.id = new.website_id and w.customer_id = new.customer_id) then
    raise exception 'customer_id % does not own website %', new.customer_id, new.website_id;
  end if;
  return new;
end $$;
create trigger form_submissions_owner before insert or update on app.form_submissions
  for each row execute function app.check_child_customer();
create trigger reviews_owner before insert or update on app.reviews
  for each row execute function app.check_child_customer();

create trigger customers_upd before update on app.customers for each row execute function app.set_updated_at();
create trigger websites_upd before update on app.websites for each row execute function app.set_updated_at();
create trigger crm_integrations_upd before update on app.crm_integrations for each row execute function app.set_updated_at();

-- ================= admin schema (never visible to customers) =================
create table admin.admins (
  user_id uuid primary key,                   -- Tyler's Supabase auth user id
  email text not null,
  created_at timestamptz not null default now()
);

create table admin.customer_admin (
  customer_id uuid primary key references app.customers(id) on delete cascade,
  ltv_cents bigint not null default 0,
  phone text,
  payment_status text,
  notes text,
  updated_at timestamptz not null default now()
);

create table admin.lead_warehouse (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('google-places','apollo','hunter','scraper','photo-intake','manual')),
  source_ref text,
  dedupe_key text not null unique,
  company text,
  name text,
  email text,
  phone text,
  vertical text,
  location text,
  website_url text,
  raw jsonb,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table admin.leads (
  id uuid primary key default gen_random_uuid(),
  warehouse_id uuid references admin.lead_warehouse(id) on delete set null,
  name text,
  email text,
  phone text,
  company text,
  title text,
  location text,
  vertical text,
  website_url text,
  intent_signals jsonb not null default '[]'::jsonb,
  source text,
  status text not null default 'new' check (status in ('new','scored','contacted','qualified','converted','rejected','suppressed')),
  score int check (score between 0 and 100),
  assigned_tier text check (assigned_tier in ('micro','smb','mid-market')),
  score_reason jsonb,
  last_contacted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index on admin.leads (status, score desc);
create trigger leads_upd before update on admin.leads for each row execute function app.set_updated_at();

create table admin.prospects (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references admin.leads(id) on delete cascade,
  customer_id uuid references app.customers(id) on delete set null,
  demo_generated_at timestamptz,
  demo_view_count int not null default 0,
  demo_viewed_at timestamptz,
  demo_converted_at timestamptz,
  demo_expiration_date timestamptz,
  follow_up_count int not null default 0,
  next_follow_up_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger prospects_upd before update on admin.prospects for each row execute function app.set_updated_at();

create table admin.demos (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references admin.prospects(id) on delete cascade,
  client_slug text not null,
  design_template_used text,
  style_profile text,
  cloudflare_url text,
  cloudflare_deployment_id text,
  status text not null default 'generated' check (status in ('generated','viewed','converted','expired','archived')),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  archived_at timestamptz,
  view_count int not null default 0,
  conversion_flag boolean not null default false,
  core_web_vitals_score int,
  lighthouse_score int check (lighthouse_score between 0 and 100),
  qa_passed boolean
);
create index on admin.demos (prospect_id);
create index on admin.demos (created_at);

create table admin.agent_runs (
  id uuid primary key default gen_random_uuid(),
  agent_name text not null,
  run_id text,
  trigger text not null default 'manual' check (trigger in ('cron','event','manual')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'running' check (status in ('success','failed','partial','timeout','running')),
  rows_processed int not null default 0,
  rows_failed int not null default 0,
  error_message text,
  retry_count int not null default 0,
  model text,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd numeric(12,6) not null default 0,
  dry_run boolean not null default false
);
create index on admin.agent_runs (agent_name, started_at desc);

create table admin.outbound_campaign_runs (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references admin.leads(id) on delete cascade,
  prospect_id uuid references admin.prospects(id) on delete set null,
  touch_number int not null check (touch_number between 1 and 5),
  template_variant text check (template_variant in ('A','B','C')),
  status text not null default 'queued' check (status in ('queued','sent','delivered','opened','clicked','replied','bounced','unsubscribed','failed')),
  subject text,
  sendgrid_message_id text,
  demo_url text,
  utm jsonb,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  replied_at timestamptz,
  error_message text,
  agent_run_id uuid references admin.agent_runs(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (lead_id, touch_number)
);

create table admin.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references app.customers(id),
  stripe_transaction_id text not null unique,
  amount_cents int not null,
  transaction_type text not null check (transaction_type in ('charge','refund','dispute')),
  status text not null check (status in ('succeeded','failed','pending')),
  created_at timestamptz not null default now(),
  error_message text
);
create index on admin.payment_transactions (customer_id);

create table admin.events (
  id uuid primary key default gen_random_uuid(),
  event_id text not null unique,
  stream text not null,
  source text not null,
  recipient text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','processed','failed','dead')),
  attempts int not null default 0,
  next_attempt_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);
create index on admin.events (stream, created_at);
create index on admin.events (status, next_attempt_at) where status in ('pending','failed');

create table admin.health_check_log (
  id bigserial primary key,
  endpoint text not null,
  kind text not null check (kind in ('http','dns','db','service')),
  ok boolean not null,
  latency_ms int,
  status_code int,
  error_message text,
  checked_at timestamptz not null default now()
);
create index on admin.health_check_log (endpoint, checked_at desc);

create table admin.business_metrics_log (
  id bigserial primary key,
  metric text not null,
  value numeric not null,
  recorded_at timestamptz not null default now()
);
create index on admin.business_metrics_log (metric, recorded_at desc);

create table admin.alerts (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null,
  severity text not null check (severity in ('critical','warning','info')),
  category text not null,
  title text not null,
  detail text,
  status text not null default 'open' check (status in ('open','acknowledged','resolved')),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  occurrences int not null default 1,
  last_notified_at timestamptz,
  acknowledged_at timestamptz,
  resolved_at timestamptz
);
create unique index alerts_one_live_per_key on admin.alerts (dedupe_key) where status <> 'resolved';
