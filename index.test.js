import assert from "node:assert/strict";
import { test } from "node:test";
import { ClientRouter } from "./index.js";

const fakeWindow = {
	addEventListener: () => null,
	location: {
		origin: "http://localhost:0",
		href: "http://localhost:0/whatever",
	},
	history: {
		pushState: () => null,
	},
	scrollTo: () => null,
};

test("push calls callback", async () => {
	ClientRouter.window = fakeWindow;

	let called = false;
	ClientRouter.onChange = (newUrl) => {
		called = true;

		return newUrl;
	};

	await ClientRouter.start();
	ClientRouter.push("/foobar");

	assert.equal(called, true);
});
