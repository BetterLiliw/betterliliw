/**
 * "In development" gate.
 *
 * While `VITE_COMING_SOON=true`, every route renders the ComingSoon page
 * instead of the portal. The team can bypass it with `?preview=1`, which is
 * remembered in localStorage so navigation keeps working; `?preview=0` clears
 * it again.
 *
 * To take the portal public, set `VITE_COMING_SOON=false` (or drop the var)
 * and redeploy — no code changes required.
 */

const PREVIEW_STORAGE_KEY = 'betterliliw:preview';

/** True when the build was made with the coming-soon gate switched on. */
export function isComingSoonEnabled(): boolean {
  return import.meta.env.VITE_COMING_SOON === 'true';
}

function readStoredPreview(): boolean {
  try {
    return window.localStorage.getItem(PREVIEW_STORAGE_KEY) === '1';
  } catch {
    // Private mode / blocked storage — fail closed, show the gate.
    return false;
  }
}

function storePreview(granted: boolean): void {
  try {
    if (granted) {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, '1');
    } else {
      window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
    }
  } catch {
    // Non-fatal: the ?preview flag still applies for this render.
  }
}

/**
 * Resolve preview access for the current URL.
 *
 * `?preview=1` grants access and persists it, `?preview=0` revokes it.
 * Without the param, the previously stored answer is used.
 */
export function resolvePreviewAccess(search: string): boolean {
  const requested = new URLSearchParams(search).get('preview');

  if (requested === '1' || requested === 'true') {
    storePreview(true);
    return true;
  }

  if (requested === '0' || requested === 'false') {
    storePreview(false);
    return false;
  }

  return readStoredPreview();
}
