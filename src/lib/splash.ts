/**
 * Splash screen dismissal.
 *
 * The splash itself is static markup in `index.html` so it paints on every
 * page load before this bundle arrives. The app calls `dismissSplash()` once
 * its shell has mounted; the overlay then stays up just long enough for the
 * wordmark reveal to finish, fades out and is removed from the DOM.
 */

/** The wordmark reveal animation runs ~2.4s; hold briefly after it lands. */
const MIN_VISIBLE_MS = 2700;

/** With reduced motion the mark is static, so only a short beat is needed. */
const MIN_VISIBLE_REDUCED_MS = 500;

/** Matches the opacity transition on `#splash` in index.html. */
const FADE_MS = 450;

let dismissed = false;

function minimumVisibleMs(): number {
  // Automation (Playwright et al.) should never wait on brand choreography.
  if (navigator.webdriver) return 0;

  const reduced = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  return reduced ? MIN_VISIBLE_REDUCED_MS : MIN_VISIBLE_MS;
}

export function dismissSplash(): void {
  if (dismissed) return;
  dismissed = true;

  const splash = document.getElementById('splash');
  if (!splash) return;

  // `performance.now()` counts from navigation start, which is effectively
  // when the splash first painted.
  const remaining = Math.max(0, minimumVisibleMs() - performance.now());

  window.setTimeout(() => {
    splash.setAttribute('aria-busy', 'false');
    splash.classList.add('is-leaving');
    window.setTimeout(() => splash.remove(), FADE_MS + 50);
  }, remaining);
}
