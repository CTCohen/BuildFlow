// Fictional, plausible clients for smoke tests and benchmarks: four launch verticals, real-sounding copy.
// Nothing here is a real business, testimonial or result.
const rev = (quote, author, location) => ({ quote, author, location });
const VERTICALS = {
  hvac: {
    name: "Copper State Heating & Air", city: "Mesa, AZ", areas: ["Mesa", "Gilbert", "Tempe", "Chandler"], years: 14, lic: "ROC 291847",
    services: [["AC repair", "Same-day repair on all major brands, with the part price quoted before we start."], ["System replacement", "Sized to your home, installed by our own crew, with a 10-year parts warranty."], ["Seasonal tune-ups", "Two visits a year to catch failures before the first 110-degree week."]],
    reviews: [rev("They fixed our AC the same afternoon and the price matched the quote.", "Dana R.", "Gilbert"), rev("Honest about repairing versus replacing. We kept our old unit two more years.", "Marcus T.", "Mesa")],
  },
  plumbing: {
    name: "Riverbend Plumbing", city: "Sacramento, CA", areas: ["Sacramento", "Elk Grove", "Folsom"], years: 9, lic: "CSLB 1049322",
    services: [["Drain cleaning", "Cables and hydro-jetting for slow drains and repeat clogs."], ["Water heaters", "Tank and tankless repair and replacement, usually in one visit."], ["Leak detection", "Find the leak without tearing out the wall, then fix it."]],
    reviews: [rev("Showed up in an hour on a Sunday and left the bathroom cleaner than he found it.", "Priya S.", "Folsom"), rev("Fair price on a new water heater. No upsell.", "Tom B.", "Elk Grove")],
  },
  electrical: {
    name: "Brightline Electric", city: "Columbus, OH", areas: ["Columbus", "Dublin", "Westerville"], years: 6, lic: "OH 44921",
    services: [["Panel upgrades", "Replace overloaded or outdated panels, permitted and inspected."], ["EV charger install", "Level 2 home chargers, wired and load-checked."], ["Lighting and outlets", "New circuits, recessed lighting and safer outlets."]],
    reviews: [rev("Upgraded our panel in a day and handled the inspection.", "Chris L.", "Dublin"), rev("Clear estimate, tidy work, chargers works great.", "Angela M.", "Westerville")],
  },
  roofing: {
    name: "Ridgeline Roofing Co", city: "Boise, ID", areas: ["Boise", "Meridian", "Eagle", "Nampa"], years: 21, lic: "RCE-30177",
    services: [["Roof replacement", "Full tear-off and replacement with a 25-year workmanship warranty."], ["Storm damage repair", "Hail and wind repair, with help on the insurance paperwork."], ["Roof inspections", "A written report with photos, useful before you buy or sell."]],
    reviews: [rev("They handled the insurance claim and finished in two days.", "Beth K.", "Meridian"), rev("Crew was on time and the yard was spotless after.", "Jared W.", "Eagle")],
  },
};
export const VERTICAL_IDS = Object.keys(VERTICALS);

export function makeClient({ vertical, tier = "smb", profile = "professional-service", slug, customization }) {
  const v = VERTICALS[vertical];
  const c = {
    slug: slug ?? `${vertical}-${tier}-${profile}`,
    tier,
    styleProfile: profile,
    business: { name: v.name, trade: vertical, phone: "+1-555-010-0142", email: `office@${v.name.toLowerCase().replace(/[^a-z]+/g, "")}.test`, cityState: v.city, serviceAreas: v.areas, hours: "Mon-Fri 7am-6pm", yearsInBusiness: v.years, licenseNo: v.lic },
    brand: { primary: "#0b5cad", accent: "#f2a516", heroStyle: null, typePairing: "grotesk-serif", density: "comfortable" },
    content: { en: {
      tagline: `${vertical === "hvac" ? "Heating and cooling" : vertical[0].toUpperCase() + vertical.slice(1)} for ${v.city.split(",")[0]} homes`,
      heroHeadline: `${v.city.split(",")[0]} ${vertical} done right the first time`,
      heroSub: `Licensed and insured, ${v.years} years serving ${v.areas.slice(0, 3).join(", ")}. Call or request a quote.`,
      primaryCta: "Get a free quote",
      about: `We are a local ${vertical} company that has served ${v.areas.join(", ")} for ${v.years} years. Our own technicians do the work, and we quote before we start.`,
      services: v.services.map(([name, blurb]) => ({ name, blurb })),
      reviews: v.reviews,
    } },
    media: { heroImage: null, logo: null, source: "generated-identity" },
  };
  if (customization) c.customization = customization;
  return c;
}
