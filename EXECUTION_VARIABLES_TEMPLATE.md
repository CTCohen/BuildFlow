---
title: Execution Variables Template
purpose: Template for tracking execution variables and environment setup
status: draft
owner: c.t.cohen
tier_scope: all
phase: operational
---

> **ON HOLD (2026-09-18):** re-priced to the spec pricing (SMB $249/mo, offboard $799). Do not send or use this until Tyler approves the updated copy. Phase 1 was re-baselined to the platform launch; see `ROADMAP.md` and `RECONCILIATION_LOG.md` (D42).


# Execution Variables Template

> When Tyler provides the 6 blockers (B1–B6), use this template to update all files at once.
> This is a checklist for Claude when ready to execute.

---

## Variables Needed From Tyler

### B1: Calendly Link
**Format:** `https://calendly.com/tyler/your-event-name`  
**Status:** ☐ Provided by Tyler  
**Value:** `_________________`

### B2: Business Email Addresses
**What we need:**
- Email that shows in From: line on outreach → use `tyler@buildflow.com`
- Support email → use `hello@buildflow.com` (or ops email)

**Status:** ☐ Email addresses confirmed working  
**From address:** `tyler@buildflow.com`  
**Support address:** `hello@buildflow.com`

### B3: Stripe Checkout Links
**What we need (2 links from Stripe dashboard):**

1. **Managed Monthly Subscription** ($249/mo)
   - Format: `https://buy.stripe.com/XXXXXXXXXXXXXXXXXXXXXX`
   - Status: ☐ Created
   - Link: `_________________`

2. **Offboard One-Time** ($799)
   - Format: `https://buy.stripe.com/YYYYYYYYYYYYYYYYYYYYYY`
   - Status: ☐ Created
   - Link: `_________________`

### B4: Domain Confirmation
**What we need:**
- Confirm buildflow.com is registered and accessible
- Note: website deploy depends on domain pointing to Railway

**Status:** ☐ Domain confirmed  
**Domain status:** `_________________`

### B5: Business Address
**What we need:**
- Registered business address for Terms of Service §16

**Format:**
```
BuildFlow LLC
[Address]
[City], [State] [ZIP]
```

**Status:** ☐ Address filled in Terms  
**Address:** `_________________`

### B6: Email Warmup (Optional)
**Status:** ☐ Not needed / ☐ Completed

---

## Files to Update (Once Variables Are Provided)

### 1. Prospect Emails (5 files)
**File:** `/BuildFlow/outreach/REAL_PROSPECTS_READY_TO_SEND.md`  
**Placeholder to replace:** `[CALENDLY_LINK]`  
**Needs:** B1 (Calendly link)  
**Action:** 
```bash
# Find all [CALENDLY_LINK] in the file and replace with Tyler's link
sed -i 's|\[CALENDLY_LINK\]|<B1_LINK>|g' /BuildFlow/outreach/REAL_PROSPECTS_READY_TO_SEND.md
```
**Verification:** Open file and confirm all 5 emails show real Calendly link, not the placeholder.

---

### 2. Website — Pricing/Checkout Links
**File:** `/BuildFlow/website/src/pages/index.astro` (lines 180 & 198)  
**Current state:** Both links are `mailto:` email placeholders  
**Needs:** B3 (Stripe checkout links)  

**Action — Line 180 (Managed, $249/mo):**
Replace the email link with Stripe checkout:
```
OLD: href="mailto:hello@buildflow.com?subject=Start%20BuildFlow%20Managed%20Growth"
NEW: href="<B3_MANAGED_GROWTH_CHECKOUT_URL>"
```

**Action — Line 198 (Offboard, $799 one-time):**
Replace the email link with Stripe checkout:
```
OLD: href="mailto:hello@buildflow.com?subject=BuildFlow%20Ownership%20plan"
NEW: href="<B3_OWNERSHIP_CHECKOUT_URL>"
```

**Verification:** 
- Visit website in browser preview
- Click both "Get Started" and "Choose Offboard" buttons
- Both lead to real Stripe checkout pages
- No email client opens; no 404 errors

---

### 3. Terms of Service — Business Address
**File:** `/BuildFlow/legal/TERMS_OF_SERVICE.md`  
**Placeholder:** Search for `[ADDRESS]` or `[BUSINESS_ADDRESS]` or `Scottsdale` (example)  
**Needs:** B5 (business address)  
**Action:**
```bash
# Find the address placeholder and replace
sed -i 's|\[ADDRESS\]|<B5_ADDRESS>|g' /BuildFlow/legal/TERMS_OF_SERVICE.md
```
**Verification:** Read §16 and confirm real business address, not placeholder.

---

### 4. Website — Footer/Contact Links
**Files:** `/BuildFlow/website/src/components/Footer.astro` (or similar)  
**Placeholder:** `hello@buildflow.com` or `support@buildflow.com`  
**Needs:** B2 (email addresses confirmed)  
**Action:** Verify footer has correct support email. Usually pre-filled; no change needed if already correct.

---

### 5. Outreach Messaging — Reply-To Address
**Files:** Any outreach script or email template  
**Needs:** B2 (email address)  
**Action:** Ensure "From" line uses `tyler@buildflow.com` when sending.

---

## Execution Checklist

**Once Tyler provides all 6 blockers:**

- [ ] **B1 received** — Calendly link provided
- [ ] **B2 confirmed** — Email addresses working
- [ ] **B3 received** — Stripe checkout links created
- [ ] **B4 confirmed** — Domain status checked
- [ ] **B5 filled in** — Business address confirmed
- [ ] **B6 optional** — Email warmup done (or skipped if N/A)

**Update all files:**
- [ ] Prospect emails — `[CALENDLY_LINK]` → real link
- [ ] Website pricing — Stripe links added
- [ ] Terms of Service — business address filled
- [ ] Footer — support email confirmed
- [ ] Outreach scripts — From: address set

**Verification:**
- [ ] All 5 prospect emails show real Calendly link (read files)
- [ ] Website pricing buttons link to real Stripe checkout
- [ ] Terms §16 shows real business address, not placeholder
- [ ] Support email is clickable in footer
- [ ] No `[PLACEHOLDER]`, `[ADDRESS]`, `[CALENDLY_LINK]`, or similar remain in outreach files

**Ready to send:**
- [ ] All variables in place
- [ ] All verification checks pass
- [ ] Monday 9 AM PT: Tyler sends 5 emails, spaced 2-3 min apart

---

## Files to Check for Remaining Placeholders

Before sending, grep for any leftover placeholders:

```bash
cd /BuildFlow

# Find all placeholder patterns in outreach + website files
grep -r "\[CALENDLY_LINK\]" outreach/ website/
grep -r "\[STRIPE" outreach/ website/
grep -r "\[ADDRESS\]" legal/
grep -r "\[PLACEHOLDER\]" --include="*.md" --include="*.astro" .
```

**Expected result:** Zero matches. If any remain, they must be replaced before sending.

---

## The Order of Operations

1. **Tyler completes B1–B6** (Calendly, email setup, Stripe, domain, address, warmup)
2. **Claude receives the values** (Tyler provides them in chat)
3. **Claude updates all files** using the template above
4. **Claude verifies** no placeholders remain
5. **Claude confirms ready** to Tyler: "All set for Monday 9 AM send"
6. **Tyler sends emails Monday 9 AM** with correct Calendly link
7. **Track opens/clicks** in spreadsheet throughout the week
8. **Handle calls Friday**
9. **Close deals** and start site builds

---

## Questions?

If any of the updates above are unclear, ask Claude before Tyler completes the blockers. Better to clarify now than to have wrong links or missing info in live outreach.

---

**This file:** `/BuildFlow/EXECUTION_VARIABLES_TEMPLATE.md`  
**Status:** Ready to use once blockers are provided  
**Last updated:** 2026-09-11
