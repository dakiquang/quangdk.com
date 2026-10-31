// Entrances below the fold: each part rises once, in reading order.
export function initRise(reduce: boolean) {
	const parts = document.querySelectorAll<HTMLElement>("[data-rise]");
	if (reduce || !("IntersectionObserver" in window)) {
		parts.forEach((el) => el.classList.add("in"));
		return;
	}
	const seen = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("in");
				seen.unobserve(entry.target);
			});
		},
		{ rootMargin: "0px 0px -12% 0px" },
	);
	parts.forEach((el) => seen.observe(el));
}
