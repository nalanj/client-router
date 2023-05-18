import { test } from "node:test";
import assert from "node:assert/strict";
import { ClientRouter } from "./index.js";

const fakeWindow = {
  addEventListener: () => null,
  location: {
    origin: "http://localhost:0",
  },
  history: {
    pushState: () => null,
  },
};

test("push calls callback", () => {
  const router = new ClientRouter(fakeWindow);

  let called = false;
  router.onChange = () => {
    called = true;
  };

  router.push("/foobar");

  assert.equal(called, true);
});
