import type { APIRoute } from "astro";
import { SITE } from "../lib/site";

// AI crawlers are allowed on purpose: the goal is to be found and cited (docs/02-seo-strategy.md).
export const GET: APIRoute = () =>
	new Response(
		`User-agent: *
Allow: /
Disallow: /_emdash/

Sitemap: ${SITE.url}/sitemap.xml
`,
		{ headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } },
	);
