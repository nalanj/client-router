import { test } from "node:test";
import assert from "node:assert/strict";
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

test("push calls callback", () => {
  ClientRouter.window = fakeWindow;

  let called = false;
  ClientRouter.onChange = () => {
    called = true;
  };

  ClientRouter.start();
  ClientRouter.push("/foobar");

  assert.equal(called, true);
});
