---
title: Auth and Database Setup
purpose: Step-by-step for Tyler to create the real Supabase project and turn on the auth rules the schema expects
status: draft
owner: c.t.cohen
updated: '2026-09-20'
version: 1.0.0
tier_scope: all
phase: phase_1
related: [platform/CONTRACT.md, legal/SPEC-11-compliance-security.md]
---

# Auth and database setup (Tyler does this; Lane A does not create the project)

Decisions: Supabase Postgres + Supabase Auth (D12). Google and email/password. Passwords 12+ characters. Tyler's admin login is Google plus 2FA.

## 1. Create the project
1. supabase.com → New project (region: US, closest to Arizona). Save the database password in your password manager, not in chat.
2. Put the keys in the provider secret stores (Railway variables now): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`. The service role key never goes to a browser.

## 2. Apply the schema
Run `platform/db/migrations/0001` to `0004` in order (SQL editor or `supabase db push`). Supabase already has `anon`, `authenticated`, `service_role` and the `auth` schema; the migrations detect them.
In the dashboard, expose only the `app` schema to the Data API (Settings → API → Exposed schemas: `app`). **Do not expose `admin`.**

## 3. Auth settings (Authentication → Sign In / Providers)
| Setting | Value | Why |
|---|---|---|
| Email provider | on, confirm email on | System 11 |
| Minimum password length | 12 | System 11 |
| Password requirements | letters and digits | |
| Google provider | on (create an OAuth client in Google Cloud; redirect URL from Supabase) | D12 |
| Password reset link expiry | 86400 s (24 h) | System 11 |
| JWT expiry | 28800 s (8 h) | 8-hour session |
| Inactivity timeout | 1 hour, enforced by the app (Supabase has no idle setting on the free plan) | System 11 |
| Sign-ups | on for customers only via the checkout flow; off otherwise | avoids stray accounts |
| MFA (TOTP) | on; optional for customers | System 11 |

## 4. Tyler's admin identity
1. Sign in once with Google on the admin app.
2. Enrol TOTP in his account; the admin app refuses a session whose `aal` claim is not `aal2`.
3. Insert his user id: `insert into admin.admins (user_id, email) values ('<his auth.users id>', '<his email>');`
The backend checks `admin.admins` and `aal2` before it acts as `bf_admin`.

## 5. Linking customers
On payment, the backend (service role) creates `app.customers`, then `app.customer_users (customer_id, user_id)` for the Supabase user. RLS reads that mapping; a user with no mapping sees nothing.

## 6. Checklist before the first charge
- [ ] Isolation test re-run against the real project (`platform/db/tests/10_isolation.sql`, needs the local auth shim removed)
- [ ] `admin` schema not exposed in the Data API
- [ ] Service role key only in server environment
- [ ] Tyler enrolled in 2FA and present in `admin.admins`
