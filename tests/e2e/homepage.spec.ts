import { expect, test } from "@playwright/test";

test.describe("homepage", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("renders all nine sections in order", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main section")).toHaveCount(9);
    await expect(page.locator("main section[aria-labelledby]")).toHaveCount(9);
    await expect(page.locator("#hero-title")).toContainText("Building spaces.");
    await expect(page.locator("#contact-title")).toContainText("meaningful");
  });

  test("project filters narrow the mosaic and announce the count", async ({ page }) => {
    await page.goto("/");
    const group = page.getByRole("group", { name: /Places in/ });
    const tiles = page.locator("main article");

    const all = await tiles.count();
    expect(all).toBeGreaterThan(1);

    await group.getByRole("button", { name: /Commercial/ }).click();
    await expect(group.getByRole("button", { name: /Commercial/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(tiles).toHaveCount(1);
    await expect(tiles.first()).toContainText("Commercial");
    await expect(page.getByText(/1 project shown/)).toBeAttached();

    await group.getByRole("button", { name: /^All/ }).click();
    await expect(tiles).toHaveCount(all);
  });

  test("every sample project tile is labelled and links to its page", async ({ page }) => {
    await page.goto("/");
    const tile = page.locator("main article").first();
    await expect(tile.getByText("Sample project")).toBeVisible();
    await tile.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/projects\/sample-/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("statistics never show invented numbers", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Awaiting verified figure")).toHaveCount(4);
  });
});

test.describe("enquiry form", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows inline errors, then a truthful success state", async ({ page }) => {
    await page.goto("/#enquire");
    const form = page.getByRole("form", { name: "Enquiry form" });

    await form.getByRole("button", { name: /Send enquiry/ }).click();
    await expect(form.getByText("Please enter your full name.")).toBeVisible();
    await expect(form.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");

    await form.getByText("Landowner partnership").click();
    await form.getByLabel("Full name").fill("Test Visitor");
    await form.getByLabel("Email").fill("not-an-email");
    await form.getByLabel("Message").fill("I have a plot I would like to discuss.");
    await form.getByLabel("Full name").focus();
    await expect(form.getByText(/Enter an email address/)).toBeVisible();

    await form.getByLabel("Email").fill("visitor@example.com");
    await form.getByRole("button", { name: /Send enquiry/ }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("Your enquiry has been received");
    await expect(status).toContainText("isn't connected to Meridian's inbox yet");
  });
});
