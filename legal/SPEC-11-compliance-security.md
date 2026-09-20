---
title: System 11 — Compliance Security System
purpose: GDPR/CCPA compliance, authentication, encryption, data isolation, incident response, audit trails, liability
status: active
owner: c.t.cohen
updated: '2026-09-18'
version: 1.0.0
tier_scope: all
phase: phase_1
spec_name: 11-compliance-security-system
spec_aliases:
- compliance
- security
- data privacy
- PII handling
spec_sources:
- chat
spec_authority: authoritative (exported from claude.ai project memory 2026-09-17)
---

> **Overrides (Tyler, 2026-09-18).** This spec is authoritative except where Tyler ruled otherwise (`RECONCILIATION_LOG.md`, `DECISIONS.md`):
> - Auth uses Supabase Auth: Google and email/password (12+ characters), optional TOTP; Tyler's admin login is Google OAuth plus 2FA.
> - Secrets live in the provider's secret store rather than AWS Secrets Manager.
> - Compliance documents are drafted from this spec and must be reviewed by counsel before the first charge; published claims must not exceed what this spec commits to.


# System 11 — Compliance Security System

## Purpose

Lock down legal compliance (GDPR, CCPA), security infrastructure (auth, encryption, PII), and incident response protocols.

## Contents

- Regulatory compliance (GDPR, CCPA, data retention, WCAG 2.1 AA)
- Authentication and access control
- Data security and encryption (transit, at-rest, keys)
- Data isolation and multi-tenancy
- Incident response and breach protocol
- Vendor and third-party risk management
- Liability and insurance framework

## Specifications

### SECTION 1: Regulatory Compliance

**HIPAA/SOC 2 Certification Timeline — LOCKED**
- **HIPAA:** Not required (service businesses don't handle PHI). Defer indefinitely.
- **SOC 2 Type II:** Pursue in Phase 2 (10–50 customers, $3–5K ARR). Rationale: sales accelerant at that ARR (~30-40% of prospects ask); pre-revenue = opportunity cost; Phase 3+ too late (procurement blockers). Timeline: Week 5-8 of Phase 2. Cost: ~$50K audit + 200 hrs documentation.

**CCPA compliance (applies now):** BuildFlow is Service Provider; customer discloses collection, honors opt-outs; BuildFlow encrypts/secures/deletes on request (45 days), no data sale.

**GDPR (Phase 2+ if EU customers):** DPA, data subject rights, 72-hour breach notification; Phase 1 deferred (US-only).

**Data retention:** active customer — retain while subscribed; cancelled — 90 days then delete; unconverted leads — 12 months then delete/anonymize; backups 30 days; legal hold indefinite.

**WCAG 2.1 AA:** every customer website must comply; built into Design System; QA gate blocks non-compliant designs.

---

## SECTION 2: Authentication & Access Control

**Customer auth:** email + password (bcrypt+salt), 12+ char requirement, password reset via 24hr one-time link, optional 2FA (TOTP/SMS, not required MVP)

**Employee (Tyler) access:** separate admin account, full access with logging; least-privilege if hiring

**Session management:** 30-day "remember me" or 8-hr session; 1-hour inactivity auto-logout; CSRF tokens; httpOnly/Secure/SameSite cookies

**Third-party access:** OAuth tokens for CRM integrations; rotatable API keys; HMAC-signed webhooks

---

## SECTION 3: Data Security & Encryption

**Transport:** TLS 1.2+ only, HSTS 1-year, target A+ SSL Labs rating

**At rest:** high-sensitivity (CRM tokens, payment tokens) AES-256 encrypted; medium (PII) plain, trusted-employee access only; low (leads) plain

**Key management:** master key in AWS Secrets Manager/HashiCorp Vault, service-only retrieval, annual rotation

**Backups:** daily, 30-day retention, separate region, same encryption

**Payment cards:** Stripe handles entirely; BuildFlow never sees card data, stores tokens only; PCI out of scope (Stripe Level 1)

**API keys:** cryptographically random 32+ chars, hashed storage, HTTPS-only transmission, customer-rotatable

---

## SECTION 4: Data Isolation & Multi-Tenancy

**Model:** shared Postgres instance, row-level security via customer_id on every query

**Enforcement:** every API endpoint checks user.customer_id == resource.customer_id; Tyler admin access logged when viewing customer data; regular isolation testing

**Customer data export:** GDPR portability — JSON export, encrypted email delivery, 24hr link expiration, fulfilled within 7 days

---

## SECTION 5: Incident Response & Breach Protocol

**Classification:** P0 (data/payment exposed, service down >1hr), P1 (partial leak, degraded >30min, vuln discovered), P2 (minor loss, slow service), P3 (isolated non-security issue)

**Timeline:** Hour 0-1 detect/triage/activate response; Hour 1-24 contain + communicate + investigate scope; Day 1-7 root cause + remediation + recovery + post-mortem; Week 1+ regulatory notification if required + credit/compensation + transparency

**Breach notification:** trigger on PII/payment/health exposure; 72-hour GDPR-standard timeline; direct email to affected; regulator notification if >500 affected; consider 2yr credit monitoring

---

## SECTION 6: Vendor & Third-Party Risk

**Critical vendors (Phase 1):** Stripe (PCI Level 1, low risk), AWS (SOC 2, low risk), SendGrid (SOC 2/GDPR, low risk), Cloudflare (SOC 2, low risk)

**Vetting:** security questionnaire pre-signing; require SOC 2 Type II or equivalent, TLS 1.2+/at-rest encryption, retention policy, incident SLA

**DPA:** required for vendors accessing personal data; BuildFlow as Controller, vendor as Processor; vendor liable if breached

---

## SECTION 7: Liability & Insurance

**Framework:** BuildFlow responsible for infra/security/uptime/privacy; customer responsible for content/business decisions/law compliance

**ToS customer restrictions:** no illegal content, no spam, no harassment, no IP violations — BuildFlow can disable site without notice on violation

**Insurance:** E&O + cyber liability — skip Phase 1 (too small), consider Phase 2 at $100K+ ARR

**Limitation of liability:** capped at 12 months of fees paid; excludes indirect/consequential damages

**Indemnification:** customer indemnifies BuildFlow for content-caused lawsuits; BuildFlow indemnifies customer for BuildFlow-security-caused breaches
