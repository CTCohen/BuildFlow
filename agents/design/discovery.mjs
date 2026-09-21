/**
 * Design Discovery Agent, minimal (agents/AGENT_REGISTRY.md #2): URL in, brand profile out.
 * Deterministic parsing of the DOM and CSS; no LLM. Tone extraction is out unless a mock is
 * provided (Lane B brief). On any crawl failure it returns `fallback: "manual-intake"` with the
 * intake form fields; it never retries in a loop.
 *
 *   discoverBrand(url, { fetchImpl?, lookup? }) -> { ok, profile, clientPatch } | { ok:false, fallback, intake, reason }
 *
 * SSRF: only http(s), every hostname resolved and every address checked (loopback, private,
 * link-local incl. cloud metadata, CGNAT, multicast, IPv6 ULA), redirects re-checked per hop.
 */
import dns from "node:dns/promises";
import net from "node:net";
import { parseHex, toHex } from "./lib/color.mjs";

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 8000;
const MAX_REDIRECTS = 3;
const MAX_STYLESHEETS = 3;

/** Fields a person fills in when the crawl fails (matches the client JSON the Design Agent takes). */
export const MANUAL_INTAKE_FIELDS = [
  { key: "business.name", label: "Business name", required: true },
  { key: "business.trade", label: "Trade", required: true },
  { key: "business.phone", label: "Phone", required: true },
  { key: "business.email", label: "Email", required: true },
  { key: "business.cityState", label: "City, State", required: true },
  { key: "business.serviceAreas", label: "Service areas", required: true },
  { key: "content.en.services", label: "3 or more services with a one-line description", required: true },
  { key: "media.logo", label: "Logo file or URL (optional)", required: false },
  { key: "brand.primary", label: "Main brand color (optional)", required: false },
];

// ------------------------------------------------------------------ SSRF guard
export function isBlockedIp(ip) {
  if (net.isIPv6(ip)) {
    const v = ip.toLowerCase();
    if (v === "::1" || v === "::") return true;
    if (v.startsWith("::ffff:")) return isBlockedIp(v.slice(7)); // IPv4-mapped
    return /^(fc|fd|fe[89ab]|ff)/.test(v); // ULA, link-local, multicast
  }
  if (!net.isIPv4(ip)) return true;
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT
    (a === 169 && b === 254) || // link-local and cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224 // multicast and reserved
  );
}

export async function assertPublicUrl(raw, lookup = dns.lookup) {
  let u;
  try { u = new URL(raw); } catch { throw new Error("invalid URL"); }
  if (!["http:", "https:"].includes(u.protocol)) throw new Error(`blocked scheme ${u.protocol}`);
  if (u.username || u.password) throw new Error("blocked credentials in URL");
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (/^(localhost|.*\.localhost|.*\.local|.*\.internal)$/i.test(host)) throw new Error("blocked internal hostname");
  // Numeric forms (2130706433, 0x7f000001, 017700000001) are normalized by URL to dotted IPv4.
  const addrs = net.isIP(host) ? [{ address: host }] : await lookup(host, { all: true });
  if (!addrs.length) throw new Error("hostname did not resolve");
  for (const { address } of addrs) if (isBlockedIp(address)) throw new Error(`blocked address ${address}`);
  return u;
}

async function safeGet(url, { fetchImpl, lookup, accept }) {
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = await assertPublicUrl(current, lookup);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
    try {
      const res = await fetchImpl(u.href, { redirect: "manual", signal: ctl.signal, headers: { accept, "user-agent": "BuildFlowDiscovery/0.1" } });
      if (res.status >= 300 && res.status < 400 && res.headers.get("location")) {
        current = new URL(res.headers.get("location"), u).href;
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (text.length > MAX_BYTES) throw new Error("response too large");
      return { url: u.href, text };
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error("too many redirects");
}

// ------------------------------------------------------------------ extraction
const abs = (href, base) => { try { return new URL(href, base).href; } catch { return null; } };
const strip = (s) => s.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

function hslOf(hex) {
  const rgb = parseHex(hex);
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: ((h * 60) + 360) % 360, s, l };
}

const normHex = (h) => {
  const rgb = parseHex(h);
  return rgb ? toHex(rgb) : null;
};

export function extractColors(css, html) {
  const counts = new Map();
  const bump = (hex, w = 1) => { const n = normHex(hex); if (n) counts.set(n, (counts.get(n) ?? 0) + w); };
  for (const m of css.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) bump(m[0]);
  for (const m of css.matchAll(/rgb\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})\s*\)/g)) bump(toHex([+m[1], +m[2], +m[3]]));
  // Named brand tokens count heavily: the author said "this is the brand color".
  for (const m of css.matchAll(/--(?:brand|primary|main|accent|secondary)[\w-]*\s*:\s*(#[0-9a-fA-F]{3,6})/gi)) bump(m[1], 25);
  const theme = html.match(/<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-fA-F]{3,6})["']/i);
  if (theme) bump(theme[1], 30);

  // Brand colors are saturated and not near black/white; greys are the page chrome.
  const ranked = [...counts.entries()]
    .map(([hex, n]) => ({ hex, n, ...hslOf(hex) }))
    .filter((c) => c.s >= 0.25 && c.l >= 0.12 && c.l <= 0.85)
    .sort((a, b) => b.n - a.n);
  const primary = ranked[0]?.hex;
  const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
  const accent = ranked.find((c) => c.hex !== primary && hueGap(c.h, ranked[0].h) > 30)?.hex ?? ranked.find((c) => c.hex !== primary)?.hex;
  const secondary = ranked.find((c) => c.hex !== primary && c.hex !== accent)?.hex;
  return { primary, secondary, accent, candidates: ranked.slice(0, 6).map((c) => c.hex) };
}

const GENERIC_FONTS = new Set(["inherit", "initial", "serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-sans-serif", "ui-serif", "ui-monospace", "-apple-system", "blinkmacsystemfont", "segoe ui", "roboto", "helvetica", "helvetica neue", "arial", "emoji", "apple color emoji", "segoe ui emoji", "noto color emoji"]);

export function extractFonts(css, html) {
  const counts = new Map();
  const add = (name, w = 1) => {
    const n = name.trim().replace(/^["']|["']$/g, "");
    if (!n || GENERIC_FONTS.has(n.toLowerCase()) || n.startsWith("var(")) return;
    counts.set(n, (counts.get(n) ?? 0) + w);
  };
  for (const m of css.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) add(m[1].split(",")[0]);
  for (const m of html.matchAll(/fonts\.googleapis\.com\/css2?\?[^"']*/gi)) {
    for (const f of m[0].matchAll(/family=([^:&"']+)/g)) add(decodeURIComponent(f[1]).replace(/\+/g, " "), 10);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n);
}

export function extractLogo(html, base) {
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const attr = (tag, name) => tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1] ?? "";
  const header = html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "";
  const isLogo = (tag) => /logo/i.test(attr(tag, "class") + attr(tag, "id") + attr(tag, "alt") + attr(tag, "src"));
  const pick = imgs.find((t) => isLogo(t) && header.includes(t)) ?? imgs.find(isLogo);
  if (pick && attr(pick, "src")) return abs(attr(pick, "src"), base);
  const icon = html.match(/<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]*>/i)?.[0];
  if (icon) { const href = attr(icon, "href"); if (href) return abs(href, base); }
  return null;
}

export function extractServices(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<nav[\s\S]*?<\/nav>|<footer[\s\S]*?<\/footer>/gi, "");
  const heading = body.match(/<h[1-3][^>]*>\s*(?:our\s+)?(?:services|what we do|how we help|our work)[^<]*<\/h[1-3]>/i);
  if (!heading) return [];
  const rest = body.slice(heading.index + heading[0].length, heading.index + heading[0].length + 6000);
  const stop = rest.search(/<h[12][\s>]/i);
  const scope = stop > 0 ? rest.slice(0, stop) : rest;
  const items = [];
  for (const m of scope.matchAll(/<h[34][^>]*>([\s\S]*?)<\/h[34]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>)?/gi)) {
    const name = strip(m[1]);
    if (name && name.length < 60) items.push({ name, blurb: m[2] ? strip(m[2]).slice(0, 160) : "" });
  }
  if (!items.length) for (const m of scope.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) { const name = strip(m[1]); if (name && name.length < 60) items.push({ name, blurb: "" }); }
  return items.slice(0, 8);
}

function extractBasics(html) {
  const meta = (p) => html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${p}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1];
  const name = meta("og:site_name") ?? strip(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "").split(/[|\-–—·]/)[0].trim();
  const phone = html.match(/href=["']tel:([+\d][\d\-().\s%]+)["']/i)?.[1]?.replace(/%20/g, " ");
  const email = html.match(/href=["']mailto:([^"'?]+)/i)?.[1];
  return { name: name || null, phone: phone ?? null, email: email ?? null, description: meta("description") ?? null };
}

/** Pure: parse one fetched page + its CSS into a brand profile. Exported for evals. */
export function parseSite({ html, css = "", url }) {
  const allCss = css + "\n" + [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n") + "\n" + [...html.matchAll(/style=["']([^"']*)["']/gi)].map((m) => m[1]).join(";");
  const colors = extractColors(allCss, html);
  const logo = extractLogo(html, url);
  const fonts = extractFonts(allCss, html);
  const services = extractServices(html);
  const basics = extractBasics(html);
  const found = [colors.primary, logo, fonts.length, services.length].filter(Boolean).length;
  return {
    source: "crawl",
    url,
    business: basics,
    logo_url: logo,
    colors: { primary: colors.primary ?? null, secondary: colors.secondary ?? null, accent: colors.accent ?? null },
    fonts,
    services,
    tone: null, // extracted only when a mock or an LLM step is provided (out of scope for v0)
    confidence: found / 4,
  };
}

/** What Discovery hands the Design Agent: the existing-identity branch (logo-first). */
export function toClientPatch(profile) {
  if (!profile.logo_url || !profile.colors.primary) return { media: { source: "generated-identity", logo: null }, note: "no usable logo or colors: generated identity" };
  return {
    media: { source: "existing-identity", logo: profile.logo_url },
    brand: { primary: profile.colors.primary, accent: profile.colors.accent ?? profile.colors.secondary ?? profile.colors.primary },
  };
}

export async function discoverBrand(url, { fetchImpl = globalThis.fetch, lookup = dns.lookup } = {}) {
  const fail = (reason) => ({ ok: false, fallback: "manual-intake", reason, intake: MANUAL_INTAKE_FIELDS });
  try {
    const page = await safeGet(url, { fetchImpl, lookup, accept: "text/html" });
    const sheets = [...page.text.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)]
      .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1])
      .filter(Boolean)
      .map((h) => abs(h, page.url))
      .filter(Boolean)
      .slice(0, MAX_STYLESHEETS);
    let css = "";
    for (const s of sheets) {
      try { css += "\n" + (await safeGet(s, { fetchImpl, lookup, accept: "text/css" })).text; } catch { /* a missing stylesheet is not fatal */ }
    }
    const profile = parseSite({ html: page.text, css, url: page.url });
    if (profile.confidence === 0) return fail("crawled the page but found no logo, colors, fonts or services");
    return { ok: true, profile, clientPatch: toClientPatch(profile) };
  } catch (e) {
    return fail(String(e.message || e));
  }
}
