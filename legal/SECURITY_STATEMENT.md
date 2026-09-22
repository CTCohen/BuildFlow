---
title: Security_Statement
purpose: Documentation for SECURITY_STATEMENT.md
status: draft
owner: c.t.cohen
updated: '2026-09-18'
tier_scope: all
phase: operational
---

> **DRAFT for counsel review (2026-09-18).** Rebuilt from spec System 11 and System 03. It states commitments and targets only; it does not claim certifications Fornax does not hold. Not to be published until reviewed.

# Fornax Security Statement

## Summary
Fornax hosts customer websites on established infrastructure providers, isolates each customer's data, encrypts sensitive credentials, keeps daily backups, and logs administrative access. This page describes our practices and targets.

## 1. Infrastructure
- **Sites, DNS, CDN, storage:** Cloudflare. **Database and authentication:** Supabase (PostgreSQL). **Backend services:** a containerized cloud service. **Payments:** Stripe (we never see card numbers). **Email:** SendGrid.
- Our providers publish their own certifications (for example SOC 2). **These are the providers' certifications, not Fornax's.** Fornax has not yet completed its own SOC 2 audit; we plan to pursue it as we grow.
- Availability target: 99.5% per month, excluding scheduled maintenance. Scheduled maintenance happens outside business hours with notice where possible.

## 2. Encryption
- **In transit:** TLS 1.2 or higher on all connections, HSTS enabled.
- **Secrets and credentials:** CRM connection tokens and payment tokens are encrypted with AES-256, keys are held in a secrets manager separate from the data, and keys rotate at least annually.
- **At rest:** our infrastructure providers encrypt stored data at rest; ordinary business and lead data is protected by access controls rather than field-level encryption.
- **Backups:** daily, retained 30 days, stored in a separate region.

## 3. Access control and data isolation
- Customer accounts use email and password (12+ characters, stored hashed) or Google sign-in; optional two-factor authentication.
- Every customer's data is isolated with row-level security tied to the customer identifier; every request checks that the user owns the resource. We run isolation tests before launch and regularly.
- Administrative access is limited to the founder, uses a separate account with two-factor sign-in, and is logged, including when customer data is viewed.
- Sessions: httpOnly, Secure, SameSite cookies, CSRF protection, inactivity timeout.

## 4. Payments
Stripe handles all card data; Fornax stores tokens only. Payment card data is out of Fornax's PCI scope.

## 5. Vendor risk
We review each critical vendor (Stripe, Cloudflare, Supabase, SendGrid, our backend cloud provider) for security posture, retention policy and incident response before relying on it, and sign data processing terms where personal data is involved.

## 6. Incident response
- Incidents are classified P0-P3. P0 (data or payment exposed, or service down over an hour) is handled immediately.
- Timeline: triage within the first hour, containment and customer communication within 24 hours, root cause and remediation within a week, and a written post-incident review.
- If personal data is exposed we notify affected customers without undue delay and follow applicable notification laws (72 hours is our internal target).

## 7. Compliance
- **CCPA:** we act as a service provider for your customers' data, honor deletion requests within 45 days, and never sell data.
- **GDPR:** we do not target EU customers at launch; we will add a data processing agreement and data-subject-rights handling if EU customers appear.
- **WCAG 2.1 AA:** every generated site is checked against accessibility gates before it is published.
- **HIPAA:** not applicable; we do not handle protected health information.

## 8. Reporting a vulnerability
Email security@buildflow.com. We aim to acknowledge within 24 hours.

## 9. Changes
We will update this statement as our practices change.
