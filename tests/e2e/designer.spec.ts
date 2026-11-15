import { expect, test } from "@playwright/test";

// The designer is WebGL: software rendering works on machines without a GPU (see project.spec.ts).
test.use({
  launchOptions: {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  },
});

test.describe("residence designer", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(90000);
  test.use({ viewport: { width: 1440, height: 900 } });

  test("opens with a furnished apartment and the controls around it", async ({ page }) => {
    await page.goto("/design");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("yours");
    await expect(page.locator("canvas")).toBeVisible({ timeout: 60000 });
    await expect(page.getByText("Sample plan and furniture")).toBeVisible();
    await expect(page.getByText(/In the apartment · \d+/)).toBeVisible();
    // All eight rooms can be flown to, and the finishes and moods are one click away.
    const rooms = page.getByRole("group", { name: "Rooms" }).getByRole("button");
    await expect(rooms).toHaveCount(9);
    await page.getByRole("tab", { name: "Moods" }).click();
    await expect(page.getByRole("button", { name: /Warm/ })).toBeVisible();
  });

  test("adds, turns, undoes and removes a piece of furniture", async ({ page }) => {
    await page.goto("/design");
    await expect(page.locator("canvas")).toBeVisible({ timeout: 60000 });
    const count = page.getByText(/In the apartment · \d+/);
    const before = Number(((await count.textContent()) ?? "").match(/(\d+)/)?.[1]);

    await page
      .getByRole("button", { name: /Mid-century lounge chair/ })
      .first()
      .click();
    await expect(count).toHaveText(new RegExp(`· ${before + 1}`));
    const toolbar = page.getByRole("toolbar");
    await expect(toolbar).toBeVisible();

    await toolbar.getByRole("button", { name: /Turn right/ }).click();
    await toolbar.getByRole("button", { name: /Duplicate/ }).click();
    await expect(count).toHaveText(new RegExp(`· ${before + 2}`));

    await page.getByRole("button", { name: /Undo/ }).click();
    await expect(count).toHaveText(new RegExp(`· ${before + 1}`));
    await page.getByRole("button", { name: /Redo/ }).click();
    await expect(count).toHaveText(new RegExp(`· ${before + 2}`));

    await page
      .getByRole("toolbar")
      .getByRole("button", { name: /Remove/ })
      .click();
    await expect(count).toHaveText(new RegExp(`· ${before + 1}`));
  });

  test("repaints one room, applies a mood, and keeps the design in a link", async ({ page }) => {
    await page.goto("/design");
    await expect(page.locator("canvas")).toBeVisible({ timeout: 60000 });
    await page
      .getByRole("group", { name: "Rooms" })
      .getByRole("button", { name: "Primary bedroom" })
      .click();
    await page.getByRole("tab", { name: "Finishes" }).click();
    await expect(page.getByText(/Choosing for Primary bedroom/)).toBeVisible();
    const sage = page.getByRole("button", { name: "Sage" });
    await sage.click();
    await expect(sage).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("tab", { name: "Moods" }).click();
    await page.getByRole("button", { name: /Dark/ }).click();

    await page.getByRole("button", { name: /Copy link/ }).click();
    await expect(page).toHaveURL(/#d=/);
    const url = page.url();

    // The same link brings the same design back.
    await page.goto("/design");
    await page.goto(url);
    await page.reload();
    await expect(page.locator("canvas")).toBeVisible({ timeout: 60000 });
    await page.getByRole("tab", { name: "Finishes" }).click();
    await page
      .getByRole("group", { name: "Rooms" })
      .getByRole("button", { name: "Primary bedroom" })
      .click();
    await expect(page.getByRole("button", { name: "Charcoal" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("the credits name the CC-BY models that are in the room", async ({ page }) => {
    await page.goto("/design");
    await expect(page.locator("canvas")).toBeVisible({ timeout: 60000 });
    await page.getByText("Model credits").click();
    await expect(page.getByText(/Poly Haven, CC0/)).toBeVisible();
    await expect(page.getByRole("link", { name: "3dimentionalben" }).first()).toBeVisible();
    await expect(page.getByText(/CC BY 4\.0, via Sketchfab/).first()).toBeVisible();
  });
});
