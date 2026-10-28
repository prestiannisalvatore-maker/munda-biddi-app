const defaultCache = require("next-pwa/cache");

/** Bump when offline shell changes so SW re-precache runs on devices. */
const OFFLINE_REV = "offline-life-v3";

const withPWA = require("next-pwa")({
  dest: "public",
  register: false,
  skipWaiting: true,
  clientsClaim: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: false,
  // Static launch pad is the Home Screen entry (see public/go.html)
  cacheStartUrl: true,
  dynamicStartUrl: false,
  customWorkerDir: "worker",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/go.html",
  },
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /server\/app\/.*\/page_client-reference-manifest\.js$/,
  ],
  // Only STATIC public files here. Dynamic Next routes are warmed at runtime.
  // Precaching "/" etc. during SW install can fail on iOS and block the whole worker.
  additionalManifestEntries: [
    { url: "/go.html", revision: OFFLINE_REV },
    { url: "/offline.html", revision: OFFLINE_REV },
    { url: "/manifest.json", revision: OFFLINE_REV },
    { url: "/stirling-ridge-walk.gpx", revision: OFFLINE_REV },
    { url: "/leaflet/marker-icon.png", revision: OFFLINE_REV },
    { url: "/leaflet/marker-icon-2x.png", revision: OFFLINE_REV },
    { url: "/leaflet/marker-shadow.png", revision: OFFLINE_REV },
    { url: "/icons/apple-touch-icon.png", revision: OFFLINE_REV },
    { url: "/icons/icon-192x192.png", revision: OFFLINE_REV },
    { url: "/icons/icon-512x512.png", revision: OFFLINE_REV },
  ],
  runtimeCaching: [
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "CacheFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 300,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/[abc]\.tile\.opentopomap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-topo",
        expiration: {
          maxEntries: 2500,
          maxAgeSeconds: 60 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-esri",
        expiration: {
          maxEntries: 5000,
          maxAgeSeconds: 60 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles-osm",
        expiration: {
          maxEntries: 1500,
          maxAgeSeconds: 60 * 24 * 60 * 60,
        },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|gpx|kml|html)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    ...defaultCache,
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withPWA(nextConfig);
