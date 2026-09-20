import { validateClient } from "../data/schema.mjs";

// Active client for this build. `import.meta.env.CLIENT` is injected by astro.config.mjs.
const SLUG = (import.meta.env.CLIENT as string) || "demo-plumbing";

const modules = import.meta.glob("../data/clients/*.json", { eager: true }) as Record<
  string,
  { default: unknown }
>;

function loadRaw(slug: string): unknown {
  const key = Object.keys(modules).find((k) => k.endsWith(`/${slug}.json`));
  if (!key) {
    const available = Object.keys(modules)
      .map((k) => k.split("/").pop()?.replace(".json", ""))
      .join(", ");
    throw new Error(`Client "${slug}" not found. Available: ${available || "(none)"}`);
  }
  return modules[key].default;
}

export type Lang = "en" | "es";

export interface Service {
  name: string;
  blurb: string;
  slug?: string;
  description?: string;
  symptoms?: string[];
  process?: { title: string; description: string }[];
  pricingSignal?: string;
}
export interface Review {
  quote: string;
  author: string;
  location?: string;
}
export interface ClientContent {
  tagline: string;
  heroHeadline: string;
  heroSub: string;
  primaryCta: string;
  about: string;
  services: Service[];
  reviews: Review[];
}
export interface Client {
  slug: string;
  business: {
    name: string;
    trade: string;
    phone: string;
    email: string;
    cityState: string;
    serviceAreas: string[];
    hours: string;
    yearsInBusiness?: number;
    licenseNo?: string;
    teamSize?: number;
  };
  brand: {
    primary: string;
    accent: string;
    heroStyle: "photo-left" | "full-bleed" | "split" | "accent-bar" | "minimal";
    typePairing: "grotesk-serif" | "humanist" | "classic";
    density: "compact" | "comfortable" | "spacious";
    servicesLayout?: "grid-3col" | "grid-2col-feature" | "card-stack" | "list-sidebar";
    testimonialStyle?: "grid" | "carousel" | "sidebar";
  };
  content: { en: ClientContent; es?: ClientContent };
  tier: "micro" | "smb" | "mid-market";
  styleProfile: string;
  media?: { heroImage?: string; logo?: string };
  // Mega-scale: Vertical pool + conditional features
  vertical?: string;
  conditionalFeatures?: {
    emergencyFocused?: boolean;
    portfolioHeavy?: boolean;
    seasonal?: boolean;
    projectBased?: boolean;
    premiumPositioning?: boolean;
    multiLocation?: boolean;
    soloOperator?: boolean;
    healthSafety?: boolean;
  };
}

const raw = loadRaw(SLUG);
const result = validateClient(raw);
if (!result.ok) {
  throw new Error(
    `Client "${SLUG}" failed validation:\n` + result.errors.map((e) => `  - ${e}`).join("\n"),
  );
}
if (result.warnings.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `[client:${SLUG}] warnings:\n` + result.warnings.map((w) => `  - ${w}`).join("\n"),
  );
}

export const client = raw as Client;
export const tel = client.business.phone.replace(/[^+0-9]/g, "");
export function t(lang: Lang): ClientContent {
  return client.content[lang] ?? client.content.en;
}
// Languages this client actually has content for (English-only at launch).
export const langs = (Object.keys(client.content) as Lang[]).filter((l) => client.content[l]);
