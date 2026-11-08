import { expect, test } from "@playwright/test";
import { routes } from "../routes";

test.describe("routes", () => {
  for (const route of routes) {
    test(`${route.path} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }

  test("unknown route returns 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("not on the plan");
  });
});

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("primary nav links navigate and mark the current page", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(nav.getByRole("link", { name: "Projects" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("header gains a solid background after scrolling", async ({ page }) => {
    await page.goto("/styleguide");
    const header = page.locator("header").first();
    await expect(header).toHaveAttribute("data-scrolled", "false");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("mobile navigation", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("opens, traps focus, closes with Escape and restores focus", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: "Site navigation" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Home/ })).toBeFocused();

    // Focus must stay inside the header while open
    for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
    const insideHeader = await page.evaluate(() => !!document.activeElement?.closest("header"));
    expect(insideHeader).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
  });

  test("navigating from the menu closes it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /About/ }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});
