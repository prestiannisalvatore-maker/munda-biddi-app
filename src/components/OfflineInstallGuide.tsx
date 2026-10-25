"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isOfflineReadyFlag,
  prepareForOffline,
  verifyOfflineCaches,
  type PrepProgress,
} from "@/lib/offlinePrep";

/**
 * Mandatory offline prep. Tiles download once and stay on the iPhone.
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
  const autoStarted = useRef(false);

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
        setStatus(
          "Offline pack is on this iPhone. Map tiles stay saved — no need to download every time."
        );
      }
    });

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const runPrep = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setProgress(null);

    if (!navigator.onLine) {
      setBusy(false);
      setStatus("Connect to Wi‑Fi first. Prep cannot run in Airplane Mode.");
      return;
    }

    const result = await prepareForOffline((p) => {
      setProgress(p);
      setStatus(
        `${p.phase}${p.total ? ` ${p.current}/${p.total}` : ""}`
      );
    });

    setSwReady(result.sw);
    setPagesReady(result.pages);
    setTilesReady(result.tiles);
    setStatus(result.detail);
    setProgress(null);
    setBusy(false);
  }, [busy]);

  useEffect(() => {
    if (autoStarted.current) return;
    if (!navigator.onLine) return;
    if (isOfflineReadyFlag()) return;
    autoStarted.current = true;
    void runPrep();
  }, [runPrep]);

  return (
    <div
      className={`rounded-xl border-2 p-5 sm:p-6 space-y-4 ${
        fullyReady ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      <div>
        <h2
          className={`font-bold text-lg ${
            fullyReady ? "text-green-950" : "text-red-950"
          }`}
        >
          {fullyReady
            ? "Offline pack saved on this iPhone"
            : "CRITICAL — prepare offline pack on Wi‑Fi"}
        </h2>
        <p
          className={`text-sm mt-1 ${
            fullyReady ? "text-green-900" : "text-red-900"
          }`}
        >
          Map tiles download <strong>once</strong> and stay on your phone. If the
          bar seems stuck, wait — about 300 tiles, usually a few minutes, then it
          finishes and will not keep re-downloading.
        </p>
      </div>

      <div className="rounded-lg border border-red-400 bg-white p-3 text-sm text-red-950 space-y-2">
        <p className="font-semibold">Home Screen must use the new launch icon:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Delete the old Stirling Ridge icon from your Home Screen</li>
          <li>Wi‑Fi on → open this site in <strong>Safari</strong></li>
          <li>
            Tap <strong>Prepare offline pack</strong> → wait until all badges are
            green
          </li>
          <li>
            Share → <strong>Add to Home Screen</strong> (opens <code>/go.html</code>{" "}
            offline launch pad)
          </li>
          <li>Open that new icon once while still online</li>
          <li>Airplane Mode → open the same Home Screen icon only</li>
        </ol>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge ok={online} good="Online now" bad="Offline now" />
        <Badge
          ok={standalone}
          good="Opened from Home Screen"
          bad="Safari tab — add new Home Screen icon"
          warn={!standalone}
        />
        <Badge ok={swReady} good="Offline engine ready" bad="Offline engine missing" />
        <Badge ok={pagesReady} good="App pages cached" bad="App pages not cached" />
        <Badge
          ok={tilesReady}
          good="Map tiles on iPhone"
          bad={busy ? "Saving map tiles…" : "Map tiles not saved yet"}
        />
      </div>

      {progress && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full bg-amber-700 transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((progress.current / progress.total) * 100)
                )}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-700">
            {progress.phase} — one-time save, keep this screen open (
            {progress.current}/{progress.total})
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
        {busy ? "Preparing… do not close" : fullyReady ? "Re-check offline pack" : "Prepare offline pack"}
      </button>

      {fullyReady ? (
        <p className="text-sm font-semibold text-green-900">
          Tiles stay on this iPhone. Delete any old Home Screen icon, add a fresh
          one, then use that icon in Airplane Mode.
        </p>
      ) : (
        <p className="text-sm font-semibold text-red-900">
          Not ready. Wait for tiles to finish (not a loop — first save takes a few
          minutes).
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
