import { expect, type Page } from '@playwright/test';

/**
 * Assert that the page uses Tsinelas design system semantic tokens.
 *
 * Note: Checks main content area only, excluding Navbar/Footer and code examples (<pre> tags).
 *
 * This deliberately does not reject raw Tailwind palette classes: some
 * third-party widgets render them, so a DOM-level check cannot tell app code
 * from vendored markup. Keep raw colours out of app code with ESLint/code
 * review instead.
 */
export async function assertTsinelasTokens(page: Page): Promise<void> {
  // Check main content area instead of entire body to avoid Navbar/Footer legacy classes.
  // Sidebar layouts nest a second <main> inside the app shell's, so take the outermost.
  let mainHTML = await page.locator('main').first().innerHTML();

  // Remove <pre> tag contents (code examples that may show "wrong" usage as examples)
  mainHTML = mainHTML.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, '');

  // Tsinelas semantic tokens should be present
  expect(mainHTML).toMatch(/text-tsinelas-text-/);
  expect(mainHTML).toMatch(/bg-tsinelas-bg-/);
  expect(mainHTML).toMatch(/border-tsinelas-border-/);
}
