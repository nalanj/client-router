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

    // just set window.location if the new url isn't part of this origin
    if (newUrl.origin !== this.window.location.origin) {
      this.window.location = newUrl;
      return;
    }

    const currentUrl = new URL(this.window.location.href);

    if (newUrl.toString() === currentUrl.toString()) {
      return;
    }

    this.change(newUrl);
  }

  async change(newUrl) {
    const result = await this.onChange(newUrl, true);

    if (result !== false) {
      this.window.scrollTo(0, 0);
      this.window.history.pushState(null, "", new URL(newUrl));
    }
  }
}

export { replace, replaceDocument } from "./replace.js";
