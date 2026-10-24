"use client";

import { useEffect, useState } from "react";

const PAGE_ROUTES = [
  "/",
  "/?source=pwa",
  "/map",
  "/help",
  "/info",
  "/itinerary",
  "/checklist",
  "/3d",
];

const EXTRA_ASSETS = [
  "/offline.html",
  "/manifest.json",
  "/stirling-ridge-walk.gpx",
  "/icons/apple-touch-icon.png",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

/**
 * Put HTML into the same caches Workbox uses for cold starts / navigations.
 * A normal fetch() alone does not fill the "pages" / "start-url" caches that
 * iPhone Home Screen opens need in airplane mode.
 */
async function warmOfflineCaches(): Promise<boolean> {
  if (!("caches" in window) || !navigator.onLine) return false;

  const pages = await caches.open("pages");
  const startUrl = await caches.open("start-url");
  const assets = await caches.open("static-assets");

  let okCount = 0;
  for (const path of PAGE_ROUTES) {
    try {
      const res = await fetch(path, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
      });
      if (!res.ok) continue;
      // Avoid storing redirects as opaque failures on iOS
      const body = await res.blob();
      const stored = new Response(body, {
        status: 200,
        statusText: "OK",
        headers: res.headers,
      });
      await pages.put(path, stored.clone());
      if (path === "/" || path.startsWith("/?")) {
        await startUrl.put("/", stored.clone());
        await startUrl.put(path, stored.clone());
      }
      okCount += 1;
    } catch {
      /* keep going */
    }
  }

  for (const path of EXTRA_ASSETS) {
    try {
      const res = await fetch(path, { credentials: "same-origin" });
      if (res.ok) await assets.put(path, res.clone());
    } catch {
      /* ignore */
    }
  }

  // Ask Workbox to cache the same URLs through its own handlers when possible
  const controller = navigator.serviceWorker?.controller;
  if (controller) {
    controller.postMessage({
      type: "CACHE_URLS",
      payload: { urlsToCache: [...PAGE_ROUTES, ...EXTRA_ASSETS] },
    });
  }

  return okCount >= 3;
}

/**
 * Explains iPhone offline install and warms the service-worker page cache
 * while the device is online.
 */
export default function OfflineInstallGuide() {
  const [swReady, setSwReady] = useState(false);
  const [cached, setCached] = useState(false);
  const [caching, setCaching] = useState(false);
  const [online, setOnline] = useState(true);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari legacy
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    setStandalone(isStandalone);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const run = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        /* next-pwa also registers */
      }

      await navigator.serviceWorker.ready;
      if (cancelled) return;
      setSwReady(true);

      if (!navigator.onLine) return;
      setCaching(true);
      const ok = await warmOfflineCaches();
      if (!cancelled) {
        setCached(ok);
        setCaching(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  const readyForAirplane = swReady && cached;

  return (
    <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-bold text-amber-950 text-lg">
          Use this app offline on iPhone
        </h2>
        <p className="text-amber-900 text-sm mt-1">
          Airplane Mode in a Safari tab will always show &quot;not connected to the
          internet&quot;. That is Safari blocking the tab — not the trail app. Offline
          only works from the Home Screen icon after you install and open it once
          while online.
        </p>
      </div>

      <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
        <strong>If you already saw that Safari error:</strong> turn Airplane Mode
        off, open this page in Safari, follow the steps below, then open from the
        Home Screen icon (delete any old Home Screen icon first if it was added
        days ago).
      </div>

      <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-950">
        <li>
          <strong>Stay online</strong>. Open{" "}
          <span className="font-mono text-xs bg-amber-100 px-1 rounded">
            munda-biddi-app.vercel.app
          </span>{" "}
          in <strong>Safari</strong> (not Chrome).
        </li>
        <li>
          Tap <strong>Share</strong>{" "}
          <span className="inline-block px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs">
            □↑
          </span>
          → <strong>Add to Home Screen</strong> → <strong>Add</strong>.
        </li>
        <li>
          Open the new <strong>Home Screen icon</strong> while still online (do
          this before Airplane Mode). Wait until the badges below turn green.
        </li>
        <li>
          Tap through Home, Trail Map, Help, Checklist once while online.
        </li>
        <li>
          On Help, tap <strong>Download Map for Offline Use</strong> if you want
          map tiles without signal.
        </li>
        <li>
          Airplane Mode → open again from the <strong>Home Screen icon only</strong>
          — never from a Safari tab or bookmark.
        </li>
      </ol>

      <div className="flex flex-wrap gap-2 text-xs">
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            online ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {online ? "Online now" : "Offline now"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            standalone
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-900"
          }`}
        >
          {standalone
            ? "Opened from Home Screen"
            : "Opened in Safari tab — install required"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            swReady ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {swReady ? "Offline engine ready" : "Preparing offline engine…"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            cached
              ? "bg-green-100 text-green-800"
              : caching
                ? "bg-amber-100 text-amber-900"
                : "bg-slate-200 text-slate-600"
          }`}
        >
          {cached
            ? "App pages cached for offline"
            : caching
              ? "Caching app pages…"
              : "Pages not cached yet"}
        </span>
      </div>

      {readyForAirplane ? (
        <p className="text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Ready for Airplane Mode — open from the Home Screen icon only.
        </p>
      ) : (
        <p className="text-sm text-amber-900">
          Stay on Wi‑Fi until you see green &quot;Offline engine ready&quot; and
          &quot;App pages cached for offline&quot;.
        </p>
      )}

      <p className="text-[11px] text-amber-800">
        GPS still works in Airplane Mode if Location Services are on. The 3D
        Preview needs internet. For serious navigation, also load the GPX into a
        dedicated GPS app.
      </p>
    </div>
  );
}
