import { expect, test } from "@playwright/test";

// WebGL in headless Chromium needs the software renderer (as in project.spec.ts).
test.use({
  launchOptions: {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  },
});

test.describe("hero tower explorer", () => {
  test.describe.configure({ mode: "serial" });
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

    // A room: its note replaces the summary on hover; choosing it opens its 360° view in place.
    const living = panel.getByRole("button", { name: "Step inside: Living room" }).last();
    await living.hover();
    await expect(panel.getByText(/full-height glass/)).toBeVisible();
    await living.click();
    const tour = hero.getByRole("region", { name: "Residence A, 360° view" });
    await expect(tour.locator(".psv-container canvas")).toBeVisible({ timeout: 20000 });
    await expect(tour.getByRole("button", { name: "Living room", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(new URL(page.url()).search).toBe("");

    // Escape leaves the room first, then the residence.
    // (Each step plays its flight clip backwards first; software rendering makes that slow here.)
    const flying = hero.locator("video.opacity-100");
    // A key pressed while a flight clip is playing is ignored, so wait for the fly-in to end.
    await expect(flying).toHaveCount(0, { timeout: 15000 });
    await page.keyboard.press("Escape");
    await expect(tour).toHaveCount(0, { timeout: 15000 });
    await expect(hero).toHaveAttribute("data-view", "residence");
    await expect(flying).toHaveCount(0, { timeout: 15000 });
    await page.keyboard.press("Escape");
    await expect(hero).toHaveAttribute("data-view", "tower", { timeout: 15000 });
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
