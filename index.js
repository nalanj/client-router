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
    const url = new URL(path, this.window.location.origin);
    const result = this.onChange(url, true);

    if (result !== false) {
      this.window.history.pushState(null, "", new URL(url));
    }
  }
}
