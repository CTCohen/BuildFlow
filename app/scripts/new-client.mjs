#!/usr/bin/env node
/**
 * Scaffold a client data file.
 *   node scripts/new-client.mjs <slug> [trade] [--has-logo]
 * Then fill every FILL_ value. `npm run qa -- --client <slug>` fails until it's complete.
 *
 * --has-logo: pass this when the business already has a logo / visual identity you found
 * during discovery. That's the design system's one branch point (media.source in schema.mjs):
 *   existing-identity  → set media.logo to where it lives, and set brand.primary/accent to
 *                         colors EXTRACTED from that logo. Honor their brand, don't restyle it.
 *   generated-identity → no usable existing brand. brand.primary/accent are BuildFlow's own
 *                         invented identity, chosen freely.
 * Omit the flag (the default) for generated-identity.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TRADES } from "../src/data/schema.mjs";

const rawArgs = process.argv.slice(2);
const hasLogo = rawArgs.includes("--has-logo");
const [slug, trade = "plumbing"] = rawArgs.filter((a) => !a.startsWith("--"));
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("usage: node scripts/new-client.mjs <slug:kebab-case> [trade]");
  process.exit(2);
}
if (!TRADES.includes(trade)) {
  console.error(`trade must be one of: ${TRADES.join(", ")}`);
  process.exit(2);
}

const dir = join(ROOT, "src/data/clients");
mkdirSync(dir, { recursive: true });
const out = join(dir, `${slug}.json`);
if (existsSync(out)) {
  console.error(`refusing to overwrite ${out}`);
  process.exit(1);
}

const svc = () => ({ name: "FILL_service name", blurb: "FILL_one sentence, specific" });
const rev = () => ({ quote: "FILL_real review text", author: "FILL_First L.", location: "FILL_city" });
const lang = (x) => ({
  tagline: `FILL_short ${x} tagline`,
  heroHeadline: `FILL_${x} headline`,
  heroSub: `FILL_${x} 1-2 sentence sub`,
  primaryCta: x === "es" ? "Pide tu presupuesto gratis" : "Get a free quote",
  about: `FILL_${x} about paragraph`,
  services: [svc(), svc(), svc()],
  reviews: [rev(), rev()],
});

const template = {
  slug,
  business: {
    name: "FILL_Legal or trading name",
    trade,
    phone: "+1-000-000-0000",
    email: "FILL_owner@theirdomain.com",
    cityState: "FILL_City, ST",
    serviceAreas: ["FILL_City", "FILL_Nearby"],
    hours: "FILL_Mon–Fri 8am–5pm",
    yearsInBusiness: 0,
    licenseNo: "FILL_or remove",
  },
  brand: hasLogo
    ? {
        primary: "FILL_hex extracted from their logo",
        accent: "FILL_hex extracted from their logo",
        heroStyle: null,
        typePairing: "grotesk-serif",
        density: "comfortable",
      }
    : {
        primary: "#0b5cad",
        accent: "#f2a516",
        heroStyle: "split",
        typePairing: "grotesk-serif",
        density: "comfortable",
      },
  content: { en: lang("en"), es: lang("es") },
  media: hasLogo
    ? { heroImage: null, logo: "FILL_where their logo lives (file path or URL)", source: "existing-identity" }
    : { heroImage: null, logo: null, source: "generated-identity" },
};

writeFileSync(out, JSON.stringify(template, null, 2) + "\n");
console.log(`created ${out}`);
if (hasLogo) {
  console.log(`existing-identity: extract brand.primary/brand.accent from the logo at media.logo by eye.`);
  console.log(`Don't invent colors for this one — honor what they already have.`);
}
console.log(`next: fill every FILL_ value, then  npm run qa -- --client ${slug}`);
