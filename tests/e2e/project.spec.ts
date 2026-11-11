import { expect, test } from "@playwright/test";

const LINDEN = "/projects/sample-the-linden";

// The tour needs WebGL; software rendering works on machines without a GPU. Only this file uses it
// (software GL would slow the hero canvas in the other specs).
test.use({
  launchOptions: {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  },
});

test.describe("project page", () => {
  // Software WebGL is CPU-heavy: run this file's tests one after another so they don't starve
  // each other (and the server) when the whole suite runs in parallel.
  test.describe.configure({ mode: "serial" });
  test.use({ viewport: { width: 1440, height: 900 } });

  test("renders the lead sections and only the sections it has data for", async ({ page }) => {
    await page.goto("/projects/sample-northlight-tower");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Northlight Tower");
    await expect(page.getByRole("heading", { name: /About\s*the project/ })).toBeVisible();
    await expect(page.getByText("Sample project").first()).toBeVisible();
    // The sample record has no tour, gallery, plans, amenities or location.
    for (const name of [/Step inside/, /The\s*gallery/, /Floor\s*plans/, /amenities/, /location/]) {
      await expect(page.getByRole("heading", { name })).toHaveCount(0);
    }
    await expect(page.getByRole("link", { name: /Enquire about this project/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Next project/ })).toBeVisible();
  });

  test("the 360° tour loads only on demand and moves between rooms", async ({ page }) => {
    const requested: string[] = [];
    page.on("request", (request) => requested.push(request.url()));

    await page.goto(LINDEN, { waitUntil: "load" });
    const enter = page.getByRole("button", { name: "Enter the tour" });
    await enter.scrollIntoViewIfNeeded();
    await expect(enter).toBeVisible();
    await expect(page.getByText("Illustrative tour")).toBeVisible();

    // Before the click: no viewer, no panorama downloaded.
    await expect(page.locator(".psv-container")).toHaveCount(0);
    expect(requested.some((url) => /\/the-linden\/(living|dining)/.test(url))).toBe(false);

    await enter.click();
    await expect(page.locator(".psv-container canvas")).toBeVisible({ timeout: 30_000 });
    expect(requested.some((url) => url.includes("/the-linden/living.webp"))).toBe(true);

    const rooms = page.getByRole("navigation", { name: "Rooms" });
    await expect(rooms.getByRole("button")).toHaveCount(5);
    await expect(rooms.getByRole("button", { name: "Living room" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await rooms.getByRole("button", { name: "Dining & terrace" }).click();
    await expect(rooms.getByRole("button", { name: "Dining & terrace" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect
      .poll(() => requested.some((url) => url.includes("/the-linden/dining.webp")))
      .toBe(true);

    // Escape (and the button) go back to the still.
    await page.getByRole("region", { name: /virtual tour/ }).press("Escape");
    await expect(enter).toBeVisible();
    await expect(page.locator(".psv-container")).toHaveCount(0);
  });

  test("the sample project page is complete and its placeholder content is labelled", async ({
    page,
  }) => {
    await page.goto(LINDEN);
    for (const name of [
      /About\s*the project/,
      /Step inside/,
      /The\s*gallery/,
      /Floor\s*plans/,
      /Shared\s*amenities/,
      /The\s*location/,
    ]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    await expect(page.getByText("Sample details")).toHaveCount(2);
    await expect(page.getByText("Sample drawings")).toBeVisible();
    await expect(page.getByText("Illustrative render").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Type A" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Type B" })).toBeVisible();
  });

  test("a ?room= link opens the tour on that room, with a mini-map and a way to book", async ({
    page,
  }) => {
    await page.goto(LINDEN + "?room=bedroom");
    await expect(page.locator(".psv-container canvas")).toBeVisible({ timeout: 30_000 });
    const rooms = page.getByRole("navigation", { name: "Rooms" });
    await expect(rooms.getByRole("button", { name: "Bedroom" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.getByRole("link", { name: "Book a visit" })).toHaveAttribute(
      "href",
      "/contact",
    );

    // The mini-map moves between rooms, and the address bar follows.
    await page.getByRole("button", { name: "Go to Balcony" }).click();
    await expect(rooms.getByRole("button", { name: "Balcony" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect.poll(() => new URL(page.url()).searchParams.get("room")).toBe("balcony");

    // Leaving the tour clears the room from the address.
    await page.getByRole("button", { name: "Exit tour" }).click();
    await expect.poll(() => new URL(page.url()).searchParams.get("room")).toBeNull();
  });

  test("phones fetch the smaller panorama", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    const requested: string[] = [];
    page.on("request", (request) => requested.push(request.url()));
    await page.goto(LINDEN, { waitUntil: "load" });
    await page.getByRole("button", { name: "Enter the tour" }).click();
    await expect(page.locator(".psv-container canvas")).toBeVisible({ timeout: 30_000 });
    expect(requested.some((url) => url.includes("living-2k.webp"))).toBe(true);
    expect(requested.some((url) => /living\.webp/.test(url))).toBe(false);
    await context.close();
  });
});
