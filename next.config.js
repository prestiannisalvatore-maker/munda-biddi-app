const defaultCache = require("next-pwa/cache");

const withPWA = require("next-pwa")({
  dest: "public",
  // App Router: register from ServiceWorkerRegister client component instead
  register: false,
  skipWaiting: true,
  clientsClaim: true,
  // Cache Next.js client navigations so tabs visited online work offline
  cacheOnFrontEndNav: true,
  // Don't force-reload when connectivity returns (disrupts field use)
  reloadOnOnline: false,
  disable: process.env.NODE_ENV === "development",
  // Serve offline.html when a page isn't in cache and the network is down
  fallbacks: {
    document: "/offline.html",
  },
  // App Router emits app-build-manifest.json into the Workbox precache, but
  // Vercel does not serve that file (404). One missing precache URL makes the
  // whole service worker fail to install on iPhone — badges hang forever.
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /server\/app\/.*\/page_client-reference-manifest\.js$/,
  ],
  // Precache shell assets needed before any runtime visit
  additionalManifestEntries: [
    { url: "/offline.html", revision: "ios-offline-v4" },
    { url: "/manifest.json", revision: "ios-offline-v4" },
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
      // OpenTopoMap contour tiles
      urlPattern: /^https:\/\/[abc]\.tile\.opentopomap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-topo",
        expiration: {
          maxEntries: 2500,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Esri World Topo + World Imagery (Trail Map + 3D)
      urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-esri",
        expiration: {
          maxEntries: 4000,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // OSM streets (high-zoom detail layer)
      urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-osm",
        expiration: {
          maxEntries: 1500,
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
