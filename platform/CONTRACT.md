---
title: Platform Data Contract
purpose: The one shared definition of every Fornax entity and field; all lanes code against this
status: active
owner: c.t.cohen
updated: '2026-09-21'
version: 1.0.1
tier_scope: all
phase: phase_1
related: [platform/SPEC-02-platform-architecture.md, legal/SPEC-11-compliance-security.md, platform/SPEC-13-observability.md, RECONCILIATION_LOG.md]
---

# Platform Data Contract (v1.0.0)

Owner: Lane A. **Only Lane A changes this file**; other lanes request changes in their `STATUS-<lane>.md`.
The SQL in `platform/db/migrations/` implements exactly this. If the two disagree, that is a bug: fix both together.
Derived from System 02 Section 1 plus the entities other specs use (Systems 07, 09, 13). Resolves D39.

## Conventions
- **IDs:** `uuid` (`gen_random_uuid()`), column `id`. Foreign keys are `<entity>_id`.
- **Times:** `timestamptz`, UTC, `*_at`. Every table has `created_at`; mutable tables also `updated_at` (trigger-maintained).
- **Money:** integer cents, `*_cents`. Dollars for LLM cost are `numeric(12,6)` named `cost_usd`.
- **Enums:** `text` with a CHECK constraint (easy to extend). Values are lowercase kebab/snake. Tier values match `app/src/data/schema.mjs`: `micro | smb | mid-market` (the spec's "tranche" and this contract's `tier` are the same thing; the spec's business_size is dropped, Lead Scoring assigns the tier).
- **Soft delete:** `deleted_at` on `leads`, `customers`, `websites`. Retention per System 11: cancelled customer data deleted 90 days after `canceled_at`; unconverted leads 12 months; logs per the table notes below.
- **Two schemas** (resolves the PaymentTransaction / `customer_id` contradiction):
  - **`app`** — customer-visible tables. Row-level security on `customer_id` (on `customers`, on `id`). Customers only ever read; all writes go through the backend using the service role.
  - **`admin`** — pre-customer pipeline data, ops logs and money records. No access for customers at all (no schema usage, no grants). Only role `bf_admin` (Tyler) and the backend service role. `admin.payment_transactions` keeps its `customer_id` for reporting; it is admin-only, so that is safe.
- **Identity:** Supabase Auth user id (`auth.uid()`) maps to a customer through `app.customer_users`. Tyler's admin identity is a row in `admin.admins` (his Supabase user id); the admin dashboard authenticates as him (Google + 2FA) and the backend then acts with `bf_admin`.
- **Secrets:** never stored in these tables in plain text. `crm_integrations.auth_token_encrypted` is ciphertext (key lives in the provider secret store); customers cannot select that column.

## Entity map

| Entity | Table | Schema | Customer sees | Notes |
|---|---|---|---|---|
| Customer | `customers` | app | own row | admin-only fields live in `admin.customer_admin` |
| CustomerUser | `customer_users` | app | own rows | maps auth user to customer |
| Website | `websites` | app | own | holds `client_json` |
| FormSubmission | `form_submissions` | app | own | leads captured by the customer's site |
| Review | `reviews` | app | own | |
| CRMIntegration | `crm_integrations` | app | own, minus token | |
| Subscription | `subscriptions` | app | own, billing summary columns only | includes `launch_cohort` |
| crm_sync_log | `crm_sync_log` | app | own | 90-day retention |
| crm_conflict_log | `crm_conflict_log` | app | own | 30-day retention |
| Lead | `leads` | admin | never | |
| LeadWarehouse | `lead_warehouse` | admin | never | raw discovery rows |
| Prospect | `prospects` | admin | never | |
| Demo | `demos` | admin | never | |
| OutboundCampaignRun | `outbound_campaign_runs` | admin | never | one row per email touch |
| AgentRun | `agent_runs` | admin | never | tokens and dollars |
| PaymentTransaction | `payment_transactions` | admin | never | |
| Event | `events` | admin | never | idempotent event log + DLQ |
| health_check_log | `health_check_log` | admin | never | 30-day retention |
| business_metrics_log | `business_metrics_log` | admin | never | 90-day retention |
| alerts | `alerts` | admin | never | until acknowledged + 7 days |
| Admin | `admins` | admin | never | Tyler's user id |
| CustomerAdmin | `customer_admin` | admin | never | ltv, phone, payment status, notes |
| DeletionRequest | `deletion_requests` | admin | never | System 11 retention/deletion workflow; due 45 days after `requested_at` |

## Enumerations

| Name | Values |
|---|---|
| tier | `micro`, `smb`, `mid-market` |
| lead_status | `new`, `scored`, `contacted`, `qualified`, `converted`, `rejected`, `suppressed` |
| crm_type | `hubspot`, `jobber`, `servicetitan`, `housecall-pro`, `successware` (HubSpot first) |
| demo_status | `generated`, `viewed`, `converted`, `expired`, `archived` |
| sync_status (integration) | `active`, `failed`, `paused`, `error` |
| crm_sync_status (submission) | `pending`, `synced`, `failed` |
| payment_status (subscription) | `active`, `past_due`, `canceled`, `unpaid` |
| billing_cycle | `monthly`, `annual` |
| launch_cohort | `launch`, `standard` (`launch` = grandfathered early customers, D02) |
| agent_run_status | `success`, `failed`, `partial`, `timeout`, `running` |
| review_source | `google`, `yelp`, `trustpilot` |
| transaction_type | `charge`, `refund`, `dispute` |
| transaction_status | `succeeded`, `failed`, `pending` |
| event_status | `pending`, `processed`, `failed`, `dead` |
| campaign_run_status | `queued`, `sent`, `delivered`, `opened`, `clicked`, `replied`, `bounced`, `unsubscribed`, `failed` |
| alert_severity | `critical`, `warning`, `info` |
| alert_status | `open`, `acknowledged`, `resolved` |

## Entities

### app.customers
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | the `customer_id` everywhere |
| name | text NOT NULL | business name |
| email | text NOT NULL | unique |
| domain | text | customer's own domain, nullable until known |
| tier | text NOT NULL | tier enum |
| created_at, updated_at | timestamptz | |
| churn_date | timestamptz | |
| deleted_at | timestamptz | soft delete |

### app.customer_users
`id`, `customer_id` FK, `user_id uuid` (Supabase `auth.users.id`, unique), `role` (`owner` only at launch), `created_at`.

### admin.customer_admin (1:1 with customer; the spec's "admin-only fields")
`customer_id` PK/FK, `ltv_cents`, `phone`, `payment_status`, `notes`, `updated_at`.

### app.websites
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| customer_id | uuid FK NOT NULL | RLS key |
| slug | text unique | matches `client_json.slug` |
| domain | text | |
| subdomain_fallback | text | e.g. `slug.[domain TBD under Fornax name]` |
| client_json | jsonb NOT NULL | **the client JSON the design engine renders** (see below) |
| ssl_certificate_expires_at | timestamptz | |
| deployed_at, last_updated_at | timestamptz | |
| feature_toggles | jsonb NOT NULL default `{}` | |
| customer_edit_count | int default 0 | |
| last_customer_edit_at | timestamptz | |
| bundle_url | text | static bundle location on R2 (added; needed by Managed hosting) |
| deleted_at | timestamptz | |

### app.form_submissions
`id`, `customer_id` FK (denormalized from website so RLS is a plain equality; kept consistent by trigger), `website_id` FK, `prospect_name`, `prospect_email`, `prospect_phone`, `message`, `submitted_at`, `synced_to_crm_at`, `crm_sync_status` (default `pending`), `crm_error_message`.

### app.reviews
`id`, `customer_id` FK, `website_id` FK, `source`, `author_name`, `rating` (1-5), `text`, `url`, `reviewed_at`, `synced_at`, `customer_response`. Unique `(website_id, source, url)`.

### app.crm_integrations
`id`, `customer_id` FK, `crm_type`, `auth_token_encrypted bytea` (**not selectable by customers**), `sync_status`, `last_sync_at`, `leads_sent int`, `sync_errors_count int`, `created_at`, `updated_at`. Unique `(customer_id, crm_type)`.

### app.subscriptions
`id`, `customer_id` FK, `stripe_subscription_id` unique, `stripe_price_id` (versioned Price, D02), `tier`, `billing_cycle`, `monthly_price_cents`, `billing_cycle_start`, `billing_cycle_end`, `next_billing_date`, `payment_status`, `launch_cohort` (default `standard`), `created_at`, `canceled_at`, `cancellation_reason`. Customers can select only: `id, customer_id, tier, billing_cycle, monthly_price_cents, next_billing_date, payment_status, canceled_at` (the "billing summary").

### app.crm_sync_log
`id`, `customer_id` FK, `integration_id` FK, `form_submission_id` FK, `attempt int`, `status` (`success`, `failed`, `retrying`), `http_status`, `error_message`, `idempotency_key` unique, `created_at`.

### app.crm_conflict_log
`id`, `customer_id` FK, `integration_id` FK, `field`, `old_value`, `new_value`, `winner` (`crm`, `buildflow`, `flagged`), `reason`, `confidence numeric(4,3)`, `created_at`.

### admin.lead_warehouse (raw discovery rows, System 07 section 1)
`id`, `source` (`google-places`, `apollo`, `hunter`, `scraper`, `photo-intake`, `manual`), `source_ref`, `dedupe_key` unique (normalized phone or domain), `company`, `name`, `email`, `phone`, `vertical`, `location`, `website_url`, `raw jsonb`, `created_at`, `last_seen_at`.

### admin.leads
`id`, `warehouse_id` FK, `name`, `email`, `phone`, `company`, `title`, `location`, `vertical`, `website_url`, `intent_signals jsonb`, `source`, `status`, `score int 0-100`, `assigned_tier`, `score_reason jsonb`, `last_contacted_at`, `created_at`, `updated_at`, `deleted_at`.

### admin.prospects
`id`, `lead_id` FK unique, `demo_generated_at`, `demo_view_count`, `demo_viewed_at`, `demo_converted_at`, `demo_expiration_date`, `follow_up_count`, `next_follow_up_date`, `customer_id` (FK to `app.customers`, set on conversion), `created_at`, `updated_at`.

### admin.demos
`id`, `prospect_id` FK, `client_slug`, `design_template_used`, `style_profile`, `cloudflare_url`, `cloudflare_deployment_id`, `status`, `created_at`, `expires_at`, `archived_at`, `view_count`, `conversion_flag`, `core_web_vitals_score`, `lighthouse_score`, `qa_passed boolean`.

### admin.outbound_campaign_runs
`id`, `lead_id` FK, `prospect_id` FK, `touch_number` (1-5), `template_variant` (`A`, `B`, `C`), `status`, `subject`, `sendgrid_message_id`, `demo_url`, `utm jsonb`, `sent_at`, `opened_at`, `clicked_at`, `replied_at`, `error_message`, `agent_run_id` FK, `created_at`. Unique `(lead_id, touch_number)` so a touch is never sent twice.

### admin.agent_runs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| agent_name | text | registry name (`design`, `lead-scoring`, ...) |
| run_id | text | caller's correlation id |
| trigger | text | `cron`, `event`, `manual` |
| started_at, completed_at | timestamptz | |
| status | text | agent_run_status |
| rows_processed, rows_failed | int | |
| error_message | text | |
| retry_count | int | |
| model | text | null when the agent uses no LLM |
| input_tokens, output_tokens | int | default 0 |
| cost_usd | numeric(12,6) | default 0; feeds `metrics/token-log.md` and the $30/mo cap |
| dry_run | boolean | |

### admin.payment_transactions
`id`, `customer_id` FK, `stripe_transaction_id` unique, `amount_cents`, `transaction_type`, `status`, `created_at`, `error_message`.

### admin.events (System 02 section 2: idempotent events and DLQ)
`id`, `event_id text UNIQUE` (idempotency), `stream text` (per-customer ordering), `source`, `recipient`, `event_type`, `payload jsonb`, `status`, `attempts`, `next_attempt_at`, `last_error`, `created_at`, `processed_at`. Backoff and retry rules: System 02.

### admin.health_check_log
`id`, `endpoint text`, `kind` (`http`, `dns`, `db`, `service`), `ok boolean`, `latency_ms`, `status_code`, `error_message`, `checked_at`. Retention 30 days.

### admin.business_metrics_log
`id`, `metric text`, `value numeric`, `recorded_at`. Retention 90 days.

### admin.alerts
`id`, `dedupe_key`, `severity`, `category`, `title`, `detail`, `status`, `first_seen_at`, `last_seen_at`, `occurrences`, `last_notified_at`, `acknowledged_at`, `resolved_at`. At most one non-resolved alert per `dedupe_key`; alerts inside a 30-minute window collapse into it (System 13).

### admin.admins
`user_id uuid PK` (Supabase auth user), `email`, `created_at`.

## Client JSON (design engine input)
Stored in `app.websites.client_json`. **`app/src/data/schema.mjs` is the executable definition (Lane B owns it); `validateClient()` is the gate.** Shape at contract time:

```
{
  slug, tier ("micro"|"smb"|"mid-market"), styleProfile (one of the 10 profiles),
  business: { name, trade, phone, email, cityState, serviceAreas[], hours, yearsInBusiness?, licenseNo? },
  brand:    { primary, accent, heroStyle|null, typePairing, density },
  media:    { source ("existing-identity"|"generated-identity"), logo?, heroImage? },
  content:  { en: { tagline, heroHeadline, heroSub, primaryCta, about, services[{name,blurb,slug?,description?,...}], reviews[{quote,author}] }, es?: same keys }
}
```
Rules the platform enforces: `client_json.slug` equals `websites.slug`; `client_json.tier` equals the customer's subscription tier (checked in the backend, not the database). English is required, Spanish optional. Changes to this shape are made in `schema.mjs`; Lane B tells Lane A through STATUS so this section is updated.

## Access model (what the tests prove)
| Actor | Role | Can |
|---|---|---|
| Customer | `authenticated` + JWT `sub` | select own rows in `app` tables (respecting column limits); nothing in `admin`; no writes |
| Backend | `service_role` | everything (bypasses RLS); must set `customer_id` explicitly |
| Tyler | `bf_admin` | everything in `admin`; read on `app` (all customers), each read is expected to be logged by the backend |
| Anonymous | `anon` | nothing |

## Change log
- 1.0.0 (2026-09-20): first version.
- 1.0.1 (2026-09-21): added `admin.deletion_requests` (System 11 retention/deletion workflow, BUILD_TASKS.md §8; `platform/db/migrations/0005_retention.sql`).
