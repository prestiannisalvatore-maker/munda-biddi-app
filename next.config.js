const defaultCache = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  // App Router: register from ServiceWorkerRegister client component instead
  register: false,
  skipWaiting: true,
  // Cache Next.js client navigations so tabs visited online work offline
  cacheOnFrontEndNav: true,
  // Don't force-reload when connectivity returns (disrupts field use)
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  // Serve offline.html when a page isn't in cache and the network is down
  fallbacks: {
    document: "/offline.html",
  },
  // Precache shell assets needed before any runtime visit
  additionalManifestEntries: [
    { url: "/offline.html", revision: "ios-offline-v2" },
    { url: "/manifest.json", revision: "ios-offline-v2" },
  ],
  runtimeCaching: [
    // Cache full page navigations (critical for iPhone airplane mode)
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 48,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    {
      // Next.js build assets
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      // OpenTopoMap tiles for offline Trail Map
      urlPattern: /^https:\/\/[abc]\.tile\.opentopomap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-topo",
        expiration: {
          maxEntries: 800,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Esri satellite tiles (3D preview / satellite layer)
      urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-satellite",
        expiration: {
          maxEntries: 800,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Leaflet marker assets
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "leaflet-assets",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // GPX and other static files in /public
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|gpx|kml)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    // Keep next-pwa defaults (fonts, js/css, same-origin, etc.)
    ...defaultCache,
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
