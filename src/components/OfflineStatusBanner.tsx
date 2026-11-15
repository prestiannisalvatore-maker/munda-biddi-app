"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isOfflineReadyFlag, verifyOfflineCaches } from "@/lib/offlinePrep";

/** Persistent warning until the offline pack is verified on-device. */
export default function OfflineStatusBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const v = await verifyOfflineCaches();
      const ready = v.swOk && v.pagesOk && v.tilesOk && isOfflineReadyFlag();
      if (!cancelled) setShow(!ready);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="bg-red-800 text-white text-center text-sm px-3 py-2">
      <strong>Offline pack not ready.</strong> Do not hike on this app alone yet.{" "}
      <Link href="/" className="underline font-semibold">
        Prepare on Home
      </Link>{" "}
      or{" "}
      <Link href="/help" className="underline font-semibold">
        Help
      </Link>{" "}
      while you still have Wi‑Fi.
    </div>
  );
}
