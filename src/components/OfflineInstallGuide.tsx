"use client";

import { useEffect, useState } from "react";

/**
 * Points users at Field Mode — the only reliable iPhone Airplane Mode path.
 */
export default function OfflineInstallGuide() {
  const [standalone, setStandalone] = useState(false);
  const [online, setOnline] = useState(true);
  const [swOk, setSwOk] = useState(false);

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

    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistration("/field-sw.js").then((reg) => {
        setSwOk(Boolean(reg?.active || reg?.installing));
      });
      void navigator.serviceWorker
        .register("/field-sw.js", { scope: "/", updateViaCache: "none" })
        .then((reg) => setSwOk(Boolean(reg.active || reg.installing || reg.waiting)))
        .catch(() => setSwOk(false));
    }

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="rounded-xl border-2 border-red-600 bg-red-50 p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="font-bold text-red-950 text-lg">
          Offline on iPhone = Field Mode (not the website tab)
        </h2>
        <p className="text-red-900 text-sm mt-1">
          Safari tabs and the old Home Screen icons cannot start the full website
          with Airplane Mode on. Use the <strong>Field Mode</strong> page — it is a
          self-contained offline app (trail line, peaks, GPS, compass, checklist)
          and does <strong>not</strong> need map tile downloads.
        </p>
      </div>

      <ol className="list-decimal pl-5 space-y-2 text-sm text-red-950">
        <li>
          Stay on <strong>Wi‑Fi</strong>. Delete any old Stirling Ridge Home Screen
          icons.
        </li>
        <li>
          Open{" "}
          <a href="/field.html" className="font-bold underline">
            Field Mode (/field.html)
          </a>{" "}
          in <strong>Safari</strong>.
        </li>
        <li>
          Wait 5 seconds (offline engine installs). You should see the orange trail
          map.
        </li>
        <li>
          Share → <strong>Add to Home Screen</strong> → Add.
        </li>
        <li>Open the new icon once while still online.</li>
        <li>
          Airplane Mode → open that icon. You should see Field Mode, not a Safari
          error.
        </li>
      </ol>

      <a
        href="/field.html"
        className="block w-full text-center px-4 py-3.5 rounded-lg bg-red-800 text-white text-base font-bold"
      >
        Open Field Mode now
      </a>

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
            swOk ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700"
          }`}
        >
          {swOk ? "Field offline engine registered" : "Engine not registered yet"}
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
            : "Still in Safari — add Field Mode to Home Screen"}
        </span>
      </div>

      <p className="text-xs text-red-900">
        Full website (Trail Map with photo tiles, 3D, etc.) needs signal. Field Mode
        is the emergency offline tool. Still carry PLB, paper map, and a dedicated
        GPS.
      </p>
    </div>
  );
}
