"use client";

import { useCallback, useEffect, useState } from "react";

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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (v) => {
        window.clearTimeout(t);
        resolve(v);
      },
      (e) => {
        window.clearTimeout(t);
        reject(e);
      }
    );
  });
}

async function warmOfflineCaches(): Promise<{ ok: boolean; cached: number; detail: string }> {
  if (!("caches" in window)) {
    return { ok: false, cached: 0, detail: "This browser blocks offline storage (try non-Private Safari)." };
  }
  if (!navigator.onLine) {
    return { ok: false, cached: 0, detail: "Go online to cache pages first." };
  }

  const pages = await caches.open("pages");
  const startUrl = await caches.open("start-url");
  const assets = await caches.open("static-assets");

  let okCount = 0;
  const failed: string[] = [];

  for (const path of PAGE_ROUTES) {
    try {
      const res = await fetch(path, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
        cache: "no-cache",
      });
      if (!res.ok) {
        failed.push(`${path} (${res.status})`);
        continue;
      }
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
      failed.push(path);
    }
  }

  for (const path of EXTRA_ASSETS) {
    try {
      const res = await fetch(path, { credentials: "same-origin", cache: "no-cache" });
      if (res.ok) await assets.put(path, res.clone());
    } catch {
      /* ignore */
    }
  }

  const controller = navigator.serviceWorker?.controller;
  if (controller) {
    controller.postMessage({
      type: "CACHE_URLS",
      payload: { urlsToCache: [...PAGE_ROUTES, ...EXTRA_ASSETS] },
    });
  }

  if (okCount >= 3) {
    return { ok: true, cached: okCount, detail: `Cached ${okCount} pages.` };
  }
  return {
    ok: false,
    cached: okCount,
    detail: `Only cached ${okCount} pages.${failed.length ? ` Failed: ${failed.slice(0, 3).join(", ")}` : ""}`,
  };
}

async function ensureServiceWorker(): Promise<{ ready: boolean; detail: string }> {
  if (!("serviceWorker" in navigator)) {
    return {
      ready: false,
      detail: "Service workers unavailable — turn off Private Browsing and use Safari.",
    };
  }

  try {
    const reg = await withTimeout(
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      }),
      15000,
      "Service worker register"
    );

    // Prefer an active worker; don't hang forever on .ready
    if (reg.active) {
      return { ready: true, detail: "Offline engine active." };
    }

    const readyReg = await withTimeout(
      navigator.serviceWorker.ready,
      20000,
      "Service worker ready"
    );
    if (readyReg.active || readyReg.installing || readyReg.waiting) {
      return { ready: true, detail: "Offline engine ready." };
    }
    return { ready: false, detail: "Service worker registered but not active yet — tap Retry." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return {
      ready: false,
      detail: `${msg}. Try Safari (not Chrome), leave Private mode, then tap Retry.`,
    };
  }
}

export default function OfflineInstallGuide() {
  const [swReady, setSwReady] = useState(false);
  const [cached, setCached] = useState(false);
  const [caching, setCaching] = useState(false);
  const [online, setOnline] = useState(true);
  const [standalone, setStandalone] = useState(false);
  const [status, setStatus] = useState("Checking offline setup…");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    setStandalone(isStandalone);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const prepareOffline = useCallback(async () => {
    setBusy(true);
    setStatus("Registering offline engine…");

    const sw = await ensureServiceWorker();
    setSwReady(sw.ready);
    setStatus(sw.detail);

    if (!navigator.onLine) {
      setBusy(false);
      setStatus("Go online first, then tap Retry cache.");
      return;
    }

    setCaching(true);
    setStatus("Caching app pages for Airplane Mode…");
    const result = await warmOfflineCaches();
    setCached(result.ok);
    setCaching(false);
    setStatus(
      sw.ready
        ? result.detail
        : `${result.detail} (${sw.detail})`
    );
    setBusy(false);
  }, []);

  useEffect(() => {
    void prepareOffline();
  }, [prepareOffline]);

  const readyForAirplane = swReady && cached;

  return (
    <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-bold text-amber-950 text-lg">
          Use this app offline on iPhone
        </h2>
        <p className="text-amber-900 text-sm mt-1">
          Airplane Mode in a Safari tab always fails with &quot;not connected&quot;.
          Offline only works from the Home Screen icon after the badges below are green.
        </p>
      </div>

      <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
        <strong>Must use Safari</strong> (not Chrome / Instagram / Facebook browser),
        and not Private Browsing. Private mode blocks the offline engine.
      </div>

      <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-950">
        <li>
          Stay online in <strong>Safari</strong> on{" "}
          <span className="font-mono text-xs bg-amber-100 px-1 rounded">
            munda-biddi-app.vercel.app
          </span>
        </li>
        <li>
          Wait for <strong>Offline engine</strong> and <strong>Pages cached</strong>{" "}
          to turn green (tap <strong>Retry cache</strong> if they stay grey).
        </li>
        <li>
          Share{" "}
          <span className="inline-block px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs">
            □↑
          </span>{" "}
          → <strong>Add to Home Screen</strong>
        </li>
        <li>
          Open the <strong>Home Screen icon</strong> while still online — that badge
          should say &quot;Opened from Home Screen&quot;
        </li>
        <li>
          Tap Home, Trail Map, Help, Checklist once; on Help download map tiles
        </li>
        <li>
          Airplane Mode → open from the Home Screen icon only
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
            : "Still in Safari tab (install next)"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            swReady ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {swReady ? "Offline engine ready" : "Offline engine not ready"}
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

      <p className="text-sm text-amber-950 bg-white/70 border border-amber-200 rounded-lg px-3 py-2">
        {status}
      </p>

      <button
        type="button"
        onClick={() => void prepareOffline()}
        disabled={busy || !online}
        className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-700 text-white text-sm font-semibold disabled:opacity-50"
      >
        {busy ? "Working…" : "Retry cache"}
      </button>

      {readyForAirplane ? (
        <p className="text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Ready for Airplane Mode — open from the Home Screen icon only.
        </p>
      ) : (
        <p className="text-sm text-amber-900">
          You need green on <strong>Offline engine</strong> and{" "}
          <strong>Pages cached</strong>. The Safari-tab badge stays amber until you
          open the Home Screen icon — that is normal.
        </p>
      )}

      <p className="text-[11px] text-amber-800">
        GPS still works in Airplane Mode if Location Services are on. The 3D
        Preview needs internet.
      </p>
    </div>
  );
}
