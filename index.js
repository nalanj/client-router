function debounce(fn, timeout = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(this, args);
    }, timeout);
  };
}

export class ClientRouter {
  static window = globalThis;
  static onChange = async () => true;

  static async start() {
    this.window.addEventListener("popstate", async (evt) => {
      const to = new URL(this.window.document.location.href);
      const url = await this.onChange(to);

      if (evt.state?.scrollPos) {
        this.window.scrollTo(evt.state.scrollPos[0], evt.state.scrollPos[1]);
      }

      if (url !== to) {
        this.window.history.replaceState(
          {
            scrollPos: [this.window.scrollX, this.window.scrollY],
          },
          "",
          url
        );
      }
    });

    this.window.addEventListener(
      "scroll",
      debounce(function () {
        this.window.history.replaceState(
          {
            scrollPos: [this.window.scrollX, this.window.scrollY],
          },
          "",
          this.window.location.href
        );
      })
    );
  }

  static push(path) {
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

  static async change(newUrl) {
    try {
      const url = await this.onChange(newUrl);

      if (url !== false) {
        this.window.history.pushState({ scrollPos: [0, 0] }, "", new URL(url));
        this.window.scrollTo(0, 0);
      }
    } catch (e) {
      // if an error occurs loading, just set the window location
      this.window.location = newUrl;
      throw e;
    }
  }
}

export { replace, replaceDocument } from "./replace.js";
