/* Custom Workbox hooks for next-pwa — offline-first for field safety */

// Ensure the new worker takes control of open clients immediately
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLIENTS_CLAIM") {
    self.clients.claim();
  }
});
