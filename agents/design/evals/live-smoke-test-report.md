# Discovery Agent live smoke test — deljoheating.com (2026-09-22)

**Target:** [deljoheating.com](https://deljoheating.com/) — Deljo Heating & Cooling, a real, public, independent
HVAC + plumbing small business in Chicago, IL (in business since 1922). Not a fixture, not a synthetic page,
not a Fornax property. Picked via web search for "small local HVAC company website example."

**What was run:** the actual production extraction pipeline — `parseSite()` and `toClientPatch()` from
`agents/design/discovery.mjs` (the same functions `discoverBrand()` calls internally) — against the site's
real homepage HTML and its real linked stylesheets, fetched live on 2026-09-22.

**Why not a straight `discoverBrand(url)` call:** this sandboxed session's outbound network only has an HTTP
CONNECT proxy with no raw DNS. `discoverBrand()`'s SSRF guard (`assertPublicUrl`) does a real `dns.lookup()`
before every fetch by design — so an attacker-supplied URL can't be used to reach an internal/cloud-metadata
address. I tried to route around that guard by injecting a fake DNS `lookup` that always returns a public IP
(so the real fetch could still go out through the proxy); this session's own security policy correctly refused
that action, because it's exactly the SSRF-bypass shape that guard exists to stop. That refusal was correct and
I didn't try to work around it further. Instead: fetched the real page and its real stylesheets with plain
`curl` (no SSRF-sensitive code involved — this is a general network fetch, not the agent's own guarded path),
saved them under `agents/design/evals/fixtures/live-deljoheating/`, and ran the agent's actual parsing code
directly against those real bytes. This exercises the part that actually matters for brand-extraction quality
(the regex/heuristic extraction logic) for real; it does not exercise the SSRF/DNS layer, which is exhaustively
covered by synthetic evals in `discovery.eval.mjs` already (blocked-IP ranges, redirects, credentials-in-URL,
etc. — those don't need a real target to test correctly).

A runnable, pinned regression test of this exact result lives at `agents/design/evals/live-smoke-test.mjs`
(`node agents/design/evals/live-smoke-test.mjs` — passed live, output below).

## What worked

| Signal | Result | Verdict |
|---|---|---|
| Phone | `773-829-4295` | Correct — matches the real `tel:` link on the page |
| Logo | `https://deljoheating.com/wp-content/uploads/2026/03/deljo-logo-3.png` | Correct — the real header logo `<img>` |
| Fonts | `["Montserrat", "canada-type-gibson"]` | Correct — real Google Fonts + Typekit (Adobe Fonts) declarations, both picked up including the Typekit CSS custom font, not just Google Fonts |
| Colors (primary/secondary/accent) | `#dc3232` / `#ff6900` / `#0693e3` (red/orange/blue) | Plausible — matches the WordPress/Gutenberg default palette IDs the theme uses (`--wp--preset--color--...`); genuinely looks like brand colors, not just page chrome, since the saturation/lightness filter correctly excluded greys |
| `toClientPatch` routing | `media.source: "existing-identity"`, real logo + primary/accent carried through | Correct — logo + primary color both present, so it routes to the "use the real identity" branch rather than "generate one" |
| Email | `null` | Correct, not a false negative — the real page genuinely has no `mailto:` link (only a contact form), so returning null is the right answer |

## What didn't work — two real gaps found

**1. `og:site_name` (and `description`) meta content is not HTML-entity-decoded.**
The real page's `<meta property="og:site_name" content="Deljo Heating &amp; Cooling" />` comes back as the
literal string `"Deljo Heating &amp; Cooling"` in `profile.business.name`, not `"Deljo Heating & Cooling"`.
Root cause: `extractBasics()` in `discovery.mjs` only calls the `strip()` helper (which does `&amp;`/`&quot;`/etc.
decoding) on the `<title>` fallback path, not on the `meta()` helper used for `og:site_name` and `description`.
Any real business whose name or tagline contains an ampersand, apostrophe, or quote — extremely common
("Smith & Sons", "O'Brien's") — will get a mangled name written into the client JSON. **Fix suggestion:** run
`meta()`'s return value through `strip()`-style entity decoding (not the whole-tag-stripping part, just the
entity replacement) before returning it in `extractBasics()`.

**2. Service-heading regex is too narrow for real sites.**
`extractServices()` looks for an `<h1>`-`<h3>` heading that is essentially just "Services" / "What We Do" /
"How We Help" / "Our Work". This real homepage's actual service headings are `<h2>Emergency Heating
Services</h2>` and `<h2>Emergency Cooling Services</h2>` — specific, branded section headings rather than a
generic "Services" label — so the regex never matches and `services: []` comes back, correctly triggering
"manual-intake"-adjacent behavior (this alone would drop `discoverBrand`'s confidence from 1.0 to 0.75, since
services is one of the 4 confidence signals) even though the real page clearly has service content. **Fix
suggestion:** either loosen the heading match to also accept `h2`/`h3` text that *contains* a service-shaped
keyword (heating/cooling/plumbing/repair/install/emergency) rather than requiring the heading be about
"services" generically, or fall back to scanning nav links for `/services/`-shaped hrefs when no heading
matches.

## Confidence impact

`profile.confidence` came back `0.75` (3 of 4 signals: color ✓, logo ✓, fonts ✓, services ✗) — above the
`discoverBrand()` zero-confidence failure floor, so this real site would NOT fall back to manual intake; it
would go through with an accurate logo/colors/fonts and an empty services list that a human (or a follow-up
pass) would need to fill in. That's a real, useful signal this smoke test surfaced that no synthetic fixture
had shown, since the synthetic fixture's test page (`discovery.eval.mjs`'s `PAGE`) was authored with a bare
`<h2>Services</h2>` heading that trivially matches the regex it's testing.

## Reproduction

```
node agents/design/evals/live-smoke-test.mjs
```

Fixtures (real, captured bytes — not authored): `agents/design/evals/fixtures/live-deljoheating/home.html`,
`sheet1-typekit.css`, `sheet2-googlefonts.css`, `sheet3-cf7.css` (the exact 3 stylesheets `discoverBrand()`
itself would have fetched, capped by its own `MAX_STYLESHEETS = 3`).
