"use client";

import { useCallback, useEffect, useState } from "react";

const PAGE_ROUTES = [
  "/",
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
    return {
      ok: false,
      cached: 0,
      detail: "Offline storage blocked — leave Private Browsing.",
    };
  }
  if (!navigator.onLine) {
    return { ok: false, cached: 0, detail: "Go online to cache pages first." };
  }

  const pages = await caches.open("pages");
  const startUrl = await caches.open("start-url");
  const assets = await caches.open("static-assets");

  let okCount = 0;
  for (const path of PAGE_ROUTES) {
    try {
      const res = await fetch(path, {
        credentials: "same-origin",
        headers: { Accept: "text/html" },
        cache: "no-cache",
      });
      if (!res.ok) continue;
      const body = await res.blob();
      const stored = new Response(body, {
        status: 200,
        statusText: "OK",
        headers: res.headers,
      });
      await pages.put(path, stored.clone());
      if (path === "/") {
        await startUrl.put("/", stored.clone());
      }
      okCount += 1;
    } catch {
      /* keep going */
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
  return { ok: false, cached: okCount, detail: `Only cached ${okCount} pages.` };
}

async function ensureServiceWorker(): Promise<{ ready: boolean; detail: string }> {
  if (!("serviceWorker" in navigator)) {
    return {
      ready: false,
      detail: "Service workers unavailable — use Safari, not Private mode.",
    };
  }

  try {
    // Remove broken registrations left by the old 404 precache bug
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      if (!reg.active) {
        await reg.unregister();
      }
    }

    const reg = await withTimeout(
      navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      }),
      20000,
      "Service worker register"
    );

    // Wait for activate (install can take a few seconds on cellular)
    const active = await new Promise<ServiceWorker | null>((resolve) => {
      if (reg.active) {
        resolve(reg.active);
        return;
      }
      const worker = reg.installing || reg.waiting;
      if (!worker) {
        resolve(null);
        return;
      }
      const onChange = () => {
        if (worker.state === "activated" || reg.active) {
          worker.removeEventListener("statechange", onChange);
          resolve(reg.active || worker);
        } else if (worker.state === "redundant") {
          worker.removeEventListener("statechange", onChange);
          resolve(null);
        }
      };
      worker.addEventListener("statechange", onChange);
      window.setTimeout(() => {
        worker.removeEventListener("statechange", onChange);
        resolve(reg.active);
      }, 25000);
    });

    if (active || reg.active || navigator.serviceWorker.controller) {
      return { ready: true, detail: "Offline engine active." };
    }

    // Last chance: ready promise with timeout
    try {
      const readyReg = await withTimeout(
        navigator.serviceWorker.ready,
        10000,
        "Service worker ready"
      );
      if (readyReg.active) {
        return { ready: true, detail: "Offline engine ready." };
      }
    } catch {
      /* fall through */
    }

    return {
      ready: false,
      detail:
        "Offline engine installed but not active yet. Tap Retry, or Settings → Safari → Clear History and Website Data for this site, then reload.",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return {
      ready: false,
      detail: `${msg}. Use Safari (not Chrome), leave Private mode, then tap Retry.`,
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

    if (!navigator.onLine) {
      setBusy(false);
      setStatus("Go online first, then tap Retry.");
      return;
    }

    // Cache pages first so that badge can go green even while SW activates
    setCaching(true);
    setStatus("Caching app pages…");
    const result = await warmOfflineCaches();
    setCached(result.ok);
    setCaching(false);

    setStatus("Starting offline engine…");
    const sw = await ensureServiceWorker();
    setSwReady(sw.ready);

    if (sw.ready && result.ok) {
      setStatus(`${result.detail} Offline engine ready — you can Add to Home Screen.`);
    } else if (result.ok && !sw.ready) {
      setStatus(`${result.detail} But ${sw.detail}`);
    } else {
      setStatus(`${result.detail} ${sw.detail}`);
    }
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
          Airplane Mode in a Safari tab always fails. You need the Home Screen
          icon after both <strong>Offline engine</strong> and{" "}
          <strong>Pages cached</strong> are green.
        </p>
      </div>

      <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">
        Use <strong>Safari</strong> (not Chrome), not Private Browsing. After this
        update, tap <strong>Retry</strong> once so the fixed offline engine can
        install.
      </div>

      <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-950">
        <li>
          Stay online on{" "}
          <span className="font-mono text-xs bg-amber-100 px-1 rounded">
            munda-biddi-app.vercel.app
          </span>{" "}
          in Safari
        </li>
        <li>
          Tap <strong>Retry</strong> below — wait for Offline engine + Pages cached
          green
        </li>
        <li>
          Share{" "}
          <span className="inline-block px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs">
            □↑
          </span>{" "}
          → <strong>Add to Home Screen</strong>
        </li>
        <li>Open the Home Screen icon while still online</li>
        <li>Visit Map / Help / Checklist; download map tiles on Help</li>
        <li>Airplane Mode → open from the Home Screen icon only</li>
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
        {busy ? "Working…" : "Retry"}
      </button>

      {readyForAirplane ? (
        <p className="text-sm font-medium text-green-800 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Ready for Airplane Mode — open from the Home Screen icon only.
        </p>
      ) : (
        <p className="text-sm text-amber-900">
          Need green on Offline engine + Pages cached. Safari-tab amber is normal
          until you open the Home Screen icon.
        </p>
      )}
    </div>
  );
}
