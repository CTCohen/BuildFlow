---
title: Communications & Tech Stack System
purpose: Authoritative spec and build checklist for domain, email, phone/voicemail, DNS, and the complete account/service inventory that runs Fornax.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.2.0
tier_scope: all
phase: phase_1
---

# Communications & Tech Stack System

Manages domain registration, DNS configuration, email infrastructure, phone, and the complete account inventory.

## Domain — real, confirmed by Tyler directly (2026-09-22)
`fornaxopsuites.com`, purchased at Porkbun. This is now trustworthy because **Tyler said so directly in chat** —
not because a file claimed it. (An earlier version of this file fabricated the same claim before it was real;
that was caught and corrected. The lesson stands even though the domain is now genuinely owned: an agent's own
written claim of a completed purchase is never evidence on its own.)

**DNS/Railway setup:** a separate session is currently configuring this domain to point at Railway — in
progress, not independently confirmed from here. Before that setup is treated as final, see the open hosting-
architecture question below; it may need to change what it's pointing at.

## Built and verified
- [x] Domain purchased: `fornaxopsuites.com` at Porkbun — confirmed directly by Tyler, 2026-09-22
- [x] Sender address ruled: `hello@` (D01, 2026-09-21)
- [x] Phone/voicemail ruled (Tyler, 2026-09-22): **Managed-only.** Not offered to Offboard-eligible customers.
  Edge cases and client-experience recovery are handled personally by Tyler, manually — not automated. This
  closes the open research question in `systems/offboarding_system.md`.

## Open hosting-architecture question (Tyler flagged this directly, 2026-09-22)
Client static websites — demo AND once a customer is onboarded for Managed service — should **stay on Cloudflare
the whole time**, never move to Railway. They're static generated sites; the only thing that changes at onboarding
is that their forms start posting to a live backend (Railway-hosted API) instead of nothing, and they get a
dashboard. **This means "onboarding" is not a hosting migration — the website never moves.** Confirm the session
currently wiring `fornaxopsuites.com` to Railway is pointing the right thing at Railway (the backend API and the
Fornax admin dashboard's backend — not any static site, not Fornax's own marketing site either, which per the
existing plan should also be static on Cloudflare for consistency with the client-site pattern).

## Specified, not yet built
- [ ] Mailboxes: `hello@`, `support@`, `tyler@`, `legal@`, `security@`
- [ ] DNS configuration for hosting (Cloudflare) and email (SendGrid domain auth)
- [ ] SendGrid sender-domain verification
- [ ] Support inbox routing/ticketing — no tool chosen yet

## Possible future specs (not built, not committed to)
- Help center subdomain (`help.fornaxopsuites.com`)
- Google Workspace once past the email-forwarding stage
- SMS channel (explicitly off at launch, email-only)

## Complete tech stack (real accounts only — nothing here implies it exists until checked off)
| Layer | Provider | Status |
|---|---|---|
| Domain registrar | Porkbun | **owned** — `fornaxopsuites.com` |
| Client/demo site hosting (static, always) | Cloudflare Pages/Workers/R2 | plugin installed, no API token yet |
| Fornax's own marketing site | Should be Cloudflare (see open question above) | not deployed |
| Backend/API/database logic (billing, CRM sync, lead scoring, admin dashboard data) | Railway (now) → Google Cloud Run (later) | in progress, another session |
| Database | Supabase (Postgres) | project created, publishable key stored, service-role key missing |
| Transactional/outbound email | SendGrid | account not created |
| CRM | HubSpot | account not created |
| Billing | Stripe | account not created |
| Login | Google OAuth (via Supabase Auth) | not configured |
| AI (build/ops) | Claude Pro (existing) | in use |
| AI (unattended, capped) | Anthropic Console API key, $30/mo cap | not created |
| Phone/voicemail | Managed-only, Tyler handles edge cases personally | ruled 2026-09-22, not built |
| Alerts | Email + Twilio SMS (Slack dropped, solo founder) | Twilio not set up |

## Open questions
- Confirm the Railway DNS setup in progress is pointing only the backend/dashboard API, not any static site
- Support inbox tool: no ticketing system chosen yet
