// Queries for the three EmDash collections: work (case studies), posts (writing), cuts (Before / After).
// Each returns the cache hints so cached routes are invalidated when content is published.
import { getEmDashCollection } from "emdash";

type Hint = unknown;
type Entry<T> = { id: string; data: T & { id: string; publishedAt: Date | null; updatedAt: Date }; edit: Record<string, unknown> };

export type WorkData = {
	title: string;
	summary: string;
	role?: string;
	years?: string;
	platforms?: string;
	stack?: string;
	featured?: boolean;
	sort_order?: number;
	featured_image?: { id: string; src?: string; alt?: string; width?: number; height?: number };
	tradeoffs?: { decision: string; gave_up?: string; why?: string }[];
	content?: unknown[];
};

export type PostData = {
	title: string;
	kind?: string;
	excerpt?: string;
	featured_image?: { id: string; src?: string; alt?: string; width?: number; height?: number };
	content?: unknown[];
	/** Language of the article; missing means English */
	lang?: "en" | "vi";
	/** Slug of the same article in the other language */
	translation_slug?: string;
};

export type CutData = { title: string; before: string; after: string; sort_order?: number };

const byOrder = <T extends { data: { sort_order?: number } }>(a: T, b: T) =>
	(a.data.sort_order ?? 999) - (b.data.sort_order ?? 999);

export async function getWork(options: { featuredOnly?: boolean } = {}) {
	const { entries, cacheHint } = await getEmDashCollection("work", { status: "published", limit: 100 });
	let items = (entries as unknown as Entry<WorkData>[]).sort(byOrder);
	if (options.featuredOnly) items = items.filter((entry) => entry.data.featured);
	return { items, cacheHint: cacheHint as Hint };
}

export async function getPosts(limit = 50) {
	const { entries, cacheHint } = await getEmDashCollection("posts", {
		status: "published",
		orderBy: { published_at: "desc" },
		limit,
	});
	return { items: entries as unknown as Entry<PostData>[], cacheHint: cacheHint as Hint };
}

export async function getCuts() {
	const { entries, cacheHint } = await getEmDashCollection("cuts", { status: "published", limit: 20 });
	return { items: (entries as unknown as Entry<CutData>[]).sort(byOrder), cacheHint: cacheHint as Hint };
}

export const formatDate = (date: Date | null, locale = "en-AU") =>
	date ? date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Ho_Chi_Minh" }) : "";
