/**
 * Life-critical offline preparation for the Stirling Ridge Walk app.
 */

export const OFFLINE_FLAG_KEY = "srw-offline-ready-v2";
export const OFFLINE_TILES_FLAG_KEY = "srw-offline-tiles-v2";
export const PREP_LOCK_KEY = "srw-prep-lock-v2";

export const CRITICAL_PAGES = [
  "/go.html",
  "/",
  "/map",
  "/help",
  "/info",
  "/itinerary",
  "/checklist",
] as const;

export const OPTIONAL_PAGES = ["/3d"] as const;

export const CRITICAL_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/stirling-ridge-walk.gpx",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/leaflet/marker-icon.png",
  "/leaflet/marker-icon-2x.png",
  "/leaflet/marker-shadow.png",
] as const;

export const TRAIL_BOUNDS = {
  north: -34.3,
  south: -34.4,
  east: 118.42,
  west: 118.22,
};

/** Keep this small — ~300 tiles, one-time download. */
export const CRITICAL_TOPO_ZOOMS = [12, 13, 14, 15] as const;

export type PrepProgress = {
  phase: string;
  current: number;
  total: number;
};

function latLngToTile(lat: number, lng: number, zoom: number) {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
  return { x, y };
}

function tilesForZooms(
  zooms: readonly number[],
  buildUrl: (z: number, x: number, y: number) => string
) {
  const urls: string[] = [];
  for (const zoom of zooms) {
    const nw = latLngToTile(TRAIL_BOUNDS.north, TRAIL_BOUNDS.west, zoom);
    const se = latLngToTile(TRAIL_BOUNDS.south, TRAIL_BOUNDS.east, zoom);
    for (let x = nw.x; x <= se.x; x++) {
      for (let y = nw.y; y <= se.y; y++) {
        urls.push(buildUrl(zoom, x, y));
      }
    }
  }
  return urls;
}

export function buildCriticalTileJobs(): { url: string; cache: string }[] {
  const esriTopo = tilesForZooms(
    CRITICAL_TOPO_ZOOMS,
    (z, x, y) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`
  );
  return esriTopo.map((url) => ({ url, cache: "map-tiles-esri" }));
}

export function isOfflineReadyFlag(): boolean {
  try {
    return localStorage.getItem(OFFLINE_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOfflineReadyFlag(ready: boolean) {
  try {
    if (ready) localStorage.setItem(OFFLINE_FLAG_KEY, "1");
    else localStorage.removeItem(OFFLINE_FLAG_KEY);
  } catch {
    /* ignore */
  }
}

export function isTilesReadyFlag(): boolean {
  try {
    return localStorage.getItem(OFFLINE_TILES_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export function setTilesReadyFlag(ready: boolean) {
  try {
    if (ready) localStorage.setItem(OFFLINE_TILES_FLAG_KEY, "1");
    else localStorage.removeItem(OFFLINE_TILES_FLAG_KEY);
  } catch {
    /* ignore */
  }
}

async function putNavigate(cache: Cache, path: string, res: Response) {
  const body = await res.blob();
  const stored = new Response(body, {
    status: 200,
    statusText: "OK",
    headers: res.headers,
  });
  await cache.put(path, stored.clone());
  try {
    await cache.put(new Request(path, { mode: "navigate" }), stored.clone());
  } catch {
    /* ignore */
  }
  return stored;
}

export async function warmCriticalPages(): Promise<{
  ok: boolean;
  cached: number;
  detail: string;
}> {
  if (!("caches" in window)) {
    return { ok: false, cached: 0, detail: "Cache API blocked (Private mode?)." };
  }

  const pages = await caches.open("pages");
  const startUrl = await caches.open("start-url");
  const assets = await caches.open("static-assets");

  let okCount = 0;
  const failed: string[] = [];

  for (const path of [...CRITICAL_PAGES, ...OPTIONAL_PAGES]) {
    try {
      const res = await fetch(path, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
        cache: "reload",
      });
      if (!res.ok) {
        failed.push(`${path}(${res.status})`);
        continue;
      }
      const stored = await putNavigate(pages, path, res);
      if (path === "/" || path === "/go.html") {
        await startUrl.put(path, stored.clone());
        await startUrl.put("/", stored.clone());
      }
      okCount += 1;
    } catch {
      failed.push(path);
    }
  }

  for (const path of CRITICAL_ASSETS) {
    try {
      const res = await fetch(path, { credentials: "same-origin", cache: "reload" });
      if (res.ok) await assets.put(path, res.clone());
    } catch {
      /* ignore */
    }
  }

  const controller = navigator.serviceWorker?.controller;
  if (controller) {
    controller.postMessage({
      type: "CACHE_URLS",
      payload: {
        urlsToCache: [...CRITICAL_PAGES, ...OPTIONAL_PAGES, ...CRITICAL_ASSETS],
      },
    });
  }

  // Must have launch pad + map at minimum
  const hasGo = await pages.match("/go.html");
  const hasMap = await pages.match("/map");
  const hasHome = await pages.match("/");
  const ok = Boolean(hasGo && hasMap && hasHome);
  return {
    ok,
    cached: okCount,
    detail: ok
      ? `Cached ${okCount} pages including launch pad + map.`
      : `Page cache incomplete (${okCount}). Failed: ${failed.slice(0, 4).join(", ") || "unknown"}`,
  };
}

export async function ensureServiceWorkerActive(): Promise<{
  ready: boolean;
  detail: string;
}> {
  if (!("serviceWorker" in navigator)) {
    return {
      ready: false,
      detail: "No service worker — use Safari, turn off Private Browsing.",
    };
  }

  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      if (!reg.active) await reg.unregister();
    }

    const reg = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    await new Promise<void>((resolve) => {
      if (reg.active) {
        resolve();
        return;
      }
      const worker = reg.installing || reg.waiting;
      if (!worker) {
        resolve();
        return;
      }
      const done = () => {
        if (worker.state === "activated" || worker.state === "redundant" || reg.active) {
          worker.removeEventListener("statechange", done);
          resolve();
        }
      };
      worker.addEventListener("statechange", done);
      window.setTimeout(() => {
        worker.removeEventListener("statechange", done);
        resolve();
      }, 45000);
    });

    if (reg.active) {
      reg.active.postMessage({ type: "CLIENTS_CLAIM" });
      await new Promise((r) => setTimeout(r, 400));
    }

    if (reg.active || navigator.serviceWorker.controller) {
      return { ready: true, detail: "Offline engine active." };
    }

    return {
      ready: false,
      detail:
        "Offline engine did not activate. Safari Settings → clear this site’s data, reload on Wi‑Fi.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return { ready: false, detail: msg };
  }
}

async function countEsriTiles(): Promise<number> {
  try {
    const esri = await caches.open("map-tiles-esri");
    const keys = await esri.keys();
    return keys.length;
  } catch {
    return 0;
  }
}

export async function downloadCriticalMapTiles(
  onProgress?: (p: PrepProgress) => void
): Promise<{ ok: boolean; cached: number; total: number; detail: string }> {
  if (!("caches" in window)) {
    return { ok: false, cached: 0, total: 0, detail: "Cache API blocked." };
  }

  const existing = await countEsriTiles();
  if (isTilesReadyFlag() && existing >= 150) {
    return {
      ok: true,
      cached: existing,
      total: existing,
      detail: `Map tiles already on this iPhone (${existing} cached).`,
    };
  }

  const jobs = buildCriticalTileJobs();
  const esri = await caches.open("map-tiles-esri");
  let done = 0;
  const batchSize = 8;

  onProgress?.({ phase: "Downloading map tiles (one-time)…", current: 0, total: jobs.length });

  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async ({ url }) => {
        try {
          const hit = await esri.match(url);
          if (!hit) {
            // Prefer CORS so Workbox can reuse; fall back to no-cors opaque
            let res: Response | null = null;
            try {
              res = await fetch(url, { mode: "cors", cache: "force-cache" });
              if (!res.ok) res = null;
            } catch {
              res = null;
            }
            if (!res) {
              res = await fetch(url, { mode: "no-cors", cache: "force-cache" });
            }
            await esri.put(url, res);
          }
        } catch {
          /* skip bad tile */
        } finally {
          done += 1;
          onProgress?.({
            phase: "Downloading map tiles (one-time)…",
            current: done,
            total: jobs.length,
          });
        }
      })
    );
    await new Promise((r) => setTimeout(r, 40));
  }

  let present = 0;
  for (const { url } of jobs) {
    if (await esri.match(url)) present += 1;
  }
  const ok = present >= Math.floor(jobs.length * 0.7) || present >= 180;
  if (ok) setTilesReadyFlag(true);

  return {
    ok,
    cached: present,
    total: jobs.length,
    detail: ok
      ? `Map tiles saved on this iPhone (${present}/${jobs.length}). No need to re-download each time.`
      : `Map tiles incomplete (${present}/${jobs.length}). Stay on Wi‑Fi and tap Prepare once more.`,
  };
}

export async function prepareForOffline(
  onProgress?: (p: PrepProgress) => void
): Promise<{
  ok: boolean;
  sw: boolean;
  pages: boolean;
  tiles: boolean;
  detail: string;
}> {
  onProgress?.({ phase: "Starting offline engine…", current: 0, total: 3 });
  const sw = await ensureServiceWorkerActive();

  onProgress?.({ phase: "Caching app pages…", current: 1, total: 3 });
  const pages = await warmCriticalPages();

  onProgress?.({ phase: "Saving map tiles on iPhone…", current: 2, total: 3 });
  const tiles = await downloadCriticalMapTiles(onProgress);

  // App can launch offline with SW + pages; tiles required for map imagery
  const ok = sw.ready && pages.ok && tiles.ok;
  setOfflineReadyFlag(ok);

  return {
    ok,
    sw: sw.ready,
    pages: pages.ok,
    tiles: tiles.ok,
    detail: [sw.detail, pages.detail, tiles.detail].join(" "),
  };
}

export async function verifyOfflineCaches(): Promise<{
  pagesOk: boolean;
  tilesOk: boolean;
  swOk: boolean;
}> {
  const swOk = Boolean(
    "serviceWorker" in navigator &&
      ((await navigator.serviceWorker.getRegistration())?.active ||
        navigator.serviceWorker.controller)
  );

  let pagesOk = false;
  let tilesOk = isTilesReadyFlag();
  if ("caches" in window) {
    try {
      const pages = await caches.open("pages");
      const go = await pages.match("/go.html");
      const map = await pages.match("/map");
      const home = await pages.match("/");
      pagesOk = Boolean(go && map && home);
      if (!tilesOk) {
        tilesOk = (await countEsriTiles()) >= 150;
      }
    } catch {
      /* ignore */
    }
  }
  return { pagesOk, tilesOk, swOk };
}
