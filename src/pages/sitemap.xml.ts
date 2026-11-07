import type { APIRoute } from "astro";
import { getPosts, getWork } from "../lib/content";
import { absolute } from "../lib/site";

// Only published content is listed; drafts and scheduled entries never appear here.
const PAGES = ["/", "/work", "/about", "/services", "/writing", "/cv", "/contact"];
// Change this date when the content of these pages changes.
const PAGES_UPDATED_AT = new Date("2026-11-01");

export const GET: APIRoute = async () => {
	const [work, posts] = await Promise.all([getWork(), getPosts(200)]);
	const publishedSlugs = new Set(posts.items.map((post) => post.id));
	const urls: { loc: string; lastmod?: Date; alternates?: { hreflang: string; href: string }[] }[] = [
		...PAGES.map((path) => ({ loc: absolute(path), lastmod: PAGES_UPDATED_AT })),
		...work.items.map((item) => ({ loc: absolute(`/work/${item.id}`), lastmod: item.data.updatedAt })),
		...posts.items.map((post) => {
			const loc = absolute(`/writing/${post.id}`);
			const other = post.data.translation_slug;
			if (!other || !publishedSlugs.has(other)) return { loc, lastmod: post.data.updatedAt };
			const otherLoc = absolute(`/writing/${other}`);
			const isVi = post.data.lang === "vi";
			const en = isVi ? otherLoc : loc;
			const vi = isVi ? loc : otherLoc;
			return {
				loc,
				lastmod: post.data.updatedAt,
				alternates: [
					{ hreflang: "en", href: en },
					{ hreflang: "vi", href: vi },
					{ hreflang: "x-default", href: en },
				],
			};
		}),
	];

	const body = urls
		.map(({ loc, lastmod, alternates = [] }) => {
			const parts = [`<loc>${loc}</loc>`];
			if (lastmod) parts.push(`<lastmod>${lastmod.toISOString()}</lastmod>`);
			for (const alt of alternates) {
				parts.push(`<xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"/>`);
			}
			return `  <url>${parts.join("")}</url>`;
		})
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`,
		{ headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } },
	);
};
