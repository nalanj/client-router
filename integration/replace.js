import { ClientRouter, replace } from "/index.js";

const router = new ClientRouter();
router.onChange = replace;

document.querySelector("#link").addEventListener("click", (evt) => {
  evt.preventDefault();

  router.push(evt.target.href);
});

console.log("READY");
