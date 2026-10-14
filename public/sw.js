// ==============================================================
// Service Worker for Lasertronics E-Shop PWA
// Architecture: Stale-While-Revalidate for Assets, Network-First for HTML
// Freshness Guarantee: Live InTouch ERP & Server Functions are NEVER cached
// ==============================================================

const CACHE_VERSION = "lasertronics-pwa-v2";
const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/offline.html",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
  "/favicon.png",
  "/robots.txt",
];

// 1. Install Event: Precache App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[PWA SW] Pre-caching partial fallback:", err);
      });
    })
  );
  // Do not unconditionally force skipWaiting() immediately on install;
  // allow the client to trigger SKIP_WAITING or prompt user gracefully.
});

// 2. Activate Event: Clean up stale caches & claim clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_VERSION) {
            console.log("[PWA SW] Deleting obsolete cache:", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 3. Message Event: Handle explicit client commands (e.g. SKIP_WAITING on update prompt)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 4. Fetch Event: Freshness-focused routing & selective caching
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // A. Mutations & Non-GET requests: Network only
  if (request.method !== "GET") {
    return;
  }

  // B. Browser extensions, non-http, or chrome-extension schemes: Ignore
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // C. Server RPCs, Checkout, InTouch ERP, and sensitive API routes:
  // FRESHNESS REQUIREMENT: Must ALWAYS be network-first and NEVER cached as current data
  if (
    url.searchParams.has("_serverFn") ||
    url.pathname.includes("/api/") ||
    url.pathname.includes("/checkout") && request.method === "POST"
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "Offline",
            message: "Live network connection is currently unavailable. This action requires an active connection.",
            isOffline: true,
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

  // D. Static Assets: CSS, JS, Fonts, Images, Icons
  // Strategy: Stale-While-Revalidate with Cache Fallback
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ttf") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.open(CACHE_VERSION).then((cache) => {
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

  // E. HTML Navigation Requests (Pages):
  // Strategy: Network-First to guarantee fresh ERP prices/stock, falling back to cached HTML or /offline.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedPage) => {
            if (cachedPage) {
              return cachedPage;
            }
            // If the specific page was not visited before, return the branded offline fallback page
            return caches.match("/offline.html").then((offlinePage) => {
              return offlinePage || caches.match("/");
            });
          });
        })
    );
  }
});
