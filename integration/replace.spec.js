import { expect, test } from "@playwright/test";

test("navigates forward and back", async ({ page }) => {
	await page.goto("/integration/replace");

	await expect(page.getByRole("heading", { name: "Hi there" })).toBeVisible();

	await page.getByRole("link", { name: "Click Me" }).click();

	await expect(page).toHaveURL("/integration/replacement");
	await expect(page.getByRole("heading", { name: "You did it" })).toBeVisible();

	// verify sticky meta tag stuck around
	const sticky = page.locator("link");
	await expect(sticky).toBeAttached();
	await expect(sticky).toHaveAttribute("rel", "whatever");

	await page.goBack();
	await expect(page).toHaveURL("/integration/replace");
	await expect(page.getByRole("heading", { name: "Hi there" })).toBeVisible();
});
