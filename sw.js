let cache = "converter";
let version = "2";
let cacheName = `${cache}_${version}`;
let filesToCache = [
  
  './index.js',
  './index.css',
  './index.html',
  './manifest.json',
  './idb.js',
  'https://free.currencyconverterapi.com/api/v5/currencies',
  'https://fonts.googleapis.com/css?family=Roboto'
];



self.addEventListener("install", event => {
  console.log("[Service Worker] installing ");

  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[Service Worker] caching all files");
      cache.addAll(filesToCache);
    }).then(() => self.skipWaiting()).catch(err => console.log("error occured while caching files: ",err))
  );
});

self.addEventListener("fetch", event => {
  console.log(event.request.url)

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
          if (key !== cacheName) {
            caches.delete(key);
            console.log(`deleted ${key}`)
          }
        })
      );
    })
  );
});
