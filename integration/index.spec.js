import { expect, test } from "@playwright/test";

test("navigates forward and back", async ({ page }) => {
	await page.goto("/integration/");

	await expect(page.getByRole("heading", { name: "Hi there" })).toBeVisible();

	await page.getByRole("link", { name: "Click Me" }).click();

	await expect(page).toHaveURL("/there");
	await expect(page.getByRole("heading", { name: "/there" })).toBeVisible();

	await page.goBack();
	await expect(page).toHaveURL("/integration/");
	await expect(
		page.getByRole("heading", { name: "/integration/" }),
	).toBeVisible();
});
