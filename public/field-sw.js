/* Field Mode SW v3 — only Field Mode offline; never hijacks the rest of the site.
 * Network-first for /field.html when online so zoom/offline fixes reach the phone.
 */
const CACHE = "srw-field-v3";
const ASSETS = [
  "/field.html",
  "/field-data/trail.json",
  "/manifest.json",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/field-sw.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      for (const url of ASSETS) {
        try {
          const res = await fetch(url, { cache: "reload" });
          if (res.ok) await cache.put(url, res.clone());
        } catch (_) {}
      }
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
      // Also drop old Workbox / next-pwa caches that break the site
      await Promise.all(
        keys
          .filter(
            (k) =>
              k.includes("workbox") ||
              k.includes("next-pwa") ||
              k.startsWith("start-url") ||
              k.startsWith("pages-") ||
              k.startsWith("static-")
          )
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

  const path = url.pathname;
  const isFieldAsset =
    path === "/field.html" ||
    path === "/field-sw.js" ||
    path.startsWith("/field-data/") ||
    path === "/manifest.json" ||
    path.startsWith("/icons/");

  // Only Field Mode navigations — leave Next.js routes alone
  if (req.mode === "navigate") {
    if (path !== "/field.html") return;
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req, { cache: "no-cache" });
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE);
            await cache.put("/field.html", fresh.clone());
            return fresh;
          }
        } catch (_) {}
        const cached = await caches.match("/field.html");
        if (cached) return cached;
        return new Response(
          "<!doctype html><meta name=viewport content='width=device-width,initial-scale=1'><body style='font-family:sans-serif;padding:24px;background:#0b1220;color:#fff'><h1>Offline copy missing</h1><p>Connect to Wi‑Fi, open <strong>/field.html</strong>, tap <strong>Save for offline</strong>, then Add to Home Screen.</p></body>",
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      })()
    );
    return;
  }

  if (!isFieldAsset) return;

  event.respondWith(
    (async () => {
      // SW script itself: always try network so updates install
      if (path === "/field-sw.js") {
        try {
          const fresh = await fetch(req, { cache: "no-cache" });
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE);
            await cache.put(req, fresh.clone());
            return fresh;
          }
        } catch (_) {}
      }
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
