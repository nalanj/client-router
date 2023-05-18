import { ClientRouter } from "/index.js";

const router = new ClientRouter();
router.onChange = (url) => {
  console.log(url);
  document.querySelector("h1").innerText = url.pathname;
};

document.querySelector("#link").addEventListener("click", (evt) => {
  evt.preventDefault();

  router.push("/there");
});

console.log("READY");
