import { ClientRouter, replace } from "/index.js";

ClientRouter.onChange = replace;
ClientRouter.start();

const links = document.querySelectorAll("a");

for (const link of links) {
	link.addEventListener("click", (evt) => {
		evt.preventDefault();

		ClientRouter.push(evt.target.href);
	});
}

console.log("READY");
