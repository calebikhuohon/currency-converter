const staticCacheName = `converter-static-v1`;

const URLs = [
            '/',
          'index.js',
          'index.css',
          //'./index',
          'https://free.currencyconverterapi.com/api/v5/currencies'
        ];

self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(staticCacheName).then((cache) => {
        return cache.addAll(URLs);
      })
    );
  });
  
  
  self.addEventListener('activate', (event) => {
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

  self.addEventListener('fetch',(event) => {
    var requestUrl = new URL(event.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('/'));
        return;
      }
    }
  
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  
