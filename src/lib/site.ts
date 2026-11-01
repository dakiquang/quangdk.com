// Site-wide facts used by the layout, structured data and pages.
// Numbers and wording here are pending approval (see docs/01-brand-data.md).
export const SITE = {
	name: "Quang Dang",
	handle: "quangdk",
	url: "https://quangdk.com",
	title: "Quang Dang · Product-minded Tech Lead",
	description:
		"Product-minded tech lead with 15+ years building software, 10 in SaaS. Simple products and solid engineering for teams in Australia, Europe and Vietnam.",
	jobTitle: "Tech Lead",
	email: "hello@quangdk.com",
	mailSubject: "A new project",
	links: {
		github: "https://github.com/dakiquang",
		linkedin: "https://www.linkedin.com/in/kim-quang-dang-16ba6317/",
	},
	knowsAbout: [
		"Product engineering",
		"SaaS",
		"Laravel",
		"PHP",
		"Node.js",
		"ReactJS",
		"Next.js",
		"React Native",
		"Flutter",
		"AWS",
		"Payments",
		"Cloudflare",
		"AI-assisted software development",
	],
} as const;

export const NAV = [
	{ label: "Work", href: "/work" },
	{ label: "About", href: "/about", optional: true },
	{ label: "Services", href: "/services", optional: true },
	{ label: "Writing", href: "/writing", optional: true },
] as const;

export const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(SITE.mailSubject)}`;

export const absolute = (path: string) => new URL(path, SITE.url).href;

export const personJsonLd = () => ({
	"@type": "Person",
	"@id": `${SITE.url}/#person`,
	name: SITE.name,
	alternateName: SITE.handle,
	url: SITE.url,
	jobTitle: SITE.jobTitle,
	image: absolute("/images/portrait.jpg"),
	sameAs: Object.values(SITE.links).filter(Boolean),
	knowsAbout: SITE.knowsAbout,
});
