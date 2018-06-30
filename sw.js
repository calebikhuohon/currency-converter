const staticCacheName = `converter-static-v2`;

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
    caches.open(staticCacheName).then((cache) => {
      console.log('[ServiceWorker] Caching cacheFiles');
      return cache.addAll(filesToCache);
    }).then(() => self.skipWaiting())
    .catch(err => console.log('error occured while caching files'))
  );
});

self.addEventListener('fetch', (event) => {
  console.log("[ServiceWorker] Fetching", e.request.url)
  var requestUrl = new URL(event.request.url);


  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);

      let requestClone = e.request.clone();

      fetch(requestClone).then((response) => {
        if (!response) {
         console.log('[ServiceWorker] No response from fetch');
          return response;
         }

        let responseClone = response.clone();

         caches.open(staticCacheName).then((cache) => {
           cache.put(e.request, responseClone);
           return fetch(e.request);
        });

       }).catch((err) => {
        console.log('[ServiceWorker] Error fetching & caching');
       });
    })
  );
});
self.addEventListener('activate', (event) => {
  console.log("[ServiceWorker] Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('converter-') &&
            cacheName != staticCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

