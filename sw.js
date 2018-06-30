const staticCacheName = `converter-static-v1`;

const filesToCache = [
  
  './index.js',
  './index.css',
  './index.html',
  './manifest.json',
  './idb.js',
  'https://free.currencyconverterapi.com/api/v5/currencies'
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

 
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      })
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