// Rolling figures: the real value stays in the text for screen readers and search.
export function initRoll() {
	const rolls = [...document.querySelectorAll<HTMLElement>("[data-roll]")];
	rolls.forEach((el, n) => {
		const value = el.textContent?.trim() ?? "";
		const said = Object.assign(document.createElement("span"), { className: "sr-only", textContent: value });
		const shown = Object.assign(document.createElement("span"), { className: "roll__digits" });
		shown.setAttribute("aria-hidden", "true");
		let i = n * 2;
		for (const ch of value) {
			if (!/\d/.test(ch)) {
				// drawn by CSS too, so the element's text is only the real value
				const mark = Object.assign(document.createElement("span"), { className: "roll__mark" });
				mark.dataset.n = ch;
				shown.appendChild(mark);
				continue;
			}
			const col = Object.assign(document.createElement("span"), { className: "roll__col" });
			const strip = Object.assign(document.createElement("span"), { className: "roll__strip" });
			strip.style.setProperty("--d", ch);
			strip.style.setProperty("--i", String(i++));
			for (let d = 0; d < 10; d++) {
				const digit = document.createElement("span");
				digit.dataset.n = String(d);
				strip.appendChild(digit);
			}
			col.appendChild(strip);
			shown.appendChild(col);
		}
		el.classList.add("roll");
		el.replaceChildren(said, shown);
	});
	requestAnimationFrame(() => requestAnimationFrame(() => rolls.forEach((el) => el.classList.add("is-in"))));
}
