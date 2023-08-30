import { ClientRouter, replace } from "/index.js";

ClientRouter.onChange = replace;
ClientRouter.start();

document.querySelector("#link").addEventListener("click", (evt) => {
  evt.preventDefault();

  ClientRouter.push(evt.target.href);
});

console.log("READY");
