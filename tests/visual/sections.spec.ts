import { test } from "@playwright/test";

/**
 * Per-section captures of the homepage for design review:
 * .artifacts/screenshots/sections/<width>-<nn>.png
 * Each section is scrolled into view first so in-view reveals and scrubbed lines have played.
 */
const widths = [
  { name: "1440", width: 1440, height: 900 },
  { name: "390", width: 390, height: 844 },
];

for (const vp of widths) {
  test(`home sections @ ${vp.name}`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    const sections = page.locator("main section, body > footer");
    const count = await sections.count();
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      await section.scrollIntoViewIfNeeded();
      // Scroll through tall sections so every reveal inside them triggers.
      const box = await section.boundingBox();
      if (box) {
        for (let y = 0; y < box.height; y += vp.height * 0.5) {
          await page.mouse.wheel(0, vp.height * 0.5);
          await page.waitForTimeout(120);
        }
      }
      await page.waitForTimeout(1200);
      await section.screenshot({
        path: `.artifacts/screenshots/sections/${vp.name}-${String(i + 1).padStart(2, "0")}.png`,
        animations: "disabled",
        style: 'body > header, a[href="#main"] { visibility: hidden !important; }',
      });
    }
  });
}
