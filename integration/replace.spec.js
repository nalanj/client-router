import { test, expect } from "@playwright/test";

test("navigates forward and back", async ({ page }) => {
  await page.goto("/integration/replace");

  await expect(page.getByRole("heading", { name: "Hi there" })).toBeVisible();

  await page.getByRole("link", { name: "Click Me" }).click();

  await expect(page).toHaveURL("/integration/replacement");
  await expect(page.getByRole("heading", { name: "You did it" })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL("/integration/replace");
  await expect(page.getByRole("heading", { name: "Hi there" })).toBeVisible();
});
