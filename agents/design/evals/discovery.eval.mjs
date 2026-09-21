// Design Discovery evals: SSRF blocking, extraction from a fixture site, and the manual-intake fallback.
// No network: fetch and DNS are injected.
import { assert, baseClient } from "./harness.mjs";
import { discoverBrand, assertPublicUrl, isBlockedIp, parseSite, toClientPatch, MANUAL_INTAKE_FIELDS } from "../discovery.mjs";
import { resolveDesign } from "../design-agent.mjs";

const PUBLIC = "93.184.216.34";
const lookupTo = (address) => async () => [{ address, family: 4 }];
const HOME = "https://www.ridgeline-roofing.test/";

const CSS = `
:root { --brand: #b3261e; --accent: #1f4e79; }
body { font-family: "Barlow", Arial, sans-serif; color: #222; background: #ffffff; }
h1, h2 { font-family: "Oswald", sans-serif; }
.btn { background: #b3261e; } .hero { background: #b3261e } .muted { color: #777777; background: #f5f5f5 }
`;
const PAGE = `<!doctype html><html><head><title>Ridgeline Roofing | Boise Roofers</title>
<meta property="og:site_name" content="Ridgeline Roofing"><meta name="description" content="Roof repair and replacement in Boise since 1998.">
<meta name="theme-color" content="#b3261e">
<link rel="stylesheet" href="/site.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Barlow&display=swap">
</head><body><header><a href="/"><img class="site-logo" src="/img/ridgeline-logo.svg" alt="Ridgeline Roofing logo"></a><nav><a href="/services">Services</a></nav></header>
<main><h1>Boise roofing you can trust</h1>
<h2>Our Services</h2>
<h3>Roof Replacement</h3><p>Full tear-off and replacement with a 25-year workmanship warranty.</p>
<h3>Storm Damage Repair</h3><p>Hail and wind damage repair, insurance paperwork handled.</p>
<h3>Gutters</h3><p>Seamless gutters installed and cleaned.</p>
<h2>Contact</h2><a href="tel:+12085550142">Call (208) 555-0142</a> <a href="mailto:office@ridgeline-roofing.test">Email</a>
</main><footer>© Ridgeline</footer></body></html>`;

function fakeFetch(routes) {
  const seen = [];
  const fn = async (url) => {
    seen.push(url);
    const hit = routes[url] ?? routes[new URL(url).pathname];
    if (hit instanceof Error) throw hit;
    if (!hit) return { ok: false, status: 404, headers: new Headers(), text: async () => "" };
    const { status = 200, body = "", headers = {} } = typeof hit === "string" ? { body: hit } : hit;
    return { ok: status < 400, status, headers: new Headers(headers), text: async () => body };
  };
  fn.seen = seen;
  return fn;
}

const blocked = async (url, lookup) => { await assert.rejects(() => assertPublicUrl(url, lookup ?? lookupTo(PUBLIC)), /blocked|invalid/, url); };

export default [
  // ---- SSRF
  { id: "v01", desc: "loopback, private, link-local and metadata IPv4 are blocked", run() {
    for (const ip of ["127.0.0.1", "10.0.0.5", "172.16.4.4", "172.31.255.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "224.0.0.1"]) assert.equal(isBlockedIp(ip), true, ip);
    for (const ip of ["93.184.216.34", "8.8.8.8", "172.32.0.1"]) assert.equal(isBlockedIp(ip), false, ip);
  } },
  { id: "v02", desc: "IPv6 loopback, ULA, link-local and IPv4-mapped loopback are blocked", run() {
    for (const ip of ["::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1", "::ffff:10.1.1.1"]) assert.equal(isBlockedIp(ip), true, ip);
    assert.equal(isBlockedIp("2606:4700:4700::1111"), false);
  } },
  { id: "v03", desc: "literal internal addresses and localhost are rejected", async run() {
    await blocked("http://127.0.0.1/");
    await blocked("http://localhost/admin");
    await blocked("http://169.254.169.254/latest/meta-data/");
    await blocked("http://[::1]/");
  } },
  { id: "v04", desc: "obfuscated IPv4 forms (decimal, hex) are rejected", async run() {
    await blocked("http://2130706433/");
    await blocked("http://0x7f000001/");
    await blocked("http://0177.0.0.1/");
  } },
  { id: "v05", desc: "non-http schemes and embedded credentials are rejected", async run() {
    await blocked("file:///etc/passwd");
    await blocked("ftp://example.org/");
    await blocked("gopher://example.org/");
    await blocked("https://user:pw@example.org/");
  } },
  { id: "v06", desc: "a public-looking hostname that resolves to a private IP is rejected (DNS rebinding)", async run() {
    await blocked("http://innocent.example.org/", lookupTo("10.0.0.7"));
    await blocked("http://innocent.example.org/", async () => [{ address: PUBLIC }, { address: "127.0.0.1" }]);
  } },
  { id: "v07", desc: "internal-suffix hostnames are rejected", async run() {
    await blocked("http://printer.local/");
    await blocked("http://db.internal/");
  } },
  { id: "v08", desc: "a redirect to an internal address is not followed", async run() {
    const f = fakeFetch({ [HOME]: { status: 302, headers: { location: "http://169.254.169.254/latest/" } } });
    const r = await discoverBrand(HOME, { fetchImpl: f, lookup: async (h) => [{ address: h === "169.254.169.254" ? "169.254.169.254" : PUBLIC }] });
    assert.equal(r.ok, false);
    assert.match(r.reason, /blocked/);
    assert.equal(f.seen.length, 1);
  } },
  { id: "v09", desc: "a redirect loop stops after 3 hops", async run() {
    const f = fakeFetch({ [HOME]: { status: 302, headers: { location: HOME } } });
    const r = await discoverBrand(HOME, { fetchImpl: f, lookup: lookupTo(PUBLIC) });
    assert.equal(r.ok, false);
    assert.match(r.reason, /redirect/);
  } },

  // ---- extraction
  { id: "v10", desc: "brand colors come from tokens and theme-color, not greys or white", run() {
    const p = parseSite({ html: PAGE, css: CSS, url: HOME });
    assert.equal(p.colors.primary, "#b3261e");
    assert.equal(p.colors.accent, "#1f4e79");
    assert.ok(![p.colors.primary, p.colors.accent, p.colors.secondary].some((c) => ["#ffffff", "#222222", "#777777", "#f5f5f5"].includes(c)));
  } },
  { id: "v11", desc: "fonts: named families kept, generics dropped, Google Fonts links counted", run() {
    const p = parseSite({ html: PAGE, css: CSS, url: HOME });
    assert.ok(p.fonts.includes("Oswald") && p.fonts.includes("Barlow"));
    assert.ok(!p.fonts.some((f) => /arial|sans-serif/i.test(f)));
  } },
  { id: "v12", desc: "logo is found in the header and resolved to an absolute URL", run() {
    assert.equal(parseSite({ html: PAGE, css: "", url: HOME }).logo_url, "https://www.ridgeline-roofing.test/img/ridgeline-logo.svg");
  } },
  { id: "v13", desc: "logo falls back to the touch icon when no <img> looks like a logo", run() {
    const html = '<html><head><link rel="apple-touch-icon" href="/icon-180.png"></head><body><img src="/hero.jpg"></body></html>';
    assert.equal(parseSite({ html, url: HOME }).logo_url, "https://www.ridgeline-roofing.test/icon-180.png");
  } },
  { id: "v14", desc: "services come from the Services section headings with their blurbs", run() {
    const p = parseSite({ html: PAGE, css: "", url: HOME });
    assert.deepEqual(p.services.map((s) => s.name), ["Roof Replacement", "Storm Damage Repair", "Gutters"]);
    assert.match(p.services[0].blurb, /25-year/);
  } },
  { id: "v15", desc: "services fall back to list items; a page with no section gives none", run() {
    const li = '<h2>What we do</h2><ul><li>Drain cleaning</li><li>Water heaters</li></ul><h2>Other</h2>';
    assert.deepEqual(parseSite({ html: li, url: HOME }).services.map((s) => s.name), ["Drain cleaning", "Water heaters"]);
    assert.deepEqual(parseSite({ html: "<h1>Hi</h1>", url: HOME }).services, []);
  } },
  { id: "v16", desc: "name, phone and email are read from meta, tel: and mailto:", run() {
    const b = parseSite({ html: PAGE, url: HOME }).business;
    assert.equal(b.name, "Ridgeline Roofing");
    assert.match(b.phone, /2085550142/);
    assert.equal(b.email, "office@ridgeline-roofing.test");
  } },
  { id: "v17", desc: "end to end: crawl merges the linked stylesheet and returns a profile", async run() {
    const f = fakeFetch({ [HOME]: PAGE, "/site.css": CSS, "https://fonts.googleapis.com/css2?family=Oswald:wght@600&family=Barlow&display=swap": "" });
    const r = await discoverBrand(HOME, { fetchImpl: f, lookup: lookupTo(PUBLIC) });
    assert.equal(r.ok, true, r.reason);
    assert.equal(r.profile.colors.primary, "#b3261e");
    assert.equal(r.profile.tone, null);
    assert.ok(r.profile.confidence >= 0.75);
    assert.ok(f.seen.some((u) => u.endsWith("/site.css")));
  } },

  // ---- failure -> manual intake
  { id: "v18", desc: "HTTP 500 falls back to the manual intake form", async run() {
    const r = await discoverBrand(HOME, { fetchImpl: fakeFetch({ [HOME]: { status: 500 } }), lookup: lookupTo(PUBLIC) });
    assert.deepEqual([r.ok, r.fallback], [false, "manual-intake"]);
    assert.deepEqual(r.intake, MANUAL_INTAKE_FIELDS);
  } },
  { id: "v19", desc: "a network error or timeout falls back, with the reason", async run() {
    const r = await discoverBrand(HOME, { fetchImpl: fakeFetch({ [HOME]: new Error("ETIMEDOUT") }), lookup: lookupTo(PUBLIC) });
    assert.equal(r.fallback, "manual-intake");
    assert.match(r.reason, /ETIMEDOUT/);
  } },
  { id: "v20", desc: "an empty page (nothing extractable) falls back instead of returning an empty profile", async run() {
    const r = await discoverBrand(HOME, { fetchImpl: fakeFetch({ [HOME]: "<html><body>Coming soon</body></html>" }), lookup: lookupTo(PUBLIC) });
    assert.equal(r.fallback, "manual-intake");
  } },
  { id: "v21", desc: "an oversized response is refused", async run() {
    const r = await discoverBrand(HOME, { fetchImpl: fakeFetch({ [HOME]: "x".repeat(1_600_000) }), lookup: lookupTo(PUBLIC) });
    assert.equal(r.ok, false);
    assert.match(r.reason, /too large/);
  } },
  { id: "v22", desc: "one broken stylesheet does not fail the crawl", async run() {
    const f = fakeFetch({ [HOME]: PAGE, "/site.css": { status: 404 } });
    const r = await discoverBrand(HOME, { fetchImpl: f, lookup: lookupTo(PUBLIC) });
    assert.equal(r.ok, true);
    assert.equal(r.profile.colors.primary, "#b3261e"); // still found via theme-color and Google Fonts markup
  } },

  // ---- hand-off to the Design Agent
  { id: "v23", desc: "a profile with logo + colors becomes existing-identity; without them, generated", run() {
    const p = parseSite({ html: PAGE, css: CSS, url: HOME });
    const patch = toClientPatch(p);
    assert.equal(patch.media.source, "existing-identity");
    assert.equal(patch.brand.primary, "#b3261e");
    assert.equal(toClientPatch({ logo_url: null, colors: {} }).media.source, "generated-identity");
  } },
  { id: "v24", desc: "the Design Agent honors discovered colors instead of overwriting them with a theme", run() {
    const patch = toClientPatch(parseSite({ html: PAGE, css: CSS, url: HOME }));
    const c = baseClient(); Object.assign(c.media, patch.media); Object.assign(c.brand, patch.brand);
    const { client } = resolveDesign(c);
    assert.equal(client.brand.primary, "#b3261e");
    assert.equal(client.media.source, "existing-identity");
  } },
];
