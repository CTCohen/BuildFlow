import type { APIRoute } from "astro";

const PATHS = ["/", "/services", "/about", "/contact"];

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.toString() ?? "https://example.com").replace(/\/$/, "");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
