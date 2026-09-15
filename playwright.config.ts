import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  /*
   * Ignore perf and a11y tests for now. The admin specs are ignored too: the
   * admin module is still template code (pages that render nothing, or crash
   * once signed in) and the specs describe UI that isn't there yet.
   */
  testIgnore: [
    '**/performance.spec.ts',
    '**/accessibility.spec.ts',
    '**/admin/**',
  ],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 1 : 0,
  /* GitHub's ubuntu runners have 4 vCPUs; the CI server is static so it keeps up. */
  workers: isCI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /*
   * Configure projects for major browsers.
   *
   * CI runs Chromium only: the full matrix multiplies the suite by five and
   * blew straight through the job timeout. Run the other browsers locally with
   * `npx playwright test --project=firefox` etc.
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(isCI
      ? []
      : [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
          {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
          },

          /* Test against mobile viewports. */
          {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
          },
          {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
          },
        ]),
  ],

  /*
   * Run your app before starting the tests.
   *
   * CI serves a production build: the dev server compiles every route on
   * first request, which was slow enough to trip the 30s navigation timeout.
   * Locally the dev server is reused so HMR keeps working while iterating.
   */
  webServer: {
    command: isCI
      ? 'npx vite build && npx vite preview --port 5173 --strictPort'
      : 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !isCI,
    timeout: 180 * 1000,
    env: {
      // The tests exercise the portal, never the coming-soon holding page.
      VITE_COMING_SOON: 'false',
    },
  },
});
