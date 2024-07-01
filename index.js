function debounce(fn, timeout = 200) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(this, args);
		}, timeout);
	};
}

// biome-ignore lint/complexity/noStaticOnlyClass: Just how this is built
export class ClientRouter {
	static window = globalThis;
	static onChange = async () => true;

	static async start() {
		ClientRouter.window.addEventListener("popstate", async (evt) => {
			const to = new URL(ClientRouter.window.document.location.href);
			const url = await ClientRouter.onChange(to);

			if (evt.state?.scrollPos) {
				ClientRouter.window.scrollTo(
					evt.state.scrollPos[0],
					evt.state.scrollPos[1],
				);
			}

			const toWithoutHash = new URL(to.toString());
			toWithoutHash.hash = "";

			if (url.toString() !== toWithoutHash.toString()) {
				ClientRouter.window.history.replaceState(
					{
						scrollPos: [
							ClientRouter.window.scrollX,
							ClientRouter.window.scrollY,
						],
					},
					"",
					url,
				);
			}
		});

		ClientRouter.window.addEventListener(
			"scroll",
			debounce(function () {
				this.window.history.replaceState(
					{
						scrollPos: [this.window.scrollX, this.window.scrollY],
					},
					"",
					this.window.location.href,
				);
			}),
		);
	}

	static push(path) {
		ClientRouter.pushOrReplace(path, false);
	}

	static replace(path) {
		ClientRouter.pushOrReplace(path, true);
	}

	static pushOrReplace(path) {
		const newUrl = new URL(path, ClientRouter.window.location.origin);

		// just set window.location if the new url isn't part of this origin
		if (newUrl.origin !== ClientRouter.window.location.origin) {
			ClientRouter.window.location = newUrl;
			return;
		}

		const currentUrl = new URL(ClientRouter.window.location.href);
		const currentHash = currentUrl.hash;
		currentUrl.hash = "";

		const newWithoutHash = new URL(newUrl.toString());
		newWithoutHash.hash = "";

		if (newWithoutHash.toString() === currentUrl.toString()) {
			if (currentHash !== newUrl.hash) {
				ClientRouter.window.history.replaceState(null, "", newUrl.toString());
			}

			return;
		}

		ClientRouter.change(newUrl);
	}

	static async change(newUrl, replace = false) {
		try {
			const url = await ClientRouter.onChange(newUrl);

			if (url !== false) {
				if (replace) {
					ClientRouter.window.history.replaceState(
						{ scrollPos: [0, 0] },
						"",
						new URL(url),
					);
				} else {
					ClientRouter.window.history.pushState(
						{ scrollPos: [0, 0] },
						"",
						new URL(url),
					);
				}

				ClientRouter.window.scrollTo(0, 0);
			}
		} catch (e) {
			// if an error occurs loading, just set the window location
			ClientRouter.window.location = newUrl;
			throw e;
		}
	}

	static async pushUrl(url) {
		ClientRouter.window.history.pushState(
			{ scrollPos: [0, 0] },
			"",
			new URL(url),
		);
		ClientRouter.window.scrollTo(0, 0);
	}
}

export { replace, replaceDocument } from "./replace.js";
