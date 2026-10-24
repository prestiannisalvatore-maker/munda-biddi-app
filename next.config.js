const defaultCache = require("next-pwa/cache");

/** Bump when offline shell changes so SW re-precache runs on devices. */
const OFFLINE_REV = "offline-life-v1";

const withPWA = require("next-pwa")({
  dest: "public",
  // App Router: register from ServiceWorkerRegister client component
  register: false,
  skipWaiting: true,
  clientsClaim: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: false,
  // Precache "/" HTML at install (critical for Home Screen cold start)
  cacheStartUrl: true,
  dynamicStartUrl: false,
  customWorkerDir: "worker",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
  // One 404 in the precache list prevents the entire SW from installing on iOS
  buildExcludes: [
    /app-build-manifest\.json$/,
    /middleware-manifest\.json$/,
    /server\/app\/.*\/page_client-reference-manifest\.js$/,
  ],
  // Precache critical documents + shell so Airplane Mode opens without a prior visit
  additionalManifestEntries: [
    { url: "/offline.html", revision: OFFLINE_REV },
    { url: "/manifest.json", revision: OFFLINE_REV },
    { url: "/", revision: OFFLINE_REV },
    { url: "/map", revision: OFFLINE_REV },
    { url: "/help", revision: OFFLINE_REV },
    { url: "/info", revision: OFFLINE_REV },
    { url: "/itinerary", revision: OFFLINE_REV },
    { url: "/checklist", revision: OFFLINE_REV },
    { url: "/stirling-ridge-walk.gpx", revision: OFFLINE_REV },
    { url: "/leaflet/marker-icon.png", revision: OFFLINE_REV },
    { url: "/leaflet/marker-icon-2x.png", revision: OFFLINE_REV },
    { url: "/leaflet/marker-shadow.png", revision: OFFLINE_REV },
    { url: "/icons/apple-touch-icon.png", revision: OFFLINE_REV },
    { url: "/icons/icon-192x192.png", revision: OFFLINE_REV },
    { url: "/icons/icon-512x512.png", revision: OFFLINE_REV },
  ],
  runtimeCaching: [
    // OFFLINE-FIRST navigations: serve cache immediately (avoids iOS Safari
    // "not connected" when NetworkFirst waits on a dead radio).
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "StaleWhileRevalidate",
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
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|gpx|kml)$/i,
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
