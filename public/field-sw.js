/* Stirling Ridge Field Mode — minimal offline worker.
 * No Workbox. Precaches the self-contained field app only.
 */
const CACHE = "srw-field-v1";
const ASSETS = [
  "/field.html",
  "/field-data/trail.json",
  "/manifest.json",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Cache each asset individually so one failure does not abort install
      await Promise.all(
        ASSETS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "reload" });
            if (res.ok) await cache.put(url, res);
          } catch (_) {
            /* continue */
          }
        })
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("srw-field-") && k !== CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Field app and its assets: cache-first
  const isField =
    url.pathname === "/field.html" ||
    url.pathname === "/field-sw.js" ||
    url.pathname.startsWith("/field-data/") ||
    url.pathname === "/manifest.json" ||
    url.pathname.startsWith("/icons/");

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        // Always prefer field.html for any navigation when offline / as start
        const cachedField = await caches.match("/field.html");
        if (url.pathname === "/field.html" || url.pathname === "/") {
          if (cachedField) return cachedField;
        }
        const cached = await caches.match(req);
        if (cached) return cached;
        if (cachedField) return cachedField;
        try {
          return await fetch(req);
        } catch (_) {
          return (
            cachedField ||
            new Response("<h1>Offline</h1><p>Open /field.html once on Wi‑Fi.</p>", {
              headers: { "Content-Type": "text/html" },
            })
          );
        }
      })()
    );
    return;
  }

  if (!isField) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE);
          await cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (_) {
        return cached || Response.error();
      }
    })()
  );
});
