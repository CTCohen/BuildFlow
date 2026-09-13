# Tier Feature Matrix — Website & Dashboard Capabilities

**Purpose:** Lock in what each tier can do. This drives design system scope, QA criteria, and dashboard development.

---

## Website Features (Public-Facing)

| Feature | Micro | SMB | Mid-market |
|---------|-------|-----|-----------|
| **Core Pages** |
| Home | ✅ | ✅ | ✅ |
| Services list | ✅ | ✅ | ✅ |
| Service detail (click-through) | ✅ | ✅ | ✅ |
| About/Team | No | Optional | ✅ |
| Service portfolio (before/after) | No | No | ✅ |
| Blog | No | No | ✅ |
| Testimonials | ✅ (2–3) | ✅ (5–10) | ✅ (10+) |
| Contact/Quote form | ✅ | ✅ | ✅ |
| Service area map | No | Optional | ✅ |
| **Content Density** |
| Services per site | 2–4 | 5–10 | 10+ unlimited |
| Pages total | 5–7 | 10–15 | 20+ |
| **Design & Customization** |
| Brand color injection | ✅ | ✅ | ✅ |
| Logo upload | ✅ | ✅ | ✅ |
| Font choice (preset) | No (1 system font) | ✅ (3 options) | ✅ (custom fonts) |
| Hero style options | 1 preset | 5+ options | Unlimited + custom CSS |
| Custom CSS override | No | No | ✅ |
| **SEO & Performance** |
| Local SEO basics | ✅ | ✅ | ✅ |
| AI SEO optimization | No | ✅ | ✅ (advanced) |
| Schema markup | Basic | Standard | Rich (LocalBusiness, Service, Reviews) |
| Sitemap/Robots | ✅ | ✅ | ✅ |

---

## Dashboard Features (What Owners Can Edit)

### Micro Dashboard — VIEW ONLY + Limited Edits

**Primary user:** Solopreneur (no time for management)  
**Use case:** "I just want a professional site, minimal fuss"  
**Access level:** View submissions only; request edits via email/support

| Feature | Access | Notes |
|---------|--------|-------|
| **Read-Only** |
| View site analytics (basic) | ✅ | Pageviews, traffic source (no conversion tracking) |
| View form submissions | ✅ | Contact form, quote requests |
| View phone call logs | ✅ | If integrated with Twilio |
| **Limited Edit** |
| Edit hours/availability | ✅ | Simple time picker (open/closed) |
| Add phone number | ✅ | One phone number only |
| Upload single logo | ✅ | Replace uploaded logo |
| **Not Available** |
| Edit service descriptions | ❌ | Request via support |
| Add testimonials | ❌ | Request via support |
| Change colors/fonts | ❌ | Request via support |
| Multi-user access | ❌ | Single owner only |
| API access | ❌ | No integrations |
| Custom fields | ❌ | Fixed schema |

---

### SMB Dashboard — SELF-SERVICE EDITS

**Primary user:** Small business owner (wants control)  
**Use case:** "I want to update my site myself, manage my own content"  
**Access level:** Full CRUD on content; no design changes

| Feature | Access | Notes |
|---------|--------|-------|
| **Read & Manage** |
| View site analytics | ✅ | Pageviews, referrer, call tracking |
| View form submissions | ✅ | Contact/quote forms, export CSV |
| View/manage appointments | Optional | If calendar integration exists |
| **Content Editing** |
| Edit service descriptions | ✅ | Text + description |
| Add/remove services | ✅ | Up to 10 services |
| Add testimonials | ✅ | With photo, text, author name |
| Upload photos | ✅ | For services, team, testimonials |
| Edit hours/availability | ✅ | Per service or site-wide |
| Edit contact info | ✅ | Phone, email, address |
| Edit about/team info | Optional | One page, short bio |
| **Customization (Limited)** |
| Edit brand color | No | Pre-approved by BuildFlow |
| Edit fonts | No | Locked to 3 preset options |
| Change hero style | No | Locked to current style |
| **Not Available** |
| Custom CSS | ❌ |  |
| Multi-user access | ❌ | Single owner |
| API access | ❌ | No integrations |
| Advanced analytics | ❌ | Basic only |

---

### Mid-Market Dashboard — FULL CUSTOMIZATION + INTEGRATIONS

**Primary user:** Business manager, marketing team, franchisee  
**Use case:** "We need full control, integrations with our tools, white-label brand"  
**Access level:** Everything + API + multi-user roles

| Feature | Access | Notes |
|---------|--------|-------|
| **Read & Manage** |
| Full analytics | ✅ | Pageviews, funnels, conversion tracking, goals |
| Form submissions with CRM sync | ✅ | Auto-sync to HubSpot, Salesforce, Pipedrive |
| Calendar/appointment integrations | ✅ | Sync with Calendly, Google Calendar, ServiceTitan |
| Lead scoring | ✅ | Track quality of leads from site |
| **Content Editing** |
| Unlimited services | ✅ | With portfolio (before/after photos) |
| Unlimited team bios | ✅ | With detailed profiles |
| Unlimited testimonials | ✅ | Video testimonials, rich media |
| Service portfolio (before/after) | ✅ | Photo gallery per service |
| Blog/resources | ✅ | Content calendar, scheduling |
| Custom fields | ✅ | Define any data you need |
| **Design Customization** |
| Full color customization | ✅ | Unlimited brand colors |
| Font upload | ✅ | Custom fonts (Google Fonts + uploads) |
| Hero/section editor | ✅ | Visual builder for layouts |
| Custom CSS | ✅ | Full CSS override capability |
| White-label option | ✅ | Remove "Built by BuildFlow" branding |
| **Advanced Features** |
| Multi-user team access | ✅ | Roles: Owner, Editor, Viewer |
| API access | ✅ | Read/write data via REST API |
| Webhook integrations | ✅ | Custom integrations (Zapier, etc.) |
| Advanced CRM integrations | ✅ | ServiceTitan, HubSpot, Salesforce, Pipedrive |
| Payment integration | ✅ | Stripe, Square, PayPal for quotes |
| Custom domain | ✅ | Any domain, white-label SSL |
| Priority support | ✅ | Dedicated support email/Slack |

---

## Backend Integrations per Tier

| Integration | Micro | SMB | Mid-market |
|------------|-------|-----|-----------|
| **Lead Routing** |
| Email routing | ✅ | ✅ | ✅ |
| SMS routing | No | ✅ | ✅ |
| **CRM Sync** |
| Google Contacts | No | No | ✅ |
| HubSpot | No | No | ✅ |
| Salesforce | No | No | ✅ |
| Pipedrive | No | No | ✅ |
| Airtable | No | No | ✅ |
| **Calendar/Scheduling** |
| Calendly | No | No | ✅ |
| Google Calendar | No | No | ✅ |
| ServiceTitan (HVAC/Plumbing) | No | No | ✅ |
| **Payment/Quotes** |
| Stripe (quotes → invoices) | No | No | ✅ |
| Square (point of sale) | No | No | ✅ |
| **Analytics** |
| Google Analytics (basic) | No | ✅ | ✅ |
| Call tracking (Twilio) | No | Optional | ✅ |
| Form analytics | No | ✅ | ✅ |
| **Automation** |
| Zapier | No | No | ✅ |
| Make.com | No | No | ✅ |

---

## QA & Performance per Tier

### Micro — Fast & Simple
- **Build time:** 2–3 days (AI-driven, minimal input needed)
- **QA criteria:**
  - Lighthouse ≥ 85 (performance is critical for small sites)
  - Form submit working
  - Mobile responsive (tested)
  - EN/ES parity
  - No placeholder content
  - Required content: 2–3 testimonials, 3–4 services, 1 page about
- **Testing scope:** Core pages + forms only; no advanced features

### SMB — Standard
- **Build time:** 4–6 days (AI + manual refinement, client input)
- **QA criteria:**
  - Lighthouse ≥ 90 (standard Web Vitals)
  - Forms + analytics working
  - Mobile + tablet responsive
  - EN/ES parity
  - Visual polish per brand
  - Required content: 5+ testimonials, 5–10 services, brand story
  - No dead links, all features tested
- **Testing scope:** All public pages, forms, analytics, service detail pages

### Mid-Market — Premium & Detailed
- **Build time:** 8–14 days (custom design, integrations, consultation)
- **QA criteria:**
  - Lighthouse ≥ 95 (premium performance expected)
  - All integrations tested (CRM, calendar, payment)
  - Dashboard full functional test
  - Multi-user team access tested
  - Mobile + tablet + desktop responsive
  - EN/ES + any custom languages
  - Accessibility audit (WCAG AA)
  - SEO: schema markup, meta tags, sitemap indexed
  - Required content: 10+ testimonials, unlimited services, portfolio, team, blog
  - White-label branding verified
- **Testing scope:** Every feature, every integration, dashboard, API

---

## Content Requirements per Tier

### Micro
- **Logo:** Required
- **Business name:** Required
- **Phone/email:** Required
- **Services:** 2–4 (short description, 1 sentence)
- **Testimonials:** 2–3 (short, 1–2 sentences)
- **About:** Optional (auto-generated if missing)
- **Hours:** Required

### SMB
- **Logo:** Required
- **Business name:** Required
- **Phone/email/address:** Required
- **Services:** 5–10 (detailed description, benefits)
- **Testimonials:** 5+ (1–2 paragraphs, photo, author name)
- **About:** Required (2–3 paragraphs, brand story)
- **Hours:** Required
- **Service areas:** Optional (locations served)

### Mid-Market
- **Logo + brand assets:** Required (favicon, multiple formats)
- **Business name:** Required
- **Contact info:** Phone, email, multiple addresses, social media
- **Services:** 10+ unlimited (detailed, with portfolio/before-after)
- **Testimonials:** 10+ unlimited (video + text, detailed)
- **Team bios:** Required (full team, roles, photos, bios)
- **About/Brand story:** Required (2+ pages, vision, company history)
- **Blog/resources:** Recommended (thought leadership)
- **Hours per location:** Required
- **Service areas:** Required with territories/coverage maps
- **Custom fields:** As needed (certifications, awards, etc.)

---

## Open Questions to Lock In

1. **Micro dashboard access:** Should they have ANY editing capability, or purely view-only with email support for changes?
2. **SMB testimonial management:** Can they add testimonials directly, or submit for approval first?
3. **Mid-market white-label:** Can they hide "Built by BuildFlow" completely, or always visible in footer?
4. **Micro design:** Single fixed hero style, or 2–3 simple preset options?
5. **Integrations roadmap:** Which integrations (CRM, calendar, payment) ship with Mid-market v1 vs. Phase 2+?
6. **SMB analytics:** Google Analytics only, or custom dashboard too?
7. **Pricing alignment:** Do these features justify the $49 / $99 / $299 price points?

---

**Next step:** Lock in answers, then design the dashboard architecture and code structure.
