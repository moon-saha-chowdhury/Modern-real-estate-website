import { test } from "@playwright/test";
import { routes, viewports } from "../routes";

/**
 * Visual QA captures (not assertions). Output: .artifacts/screenshots/<route>-<width>.png
 * Scrolls the page first so in-view reveals have played.
 */
for (const vp of viewports) {
  for (const route of routes) {
    test(`${route.name} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route.path, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);

      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += Math.round(vp.height * 0.6)) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(1400);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(900);

      await page.screenshot({
        path: `.artifacts/screenshots/${route.name}-${vp.name}.png`,
        fullPage: true,
      });
      // Above-the-fold capture as well
      await page.screenshot({ path: `.artifacts/screenshots/${route.name}-${vp.name}-fold.png` });
    });
  }
}
