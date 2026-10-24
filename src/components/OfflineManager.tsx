"use client";

import { useState, useEffect, useCallback } from "react";

interface OfflineManagerProps {
  onClose?: () => void;
}

export default function OfflineManager({ onClose }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [isCaching, setIsCaching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalTiles, setTotalTiles] = useState(0);
  const [cachedTiles, setCachedTiles] = useState(0);
  const [cacheStatus, setCacheStatus] = useState<"idle" | "caching" | "complete" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stirling Range trail bounds (with padding)
  const bounds = {
    north: -34.30,
    south: -34.40,
    east: 118.42,
    west: 118.22,
  };

  // Zoom levels to cache (12-15 for good detail)
  const zoomLevels = [12, 13, 14, 15];

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

  // Calculate tile coordinates for a given lat/lng and zoom
  const latLngToTile = (lat: number, lng: number, zoom: number) => {
    const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        Math.pow(2, zoom)
    );
    return { x, y };
  };

  // Get all tile URLs for the trail area
  const getTileUrls = useCallback(() => {
    const urls: string[] = [];
    
    for (const zoom of zoomLevels) {
      const nw = latLngToTile(bounds.north, bounds.west, zoom);
      const se = latLngToTile(bounds.south, bounds.east, zoom);
      
      for (let x = nw.x; x <= se.x; x++) {
        for (let y = nw.y; y <= se.y; y++) {
          // OpenTopoMap tiles
          const subdomain = ["a", "b", "c"][Math.floor(Math.random() * 3)];
          urls.push(`https://${subdomain}.tile.opentopomap.org/${zoom}/${x}/${y}.png`);
        }
      }
    }
    
    return urls;
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
    
    const urls = getTileUrls();
    setTotalTiles(urls.length);
    setCachedTiles(0);
    setProgress(0);

    try {
      const cache = await caches.open("map-tiles-topo");
      let cached = 0;
      const batchSize = 10;
      
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (url) => {
            try {
              // Check if already cached
              const existing = await cache.match(url);
              if (!existing) {
                const response = await fetch(url, { mode: "cors" });
                if (response.ok) {
                  await cache.put(url, response);
                }
              }
              cached++;
              setCachedTiles(cached);
              setProgress(Math.round((cached / urls.length) * 100));
            } catch (e) {
              // Some tiles may fail, that's okay
              cached++;
              setCachedTiles(cached);
              setProgress(Math.round((cached / urls.length) * 100));
            }
          })
        );
        
        // Small delay to prevent overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      setCacheStatus("complete");
    } catch (error) {
      setErrorMessage("Failed to cache some tiles. Please try again.");
      setCacheStatus("error");
    } finally {
      setIsCaching(false);
    }
  };

  const clearCache = async () => {
    if ("caches" in window) {
      await caches.delete("map-tiles-topo");
      await caches.delete("map-tiles-satellite");
      setCacheStatus("idle");
      setProgress(0);
      setCachedTiles(0);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-400 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <span>📱</span> Offline Mode Setup
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Online/Offline Status */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-4 ${
        isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}>
        <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`} />
        <span className="font-medium">{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4 text-sm text-blue-800">
        <p className="mb-2">
          <strong>How offline maps work:</strong>
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            First install the app via Safari → Share → <strong>Add to Home Screen</strong>{" "}
            (while online)
          </li>
          <li>Download map tiles below while you have internet</li>
          <li>
            In Airplane Mode, open from the <strong>Home Screen icon</strong> (not a Safari tab)
          </li>
          <li>GPS tracking works without internet</li>
        </ol>
      </div>

      {/* Cache Controls */}
      {isOnline && cacheStatus !== "caching" && (
        <div className="space-y-3">
          <button
            onClick={cacheTiles}
            disabled={isCaching}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>📥</span> Download Map for Offline Use
          </button>
          
          {cacheStatus === "complete" && (
            <button
              onClick={clearCache}
              className="w-full py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Cached Maps
            </button>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {cacheStatus === "caching" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Downloading map tiles...</span>
            <span>{cachedTiles} / {totalTiles}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center">
            {progress}% complete - Don&apos;t close this page
          </p>
        </div>
      )}

      {/* Status Messages */}
      {cacheStatus === "complete" && (
        <div className="bg-green-100 text-green-700 rounded-lg p-3 mt-4 flex items-center gap-2">
          <span>✅</span>
          <span>Map tiles cached! The map will work offline.</span>
        </div>
      )}

      {cacheStatus === "error" && errorMessage && (
        <div className="bg-red-100 text-red-700 rounded-lg p-3 mt-4">
          <p>⚠️ {errorMessage}</p>
        </div>
      )}

      {!isOnline && (
        <div className="bg-amber-100 text-amber-700 rounded-lg p-3 mt-4">
          <p>📴 You&apos;re offline. Connect to the internet to download map tiles.</p>
        </div>
      )}

      {/* Add to Home Screen Instructions */}
      <div className="mt-6 pt-4 border-t border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <span>📲</span> Install on iPhone
        </h3>
        <ol className="text-sm text-slate-600 space-y-2">
          <li className="flex items-start gap-2">
            <span className="bg-slate-200 rounded px-1.5 py-0.5 text-xs font-mono">1</span>
            <span>Tap the <strong>Share</strong> button (box with arrow)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-slate-200 rounded px-1.5 py-0.5 text-xs font-mono">2</span>
            <span>Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-slate-200 rounded px-1.5 py-0.5 text-xs font-mono">3</span>
            <span>Tap <strong>&quot;Add&quot;</strong> in the top right</span>
          </li>
        </ol>
        <p className="text-xs text-slate-500 mt-3">
          The app will appear on your home screen and work like a native app!
        </p>
      </div>
    </div>
  );
}
