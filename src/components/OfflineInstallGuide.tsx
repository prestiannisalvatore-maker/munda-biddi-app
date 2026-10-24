"use client";

import { useEffect, useState } from "react";

const ROUTES_TO_CACHE = [
  "/",
  "/map",
  "/help",
  "/info",
  "/itinerary",
  "/checklist",
  "/3d",
  "/offline.html",
  "/manifest.json",
  "/stirling-ridge-walk.gpx",
];

/**
 * Explains iPhone offline install and warms the service-worker page cache
 * while the device is online.
 */
export default function OfflineInstallGuide() {
  const [swReady, setSwReady] = useState(false);
  const [cached, setCached] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker.ready.then(() => {
      if (!cancelled) setSwReady(true);
    });

    // Warm HTML/asset caches so airplane mode can open the app later
    const warm = async () => {
      if (!navigator.onLine) return;
      try {
        await Promise.all(
          ROUTES_TO_CACHE.map((path) =>
            fetch(path, { credentials: "same-origin", cache: "reload" }).catch(
              () => null
            )
          )
        );
        if (!cancelled) setCached(true);
      } catch {
        /* ignore */
      }
    };

    void warm();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          📱
        </span>
        <div>
          <h2 className="font-bold text-amber-950 text-lg">
            Use this app offline on iPhone
          </h2>
          <p className="text-amber-900 text-sm mt-1">
            Airplane mode only works after you install the app to your Home Screen{" "}
            <em>while online</em>. Opening the website in Safari after going offline
            often shows &quot;not connected to the internet&quot; — that&apos;s Safari,
            not the app failing.
          </p>
        </div>
      </div>

      <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-950">
        <li>
          <strong>Stay online</strong> (Wi‑Fi or mobile data). Open{" "}
          <span className="font-mono text-xs bg-amber-100 px-1 rounded">
            munda-biddi-app.vercel.app
          </span>{" "}
          in <strong>Safari</strong> (not Chrome).
        </li>
        <li>
          Tap the <strong>Share</strong> button{" "}
          <span className="inline-block px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs">
            □↑
          </span>
          , then <strong>Add to Home Screen</strong> → <strong>Add</strong>.
        </li>
        <li>
          Open a few tabs once while online: Home, Trail Map, Help, Checklist (this
          caches the pages).
        </li>
        <li>
          On <strong>Help</strong>, tap <strong>Download Map for Offline Use</strong>{" "}
          if you want map tiles without signal.
        </li>
        <li>
          Turn on Airplane Mode, then open the app from the{" "}
          <strong>Home Screen icon</strong> (not a Safari tab).
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
            swReady ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {swReady ? "Offline engine ready" : "Preparing offline engine…"}
        </span>
        <span
          className={`px-2.5 py-1 rounded-full font-medium ${
            cached ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"
          }`}
        >
          {cached ? "App pages cached for offline" : "Caching app pages…"}
        </span>
      </div>

      <p className="text-[11px] text-amber-800">
        GPS still works in Airplane Mode if Location Services are on. The 3D Preview
        needs internet. For serious navigation, also load the GPX into a dedicated GPS
        app.
      </p>
    </div>
  );
}
