import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3100);
/** Uses the locally installed Chrome by default; set PW_CHANNEL="" to use the bundled Chromium. */
const channel = process.env.PW_CHANNEL ?? "chrome";

/**
 * Two projects:
 *  - e2e:     behavioural smoke tests (navigation, mobile menu, accessibility basics)
 *  - screens: visual QA captures at 1440 / 1024 / 390 into .artifacts/screenshots
 * Runs against the production build (`npm run build` first).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "e2e", testDir: "./tests/e2e", use: { ...devices["Desktop Chrome"], channel } },
    { name: "screens", testDir: "./tests/visual", use: { ...devices["Desktop Chrome"], channel } },
  ],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
