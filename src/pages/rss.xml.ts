import type { APIRoute } from "astro";
import { getPosts } from "../lib/content";
import { absolute, SITE } from "../lib/site";

export const GET: APIRoute = async () => {
	const { items } = await getPosts(20);
	const entries = items
		.filter((post) => post.data.publishedAt)
		.map((post) => {
			const link = absolute(`/writing/${post.id}`);
			return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${post.data.publishedAt!.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.excerpt ?? "")}</description>
    </item>`;
		})
		.join("\n");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.name}, writing`)}</title>
    <link>${SITE.url}/writing</link>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml"/>
    <description>${escapeXml("Notes from building and running production software.")}</description>
    <language>en-au</language>
${entries}
  </channel>
</rss>`,
		{ headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } },
	);
};

function escapeXml(s: string) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
