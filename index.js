export class ClientRouter {
  window;

  constructor(_window = globalThis) {
    this.window = _window;
    this.onChange = async () => true;

    this.window.addEventListener("popstate", async (evt) => {
      await this.onChange(new URL(this.window.document.location.href), false);

      if (evt.state?.scrollPos) {
        this.window.scrollTo(evt.state.scrollPos[0], evt.state.scrollPos[1]);
      }
    });

    this.window.addEventListener("scroll", function () {
      this.window.history.replaceState(
        { scrollPos: [this.window.scrollX, this.window.scrollY] },
        "",
        this.window.location.href
      );
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
      this.window.history.pushState({ scrollPos: [0, 0] }, "", new URL(newUrl));
      this.window.scrollTo(0, 0);
    }
  }
}

export { replace, replaceDocument } from "./replace.js";
