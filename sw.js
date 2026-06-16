const CACHE_NAME = 'tg-maengel-v2';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache))
  );
  self.skipWaiting(); // Sofort übernehmen, nicht warten
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Alle offenen Tabs sofort übernehmen
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      return r || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
