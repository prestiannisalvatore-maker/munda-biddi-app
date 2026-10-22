const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      // Cache app pages
      urlPattern: /^https?:\/\/.*\/_next\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "next-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      // Cache OpenTopoMap tiles for offline use
      urlPattern: /^https:\/\/[abc]\.tile\.opentopomap\.org\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-topo",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Cache Esri satellite tiles
      urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-satellite",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      // Cache Google Fonts
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "google-fonts-stylesheets",
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-webfonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      // Cache Leaflet assets
      urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/leaflet\/.*$/,
      handler: "CacheFirst",
      options: {
        cacheName: "leaflet-assets",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      // Cache static assets
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|gpx)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
