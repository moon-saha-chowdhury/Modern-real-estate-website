import { expect, test } from "@playwright/test";

test.describe("inner pages are built, not stubs", () => {
  const pages: [string, RegExp][] = [
    ["/about", /intention/],
    ["/projects", /developments/],
    ["/expertise", /landmark/],
    ["/contact", /meaningful/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
  ];

  for (const [path, heading] of pages) {
    test(`${path} has real content`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
      await expect(page.getByText(/In development|Milestone \d/)).toHaveCount(0);
      const words = (await page.locator("main").innerText()).split(/\s+/).length;
      expect(words).toBeGreaterThan(60);
    });
  }

  test("sample content is labelled, not presented as real", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByText("Sample copy").first()).toBeVisible();
    await page.goto("/contact");
    await expect(page.getByText("Sample contact details")).toBeVisible();
    await expect(page.getByRole("link", { name: "+1 555 0100" }).first()).toBeVisible();
    await page.goto("/privacy");
    await expect(page.getByText(/not legal advice/)).toBeVisible();
  });
});

test.describe("projects page", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("lists every project and filters through the address", async ({ page }) => {
    await page.goto("/projects");
    const tiles = page.locator("main article");
    await expect(tiles).toHaveCount(6);

    await page.getByRole("button", { name: "Commercial" }).click();
    await expect(tiles).toHaveCount(2);
    await expect.poll(() => new URL(page.url()).searchParams.get("category")).toBe("commercial");

    await page.getByRole("button", { name: "Upcoming" }).click();
    await expect(tiles).toHaveCount(1);
    await expect(tiles.first()).toContainText("Facet Commons");

    await page.getByRole("button", { name: "All" }).first().click();
    await page.getByRole("button", { name: "All" }).last().click();
    await expect(tiles).toHaveCount(6);
  });

  test("the footer's portfolio links land on a filtered view", async ({ page }) => {
    await page.goto("/");
    await page.locator("footer").getByRole("link", { name: "Completed" }).click();
    await expect(page).toHaveURL(/status=completed/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/developments/);
    await expect(page.getByText("2 projects")).toBeVisible();
  });

  test("a project tile opens the project page", async ({ page }) => {
    await page.goto("/projects");
    await page
      .getByRole("link", { name: /The Linden/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/projects\/sample-the-linden/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The Linden");
  });
});

test.describe("search engines", () => {
  test("sitemap lists the pages and projects; robots hides the style guide", async ({
    request,
  }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("/projects/sample-the-linden");
    expect(xml).toContain("/about");

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const text = await robots.text();
    expect(text).toContain("Disallow: /styleguide");
    expect(text).toContain("sitemap.xml");
  });
});
