import { expect, test, type Page } from "@playwright/test";

/** Counts canvas draws so tests can see the image sequence updating. */
async function trackDraws(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __draws: number };
    w.__draws = 0;
    const original = CanvasRenderingContext2D.prototype.drawImage as (...a: unknown[]) => void;
    CanvasRenderingContext2D.prototype.drawImage = function (
      this: CanvasRenderingContext2D,
      ...args: unknown[]
    ) {
      w.__draws++;
      return original.apply(this, args);
    } as typeof CanvasRenderingContext2D.prototype.drawImage;
  });
}

const draws = (page: Page) =>
  page.evaluate(() => (window as unknown as { __draws: number }).__draws);

test.describe("hero building transformation (image sequence)", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("scroll advances and reverses the build; title stays put", async ({ page }) => {
    await trackDraws(page);
    // Not "networkidle": that waits for all ~360 hero frames; the draw polls below are the real signal.
    await page.goto("/", { waitUntil: "load" });
    const label = page.locator("[data-stage-label]");
    await expect(label).toHaveText("Foundation");
    await expect.poll(() => draws(page), { timeout: 10000 }).toBeGreaterThan(0);

    const title = page.locator("#hero-title");
    const titleTop = await title.evaluate((el) => el.getBoundingClientRect().top);

    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 180);
      await page.waitForTimeout(60);
    }
    await expect(label).not.toHaveText("Foundation", { timeout: 10000 });
    // Frames stream in after the load event, so the canvas keeps catching up for a moment.
    await expect.poll(() => draws(page), { timeout: 10000 }).toBeGreaterThan(5);
    const drawsForward = await draws(page);

    // Still inside the sticky track: the title does not move or fade.
    expect(await title.evaluate((el) => el.getBoundingClientRect().top)).toBeCloseTo(titleTop, 0);
    expect(await title.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);

    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, -180);
      await page.waitForTimeout(60);
    }
    await expect(label).toHaveText("Foundation", { timeout: 10000 });
    await expect.poll(() => draws(page), { timeout: 10000 }).toBeGreaterThan(drawsForward);
  });

  test("uses a canvas, not a video", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-hero-root] canvas")).toHaveCount(1);
    await expect(page.locator("[data-hero-root] video")).toHaveCount(0);
  });
});

test.describe("hero with reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("draws the finished building once and does not pin", async ({ page }) => {
    await trackDraws(page);
    await page.goto("/", { waitUntil: "load" });
    await expect.poll(() => draws(page), { timeout: 10000 }).toBeGreaterThan(0);
    await expect(page.locator("#hero-title")).toBeVisible();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(400);
    const top = await page
      .locator("[data-hero-root] section")
      .evaluate((s) => s.getBoundingClientRect().top);
    expect(top).toBeLessThan(-200);
  });
});
