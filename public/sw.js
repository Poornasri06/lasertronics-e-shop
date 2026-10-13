// Self-clearing Service Worker to purge stale caches and ensure fresh updates
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      })
      .then(() => self.registration.unregister())
      .then(() => self.clients.claim())
  );
});

// Always bypass cache and fetch directly from network
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
