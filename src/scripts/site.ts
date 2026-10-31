// Progressive enhancement only: every page reads fully without this file.
import { initRise } from "./rise";
import { initRoll } from "./roll";
import { initToggle } from "./toggle";
import { initTraveller } from "./traveller";

declare global {
	interface Window {
		__site?: boolean;
	}
}

window.__site = true;
document.documentElement.classList.add("js");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initToggle(reduce);
initRoll();
initRise(reduce);
initTraveller(reduce);
