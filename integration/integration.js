import { ClientRouter } from "/index.js";

ClientRouter.onChange = (url) => {
  document.querySelector("h1").innerText = url.pathname;

  return url;
};
ClientRouter.start();

document.querySelector("#link").addEventListener("click", (evt) => {
  evt.preventDefault();

  ClientRouter.push("/there");
});

console.log("READY");
