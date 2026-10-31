// Before / After, the one live thing: the old version is struck through, then gives way.
export function initToggle(reduce: boolean) {
	document.querySelectorAll<HTMLElement>("[data-toggle]").forEach((group) => {
		const target = document.getElementById(group.dataset.toggle ?? "");
		if (!target) return;
		const buttons = group.querySelectorAll<HTMLButtonElement>("button[data-show]");
		let timer: ReturnType<typeof setTimeout> | undefined;
		target.dataset.show = "after";
		buttons.forEach((btn) => {
			btn.addEventListener("click", () => {
				const next = btn.dataset.show;
				if (!next || target.dataset.show === next) return;
				buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
				clearTimeout(timer);
				if (next === "after" && !reduce) {
					target.classList.add("striking");
					timer = setTimeout(() => {
						target.dataset.show = "after";
						target.classList.remove("striking");
					}, 460);
				} else {
					target.classList.remove("striking");
					target.dataset.show = next;
				}
			});
		});
	});
}
