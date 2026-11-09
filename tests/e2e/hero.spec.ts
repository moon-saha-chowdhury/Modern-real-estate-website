import { expect, test } from "@playwright/test";

const videoTime = (page: import("@playwright/test").Page) =>
  page.locator("[data-hero-root] video").evaluate((v: HTMLVideoElement) => v.currentTime);

test.describe("hero building transformation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("scroll scrubs the video forward and back, title fades, stage advances", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const video = page.locator("[data-hero-root] video");
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 15000 })
      .toBeGreaterThanOrEqual(1);

    expect(await videoTime(page)).toBeLessThan(0.1);
    await expect(page.locator("#hero-title")).toBeVisible();

    // Scroll deep into the pinned sequence.
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 180);
      await page.waitForTimeout(60);
    }
    await expect.poll(() => videoTime(page), { timeout: 10000 }).toBeGreaterThan(2);
    // Faded visually, but the h1 stays exposed to assistive tech.
    await expect
      .poll(() =>
        page.locator("[data-hero-copy]").evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBeLessThan(0.05);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.locator("[data-stage-label]")).not.toHaveText("Structure");
    const forward = await videoTime(page);

    // Scrolling back up reverses the build.
    for (let i = 0; i < 6; i++) {
      await page.mouse.wheel(0, -180);
      await page.waitForTimeout(60);
    }
    await expect.poll(() => videoTime(page), { timeout: 10000 }).toBeLessThan(forward - 0.5);
  });

  test("the video is silent and never autoplays", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const state = await page
      .locator("[data-hero-root] video")
      .evaluate((v: HTMLVideoElement) => ({ muted: v.muted, autoplay: v.autoplay, loop: v.loop }));
    expect(state).toEqual({ muted: true, autoplay: false, loop: false });
  });
});

test.describe("hero with reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("shows the finished building as a still image and keeps the title", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("[data-hero-root] video")).toBeHidden();
    await expect(page.locator("[data-hero-root] img")).toBeVisible();
    await page.mouse.wheel(0, 900);
    await page.waitForTimeout(400);
    // No pin under reduced motion: the page scrolls past the hero normally.
    const top = await page
      .locator("[data-hero-root] section")
      .evaluate((s) => s.getBoundingClientRect().top);
    expect(top).toBeLessThan(-200);
  });
});
