# CRM MCP Integration Roadmap

> Backend MCP integrations for each vertical phase.
> Connects customer CRM data to BuildFlow sites for real-time lead/job data display.
> Last updated: 2026-09-13

---

## Phase 1: Launch Trades (Now → 9/30)

**Verticals:**
- Plumbing & Pipefitting
- HVAC (Heating, Ventilation, Air Conditioning)
- Electrical Contracting & Wiring
- Roofing, Siding & Gutter Installation

**CRM MCPs to Build:**
1. ServiceTitan
2. Jobber
3. Housecall Pro
4. HubSpot
5. Successware

**Priority Order:**
1. Jobber (highest market share in trades)
2. ServiceTitan (enterprise-grade, recurring revenue strong)
3. Housecall Pro (mid-market favorite)
4. HubSpot (catch-all CRM for non-specialized shops)
5. Successware (regional favorite, HVAC-heavy)

**Integration Features:**
- Real-time job status → site dashboard
- Customer data sync (phone, address, service area)
- Lead capture from website → CRM → technician dispatch
- Service history display (optional, privacy-gated)

---

## Phase 2: Property & Facility Maintenance (10/1 → 12/31)

**Verticals:**
- Landscaping, Lawn Care, Groundskeeping
- Tree Care, Pruning, Arborist Services
- Pest Control & Wildlife Removal
- Residential & Commercial Cleaning (Janitorial)
- Window Cleaning
- Pool Maintenance & Repair
- Septic Tank Pumping & Maintenance
- Snow Removal & De-icing
- Pressure Washing & Exterior Surface Cleaning
- Waste Management & Junk Removal

**CRM MCPs to Build:**
1. RealGreen
2. QuoteIQ
3. ZenMaid
4. Swept
5. Jobber (already built in Phase 1)

**Priority Order:**
1. Jobber (reuse Phase 1 build)
2. RealGreen (landscaping market leader)
3. ZenMaid (cleaning vertical specialist)
4. Swept (window cleaning specialist)
5. QuoteIQ (general maintenance/service platform)

**Integration Features:**
- Seasonal service scheduling display
- Maintenance reminder automation
- Before/after photo gallery sync
- Recurring service contract status

---

## Phase 3: Automotive & Transportation (1/1 → 3/31)

**Verticals:**
- Automotive Repair & Mechanical Diagnostics
- Collision Repair, Bodywork, Paint
- Mobile Fleet Maintenance
- Auto Detailing & Paint Protection Film
- Towing & Roadside Assistance
- Transmission & Drivetrain Specialization
- Windshield Repair & Replacement
- Vehicle Fleet Management
- Courier, Delivery, Local Logistics
- Moving & Storage Operations

**CRM MCPs to Build:**
1. Tekmetric
2. AutoLeap
3. Shopmonkey
4. HubSpot (already built in Phase 1)

**Priority Order:**
1. HubSpot (reuse Phase 1 build)
2. Tekmetric (automotive repair leader)
3. Shopmonkey (collision & body shop favorite)
4. AutoLeap (fleet maintenance specialist)

**Integration Features:**
- Service appointment calendar sync
- Diagnostic report display
- Parts inventory status
- Fleet tracking (for logistics/moving)
- Customer vehicle history

---

## Phase 4: Security, Safety & Infrastructure (4/1 → 6/30)

**Verticals:**
- Alarm & Access Control Installation
- CCTV & Surveillance Setup
- Private Investigation Services
- Executive Protection & Event Security
- Fire Protection, Sprinkler, Extinguisher Maintenance
- Locksmith Services & Safe Maintenance
- Disaster Restoration (Water, Fire, Mold Remediation)
- Environmental Testing (Asbestos, Lead, Radon)

**CRM MCPs to Build:**
- Research & determine (likely vertical-specific specialists)

**Candidates (TBD):**
- Comtech (security systems)
- Workwiz (facility management)
- eMerge (disaster restoration)
- Vertical-specific custom integrations

**Integration Features:**
- Permit/compliance tracking
- Certification expiration alerts
- Incident response documentation
- Environmental testing report archive

---

## MCP Development Phases

### Phase 1A: Foundation (Sept 13–30)
**Goal:** First 2 MCPs live, Phase 1 sites can wire to CRM

- [ ] Jobber MCP
- [ ] ServiceTitan MCP
- [ ] Basic dashboard UI for data display
- [ ] OAuth setup for user authentication per MCP

### Phase 1B: Completion (Oct 1–15)
- [ ] Housecall Pro MCP
- [ ] HubSpot MCP
- [ ] Successware MCP
- [ ] Lead capture → CRM webhook

### Phase 2: Maintenance (Oct 16 – Dec 31)
- [ ] RealGreen, ZenMaid, Swept, QuoteIQ MCPs
- [ ] Service scheduling display features
- [ ] Photo/portfolio sync from CRM

### Phase 3: Automotive (Jan 1 – Mar 31)
- [ ] Tekmetric, AutoLeap, Shopmonkey MCPs
- [ ] Fleet tracking features
- [ ] Diagnostic report display

### Phase 4: Specialized (Apr 1 – Jun 30)
- [ ] Vertical-specific MCPs (research phase first)
- [ ] Compliance/certification tracking
- [ ] Documentation archive features

---

## Technical Architecture

### MCP Pattern (All Phases)
```
CRM (ServiceTitan, Jobber, etc.)
    ↓ (OAuth 2.0)
BuildFlow Backend MCP
    ↓ (REST/GraphQL)
BuildFlow Site Dashboard
    ↓
Customer Portal (on their site)
```

### Data Flow
1. **Authentication:** Customer authorizes BuildFlow to read their CRM
2. **Sync:** Real-time or hourly sync of relevant data
3. **Display:** Site shows live job status, upcoming appointments, customer info
4. **Bidirectional:** Optional write-back (lead capture, status updates)

### Per-MCP Checklist
- [ ] OAuth setup and token refresh
- [ ] API documentation review
- [ ] Read endpoints (jobs, customers, appointments, leads)
- [ ] Write endpoints (if supported)
- [ ] Rate limiting & throttling
- [ ] Error handling & retry logic
- [ ] Dashboard UI component
- [ ] Testing with real data

---

## Market Research Notes

### Phase 1 (Launch Trades)
- **Jobber:** 75k+ small service businesses (highest SMB penetration)
- **ServiceTitan:** Enterprise focus, $2k+/mo (recurring revenue play)
- **Housecall Pro:** 40k+ users, especially HVAC/plumbing
- **HubSpot:** Catch-all for businesses without specialized CRM
- **Successware:** HVAC-dominant, regional (Southwest US strong)

### Phase 2 (Maintenance)
- **RealGreen:** Landscaping vertical leader
- **ZenMaid:** Cleaning-specific, modern, SMB-friendly
- **Swept:** Window cleaning niche
- **QuoteIQ:** General maintenance/service (broad but shallow)

### Phase 3 (Automotive)
- **Tekmetric:** Repair shops, modern SaaS
- **AutoLeap:** Fleet maintenance, integrated parts ordering
- **Shopmonkey:** Collision/body shops, strong API

### Phase 4 (Security/Specialized)
- Research required per vertical (likely no single dominant player)

---

## Business Value

### For BuildFlow
- **Differentiation:** Only web builder offering live CRM integration
- **Stickiness:** Sites more valuable with real-time data (harder to leave)
- **Upsell:** CRM integration as premium tier ($149/mo instead of $99/mo)

### For Customers
- **Lead capture:** Website form → CRM → technician (closed loop)
- **Trust:** Live job counter, testimonials, service history builds credibility
- **Efficiency:** No manual data entry (site shows what's in CRM)

### Revenue Impact
- Phase 1: Base sites ($99/mo) + CRM integration upsell ($50/mo)
- Phase 2+: CRM integration becomes table-stakes (included, not upsell)

---

## Known Issues & Dependencies

### Authentication
- Each CRM requires OAuth setup (takes 1–2 weeks per vendor)
- Some require partnership approval (ServiceTitan, Jobber)
- API keys vs OAuth (some CRMs only support API keys, less secure)

### Rate Limits
- Most CRMs have strict rate limits (100–1000 req/hr)
- High-volume reads (10+ sites syncing simultaneously) = throttling issues
- Solution: Implement job queue + smart caching

### Data Privacy
- Customer data (phone, address, service history) stays on CRM (good)
- Website only shows aggregated/redacted data by default
- GDPR/CCPA compliance: Must allow opt-out per customer

### Support Load
- CRM integrations are "custom integration" support (high burden)
- Need internal runbook for "why is my CRM data not showing?"
- Solution: Automated diagnostics + clear error messages

---

## Rollout Checklist (Per MCP)

- [ ] Research API documentation
- [ ] Build OAuth flow
- [ ] Implement read endpoints (jobs, customers, appointments)
- [ ] Add write endpoints (if needed)
- [ ] Build dashboard UI component
- [ ] Test with real customer account
- [ ] Document setup instructions
- [ ] Create support runbook
- [ ] Train sales team
- [ ] Launch to Phase 1 customers
- [ ] Monitor for issues (first 2 weeks)
- [ ] Iterate based on feedback

---

## File Structure

```
BuildFlow/
├── backend/
│   └── mcps/
│       ├── jobber/              [Phase 1A]
│       ├── servicetitan/        [Phase 1A]
│       ├── housecall-pro/       [Phase 1B]
│       ├── hubspot/             [Phase 1B]
│       ├── successware/         [Phase 1B]
│       ├── realgreen/           [Phase 2]
│       ├── zenmaid/             [Phase 2]
│       ├── swept/               [Phase 2]
│       ├── quoteiq/             [Phase 2]
│       ├── tekmetric/           [Phase 3]
│       ├── autoleap/            [Phase 3]
│       └── shopmonkey/          [Phase 3]
├── frontend/
│   └── dashboard/
│       └── crm-widgets/
│           ├── job-status.astro
│           ├── lead-counter.astro
│           └── appointment-calendar.astro
└── docs/
    └── CRM_MCP_INTEGRATION_ROADMAP.md (this file)
```

---

**This file:** `/BuildFlow/docs/CRM_MCP_INTEGRATION_ROADMAP.md`  
**Status:** Strategic roadmap (execution starts Phase 1B, Oct 1)  
**Last updated:** 2026-09-13
