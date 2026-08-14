"use client";

import { useEffect } from "react";

const OLD_KEYS = ["australind-munda-v1", "australind-munda-shell-v1"];

export default function CacheReset() {
  useEffect(() => {
    try {
      for (const key of OLD_KEYS) localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) void reg.unregister();
      });
    }
    if (typeof caches !== "undefined") {
      void caches.keys().then((keys) => {
        for (const key of keys) void caches.delete(key);
      });
    }
  }, []);
  return null;
}
