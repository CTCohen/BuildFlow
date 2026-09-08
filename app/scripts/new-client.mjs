#!/usr/bin/env node
/**
 * Scaffold a client data file.
 *   node scripts/new-client.mjs <slug> [trade]
 * Then fill every FILL_ value. `npm run qa -- --client <slug>` fails until it's complete.
 */
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TRADES } from "../src/data/schema.mjs";

const [slug, trade = "plumbing"] = process.argv.slice(2);
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
  brand: {
    primary: "#0b5cad",
    accent: "#f2a516",
    heroStyle: "split",
    typePairing: "grotesk-serif",
    density: "comfortable",
  },
  content: { en: lang("en"), es: lang("es") },
  media: { heroImage: null, logo: null },
};

writeFileSync(out, JSON.stringify(template, null, 2) + "\n");
console.log(`created ${out}`);
console.log(`next: fill every FILL_ value, then  npm run qa -- --client ${slug}`);
