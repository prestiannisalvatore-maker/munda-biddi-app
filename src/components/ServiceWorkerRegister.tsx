"use client";

import { useEffect } from "react";

/**
 * App Router does not reliably load next-pwa's injected register.js.
 * Register ourselves, and replace any broken prior worker that never activated
 * (e.g. after a failed precache install).
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;

    const register = async () => {
      try {
        const existing = await navigator.serviceWorker.getRegistrations();
        for (const reg of existing) {
          const script =
            reg.active?.scriptURL ||
            reg.installing?.scriptURL ||
            reg.waiting?.scriptURL ||
            "";
          // Drop Field Mode worker from later experiments; restore next-pwa /sw.js
          if (script.includes("field-sw")) {
            await reg.unregister();
            continue;
          }
          // Clear workers that never activated — they block a healthy install
          if (!reg.active && (reg.installing || reg.waiting || !reg.active)) {
            const hasController = Boolean(navigator.serviceWorker.controller);
            if (!hasController && !reg.active) {
              await reg.unregister();
            }
          }
        }

        if (cancelled) return;

        // Clear Field Mode Cache Storage left from the reverted offline experiment
        if ("caches" in window) {
          try {
            const keys = await caches.keys();
            await Promise.all(
              keys
                .filter((k) => k.startsWith("srw-field-"))
                .map((k) => caches.delete(k))
            );
          } catch {
            /* ignore */
          }
        }

        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        void reg.update();
        if (reg.waiting) {
          reg.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        if (reg.active) {
          reg.active.postMessage({ type: "CLIENTS_CLAIM" });
        }
      } catch (err) {
        console.warn("[PWA] service worker registration failed", err);
      }
    };

    void register();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
