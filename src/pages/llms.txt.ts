import type { APIRoute } from "astro";
import { getPosts, getWork } from "../lib/content";
import { absolute, SITE } from "../lib/site";

// Only published content is listed; drafts and scheduled entries never appear here.
export const GET: APIRoute = async () => {
	const [work, posts] = await Promise.all([getWork(), getPosts(200)]);
	const workLinks = work.items.map((item) => `- [${item.data.title}](${absolute(`/work/${item.id}`)})`);
	const postLinks = posts.items.map((post) => `- [${post.data.title}](${absolute(`/writing/${post.id}`)})`);

	const sections = [
		`# ${SITE.name} (${SITE.handle})`,
		`> ${SITE.description}`,
		`## Pages

- [About](${absolute("/about")})
- [Services](${absolute("/services")})
- [CV](${absolute("/cv")})
- [Contact](${absolute("/contact")})`,
		workLinks.length > 0 && `## Selected work\n\n${workLinks.join("\n")}`,
		postLinks.length > 0 && `## Writing\n\n${postLinks.join("\n")}`,
		`## Open source

- [PaidUp](https://github.com/dakiquang/paidup): Invoices and safe payments across a Laravel API, a Next.js dashboard and an Expo app.
- [pr-orchestrator](https://github.com/dakiquang/pr-orchestrator): Cross-model pull request review with guardrails.
- [quangdk.com](https://github.com/dakiquang/quangdk.com): The source of this site.`,
	];

	return new Response(`${sections.filter(Boolean).join("\n\n")}\n`, {
		headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
	});
};
