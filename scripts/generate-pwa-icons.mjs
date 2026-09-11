/**
 * Generates the maskable PWA icons from the logomark.
 *
 * Android and other launchers apply a shape mask (circle, squircle, …) to
 * `purpose: "maskable"` icons, so the artwork must sit inside the central
 * 80% "safe zone" on an opaque background. The plain `web-app-manifest-*.png`
 * files (transparent, edge-to-edge) stay as the `purpose: "any"` icons.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'public/logos/betterliliw-logomark-primary.svg');
const background = '#ffffff';
// Fraction of the canvas the mark may occupy; keeps it well inside the
// 80% safe zone with breathing room for circular masks.
const scale = 0.68;

for (const size of [192, 512]) {
  const inner = Math.round(size * scale);
  const mark = await sharp(source)
    .resize({ width: inner, height: inner, fit: 'inside' })
    .png()
    .toBuffer();

  const out = path.join(
    root,
    `public/web-app-manifest-maskable-${size}x${size}.png`
  );
  await sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png()
    .toFile(out);
  console.log('wrote', path.relative(root, out));
}
