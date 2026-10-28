"use client";

import { useState, useEffect } from "react";
import {
  downloadCriticalMapTiles,
  isTilesReadyFlag,
  type PrepProgress,
} from "@/lib/offlinePrep";

interface OfflineManagerProps {
  onClose?: () => void;
}

/** Map-tile download control (also runs inside Prepare offline pack on Home). */
export default function OfflineManager({ onClose }: OfflineManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<PrepProgress | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [tilesReady, setTilesReady] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    setTilesReady(isTilesReadyFlag());
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const run = async () => {
    setBusy(true);
    setStatus(null);
    const result = await downloadCriticalMapTiles((p) => setProgress(p));
    setTilesReady(result.ok);
    setStatus(result.detail);
    setProgress(null);
    setBusy(false);
  };

  return (
    <div className="bg-white rounded-xl border-2 border-blue-400 p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-slate-800">Offline map tiles</h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400">
            ✕
          </button>
        )}
      </div>

      <p className="text-sm text-slate-600">
        Prefer the red <strong>Prepare offline pack</strong> button on Home — it
        caches pages, the offline engine, and these tiles together. Use this if you
        only need to refresh map imagery.
      </p>

      <div
        className={`text-sm px-3 py-2 rounded-lg ${
          tilesReady ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-900"
        }`}
      >
        {tilesReady
          ? "Map tiles flagged ready on this device."
          : "Map tiles not confirmed — run Prepare or download below."}
      </div>

      {isOnline ? (
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {busy ? "Downloading tiles…" : "Download / refresh map tiles"}
        </button>
      ) : (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
          Go online to download tiles.
        </p>
      )}

      {progress && progress.total > 0 && (
        <div className="space-y-1">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{
                width: `${Math.round((progress.current / progress.total) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {progress.current}/{progress.total} — keep this page open
          </p>
        </div>
      )}

      {status && <p className="text-sm text-slate-700">{status}</p>}
    </div>
  );
}
