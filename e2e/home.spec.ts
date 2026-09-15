import AxeBuilder from '@axe-core/playwright';
import serviceCategories from '../src/data/service_categories.json' with { type: 'json' };
import { test, expect } from './test-config';
import { assertKapwaTokens } from './utils/kapwa';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Hero section with search and quick access', async ({ page }) => {
    // Hero heading is visible
    await expect(page.locator('h1')).toBeVisible();

    // Search functionality works
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('health');
    await expect(page.locator('a[href*="/services/"]').first()).toBeVisible();

    // Clear search and the results listbox goes away
    await searchInput.fill('');
    await expect(page.getByRole('listbox')).toBeHidden();
  });

  test('All main sections are displayed', async ({ page }) => {
    // Consolidated section check - verify each section exists
    const sections = [
      /Government Services/i,
      /History of/i,
      /Weather/i,
      /Local Government/i,
    ];

    for (const text of sections) {
      await expect(
        page.locator('section').filter({ hasText: text })
      ).toBeVisible();
    }
  });

  test('Services section links to known categories', async ({ page }) => {
    const cards = page.locator('a[href*="/services?category="]');
    await expect(cards.first()).toBeVisible();

    // Every category link points at a real category (or "all")
    const known = new Set([
      'all',
      ...serviceCategories.categories.map(category => category.slug),
    ]);
    const hrefs = await cards.evaluateAll(links =>
      links.map(link => link.getAttribute('href') ?? '')
    );
    for (const href of hrefs) {
      const slug = new URL(href, 'http://localhost').searchParams.get(
        'category'
      );
      expect(known, `unknown category link ${href}`).toContain(slug);
    }
    await expect(
      page.locator('a[href="/services?category=all"]').first()
    ).toBeVisible();
  });

  test('Page uses Kapwa semantic tokens', async ({ page }) => {
    await assertKapwaTokens(page);
  });

  test('Navigation links work correctly', async ({ page }) => {
    // Test multiple navigation paths in one test
    const links = [
      '/services',
      '/transparency/financial',
      '/government/elected-officials',
    ];

    for (const href of links) {
      await page.goto('/');
      await page.locator(`a[href*="${href}"]`).first().click();
      await page.waitForURL(new RegExp(href.replace('/', '\\/')));
      expect(page.url()).toMatch(new RegExp(href.replace('/', '\\/')));
    }
  });

  test('Mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input[placeholder*="Search"]')).toBeVisible();
  });

  test('No console errors', async ({ page }) => {
    test.fixme(
      true,
      'config/lgu.config.json still has placeholder coordinates (lat/lng 0, and the code reads `lon`), so Leaflet logs "Invalid LatLng" on every load'
    );
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(errors.filter(e => !e.includes('DevTools'))).toHaveLength(0);
  });
});

test.describe('Home Page - Visual Regression', () => {
  test('Hero section visual snapshot @visual', async ({ page }) => {
    await page.goto('/');

    const heroSection = page.locator('main > div > div').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('Services section visual snapshot @visual', async ({ page }) => {
    await page.goto('/');

    const servicesSection = page.locator('section').filter({
      hasText: /Government Services/i,
    });
    await servicesSection.scrollIntoViewIfNeeded();

    await expect(servicesSection).toHaveScreenshot('services-section.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Home Page - Accessibility', () => {
  test('Home page passes accessibility checks @a11y', async ({ page }) => {
    test.fixme(
      true,
      'axe reports real violations: nested/duplicate <main> landmarks, duplicate skip links, aria-required-children, and colour contrast in Kapwa components'
    );
    await page.goto('/');

    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations).toEqual([]);
  });
});
