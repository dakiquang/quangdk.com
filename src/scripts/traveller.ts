// The travelling full stop: one red dot that leaves each section's title as you scroll on
// and glides to the next one, so the page reads as one sentence. Without script, or with
// reduced motion, every title keeps its own dot.
export function initTraveller(reduce: boolean) {
	const stops = [...document.querySelectorAll<HTMLElement>(".hero h1 .dot, .title .dot, .signature .dot")];
	if (reduce || stops.length < 2) return;

	const dot = Object.assign(document.createElement("span"), { className: "traveller" });
	dot.setAttribute("aria-hidden", "true");
	document.body.appendChild(dot);

	const SIZE = 100; // the drawn circle, scaled to each stop's own size
	let x = 0;
	let y = 0;
	let d = 0;
	let frame = 0;

	// The stop for the section being read; at the very end of the page, the last one
	const activeStop = () => {
		const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
		if (atEnd) return stops[stops.length - 1];
		const line = window.innerHeight * 0.62;
		let current = stops[0];
		for (const stop of stops) if (stop.getBoundingClientRect().top < line) current = stop;
		return current;
	};

	// While its title is scrolled away, the dot waits in the left margin, never over the text
	const frameEl = document.querySelector<HTMLElement>(".frame");
	let margin = 16;
	const measure = () => {
		margin = frameEl ? parseFloat(getComputedStyle(frameEl).paddingLeft) || 16 : 16;
	};
	measure();
	const targetOf = (stop: HTMLElement) => {
		const r = stop.getBoundingClientRect();
		if (r.top >= margin) return { x: r.left, y: r.top, d: r.width };
		const size = Math.min(r.width, margin * 0.5);
		return { x: (margin - size) / 2, y: margin, d: size };
	};

	const place = () => {
		dot.style.transform = `translate(${x}px, ${y}px) scale(${d / SIZE})`;
	};

	const step = () => {
		const { x: tx, y: ty, d: td } = targetOf(activeStop());
		x += (tx - x) * 0.16;
		y += (ty - y) * 0.16;
		d += (td - d) * 0.16;
		place();
		const settled = Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3 && Math.abs(td - d) < 0.1;
		frame = settled ? 0 : requestAnimationFrame(step);
		if (settled) {
			x = tx;
			y = ty;
			d = td;
			place();
		}
	};

	const wake = () => {
		if (!frame) frame = requestAnimationFrame(step);
	};

	// Take over from the hero's own dot once it has landed
	setTimeout(() => {
		({ x, y, d } = targetOf(activeStop()));
		place();
		document.documentElement.classList.add("travel");
		window.addEventListener("scroll", wake, { passive: true });
		window.addEventListener("resize", () => {
			measure();
			wake();
		});
		wake();
	}, 1500);
}
