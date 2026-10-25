"use client";

import { useEffect } from "react";

/**
 * Registers the simple Field Mode service worker (not next-pwa/Workbox).
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const run = async () => {
      try {
        // Drop broken Workbox registrations from older builds
        const existing = await navigator.serviceWorker.getRegistrations();
        for (const reg of existing) {
          const script = reg.active?.scriptURL || reg.installing?.scriptURL || "";
          if (script.includes("/sw.js") && !script.includes("field-sw")) {
            await reg.unregister();
          }
        }
        if (cancelled) return;

        const reg = await navigator.serviceWorker.register("/field-sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        void reg.update();
      } catch (err) {
        console.warn("[field-sw] registration failed", err);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
