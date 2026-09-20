// Client data contract — shared by the Astro app and scripts/qa.mjs.
// Zero dependencies so the QA gate runs standalone.

export const TRADES = [
  "plumbing", "hvac", "electrical", "roofing", "carpentry",
  "house-cleaning", "carpet-cleaning", "pressure-washing", "junk-removal",
  "landscaping", "snow-removal", "pool-services", "tree-care",
  "masonry", "concrete", "fence-installation", "deck-building",
  "restoration", "fire-remediation", "mold-remediation", "septic-services",
  "well-drilling", "chimney-services", "radon-mitigation", "pressure-washing-premium",
  "custom-carpentry", "junk-removal-premium"
];

export const VERTICALS = [
  "hvac", "plumbing", "electrical",           // Emergency
  "landscaping", "snow-removal", "pool-services", "tree-care", "pressure-washing",  // Seasonal
  "roofing", "carpentry", "masonry", "concrete",                                     // Premium
  "fence-installation", "deck-building", "bathroom-renovation", "kitchen-renovation", // Project-based
  "septic-services", "well-drilling", "chimney-services", "radon-mitigation", "mold-remediation"  // Specialized
];

// The one branch point in the design system: does this business already have a logo /
// visual identity, or are we inventing one for them? Everything downstream (brand colors,
// hero/type selection) reads this instead of guessing from whether media.logo is truthy.
export const BRAND_SOURCES = ["existing-identity", "generated-identity"];

export const HERO_STYLES = ["photo-left", "full-bleed", "split", "accent-bar", "minimal"];
export const TYPE_PAIRINGS = ["grotesk-serif", "humanist", "classic"];
export const DENSITIES = ["compact", "comfortable", "spacious"];
export const LANGS = ["en", "es"];
// Launch is English-only (spec). Spanish content is optional and validated only when present.
export const REQUIRED_LANGS = ["en"];

// Service tier (spec: Micro, SMB, Mid-Market). Mid-Market is paused, so it is accepted but warned.
export const TIERS = ["micro", "smb", "mid-market"];
// The 10 spec styling profiles (System 04 section 6); themes map to them in styleProfiles.json.
export const STYLE_PROFILES = [
  "professional-service", "modern-minimalist", "cutting-edge-tech", "established-authority",
  "energetic-bold", "eco-conscious", "luxury-premium", "community-focused",
  "modern-industrial", "transparent-honest",
];

// Conditional feature flags
export const CONDITIONAL_FEATURES = {
  emergencyFocused: "emergency",
  portfolioHeavy: "before-after",
  seasonal: "seasonal-availability",
  projectBased: "project-timeline",
  premiumPositioning: "luxury-aesthetic",
  multiLocation: "location-switcher",
  soloOperator: "owner-story",
  healthSafety: "certifications-education"
};

const PHONE_RE = /^\+?[0-9][0-9\-().\s]{7,}$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

// Regexes, not bare substrings — "todo" is a common Spanish word, "insert" etc.
// need boundaries. Each entry: [label, regex].
const PLACEHOLDER_PATTERNS = [
  ["lorem ipsum", /lorem\s+ipsum/i],
  ["TODO marker", /\bTODO\b|\btodo:|\bFIXME\b/],
  ["TBD marker", /\bTBD\b/],
  ["mustache token", /\{\{|\}\}/],
  ["bracket token", /\[(business|name|city|phone|trade|company|insert)[^\]]*\]/i],
  ["example.com", /example\.com/i],
  ["'placeholder'", /\bplaceholder\b/i],
  ["'your business'", /\byour business name\b/i],
  ["'insert X here'", /\binsert\b[^.]{0,30}\bhere\b/i],
  ["xxxx", /x{4,}/i],
  ["lipsum filler", /\bipsum\b/i],
];

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function hasPlaceholder(str) {
  const s = String(str);
  return PLACEHOLDER_PATTERNS.filter(([, re]) => re.test(s)).map(([label]) => label);
}

/**
 * @param {any} data
 * @returns {{ ok: boolean, errors: string[], warnings: string[] }}
 */
export function validateClient(data) {
  const errors = [];
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);

  if (!data || typeof data !== "object") {
    return { ok: false, errors: ["client data is not an object"], warnings };
  }

  if (!isNonEmptyString(data.slug)) err("slug: required");
  else if (!/^[a-z0-9-]+$/.test(data.slug)) err("slug: lowercase letters, digits, hyphens only");

  // ---- tier and styling profile (spec) ----
  if (!TIERS.includes(data.tier)) err(`tier: required, one of ${TIERS.join(", ")}`);
  else if (data.tier === "mid-market") warn("tier: mid-market is paused (not built); use smb or micro");
  if (!STYLE_PROFILES.includes(data.styleProfile)) err(`styleProfile: required, one of ${STYLE_PROFILES.join(", ")}`);

  // ---- business ----
  const b = data.business || {};
  if (!isNonEmptyString(b.name)) err("business.name: required");
  if (!TRADES.includes(b.trade)) err(`business.trade: must be one of ${TRADES.join(", ")}`);
  if (!isNonEmptyString(b.phone) || !PHONE_RE.test(b.phone)) err("business.phone: required, valid phone");
  if (!isNonEmptyString(b.email) || !EMAIL_RE.test(b.email)) err("business.email: required, valid email");
  if (!isNonEmptyString(b.cityState)) err("business.cityState: required (e.g. 'Austin, TX')");
  if (!Array.isArray(b.serviceAreas) || b.serviceAreas.length < 1) err("business.serviceAreas: >= 1 area");
  if (!isNonEmptyString(b.hours)) err("business.hours: required");
  if (b.yearsInBusiness != null && typeof b.yearsInBusiness !== "number") err("business.yearsInBusiness: number");
  if (!isNonEmptyString(b.licenseNo)) warn("business.licenseNo: missing (trades trust signal)");

  // ---- media / brand source (the logo-first branch) ----
  // "existing-identity": the business already has a logo/brand — media.logo must point to it,
  //   and brand.primary/accent below are expected to be EXTRACTED from that logo (by eye today;
  //   automatable later), not invented. Don't restyle these businesses — honor what they have.
  // "generated-identity": no usable existing brand — brand.primary/accent are BuildFlow's
  //   invented identity for them, chosen freely per the conditional-features rules.
  const media = data.media || {};
  if (!BRAND_SOURCES.includes(media.source)) {
    err(`media.source: required, one of ${BRAND_SOURCES.join(", ")} — the design system's` +
      ` logo-first branch point`);
  } else if (media.source === "existing-identity" && !isNonEmptyString(media.logo)) {
    err("media.logo: required when media.source is existing-identity");
  } else if (media.source === "generated-identity" && isNonEmptyString(media.logo)) {
    warn("media.logo is set but media.source is generated-identity — should this be existing-identity?");
  }

  // ---- brand ----
  const br = data.brand || {};
  if (!HEX_RE.test(br.primary || "")) err("brand.primary: required hex color");
  if (!HEX_RE.test(br.accent || "")) err("brand.accent: required hex color");
  if (br.heroStyle != null && !HERO_STYLES.includes(br.heroStyle)) err(`brand.heroStyle: one of ${HERO_STYLES.join(", ")} (or null for auto-selection)`);
  if (!TYPE_PAIRINGS.includes(br.typePairing)) err(`brand.typePairing: one of ${TYPE_PAIRINGS.join(", ")}`);
  if (!DENSITIES.includes(br.density)) err(`brand.density: one of ${DENSITIES.join(", ")}`);

  // ---- content, per language ----
  const content = data.content || {};
  for (const lang of LANGS) {
    const c = content[lang];
    const p = `content.${lang}`;
    if (!c || typeof c !== "object") {
      if (!REQUIRED_LANGS.includes(lang)) continue; // Spanish is optional at launch
      err(`${p}: required`);
      continue;
    }
    for (const key of ["tagline", "heroHeadline", "heroSub", "primaryCta", "about"]) {
      if (!isNonEmptyString(c[key])) err(`${p}.${key}: required`);
    }
    if (!Array.isArray(c.services) || c.services.length < 3) {
      err(`${p}.services: >= 3`);
    } else {
      c.services.forEach((s, i) => {
        if (!isNonEmptyString(s?.name)) err(`${p}.services[${i}].name: required`);
        if (!isNonEmptyString(s?.blurb)) err(`${p}.services[${i}].blurb: required`);
      });
    }
    if (!Array.isArray(c.reviews) || c.reviews.length < 2) {
      err(`${p}.reviews: >= 2`);
    } else {
      c.reviews.forEach((r, i) => {
        if (!isNonEmptyString(r?.quote)) err(`${p}.reviews[${i}].quote: required`);
        if (!isNonEmptyString(r?.author)) err(`${p}.reviews[${i}].author: required`);
      });
    }

    // placeholder leakage
    for (const [k, v] of Object.entries(c)) {
      const hits = hasPlaceholder(typeof v === "string" ? v : JSON.stringify(v));
      if (hits.length) err(`${p}.${k}: placeholder text (${[...new Set(hits)].join(", ")})`);
    }
  }

  // ---- EN/ES parity ----
  if (content.en && content.es) {
    const enKeys = Object.keys(content.en).sort().join(",");
    const esKeys = Object.keys(content.es).sort().join(",");
    if (enKeys !== esKeys) err("content: en and es key sets differ");

    for (const key of ["tagline", "heroHeadline", "heroSub", "about"]) {
      if (
        isNonEmptyString(content.en[key]) &&
        content.en[key].trim() === (content.es[key] || "").trim()
      ) {
        warn(`content.es.${key}: identical to English (untranslated?)`);
      }
    }
    if (
      Array.isArray(content.en.services) &&
      Array.isArray(content.es.services) &&
      content.en.services.length !== content.es.services.length
    ) {
      err("content: en.services and es.services length differ");
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

export { PLACEHOLDER_PATTERNS, hasPlaceholder };
