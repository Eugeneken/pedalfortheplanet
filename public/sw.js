/**
 * Tatu City Riders 2026 – Service Worker
 * Caches app shell, map tiles, and route data for full offline use.
 */

const CACHE_VERSION = "tcr2026-v1";
const TILE_CACHE = "tcr2026-tiles-v1";

// App shell assets to pre-cache on install
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
];

// ─── Install: pre-cache app shell ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate: clean up old caches ─────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION && key !== TILE_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch: route all requests through cache strategy ──────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // OSM / Leaflet map tiles — Cache First with background update
  if (
    url.hostname.includes("tile.openstreetmap.org") ||
    url.hostname.includes("tiles.stadiamaps.com") ||
    url.hostname.includes("cartodb-basemaps") ||
    url.hostname.includes("basemaps.cartocdn.com")
  ) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          // If offline and tile not in cache, return transparent 256px PNG
          return new Response(
            atob("iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="),
            { headers: { "Content-Type": "image/png" } }
          );
        }
      })
    );
    return;
  }

  // Google Fonts / external assets — Cache First
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return new Response("", { status: 503 });
        }
      })
    );
    return;
  }

  // App shell + JS/CSS bundles — Cache First, falling back to network
  if (request.destination === "document" || request.destination === "script" || request.destination === "style") {
    event.respondWith(
      caches.open(CACHE_VERSION).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          // For navigation requests, serve index.html for offline SPA routing
          if (request.destination === "document") {
            return cache.match("/index.html") || new Response("Offline", { status: 503 });
          }
          return new Response("", { status: 503 });
        }
      })
    );
    return;
  }

  // All other requests — Network first, cache fallback
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(CACHE_VERSION).then((cache) => cache.put(request, response.clone()));
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
