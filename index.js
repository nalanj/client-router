export class ClientRouter {
  window;

  constructor(_window = globalThis) {
    this.window = _window;
    this.onChange = () => true;

    this.window.addEventListener("popstate", () => {
      this.onChange(new URL(this.window.document.location.href), false);
    });
  }

  push(path) {
    const newUrl = new URL(path, this.window.location.origin);

    const currentUrl = new URL(this.window.location.href);

    if (newUrl.toString() === currentUrl.toString()) {
      return;
    }

    const result = this.onChange(newUrl, true);

    if (result !== false) {
      this.window.history.pushState(null, "", new URL(newUrl));
    }
  }
}

export { replace } from "./replace.js";
