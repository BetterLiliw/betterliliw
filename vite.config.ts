import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/** One day / one week / one month in seconds, for Workbox expiration. */
const DAY = 60 * 60 * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — loaded on every page
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
            '@remix-run/router',
          ],
          // Maps — only needed on map pages
          'vendor-leaflet': ['leaflet', 'react-leaflet'],
          // Charts — only needed on stats/transparency pages
          'vendor-recharts': ['recharts'],
          // Search — only needed on search page
          'vendor-search': ['meilisearch', 'fuse.js'],
          // i18n — loaded early but large
          'vendor-i18n': ['i18next', 'react-i18next'],
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // Prompt-based updates: the app shows a "reload for the latest version"
      // banner (src/components/pwa/ReloadPrompt.tsx) instead of swapping the
      // service worker under a visitor mid-read.
      registerType: 'prompt',
      // Static PNG/SVG icons already live in public/; the manifest is
      // generated here so it stays in sync with the build.
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon.png',
        'logos/*.svg',
        'ph-logo.svg',
        'marker-icon-2x.webp',
      ],
      manifest: {
        id: '/',
        name: 'BetterLiliw',
        short_name: 'BetterLiliw',
        description:
          'Community-powered civic portal for the Municipality of Liliw, Laguna — services, officials, transparency data and legislation.',
        lang: 'en-PH',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#1c3a5b',
        background_color: '#ffffff',
        categories: ['government', 'news', 'utilities'],
        icons: [
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/web-app-manifest-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/web-app-manifest-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Services',
            short_name: 'Services',
            description: "Citizen's Charter and how to avail services",
            url: '/services',
          },
          {
            name: 'Government',
            short_name: 'Government',
            description: 'Elected officials, departments and barangays',
            url: '/government/elected-officials',
          },
          {
            name: 'Transparency',
            short_name: 'Transparency',
            description: 'Budget, procurement and infrastructure projects',
            url: '/transparency',
          },
        ],
      },
      workbox: {
        // Precache the app shell: hashed JS/CSS chunks, fonts, locales and
        // the brand assets the splash screen depends on.
        globPatterns: ['**/*.{js,css,html,ico,svg,png,webp,woff,woff2,json}'],
        // Static data JSON is bundled into chunks, but a few large images
        // (og_image, social renders) are not worth precaching.
        globIgnores: ['**/og_image.png', '**/social/**', '**/*.map'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        // SPA fallback for deep links, except for the API and the admin
        // panel, which must always hit the network.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/admin(\/|$)/],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Admin/auth endpoints: never cached, never served offline.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && url.pathname.startsWith('/api/admin/'),
            handler: 'NetworkOnly',
          },
          {
            // Public OpenLGU / legislation data: serve cached copy instantly
            // and refresh in the background.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin &&
              /^\/api\/(openlgu|legislation|terms)\//.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-public',
              expiration: { maxEntries: 200, maxAgeSeconds: WEEK },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Weather / forex are time-sensitive: prefer fresh, fall back
            // to cache when offline.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && url.pathname.startsWith('/api/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-live',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: DAY },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Google Fonts stylesheet and font files.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: WEEK },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 30, maxAgeSeconds: MONTH * 12 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // OpenStreetMap tiles for the barangay / weather maps. Capped so
            // a wandering map session cannot fill the visitor's storage.
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: MONTH },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Opt in with `VITE_PWA_DEV=true npm run dev` to test the service
        // worker locally; off by default so it never interferes with HMR.
        enabled: process.env.VITE_PWA_DEV === 'true',
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        rewrite: path => path,
        configure: proxy => {
          // Handle proxy errors (ECONNREFUSED, ECONNRESET, etc.)
          proxy.on(
            'error',
            (
              _err: Error,
              _req: unknown,
              res: {
                headersSent: boolean;
                writeHead: (
                  code: number,
                  headers: Record<string, string>
                ) => void;
                end: (data: string) => void;
              }
            ) => {
              if (!res.headersSent) {
                res.writeHead(503, { 'Content-Type': 'application/json' });
                res.end(
                  JSON.stringify({ error: 'API unavailable', offline: true })
                );
              }
            }
          );
          // Handle proxy request errors (connection failures)
          proxy.on(
            'proxyReq',
            (proxyReq: {
              on: (event: string, handler: () => void) => void;
            }) => {
              proxyReq.on('error', () => {
                // Error will be caught by the main error handler above
              });
            }
          );
        },
      },
    },
  },
});
