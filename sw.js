const staticCacheName = `converter-static-v1`;

const filesToCache = [
  './',
  './index.js',
  './index.css',
  './index.html',
  './manifest.json',
  './idb.js'
];

self.addEventListener('install', (event) => {
  console.log("[ServiceWorker] installed");
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(filesToCache);
      
    }).then(() => self.skipWaiting())
    .catch(err => console.log('error occured while caching files'))
  );
});

self.addEventListener("fetch", event => {
  console.log(event.request.url)

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === './') {
      event.respondWith(caches.match('./'));
      return;
    }
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
    })
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      Promise.all(
        keyList.map(key => {
          if (key !== staticCacheName) {
            caches.delete(key);
            console.log(`deleted ${key}`)
          }
        })
      );
    })
  );
});