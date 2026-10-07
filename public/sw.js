// public/sw.js
const CACHE_NAME = 'satsang-static-v1';
const AUDIO_CACHE = 'satsang-audio-v1';

// Static routes to precache
const PRECACHE_ASSETS = [
  '/',
  '/bhajans',
  '/trips',
  '/wallpapers',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== AUDIO_CACHE) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 1. Audio stream caching (handles byte-range headers cleanly for iOS Safari)
  if (
    req.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.includes('/bhajans-audio/')
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        // Match against exact URL rather than range-header-dependent Request object
        const cached = await cache.match(req.url);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          if (fresh.status === 200 || fresh.status === 206 || fresh.type === 'opaque') {
            cache.put(req.url, fresh.clone());
          }
          return fresh;
        } catch {
          return cached || new Response('Offline audio unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // 2. Navigation fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((res) => res || caches.match('/'))
      )
    );
    return;
  }

  // 3. Static asset caching
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});