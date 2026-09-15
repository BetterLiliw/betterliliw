/**
 * Global test configuration for E2E tests with API mocking
 *
 * Import from this file instead of @playwright/test to get automatic API mocking:
 *
 *   import { test, expect } from './test-config';
 *
 * When CI=true or MOCK_API=true, all API requests will be mocked automatically.
 */

/* eslint-disable react-hooks/rules-of-hooks -- 'use' is from Playwright fixtures, not React */

import { test as base, expect, type Page, type Route } from '@playwright/test';

// Check if API mocking should be enabled
const shouldMockApis =
  process.env.CI === 'true' || process.env.MOCK_API === 'true';

/** Fulfil a route with a JSON body. */
function json(body: unknown) {
  return (route: Route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
}

/** Empty paginated list that satisfies every admin list page. */
const emptyAdminList = {
  items: [],
  logs: [],
  errors: [],
  documents: [],
  persons: [],
  sessions: [],
  pagination: {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 20,
    offset: 0,
    has_more: false,
  },
  offline: true,
};

/**
 * Register the API mocks.
 *
 * Playwright tries route handlers in REVERSE registration order (the most
 * recently registered handler wins), so the catch-all goes first and the
 * most specific mocks go last.
 */
async function mockApis(page: Page): Promise<void> {
  // Catch-all for any API request not mocked below.
  await page.route('**/api/**', json({ data: null, offline: true }));

  await page.route('**/api/submit-contribution**', json({ success: true }));

  // The ticker calls the shared BetterGov forex API directly; keep CI off the
  // network.
  await page.route(
    '**/api.bettergov.ph/forex**',
    json({
      rates: [
        { country: 'US Dollar', symbol: 'USD', phpEquivalent: 56.5 },
        { country: 'Euro', symbol: 'EUR', phpEquivalent: 61.2 },
        { country: 'Japanese Yen', symbol: 'JPY', phpEquivalent: 0.38 },
      ],
    })
  );

  await page.route('**/api/openlgu/**', json({ data: [], offline: true }));

  await page.route(
    '**/api/weather**',
    json({
      liliw: {
        name: 'Liliw',
        coordinates: { lat: 14.1306, lon: 121.4361 },
        weather: [{ icon: '01d', description: 'partly cloudy' }],
        main: {
          temp: 28,
          feels_like: 30,
          temp_min: 25,
          temp_max: 31,
          pressure: 1012,
          humidity: 75,
        },
        visibility: 10000,
        wind: { speed: 3.5, deg: 180 },
        clouds: { all: 10 },
        dt: Math.floor(Date.now() / 1000),
        sys: {},
        timezone: 28800,
        id: 0,
        timestamp: new Date().toISOString(),
        hourly: [],
      },
    })
  );

  // Admin: every list endpoint reads a different key, so answer with all of
  // them empty; then sign the test in as a fixture user so the admin pages
  // render instead of the "Admin Access Required" gate.
  await page.route('**/api/admin/**', json(emptyAdminList));

  await page.route(
    '**/api/admin/stats',
    json({
      review_queue: { total: 0, pending: 0, in_progress: 0, resolved: 0 },
      documents: { total: 0, pending_review: 0, processed: 0 },
      errors: { total: 0, recent: 0 },
      conflicts: { active: 0 },
      deletion_queue: { total: 0 },
    })
  );

  await page.route(
    '**/api/admin/auth/session',
    json({
      authenticated: true,
      user: {
        id: 1,
        login: 'e2e-admin',
        name: 'E2E Admin',
        email: null,
        avatar_url: '',
      },
    })
  );
}

/**
 * Extended test object with automatic API mocking
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Every route is lazy-loaded behind a Suspense boundary, so `goto` can
    // resolve before React has mounted, or while the shell still shows the
    // "Loading…" fallback. Wait for the shell, then for the route chunk to
    // land, before handing control back to the test.
    const goto = page.goto.bind(page);
    page.goto = async (url, options) => {
      const response = await goto(url, options);
      try {
        // The index.html splash overlay dismisses as soon as the shell mounts
        // (automation gets no minimum display time), but it must be gone
        // before any click can land.
        await page
          .locator('#splash')
          .waitFor({ state: 'detached', timeout: 15_000 });
        await page.locator('main').first().waitFor({ timeout: 15_000 });
        await page
          .getByText('Loading…', { exact: true })
          .waitFor({ state: 'hidden', timeout: 15_000 });
      } catch {
        // Leave it to the test's own assertions to report what went wrong.
      }
      return response;
    };

    if (shouldMockApis) {
      await mockApis(page);
    }

    await use(page);
  },
});

// Re-export expect for convenience
export { expect };
