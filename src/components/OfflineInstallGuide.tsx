"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isOfflineReadyFlag,
  prepareForOffline,
  verifyOfflineCaches,
  type PrepProgress,
} from "@/lib/offlinePrep";

/**
 * Mandatory offline prep for field use. Do not enter the Stirling Range
 * until this reports fully ready.
 */
export default function OfflineInstallGuide() {
  const [swReady, setSwReady] = useState(false);
  const [pagesReady, setPagesReady] = useState(false);
  const [tilesReady, setTilesReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [standalone, setStandalone] = useState(false);
  const [status, setStatus] = useState("Checking offline readiness…");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<PrepProgress | null>(null);

  const fullyReady = swReady && pagesReady && tilesReady;

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

    void verifyOfflineCaches().then((v) => {
      setSwReady(v.swOk);
      setPagesReady(v.pagesOk);
      setTilesReady(v.tilesOk);
      if (v.swOk && v.pagesOk && v.tilesOk) {
        setStatus("Offline pack verified on this device.");
      } else if (isOfflineReadyFlag() && !(v.swOk && v.pagesOk && v.tilesOk)) {
        setStatus("Previous prep incomplete after an update — run Prepare again on Wi‑Fi.");
      }
    });

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const runPrep = useCallback(async () => {
    setBusy(true);
    setProgress(null);

    if (!navigator.onLine) {
      setBusy(false);
      setStatus("Connect to Wi‑Fi first. Offline prep cannot run in Airplane Mode.");
      return;
    }

    const result = await prepareForOffline((p) => {
      setProgress(p);
      setStatus(`${p.phase} ${p.total ? `(${p.current}/${p.total})` : ""}`);
    });

    setSwReady(result.sw);
    setPagesReady(result.pages);
    setTilesReady(result.tiles);
    setStatus(result.detail);
    setProgress(null);
    setBusy(false);
  }, []);

  useEffect(() => {
    // Auto-prep once when online and not yet ready
    if (!navigator.onLine) return;
    if (isOfflineReadyFlag()) return;
    void runPrep();
  }, [runPrep]);

  return (
    <div
      className={`rounded-xl border-2 p-5 sm:p-6 space-y-4 ${
        fullyReady
          ? "border-green-500 bg-green-50"
          : "border-red-500 bg-red-50"
      }`}
    >
      <div>
        <h2
          className={`font-bold text-lg ${
            fullyReady ? "text-green-950" : "text-red-950"
          }`}
        >
          {fullyReady
            ? "Offline pack ready for the trail"
            : "CRITICAL — prepare offline pack before you hike"}
        </h2>
        <p
          className={`text-sm mt-1 ${
            fullyReady ? "text-green-900" : "text-red-900"
          }`}
        >
          This app must work with zero signal. Do not rely on a Safari tab in
          Airplane Mode. Install to Home Screen and complete Prepare on Wi‑Fi
          first. GPS and compass still need Location Services enabled.
        </p>
      </div>

      {!fullyReady && (
        <div className="rounded-lg border border-red-400 bg-white p-3 text-sm text-red-950 space-y-1">
          <p className="font-semibold">Before you leave reception:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Open this site in <strong>Safari</strong> (not Chrome / Private)
            </li>
            <li>
              Tap <strong>Prepare offline pack</strong> and wait until every badge
              is green (map download can take several minutes)
            </li>
            <li>
              Share → <strong>Add to Home Screen</strong>
            </li>
            <li>
              Open the <strong>Home Screen icon</strong> once while still online
            </li>
            <li>
              Only then use Airplane Mode — always from the Home Screen icon
            </li>
          </ol>
          <p className="text-xs pt-1">
            Also carry a paper topo map, compass, and a dedicated GPS with the GPX
            loaded. This phone app is a backup, not your only navigation.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge ok={online} good="Online now" bad="Offline now" />
        <Badge
          ok={standalone}
          good="Opened from Home Screen"
          bad="Safari tab — install to Home Screen"
          warn={!standalone}
        />
        <Badge ok={swReady} good="Offline engine ready" bad="Offline engine missing" />
        <Badge ok={pagesReady} good="App pages cached" bad="App pages not cached" />
        <Badge ok={tilesReady} good="Map tiles cached" bad="Map tiles not cached" />
      </div>

      {progress && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full bg-amber-700 transition-all"
              style={{
                width: `${Math.round((progress.current / progress.total) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-700">
            {progress.phase} — keep this screen open
          </p>
        </div>
      )}

      <p className="text-sm bg-white/80 border border-slate-200 rounded-lg px-3 py-2 text-slate-900">
        {status}
      </p>

      <button
        type="button"
        onClick={() => void runPrep()}
        disabled={busy || !online}
        className="w-full sm:w-auto px-4 py-3 rounded-lg bg-red-800 text-white text-sm font-bold disabled:opacity-50"
      >
        {busy ? "Preparing… do not close" : "Prepare offline pack"}
      </button>

      {fullyReady ? (
        <p className="text-sm font-semibold text-green-900">
          Ready. Open from the Home Screen icon in Airplane Mode. Trail Map, GPS,
          compass, checklist, and guide pages work offline. 3D Preview needs
          internet — do not depend on it on the ridge.
        </p>
      ) : (
        <p className="text-sm font-semibold text-red-900">
          Not ready for the hike. All five checks must pass (Home Screen badge
          turns green after you open the installed icon).
        </p>
      )}
    </div>
  );
}

function Badge({
  ok,
  good,
  bad,
  warn,
}: {
  ok: boolean;
  good: string;
  bad: string;
  warn?: boolean;
}) {
  const cls = ok
    ? "bg-green-100 text-green-800"
    : warn
      ? "bg-amber-100 text-amber-900"
      : "bg-slate-200 text-slate-700";
  return (
    <span className={`px-2.5 py-1 rounded-full font-medium ${cls}`}>
      {ok ? good : bad}
    </span>
  );
}
