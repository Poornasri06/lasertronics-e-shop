// Service Worker for Lasertronics Admin & Catalog PWA
const CACHE_NAME = "lasertronics-pwa-v1";
const STATIC_ASSETS = [
  "/",
  "/admin",
  "/manifest.webmanifest",
  "/favicon.png",
  "/robots.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("SW pre-caching partial failure:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (mutations must go to backend)
  if (request.method !== "GET") {
    return;
  }

  // Skip browser extensions or cross-origin non-CDN requests
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Don't cache server functions or API RPC calls
  if (url.searchParams.has("_serverFn") || url.pathname.includes("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "Offline",
            message: "Network connection is unavailable. Action could not be saved to server.",
          }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // For static assets: Stale-While-Revalidate strategy
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/uploads/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".woff2")
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // HTML navigation requests: Network first with cache fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request).then((matching) => {
          return matching || caches.match("/admin") || caches.match("/");
        });
      })
    );
  }
});
