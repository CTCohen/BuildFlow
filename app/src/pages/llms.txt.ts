import { client } from "../lib/client";
import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const biz = client.business;
  const services = client.content.en.services;
  const areas = biz.serviceAreas;

  const lines = [
    `# ${biz.name}`,
    `Licensed ${biz.trade} in ${biz.cityState}. Same-day service, one-year guarantee.`,
    "",
    "## Pages",
    "- [Home](/) — Contact, hours, emergency line",
    "- [Services](/services) — All services offered",
    ...services.map(
      (s) => `  - [${s.name}](/services/${s.slug || s.name.toLowerCase().replace(/[^\w]+/g, "-")})`
    ),
    "- [Service Areas](/areas) — Coverage by city",
    ...areas.map((a) => `  - [Service in ${a}](/areas/${a.toLowerCase().replace(/[^\w]+/g, "-")})`),
    "- [About](/about) — Company history, team, license",
    "- [Contact](/contact) — Quote form, emergency line, address",
  ];

  return new Response(lines.join("\n"), {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
