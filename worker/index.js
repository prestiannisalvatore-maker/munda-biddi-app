/* global self, caches, fetch, Response */

/**
 * Cache-first for document navigations. iOS Home Screen cold-starts fail when
 * Workbox waits on the network while Airplane Mode is on.
 */
self.addEventListener("message", (event) => {
  if (!event.data) return;
  if (event.data.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data.type === "CLIENTS_CLAIM") self.clients.claim();
});

const NAV_FALLBACKS = ["/go.html", "/", "/map", "/offline.html"];

async function matchNav(request) {
  const direct = await caches.match(request, { ignoreSearch: true });
  if (direct) return direct;

  const url = new URL(request.url);
  const path = url.pathname || "/";
  const pages = await caches.open("pages");
  const fromPages = (await pages.match(path)) || (await pages.match(request));
  if (fromPages) return fromPages;

  const start = await caches.open("start-url");
  const fromStart = await start.match("/") || (await start.match(path));
  if (fromStart) return fromStart;

  for (const fb of NAV_FALLBACKS) {
    const hit =
      (await caches.match(fb)) ||
      (await pages.match(fb)) ||
      (await caches.match(new Request(fb)));
    if (hit) return hit;
  }
  return null;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.mode !== "navigate") return;

  event.respondWith(
    (async () => {
      const cached = await matchNav(req);
      if (cached) return cached;
      try {
        const fresh = await fetch(req);
        if (fresh && fresh.ok) {
          try {
            const pages = await caches.open("pages");
            await pages.put(req, fresh.clone());
          } catch (_) {
            /* ignore */
          }
        }
        return fresh;
      } catch (_) {
        const fb = await matchNav(req);
        if (fb) return fb;
        return new Response(
          "<!doctype html><h1>Offline</h1><p>Open Wi‑Fi and run Prepare offline pack.</p><p><a href='/go.html'>Launch pad</a></p>",
          { status: 503, headers: { "Content-Type": "text/html" } }
        );
      }
    })()
  );
});
