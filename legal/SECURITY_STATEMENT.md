# BuildFlow Security Statement

**Last Updated:** September 2026

---

## Executive Summary

BuildFlow takes security seriously. We host customer websites on secure, certified infrastructure, encrypt all data in transit and at rest, perform regular backups, and maintain industry-standard access controls and audit logging.

This document outlines our security practices and commitments.

---

## 1. Infrastructure Security

### Hosting Provider: Railway

**Railway Security Certifications:**
- SOC 2 Type II certified (independently audited security and operations controls)
- Compliant with GDPR, HIPAA, and CCPA
- ISO 27001 committed
- Undergoes annual third-party security audits

**Railway Infrastructure:**
- Deployed across multiple geographic regions for redundancy
- Automatic DDoS protection and rate limiting
- Intrusion detection systems (IDS)
- Network segmentation and firewalls
- Encrypted inter-server communication

**Data Centers:**
- Multiple data centers in North America
- Automatic failover if primary region goes down
- 99.99% uptime SLA (99.5% guaranteed to customers)

### CDN & DNS: Cloudflare

**Cloudflare Security:**
- SOC 2 Type II certified
- DDoS protection (up to 100 Tbps capacity)
- Web Application Firewall (WAF) rules
- Rate limiting to prevent abuse
- Bot management
- Automatic HTTPS redirect (if misconfigured)

**Cloudflare Services:**
- Global CDN for fast, secure content delivery
- DNS routing (domain pointing)
- SSL/TLS certificate management
- Cache to reduce server load

---

## 2. Encryption & Data in Transit

### HTTPS/TLS Encryption

**All Site Traffic:**
- Every connection to your site is encrypted with TLS 1.2 or higher
- SSL/TLS certificates issued by Let's Encrypt (industry standard)
- Certificates auto-renew every 90 days (no action required from you)
- A+ SSL Labs rating maintained

**Certificate Details:**
- Algorithm: RSA 2048-bit (or ECDSA 256-bit)
- Cipher suites: Modern, secure algorithms only
- OCSP stapling enabled (faster certificate verification)
- HTTP Strict Transport Security (HSTS) enabled (prevent downgrade attacks)

### Data in Transit

**Secure Channels:**
- All API calls use HTTPS
- Database connections use encrypted tunnels
- Backup transfers use encrypted channels
- Admin panel uses HTTPS only (no HTTP fallback)

---

## 3. Encryption & Data at Rest

### Database Encryption

**Encryption Standard:**
- AES-256 encryption for all stored data
- Encryption keys are separate from data storage
- Key rotation performed annually

**What's Encrypted:**
- Business information (name, address, phone, email)
- Site content (pages, images, testimonials)
- Payment information (stored by Stripe, not us)
- Backup files
- Server logs (access logs, error logs, audit logs)

### Backup Security

**Backup Encryption:**
- All backups encrypted with AES-256
- Backups stored on geographically separate servers
- Encryption keys held separately from backups

**Backup Retention:**
- Daily automated backups
- Retained for 30 days
- Tested monthly for restore integrity
- Deleted securely after retention period (data shredded, not just file-deleted)

---

## 4. Access Control & Authentication

### Admin Access

**Who Has Access:**
- BuildFlow engineering team (authorized personnel only)
- Support staff (limited to support functions)
- CEO/founders (full access)
- Contractors (background-checked, NDA required)

**No One Else Has Access:**
- Your customers cannot access your site's backend
- Other customers cannot access your site
- Third parties cannot access without legal process

### Passwords & Credentials

**Password Requirements:**
- All staff passwords: minimum 14 characters, mixed case, numbers, symbols
- Multi-factor authentication (MFA) required for all admin access
- Passwords rotated every 90 days
- No password reuse (last 10 passwords remembered)

**Credential Storage:**
- Passwords hashed with bcrypt (industry standard)
- API keys stored securely with encryption
- No plaintext passwords anywhere
- Credentials never logged or displayed in error messages

### Access Logs

**Every Access Is Logged:**
- IP address of person accessing
- Timestamp of access
- What resource was accessed
- What action was taken (read, write, delete)
- Logs retained for 90 days
- Logs reviewed quarterly for suspicious activity

---

## 5. Vulnerability Management

### Vulnerability Scanning

**Regular Scanning:**
- Automated vulnerability scans run daily
- Manual penetration testing performed annually
- Third-party security audits performed yearly
- Security advisories from dependencies monitored continuously

**Patch Management:**
- Critical vulnerabilities patched within 24 hours
- High-severity vulnerabilities patched within 1 week
- Medium-severity vulnerabilities patched within 2 weeks
- Low-severity vulnerabilities patched within 1 month

### Responsible Disclosure

**If You Discover A Vulnerability:**
- Email: security@buildflow.com
- Do not publicly disclose until we have patched
- We will acknowledge receipt within 24 hours
- We will provide estimated patch timeline
- You will be credited (unless you prefer anonymity)

---

## 6. Uptime & Availability

### Service Level Agreement (SLA)

**Uptime Guarantee:**
- 99.5% uptime per month (measured)
- ~3.5 hours of acceptable downtime per month
- Excludes scheduled maintenance

**Scheduled Maintenance:**
- 1-4 times per year, typically 2-4 hours
- Scheduled for Sunday 2 AM - 6 AM PT (low-traffic time)
- Announced via email at least 7 days in advance
- Maintenance does not count against uptime SLA

### Monitoring & Alerting

**Continuous Monitoring:**
- Real-time uptime monitoring from 3 geographic locations
- Automated alerts to on-call engineer if site goes down
- Typical response time: <5 minutes
- Typical resolution time: <15 minutes

**Status Page:**
- Public status page at status.buildflow.com
- Real-time uptime metrics
- Incident reports and post-mortems
- Maintenance schedule

---

## 7. Compliance & Standards

### Legal Compliance

**GDPR (Europe):**
- Data Protection Impact Assessments (DPIA) completed
- Data Processing Agreement (DPA) available upon request
- Privacy by design implemented
- Data subject rights fully supported

**CCPA (California):**
- Privacy Policy compliant with CCPA requirements
- Consumer rights requests fulfilled within 30 days
- No sale of personal information

**HIPAA (Healthcare - if applicable):**
- Business Associate Agreement (BAA) available upon request
- Encryption, access controls, and audit logging in place
- Not HIPAA-certified but can be used with BAA

**PCI DSS (Payment Card Data):**
- We do NOT store or handle payment card data (Stripe does)
- Stripe is PCI DSS Level 1 certified
- We are not in PCI scope

### Industry Standards

**Certifications Held By Our Providers:**
- SOC 2 Type II (Railway, Cloudflare)
- ISO 27001 (Cloudflare, Railway)
- ISO 9001 (Railway)

**Security Standards Followed:**
- OWASP Top 10 (secure coding practices)
- CWE Top 25 (common weakness enumeration)
- NIST Cybersecurity Framework

---

## 8. Incident Response

### If A Security Incident Occurs

**Detection:**
- Continuous monitoring detects anomalies
- Alerts trigger immediate investigation
- Typical detection time: <1 hour

**Response:**
1. Incident declared and severity assessed (1-4: low to critical)
2. Affected systems isolated within 30 minutes
3. Forensic investigation begins
4. Customer notification within 48 hours (if data affected)
5. Post-incident review within 1 week

**Your Notification:**
- Email to your account email address
- Details: what happened, what data was affected, what we did, what you should do
- Phone call if severity is critical
- Follow-up support to help you notify your own customers

### Breach Reporting

**Legal Notification:**
- Complies with all state/federal breach notification laws
- Reports to relevant authorities if required
- Cooperates with law enforcement investigations
- Transparent communication with affected customers

---

## 9. Backup & Disaster Recovery

### Backup Strategy

**Frequency:**
- Daily automated backups of all site data
- Backups taken at 2 AM PT (off-peak time)
- Backup window: <30 minutes

**Retention:**
- 30-day retention (rolling window)
- Backups kept in geographically separate location from primary data
- Encrypted with AES-256
- Tested monthly for restore integrity

### Disaster Recovery

**If Data Is Corrupted:**
- Restore from clean backup within 4 hours
- Customer notified immediately
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 24 hours (worst case, lose 1 day of data)

**If Primary Data Center Fails:**
- Automatic failover to secondary region
- Traffic redirected within 5 minutes
- Data replicated in real-time (RPO: <1 minute)
- No manual intervention required

**You Can Request A Backup:**
- Email: support@buildflow.com
- We will provide full export of your site (HTML, CSS, images, etc.)
- Export provided within 24 hours
- No charge for export

---

## 10. Employee Security

### Background Checks

- All staff undergo background checks before hiring
- Criminal history, employment verification, reference checks
- Checks repeated every 2 years

### Security Training

- All staff complete security training before day 1
- Annual refresher training required
- Incident response drills performed quarterly
- Phishing simulations run monthly

### Confidentiality

- All staff sign NDA (Non-Disclosure Agreement)
- Confidentiality obligations continue after employment ends
- Data access rights revoked immediately upon termination

### Offboarding

- All credentials rotated when staff leaves
- All access revoked within 24 hours
- All company equipment returned and wiped
- Exit interview includes confidentiality reminder

---

## 11. Third-Party Risk Management

### Vendor Assessment

**Before Adding Any Third Party:**
- Security questionnaire completed
- References checked
- SOC 2/ISO certifications verified
- Privacy/security practices reviewed

**Ongoing Monitoring:**
- Annual vendor risk assessments
- Security incidents tracked
- Compliance verified

### Current Vendors

**Primary Vendors:**
- **Railway:** SOC 2 Type II certified, DPA available
- **Cloudflare:** SOC 2 Type II certified, DPA available
- **Stripe:** PCI DSS Level 1 certified, SOC 2, DPA available
- **Google (Analytics):** SOC 2 certified, DPA available

---

## 12. Security Roadmap

**Q4 2026:**
- Implement Web Application Firewall (WAF) rules for attack prevention
- Set up real-time security monitoring dashboard
- Conduct third-party penetration test

**Q1 2027:**
- ISO 27001 certification pursuit
- HIPAA BAA availability (if customer demand)
- Zero-trust architecture evaluation

---

## 13. Contact & Reporting

**Security Concerns:**
- Email: security@buildflow.com
- Response time: 24 hours
- Confidential handling of all reports

**Data Requests (GDPR/CCPA):**
- Email: privacy@buildflow.com
- Response time: 30 days

**General Support:**
- Email: support@buildflow.com
- Response time: 24-48 hours

---

## 14. Updates to This Statement

This Security Statement may be updated as our security practices improve. Changes will be posted here with an updated "Last Updated" date. Material changes will be communicated via email.

---

**Last Updated: September 2026**

**Build with confidence. Your site is secure.**
