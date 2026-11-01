import type { APIRoute } from "astro";
import { getPosts, getWork } from "../lib/content";
import { absolute } from "../lib/site";

// Only published content is listed; drafts and scheduled entries never appear here.
const PAGES = ["/", "/work", "/about", "/services", "/writing", "/cv", "/contact"];
// Change this date when the content of these pages changes.
const PAGES_UPDATED_AT = new Date("2026-11-01");

export const GET: APIRoute = async () => {
	const [work, posts] = await Promise.all([getWork(), getPosts(200)]);
	const urls = [
		...PAGES.map((path) => ({ loc: absolute(path), lastmod: PAGES_UPDATED_AT })),
		...work.items.map((item) => ({ loc: absolute(`/work/${item.id}`), lastmod: item.data.updatedAt })),
		...posts.items.map((post) => ({ loc: absolute(`/writing/${post.id}`), lastmod: post.data.updatedAt })),
	];

	const body = urls
		.map(({ loc, lastmod }) =>
			lastmod ? `  <url><loc>${loc}</loc><lastmod>${lastmod.toISOString()}</lastmod></url>` : `  <url><loc>${loc}</loc></url>`,
		)
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`,
		{ headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } },
	);
};
