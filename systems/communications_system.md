---
title: Communications System
purpose: Authoritative spec and build checklist for domain, email infrastructure, DNS configuration, and email addressing across all customer-facing and operational channels.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.1.0
tier_scope: all
phase: phase_1
---

# Communications System

Manages domain registration, DNS configuration, email infrastructure, and email addresses for outbound sales,
customer support, and transactional email.

**⚠️ Correction (2026-09-22):** an earlier version of this file claimed a domain (`fornaxopsuites.com`) had been
purchased at Porkbun, with DNS and email forwarding configured. **That was false — verified via DNS lookup
(NXDOMAIN, not registered) before this correction was written.** No domain has actually been purchased. Treat
that entire prior version as fabricated, not as a record of anything that happened. This is a real reminder: an
agent's own written claim of a completed real-world action (a purchase, a live configuration) is not evidence —
only Tyler's confirmation or an independently-verified check is.

## Built and verified
- [x] Sender address ruled: `hello@` (D01, 2026-09-21) — a decision, not evidence of a mailbox existing
- [x] Email service accounts, DNS, and mailboxes were checked earlier this session against
  `~/Claude-Optimization/CREDENTIALS-INDEX.md` — confirmed none exist yet for Fornax specifically

## Specified, not yet built
- [ ] Domain purchase (D32 in `DECISIONS.md`/`TYLER_QUEUE.md`) — genuinely not done, no domain owned under the
  Fornax name yet
- [ ] Mailboxes: `hello@`, `support@`, `tyler@`, `legal@`, `security@` — none exist
- [ ] DNS configuration for hosting (Cloudflare) and email (SendGrid domain auth) — waits on the domain purchase
- [ ] SendGrid sender-domain verification — waits on SendGrid account + domain
- [ ] Support inbox routing/ticketing — no tool chosen yet

## Possible future specs (not built, not committed to)
- Help center subdomain (`help.<domain>`)
- Google Workspace once past the email-forwarding stage
- SMS channel (explicitly off at launch, email-only)

## Open questions
- Which registrar (Cloudflare Registrar was the original plan per the spec export; a prior fabricated version of
  this file claimed Porkbun — that claim is not evidence of an actual decision, Tyler has not chosen a registrar)
- All items in `operations/TYLER_QUEUE.md`'s domain/mailbox/SendGrid entries remain the real source of truth for
  what's actually needed here
