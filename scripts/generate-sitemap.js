#!/usr/bin/env node

/**
 * Generates public/sitemap.xml for the live BetterLiliw route tree.
 *
 * Static routes are hand-maintained below (keep them in sync with
 * src/App.tsx when routes change). Dynamic routes — departments, barangays,
 * services — are read from the same JSON data the app renders from, so the
 * sitemap always matches what actually gets built.
 *
 * Deliberately left out:
 * - `/admin/*` and the catch-all 404 — not public content.
 * - `/government` and `/statistics` (bare) — client-side redirect / a
 *   duplicate of `/statistics/population` under a second URL. Only the
 *   canonical target is listed.
 * - `/government/reference-implementation` — an internal design-system
 *   showcase page, not real content.
 * - `/openlgu/documents/:document`, `/openlgu/session/:id`,
 *   `/openlgu/person/:id`, `/openlgu/term/:id`, and
 *   `/transparency/infrastructure/:contractId` — these are served from the
 *   D1 database at runtime (see functions/api/openlgu, functions/api's
 *   infrastructure lookups) and aren't available as static data at build
 *   time. A follow-up would expose these via a dynamic sitemap endpoint
 *   (e.g. a Cloudflare Pages Function reading D1) referenced from a
 *   sitemap index; this script only covers what it can generate statically.
 *
 * Run: node ./scripts/generate-sitemap.js
 * Wired into `npm run build` (see package.json) so it runs after
 * merge:services (fresh service data) and before `vite build` (so Vite
 * copies the regenerated file out of public/ into dist/).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const lguConfig = readJson(path.join(__dirname, '../config/lgu.config.json'));
const siteUrl = lguConfig.portal.baseUrl.replace(/\/$/, '');
const features = lguConfig.features;

/** Routes that exist regardless of feature flags. Keep in sync with src/App.tsx. */
const STATIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/accessibility',
  '/search',
  '/ideas',
  '/join-us',
  '/terms-of-service',
  '/sitemap',
  '/discord',
  '/data/weather',
  '/data/forex',
  '/services',
  '/government/elected-officials',
  '/government/elected-officials/committees',
  '/government/departments',
  '/government/barangays',
  '/contribute',
];

function featureGatedRoutes() {
  const routes = [];

  if (features.statistics) {
    routes.push(
      '/statistics/population',
      '/statistics/municipal-income',
      '/statistics/competitiveness'
    );
  }

  if (features.openLGU) {
    routes.push('/openlgu', '/openlgu/officials', '/openlgu/terms');
  }

  if (features.transparency) {
    routes.push(
      '/transparency',
      '/transparency/financial',
      '/transparency/procurement',
      '/transparency/infrastructure'
    );
  }

  return routes;
}

function dynamicDataRoutes() {
  const routes = [];

  const departments = readJson(
    path.join(__dirname, '../src/data/directory/departments.json')
  );
  for (const dept of departments) {
    if (dept.slug) routes.push(`/government/departments/${dept.slug}`);
  }

  const barangays = readJson(
    path.join(__dirname, '../src/data/directory/barangays.json')
  );
  for (const barangay of barangays) {
    if (barangay.slug) routes.push(`/government/barangays/${barangay.slug}`);
  }

  const services = readJson(
    path.join(__dirname, '../src/data/citizens-charter/merged-services.json')
  );
  for (const service of services) {
    if (service.slug) routes.push(`/services/${service.slug}`);
  }

  return routes;
}

function escapeXml(value) {
  return value.replace(
    /[&<>"']/g,
    char =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[char]
  );
}

function buildSitemapXml(routes, lastmod) {
  const urls = routes
    .map(
      route => `  <url>
    <loc>${escapeXml(`${siteUrl}${route}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function main() {
  console.log('🗺️  Generating sitemap.xml...');

  const routes = Array.from(
    new Set([...STATIC_ROUTES, ...featureGatedRoutes(), ...dynamicDataRoutes()])
  ).sort();

  // lastmod reflects the build date, not per-page content freshness — the
  // repo doesn't track a real "last edited" date per page today. A build
  // date is honest (it's genuinely when this file was produced) without
  // implying content changed more or less often than it does.
  const lastmod = new Date().toISOString().split('T')[0];

  const xml = buildSitemapXml(routes, lastmod);
  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');

  console.log(`✅ Wrote ${routes.length} URLs to ${outputPath}`);
}

main();
