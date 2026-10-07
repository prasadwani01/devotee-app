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

  // Cache-first for audio files (MP3s or Supabase bhajan storage)
  if (
    req.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.includes('/bhajans-audio/')
  ) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const fresh = await fetch(req);
          if (fresh.status === 200 || fresh.type === 'opaque') {
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch {
          return cached || new Response('Offline audio unavailable', { status: 503 });
        }
      })
    );
    return;
  }

  // Network-first with fallback for pages
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((res) => res || caches.match('/'))
      )
    );
    return;
  }

  // Stale-while-revalidate / cache-first for other static assets
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});