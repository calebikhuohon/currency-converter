const staticCacheName = `converter-static-v1`;

self.addEventListener('install', (event) => {
    console.log("install starting");
    event.waitUntil(
        console.log("waitUntil in install just starting");
      caches.open(staticCacheName).then((cache) => {
        return cache.addAll([
            '/currency-converter/',
          '/currency-converter/index.js',
          '/currency-converter/index.css',
          '/currency-converter/index.html',
            'https://free.currencyconverterapi.com/api/v5/currencies'
        ]);
      });
    console.log("event.waitUntil in install ended");
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
  
