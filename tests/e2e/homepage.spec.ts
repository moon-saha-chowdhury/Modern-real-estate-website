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

  test("selected work lists each featured project as a full-width card", async ({ page }) => {
    await page.goto("/");
    const list = page.getByRole("list", { name: "Featured projects" });
    const cards = list.locator("article");
    expect(await cards.count()).toBeGreaterThan(1);
    await expect(cards.first().getByRole("heading", { level: 3 })).toBeVisible();
    await expect(cards.first().getByText("Sample project")).toBeVisible();
  });

  test("every sample project tile is labelled and links to its page", async ({ page }) => {
    await page.goto("/");
    const tile = page.locator("main article").first();
    await expect(tile.getByText("Sample project")).toBeVisible();
    await tile.getByRole("link").first().click();
    // Generous timeout: with parallel workers all streaming hero frames, the local server
    // answers the client navigation slowly.
    await expect(page).toHaveURL(/\/projects\/sample-/, { timeout: 15000 });
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
