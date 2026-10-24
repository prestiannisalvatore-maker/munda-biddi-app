"use client";

import { useState, useEffect, useCallback } from "react";

interface OfflineManagerProps {
  onClose?: () => void;
}

/** Stirling Range trail bounds (with padding) */
const BOUNDS = {
  north: -34.3,
  south: -34.4,
  east: 118.42,
  west: 118.22,
};

/**
 * Zoom coverage for offline:
 * - Topo/contours mid zooms for overview
 * - Higher zooms so pinch-zoom on the ridge still has tiles
 * Keep z17+ modest — tile count grows 4× per level.
 */
const TOPO_ZOOMS = [12, 13, 14, 15, 16];
const SAT_ZOOMS = [13, 14, 15, 16, 17];

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
  zooms: number[],
  buildUrl: (z: number, x: number, y: number) => string
) {
  const urls: string[] = [];
  for (const zoom of zooms) {
    const nw = latLngToTile(BOUNDS.north, BOUNDS.west, zoom);
    const se = latLngToTile(BOUNDS.south, BOUNDS.east, zoom);
    for (let x = nw.x; x <= se.x; x++) {
      for (let y = nw.y; y <= se.y; y++) {
        urls.push(buildUrl(zoom, x, y));
      }
    }
  }
  return urls;
}

export default function OfflineManager({ onClose }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isCaching, setIsCaching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalTiles, setTotalTiles] = useState(0);
  const [cachedTiles, setCachedTiles] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<
    "idle" | "caching" | "complete" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getTileJobs = useCallback(() => {
    const topoEsri = tilesForZooms(
      TOPO_ZOOMS,
      (z, x, y) =>
        `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}`
    );
    const topoOpen = tilesForZooms(TOPO_ZOOMS, (z, x, y) => {
      const subdomain = ["a", "b", "c"][(x + y) % 3];
      return `https://${subdomain}.tile.opentopomap.org/${z}/${x}/${y}.png`;
    });
    const satellite = tilesForZooms(
      SAT_ZOOMS,
      (z, x, y) =>
        `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`
    );

    // Cache names must match next.config.js runtimeCaching cacheName values
    return [
      ...topoEsri.map((url) => ({ url, cache: "map-tiles-esri" as const })),
      ...topoOpen.map((url) => ({ url, cache: "map-tiles-topo" as const })),
      ...satellite.map((url) => ({ url, cache: "map-tiles-esri" as const })),
    ];
  }, []);

  const cacheTiles = async () => {
    if (!("caches" in window)) {
      setErrorMessage("Your browser doesn't support offline caching");
      setCacheStatus("error");
      return;
    }

    setIsCaching(true);
    setCacheStatus("caching");
    setErrorMessage(null);

    const jobs = getTileJobs();
    setTotalTiles(jobs.length);
    setCachedTiles(0);
    setProgress(0);

    try {
      const cachesByName: Record<string, Cache> = {
        "map-tiles-topo": await caches.open("map-tiles-topo"),
        "map-tiles-esri": await caches.open("map-tiles-esri"),
      };
      let done = 0;
      const batchSize = 8;

      for (let i = 0; i < jobs.length; i += batchSize) {
        const batch = jobs.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async ({ url, cache }) => {
            try {
              const store = cachesByName[cache];
              const existing = await store.match(url);
              if (!existing) {
                const response = await fetch(url, { mode: "cors" });
                if (response.ok) await store.put(url, response);
              }
            } catch {
              /* individual tile failures are ok */
            } finally {
              done += 1;
              setCachedTiles(done);
              setProgress(Math.round((done / jobs.length) * 100));
            }
          })
        );
        await new Promise((r) => setTimeout(r, 80));
      }

      setCacheStatus("complete");
    } catch {
      setErrorMessage("Failed to cache some tiles. Please try again.");
      setCacheStatus("error");
    } finally {
      setIsCaching(false);
    }
  };

  const clearCache = async () => {
    if ("caches" in window) {
      await caches.delete("map-tiles-topo");
      await caches.delete("map-tiles-esri");
      await caches.delete("map-tiles-satellite");
      setCacheStatus("idle");
      setProgress(0);
      setCachedTiles(0);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-400 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-800">Offline map download</h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        )}
      </div>

      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
          isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        <span
          className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}
        />
        <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-4 text-sm text-blue-800 space-y-2">
        <p>
          Downloads topographic + satellite tiles for the Stirling Ridge area through
          zoom levels used when you pinch in on the trail (so detail does not vanish
          offline).
        </p>
        <p className="text-xs text-blue-700">
          Tip: on the map, use layer control (top-right) — <strong>Topographic</strong>{" "}
          or <strong>Satellite</strong> stay sharp when zoomed in.{" "}
          <strong>Contours (OpenTopo)</strong> is best at mid zoom.
        </p>
      </div>

      {isOnline && cacheStatus !== "caching" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => void cacheTiles()}
            disabled={isCaching}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Download Map for Offline Use
          </button>

          {cacheStatus === "complete" && (
            <button
              type="button"
              onClick={() => void clearCache()}
              className="w-full py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Cached Maps
            </button>
          )}
        </div>
      )}

      {cacheStatus === "caching" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Downloading map tiles…</span>
            <span>
              {cachedTiles} / {totalTiles}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center">
            {progress}% — keep this page open (may take a few minutes)
          </p>
        </div>
      )}

      {cacheStatus === "complete" && (
        <div className="bg-green-100 text-green-700 rounded-lg p-3 mt-4 text-sm">
          Map tiles cached for offline zoom. Open the app from your Home Screen
          icon in Airplane Mode.
        </div>
      )}

      {cacheStatus === "error" && errorMessage && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {!isOnline && (
        <div className="bg-amber-100 text-amber-700 rounded-lg p-3 mt-4 text-sm">
          You&apos;re offline. Connect to download map tiles.
        </div>
      )}
    </div>
  );
}
