import { expect, test } from "@playwright/test";

test.describe("hero tower explorer", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("hovering a floor shows its card; choosing it opens the residence", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero-root]");
    await expect(hero.locator("#hero-title")).toContainText("Building spaces.");
    const floors = hero.getByRole("list", { name: "Floors" }).getByRole("button");
    await expect(floors).toHaveCount(20);

    const floor = hero.getByRole("button", { name: /^Floor 15,/ });
    await floor.hover();
    await expect(hero.getByText("Available · from $1.69M")).toBeVisible();

    await floor.click();
    await expect(hero).toHaveAttribute("data-view", "residence");
    const panel = hero.getByRole("group", { name: "Residence A, floor 15" });
    await expect(panel.getByRole("heading", { name: "Residence A" })).toBeVisible();
    await expect(panel.getByText("Sample residence")).toBeVisible();
    await expect(panel.getByRole("button", { name: "Back to tower" })).toBeFocused();

    // A room: its note replaces the summary and the 360° tour is one click away.
    await panel.getByRole("button", { name: "Living room" }).last().click();
    await expect(panel.getByText(/full-height glass/)).toBeVisible();
    await expect(panel.getByRole("link", { name: /Look around in 360/ })).toHaveAttribute(
      "href",
      "/projects/sample-the-linden?room=living",
    );

    await page.keyboard.press("Escape");
    await expect(hero).toHaveAttribute("data-view", "tower");
    await expect(floor).toBeFocused();
  });

  test("the floors stay on the tower on a phone and open on tap", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto("/");
    const hero = page.locator("[data-hero-root]");
    const box = await hero.getByRole("list", { name: "Floors" }).boundingBox();
    expect(box!.x).toBeGreaterThan(0);
    expect(box!.x + box!.width).toBeLessThan(390);

    await hero.getByRole("button", { name: /^Floor 8,/ }).tap();
    await expect(hero).toHaveAttribute("data-view", "residence");
    await expect(hero.getByRole("button", { name: "Back to tower" })).toBeVisible();
    await context.close();
  });
});
