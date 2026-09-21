/**
 * Design Agent v0 (agents/AGENT_REGISTRY.md #1): deterministic, no LLM call.
 *
 *   renderSite(client, { outDir, corrections })  ->  { ok, outDir, design, ms, ... }
 *
 * One code path for all four call sites (System 4, demo generation, photo-intake auto-build,
 * customer-edit regeneration): callers hand in a client JSON and get a static bundle back.
 *
 * Steps: normalize -> resolve design (profile -> theme, tokens, component variants) -> build
 * the Astro app into an isolated out dir -> inline CSS. QA is separate (qa-loop.mjs), and
 * feeds failure reasons back in as `corrections`.
 */
import { spawn } from "node:child_process";
import { readFileSync, mkdirSync, cpSync, existsSync, symlinkSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mix, darkenToContrast } from "./lib/color.mjs";
import { validateClient } from "../../app/src/data/schema.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export const APP_ROOT = resolve(HERE, "../../app");
const readJson = (p) => JSON.parse(readFileSync(join(APP_ROOT, p), "utf8"));

const PROFILES = readJson("src/data/styleProfiles.json");
const THEMES = readJson("src/data/themes-30.json");
const THEME_BY_ID = new Map(THEMES.map((t) => [t.themeId, t]));

// Type pairing and density per profile. The profile sets mood (colors/fonts/spacing), not layout.
const PROFILE_TOKENS = {
  "professional-service": { typePairing: "grotesk-serif", density: "comfortable" },
  "modern-minimalist": { typePairing: "humanist", density: "spacious" },
  "cutting-edge-tech": { typePairing: "grotesk-serif", density: "comfortable" },
  "established-authority": { typePairing: "classic", density: "spacious" },
  "energetic-bold": { typePairing: "grotesk-serif", density: "compact" },
  "eco-conscious": { typePairing: "humanist", density: "comfortable" },
  "luxury-premium": { typePairing: "classic", density: "spacious" },
  "community-focused": { typePairing: "humanist", density: "comfortable" },
  "modern-industrial": { typePairing: "grotesk-serif", density: "compact" },
  "transparent-honest": { typePairing: "humanist", density: "compact" },
};

// Micro is one fixed design (docs/DESIGN_SYSTEMS/MICRO.md): locked profile, hero, type, density.
export const MICRO_LOCK = {
  styleProfile: "professional-service",
  heroStyle: "split",
  servicesLayout: "grid-3col",
  testimonialStyle: "grid",
  typePairing: "grotesk-serif",
  density: "comfortable",
};

const EMERGENCY_TRADES = ["hvac", "plumbing", "electrical", "restoration", "fire", "mold"];
const PORTFOLIO_TRADES = ["roofing", "landscaping", "carpentry", "restoration", "pressure-washing", "deck", "fence"];

/** Stable 32-bit hash so theme choice is repeatable for a given slug. */
function hash(str) {
  let h = 2166136261;
  for (const ch of String(str)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function maturityOf(years = 0) {
  return years > 10 ? "established" : years > 5 ? "veteran" : "new";
}

/** Pick a theme inside the profile: trade match, then maturity match, then a stable per-slug tiebreak. */
export function pickTheme(client) {
  const profile = PROFILES.profiles.find((p) => p.id === client.styleProfile) ?? PROFILES.profiles.find((p) => p.id === PROFILES.default);
  const trade = client.business?.trade;
  const maturity = maturityOf(client.business?.yearsInBusiness);
  const scored = profile.themes
    .map((id) => THEME_BY_ID.get(id))
    .filter(Boolean)
    .map((t) => ({ t, score: (t.trades?.includes(trade) ? 2 : 0) + (t.maturity === maturity ? 1 : 0) }));
  const best = Math.max(...scored.map((s) => s.score));
  const pool = scored.filter((s) => s.score === best).map((s) => s.t);
  return pool[hash(client.slug) % pool.length];
}

/** Hero / services / testimonial variants: keyed by vertical, then profile. Not customer-facing. */
export function pickVariants(client, profileId) {
  const trade = String(client.business?.trade ?? "").toLowerCase();
  const has = (list) => list.some((t) => trade.includes(t));
  let heroStyle = "split";
  if (has(EMERGENCY_TRADES)) heroStyle = "full-bleed";
  else if (has(PORTFOLIO_TRADES)) heroStyle = "photo-left";
  if (profileId === "luxury-premium" || profileId === "modern-minimalist") heroStyle = "minimal";
  if (profileId === "energetic-bold" && heroStyle === "split") heroStyle = "accent-bar";

  const services = client.content?.en?.services?.length ?? 3;
  const reviews = client.content?.en?.reviews?.length ?? 2;
  const servicesLayout = services <= 2 ? "card-stack" : services >= 6 ? "list-sidebar" : "grid-3col";
  const testimonialStyle = reviews > 5 ? "carousel" : "grid";
  return { heroStyle, servicesLayout, testimonialStyle };
}

/**
 * Normalize + resolve. Pure function: same client + corrections -> same output.
 * Returns the fully resolved client JSON (what the Astro app builds from) and a decision record.
 */
export function resolveDesign(input, { corrections = [] } = {}) {
  const client = structuredClone(input);
  const decisions = [];
  const note = (m) => decisions.push(m);

  // Safe defaults for fields a caller may omit (fixes what a retry can fix; anything else stays for QA).
  if (!client.tier) { client.tier = "smb"; note("tier missing: defaulted to smb"); }
  if (client.tier === "mid-market") { client.tier = "smb"; note("mid-market is paused: built as smb"); }
  if (!client.styleProfile) { client.styleProfile = PROFILES.default; note(`styleProfile missing: defaulted to ${PROFILES.default}`); }
  client.brand = client.brand ?? {};
  client.media = client.media ?? {};

  const micro = client.tier === "micro";
  if (micro) {
    if (client.styleProfile !== MICRO_LOCK.styleProfile) note(`micro: styleProfile locked to ${MICRO_LOCK.styleProfile}`);
    client.styleProfile = MICRO_LOCK.styleProfile;
    if (client.customization) note("micro: customization ignored (no sliders)");
    delete client.customization;
  }

  const profileId = PROFILES.profiles.some((p) => p.id === client.styleProfile) ? client.styleProfile : PROFILES.default;
  const theme = pickTheme({ ...client, styleProfile: profileId });
  const tokens = PROFILE_TOKENS[profileId];

  // Colors: an existing identity is honored; a generated identity takes the theme's colors.
  const existing = client.media.source === "existing-identity";
  if (existing) {
    note("existing-identity: brand colors kept from the client's logo");
    client.brand.primaryDark = client.brand.primaryDark ?? mix(client.brand.primary, "#000000", 0.25);
    client.brand.primaryLight = client.brand.primaryLight ?? mix(client.brand.primary, "#ffffff", 0.88);
  } else {
    Object.assign(client.brand, {
      primary: theme.colors.primary,
      accent: theme.colors.accent,
      primaryDark: theme.colors.primaryDark,
      primaryLight: theme.colors.primaryLight,
    });
    note(`generated-identity: theme ${theme.themeId} within ${profileId}`);
  }

  // SMB sliders override the profile's colors (System 04 section 7). Micro never reaches here with any.
  if (client.customization?.primary) client.brand.primary = client.customization.primary;
  if (client.customization?.accent) client.brand.accent = client.customization.accent;

  // Component variants and tokens: locked for Micro, profile- and vertical-keyed for SMB.
  const chosen = micro ? MICRO_LOCK : { ...tokens, ...pickVariants(client, profileId) };
  Object.assign(client.brand, pick(chosen, ["typePairing", "density", "heroStyle", "servicesLayout", "testimonialStyle"]));

  // Corrections fed back by QA on a retry (see qa-loop.mjs). Each is deterministic and recorded.
  for (const c of corrections) {
    switch (c) {
      case "brand-contrast": {
        const fixed = darkenToContrast(client.brand.primary);
        if (fixed !== client.brand.primary) {
          note(`correction brand-contrast: primary ${client.brand.primary} -> ${fixed}`);
          client.brand.primary = fixed;
          client.brand.primaryDark = mix(fixed, "#000000", 0.25);
        }
        break;
      }
      case "layout-sanity":
      case "lighthouse-budget":
        if (client.brand.heroStyle !== "minimal") {
          note(`correction ${c}: hero ${client.brand.heroStyle} -> minimal, density -> compact`);
          client.brand.heroStyle = "minimal";
          client.brand.density = "compact";
        }
        break;
      default:
        note(`correction ${c}: no automatic fix available`);
    }
  }

  return {
    client,
    design: { profile: profileId, theme: theme.themeId, tier: client.tier, ...pick(client.brand, ["typePairing", "density", "heroStyle", "servicesLayout", "testimonialStyle"]), decisions },
  };
}

function pick(obj, keys) {
  return Object.fromEntries(keys.map((k) => [k, obj[k]]));
}

/**
 * Astro keeps mutable state under <root>/.astro, so two builds sharing a root collide. Each build
 * gets its own small root next to its out dir: a copy of src (minus the 45 stored client files;
 * the client is passed inline), public and config, plus a symlink to node_modules. It is reused
 * across attempts and overwritten in place, never deleted; the caller owns the scratch root.
 */
function prepareWorkRoot(slug, out) {
  const work = join(dirname(out), `.work-${slug}`);
  mkdirSync(work, { recursive: true });
  const skipClients = (src) => !src.includes(`${join("src", "data", "clients")}`);
  cpSync(join(APP_ROOT, "src"), join(work, "src"), { recursive: true, force: true, filter: skipClients });
  mkdirSync(join(work, "src/data/clients"), { recursive: true });
  for (const f of ["public", "astro.config.mjs", "package.json", "tsconfig.json"]) {
    cpSync(join(APP_ROOT, f), join(work, f), { recursive: true, force: true });
  }
  if (!existsSync(join(work, "node_modules"))) symlinkSync(join(APP_ROOT, "node_modules"), join(work, "node_modules"));
  return work;
}

function run(cmd, args, opts) {
  return new Promise((res) => {
    const p = spawn(cmd, args, { ...opts, stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => res({ code, out }));
  });
}

/**
 * Render one client to a static bundle.
 * @param {object} input   client JSON (schema.mjs shape)
 * @param {{outDir: string, corrections?: string[], siteUrl?: string}} opts
 */
export async function renderSite(input, { outDir, corrections = [], siteUrl } = {}) {
  if (!outDir) throw new Error("renderSite: outDir required");
  const out = resolve(outDir);
  mkdirSync(dirname(out), { recursive: true });
  const t0 = performance.now();
  const { client, design } = resolveDesign(input, { corrections });
  const tResolve = performance.now();

  // Invalid input never reaches the build: report the schema errors as the failure reason.
  const v = validateClient(client);
  if (!v.ok) return { ok: false, stage: "schema", error: v.errors.join("; "), design, client };

  const work = prepareWorkRoot(client.slug, out);
  const env = {
    ...process.env,
    CLIENT: client.slug,
    CLIENT_DATA: JSON.stringify(client),
    OUT_DIR: out,
    VITE_CACHE_DIR: join(work, ".vite"),
    CACHE_DIR: join(work, ".astro-cache"),
    ...(siteUrl ? { SITE_URL: siteUrl } : {}),
  };
  const build = await run("node", [join(APP_ROOT, "node_modules/astro/astro.js"), "build"], { cwd: work, env });
  const tBuild = performance.now();
  if (build.code !== 0) {
    return { ok: false, stage: "build", error: build.out.split("\n").slice(-12).join("\n"), design, client };
  }
  const inline = await run("node", [join(APP_ROOT, "scripts/inline-css.mjs"), out], { cwd: work, env });
  const t1 = performance.now();
  if (inline.code !== 0) return { ok: false, stage: "inline-css", error: inline.out.slice(-400), design, client };

  return {
    ok: true,
    outDir: out,
    client,
    design,
    ms: { total: Math.round(t1 - t0), resolve: Math.round(tResolve - t0), build: Math.round(tBuild - tResolve), inline: Math.round(t1 - tBuild) },
  };
}

/** Render many clients with bounded parallelism (each build has its own out dir and cache dir). */
export async function renderMany(clients, { outRoot, concurrency = 4, ...rest } = {}) {
  const results = new Array(clients.length);
  let next = 0;
  const worker = async () => {
    while (next < clients.length) {
      const i = next++;
      results[i] = await renderSite(clients[i], { outDir: join(outRoot, clients[i].slug), ...rest });
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, clients.length) }, worker));
  return results;
}
