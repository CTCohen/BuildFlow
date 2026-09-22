---
title: Credential Setup Steps
purpose: Exact, ordered steps for every account/credential that has more than one step or moving part — so nothing gets half-done and forgotten. Simple single-key accounts stay in TYLER_QUEUE.md; this file is only for the multi-step ones.
status: active
owner: c.t.cohen
updated: '2026-09-22'
version: 1.0.0
tier_scope: all
phase: phase_1
---

# Credential setup steps

Update the status line at the top of each section as steps complete. Never put an actual secret value in this
file — it's tracked by git. Real values go in `.local/*.env` (gitignored) or the provider's own secret store.

## Cloudflare
**Status: MCP setup in progress, account status unknown.**
1. ☐ Create/confirm a Cloudflare account
2. ☐ From a regular terminal (not this session — sandboxed): `claude plugin marketplace add cloudflare/skills`
3. ☐ `claude plugin install cloudflare@cloudflare`
4. ☐ `/reload-plugins`
5. ☐ First real use of a `cloudflare` MCP tool triggers OAuth in your browser — approve it there
6. ☐ Separately, for the actual hosting (not just the MCP tool): create an API token with Pages/Workers/R2/DNS
   permissions at dash.cloudflare.com → My Profile → API Tokens. Store in `.local/cloudflare.env`, never in chat.
7. ☐ Confirm which domains you're pointing here (ties to TYLER_QUEUE.md's domain question)

## Supabase
**Status: partial — project exists, publishable key stored, service role key missing.**
1. ✔ Project created: `wvkvcuffyzbejuipjfhu.supabase.co`
2. ✔ Publishable key stored in `.local/supabase.env` (2026-09-21)
3. ☐ **Service role key** — dashboard → Project Settings → API → service_role (or "secret keys" in the newer
   format). This is the one the backend needs to bypass row-level security for admin work. More sensitive than
   the publishable key — add it directly to `.local/supabase.env`, don't paste it in chat.
4. ☐ Enable Google as an auth provider (dashboard → Authentication → Providers) — needed for customer/admin login
5. ☐ Set minimum password length to 12 (dashboard → Authentication → Policies)
6. ☐ Enroll TOTP on your own account before adding yourself to `admin.admins` (see `platform/AUTH-SETUP.md`)
7. ☐ Expose only the `app` schema to the Data API — never `admin` (dashboard → API settings)
8. ☐ Once the service role key is in, someone runs the real migrations against this project (currently only
   tested against a local throwaway database)

## SendGrid
**Status: not started — only the MCP plumbing exists, no account or key.**
1. ☐ Create a SendGrid account (this needs to be Fornax's own — confirmed no reusable account-wide key exists)
2. ☐ Verify a sending domain (not just a single email) — needed for deliverability
3. ☐ Create a **separate** sender domain/subdomain just for cold outreach, distinct from transactional email —
   keeps a bad cold-email day from breaking password-reset emails etc.
4. ☐ Generate an API key (Settings → API Keys), scoped to Mail Send only if possible
5. ☐ Start domain warmup — this takes real calendar time (days to weeks), so earlier is better even before
   anything else here is ready
6. ☐ Fill the key into `~/Claude-Optimization/mcp/sendgrid-mcp/`'s config (currently blank) if you want the
   SendGrid MCP tools working, and/or into `.local/sendgrid.env` for Fornax's own use

## Stripe
**Status: not started.**
1. ☐ Create account (test mode first — do not touch live mode until legal sign-off, see TYLER_QUEUE.md G7)
2. ☐ Create Products: Micro, SMB (Mid-Market paused, don't build it)
3. ☐ Create Prices under each: monthly and annual (annual = 10x monthly), versioned so a later price change
   doesn't break existing customers' Price IDs
4. ☐ Set up a webhook endpoint (URL comes from the Foundation lane once it has a real deploy target)
5. ☐ Store the webhook signing secret + API keys in `.local/stripe.env`

## HubSpot
**Status: not started.**
1. ☐ Create a HubSpot developer account
2. ☐ Create a private app (simpler than a public OAuth app for a single-tenant internal connector) scoped to
   contacts/deals write access
3. ☐ Store the private app token in `.local/hubspot.env`
4. ☐ Separately, apply now for Jobber and ServiceTitan partner API access — these have a 1-2 week approval
   lead time per their docs, so starting the application early matters even though they're not being built yet

## Google Cloud (OAuth for customer/admin login)
**Status: not started.**
1. ☐ Create/confirm a Google Cloud project
2. ☐ Configure the OAuth consent screen (External, since customers aren't in your org)
3. ☐ Create an OAuth 2.0 Client ID (Web application type)
4. ☐ Add authorized redirect URIs (will need the real domain once Cloudflare hosting is live — placeholder
   `localhost` URIs work for local testing in the meantime)
5. ☐ Store client ID + secret in `.local/google-oauth.env`, and also add them in the Supabase dashboard under
   Authentication → Providers → Google

## Anthropic Console API key
**Status: not started.**
1. ☐ Create the key at console.anthropic.com (separate from your Claude Pro subscription login)
2. ☐ Set a **$30/mo spend limit** on it — this is a hard rule from the cost plan, not optional
3. ☐ Store in `.local/anthropic-api.env` — note this is different from the `ANTHROPIC_API_KEY` in
   `~/.claude/credentials.env`, which is explicitly NOT auto-exported to avoid billing Claude Code itself
   pay-per-token. Keep Fornax's key separate from that one.

---
## How this file gets used
The daily coordinator agent reads this alongside `TYLER_QUEUE.md` — if it finds a task blocked on a credential
that has multi-step setup here, it points here for the steps instead of just saying "get an account." Update the
status line and check off steps as you go; the coordinator will notice and stop flagging what's already done.
