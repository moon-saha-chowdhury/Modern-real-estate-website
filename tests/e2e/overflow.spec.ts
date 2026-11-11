import { expect, test } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 } });
for (const p of [
  "/",
  "/about",
  "/projects",
  "/expertise",
  "/contact",
  "/privacy",
  "/terms",
  "/projects/sample-northlight-tower",
]) {
  test(`no sideways scroll ${p}`, async ({ page }) => {
    await page.goto(p);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(w).toBeLessThanOrEqual(391);
  });
}
