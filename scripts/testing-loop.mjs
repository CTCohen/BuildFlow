#!/usr/bin/env node
/**
 * BuildFlow Testing Loop v1
 *
 * Automated 10-round Build→Test→Learn cycle:
 * 1. Generate random HVAC/plumbing sample clients
 * 2. Build each client
 * 3. Run QA gate
 * 4. Capture learnings (successes, failures, patterns)
 * 5. Log metrics and observations
 * 6. Report aggregate results + recommendations
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const TRADES = ["hvac", "plumbing"];
const TRADES_DATA = {
  hvac: {
    names: [
      "Desert Comfort", "Cool Guys", "Precision HVAC", "Thermal Pros", "AirFlow Systems",
      "Phoenix Cooling", "Valley HVAC", "Expert Climate", "Comfort Zone", "Quick Cool"
    ],
    services: [
      ["AC repair", "System replacement", "Maintenance", "Ductwork"],
      ["Heat pump repair", "Installation", "Seasonal maintenance", "Ductwork optimization"],
      ["Emergency repair", "System upgrade", "Maintenance plans", "Thermostat installation"],
    ],
    cities: ["Phoenix", "Mesa", "Scottsdale", "Chandler", "Gilbert", "Tempe", "Ahwatukee", "Paradise Valley"],
  },
  plumbing: {
    names: [
      "RootReady", "Fast Pipes", "AquaFix", "Precision Plumbing", "TrustFlow",
      "Valley Plumbing", "Expert Drain", "Quick Plumber", "Local Pipes", "Swift Repair"
    ],
    services: [
      ["Emergency repair", "Drain cleaning", "Leak detection", "Water heater"],
      ["Burst pipe repair", "Clogged drain", "Leak repair", "Sump pump"],
      ["Emergency service", "Drain line", "Water line", "Fixture installation"],
    ],
    cities: ["Phoenix", "Chandler", "Gilbert", "Queen Creek", "Tempe", "Mesa", "Ahwatukee"],
  }
};

// Learnings log
const LEARNINGS_FILE = "testing-loop-learnings.md";
const METRICS_FILE = "testing-loop-metrics.json";

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateClient(round, trade) {
  const data = TRADES_DATA[trade];
  const name = randomChoice(data.names);
  const years = Math.floor(Math.random() * 12) + 3;
  const cities = data.cities.slice(0, Math.floor(Math.random() * 3) + 2);
  const serviceCount = Math.floor(Math.random() * 2) + 3;
  const services = randomChoice(data.services).slice(0, serviceCount);
  const brands = ["#0369a1", "#1e40af", "#059669", "#7c3aed", "#dc2626"];
  const densities = ["compact", "spacious"];
  const typePairings = ["humanist", "classic", "grotesk-serif"];

  const heroStyles = ["full-bleed", "photo-left", "split"];
  const primary = randomChoice(brands);
  const accent = randomChoice(brands.filter(b => b !== primary));

  return {
    slug: `round-loop-${round}-${trade}-${name.toLowerCase().replace(/\s+/g, "-")}`,
    business: {
      name: `${name} ${trade === "hvac" ? "HVAC" : "Plumbing"}`,
      trade,
      phone: `+1-602-555-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
      email: `contact@${name.toLowerCase().replace(/\s+/g, "")}.local`,
      cityState: `${randomChoice(cities)}, AZ`,
      serviceAreas: cities,
      hours: "Mon–Sat 7am–7pm · 24/7 emergency",
      yearsInBusiness: years,
      licenseNo: `AZ-${trade === "hvac" ? "HVAC" : "ROC"}-${String(Math.floor(Math.random() * 900000) + 10000)}`
    },
    brand: {
      primary,
      accent,
      heroStyle: randomChoice(heroStyles),
      typePairing: randomChoice(typePairings),
      density: randomChoice(densities)
    },
    content: {
      en: {
        tagline: `Professional ${trade} service in ${randomChoice(cities)}, AZ`,
        heroHeadline: `${trade === "hvac" ? "AC" : "Plumbing"} problems solved today`,
        heroSub: `Same-day service, fair pricing, licensed and insured. ${years}+ years serving ${randomChoice(cities)} area.`,
        primaryCta: `Get service now`,
        about: `Serving the Phoenix area for ${years} years. Licensed, insured, and committed to fair pricing and honest work.`,
        services: services.map(s => ({
          name: s,
          slug: s.toLowerCase().replace(/\s+/g, "-"),
          blurb: `Professional ${s.toLowerCase()} service`
        })),
        reviews: [
          {
            quote: `Great service, fair price, professional team. Highly recommend!`,
            author: "John D.",
            location: randomChoice(cities)
          },
          {
            quote: `Fast, honest, reliable. Will use again.`,
            author: "Maria S.",
            location: randomChoice(cities)
          },
          {
            quote: `Best ${trade} service in the area. Trust them completely.`,
            author: "Robert M.",
            location: randomChoice(cities)
          }
        ]
      },
      es: {
        tagline: `Servicio profesional de ${trade} en ${randomChoice(cities)}, AZ`,
        heroHeadline: `Problemas de ${trade === "hvac" ? "aire acondicionado" : "plomería"} resueltos hoy`,
        heroSub: `Servicio el mismo día, precios justos, con licencia y asegurado. ${years}+ años sirviendo el área de ${randomChoice(cities)}.`,
        primaryCta: `Obtener servicio ahora`,
        about: `Sirviendo el área de Phoenix durante ${years} años. Con licencia, asegurado y comprometido con precios justos y trabajo honesto.`,
        services: services.map(s => ({
          name: `${s} (Spanish)`,
          slug: s.toLowerCase().replace(/\s+/g, "-"),
          blurb: `Servicio profesional de ${s.toLowerCase()}`
        })),
        reviews: [
          {
            quote: `¡Excelente servicio, precio justo, equipo profesional! ¡Altamente recomendado!`,
            author: "Juan D.",
            location: randomChoice(cities)
          },
          {
            quote: `Rápido, honesto, confiable. Volveré a usar.`,
            author: "María S.",
            location: randomChoice(cities)
          },
          {
            quote: `El mejor servicio de ${trade} de la zona. Les confío completamente.`,
            author: "Roberto M.",
            location: randomChoice(cities)
          }
        ]
      }
    },
    media: { heroImage: null, logo: null }
  };
}

function runRound(round) {
  const trade = randomChoice(TRADES);
  const client = generateClient(round, trade);

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Round ${round}/10 — ${client.business.name}`);
  console.log(`${"=".repeat(60)}`);

  // Write client data
  const clientPath = join(ROOT, "app/src/data/clients", `${client.slug}.json`);
  writeFileSync(clientPath, JSON.stringify(client, null, 2));
  console.log(`✓ Client data written: ${client.slug}`);

  // Build
  try {
    execFileSync("npm", ["run", "build"], {
      cwd: join(ROOT, "app"),
      env: { ...process.env, CLIENT: client.slug },
      stdio: "pipe"
    });
    console.log(`✓ Build successful`);
  } catch (e) {
    console.error(`✗ Build failed`);
    return { round, trade, client: client.business.name, status: "build_failed", error: String(e).slice(0, 100) };
  }

  // QA
  let qaOutput = "";
  try {
    qaOutput = execFileSync("node", ["scripts/qa.mjs", "--client", client.slug], {
      cwd: join(ROOT, "app"),
      stdio: "pipe",
      encoding: "utf8"
    });
  } catch (e) {
    qaOutput = String(e.stdout || e.message);
  }

  const qaPass = qaOutput.includes("PASS");
  const qaLine = qaOutput.split("\n").find(l => l.includes("PASS") || l.includes("FAIL")) || "";
  console.log(`${qaPass ? "✓" : "✗"} QA: ${qaLine}`);

  return {
    round,
    trade,
    client: client.business.name,
    slug: client.slug,
    status: qaPass ? "pass" : "fail",
    services: client.content.en.services.length,
    areas: client.business.serviceAreas.length,
    years: client.business.yearsInBusiness,
    qaOutput: qaLine
  };
}

// Main loop
console.log(`\nBuildFlow Testing Loop — 10 rounds\n`);

const results = [];
const startTime = Date.now();

for (let i = 1; i <= 10; i++) {
  const result = runRound(i);
  results.push(result);
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
const passed = results.filter(r => r.status === "pass").length;
const failed = results.filter(r => r.status === "fail").length;

// Write metrics
const metrics = {
  timestamp: new Date().toISOString(),
  rounds: 10,
  passed,
  failed,
  passRate: `${(passed / 10 * 100).toFixed(1)}%`,
  elapsedSeconds: elapsed,
  averagePerRound: `${(elapsed / 10).toFixed(1)}s`,
  tradeBreakdown: {
    hvac: results.filter(r => r.trade === "hvac").length,
    plumbing: results.filter(r => r.trade === "plumbing").length
  },
  results
};

writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2));

// Write learnings summary
const summary = `# Testing Loop Learnings — ${new Date().toISOString().split("T")[0]}

## Metrics
- **Pass rate:** ${metrics.passRate} (${passed}/10)
- **Total time:** ${elapsed}s
- **Average per round:** ${metrics.averagePerRound}
- **Trade split:** HVAC ${metrics.tradeBreakdown.hvac}, Plumbing ${metrics.tradeBreakdown.plumbing}

## Results by Round
${results.map((r, i) => `${i + 1}. ${r.client} (${r.trade}) — ${r.status.toUpperCase()} | ${r.services} services, ${r.areas} areas`).join("\n")}

## Observations
- [ ] Theme scalability holds under varied service counts (3-5 services)
- [ ] Multi-area pages (2-4 areas) render correctly
- [ ] Trade-agnostic architecture works for HVAC and Plumbing equally
- [ ] Brand color combinations render well
- [ ] Density and typePairing combinations valid

## Recommendations for Next Round
1. Add imagery support (hero images, gallery)
2. Expand KB with trade-specific nuances
3. Test with 6+ service areas (scalability ceiling)
4. Validate schema on extreme data (very long names, special chars)
5. A/B test CTA button copy variations

---
*Generated by testing-loop.mjs*
`;

appendFileSync(LEARNINGS_FILE, summary);

console.log(`\n${"=".repeat(60)}`);
console.log(`RESULTS — 10 rounds complete`);
console.log(`${"=".repeat(60)}`);
console.log(`\nPass rate: ${metrics.passRate} (${passed}/10)`);
console.log(`Total time: ${elapsed}s`);
console.log(`Average: ${metrics.averagePerRound}/round\n`);
console.log(`✓ Metrics saved to ${METRICS_FILE}`);
console.log(`✓ Learnings saved to ${LEARNINGS_FILE}\n`);

if (failed > 0) {
  console.log(`⚠ ${failed} round(s) failed. Review metrics file for details.\n`);
}
