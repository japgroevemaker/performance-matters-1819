let cacheName = 'v2';
let cacheFiles = [
  './',
  './css/style.css',
  './js/client.js',
  './js/fontfaceobserver.js',
  './js/service-worker-registration.js',
  './search_q=appel'
]

self.addEventListener('install', function(e) {
  console.log("[ServiceWorker] Installed");

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {

      console.log("[ServiceWorker] Caching cacheFiles");
      return cache.addAll(cacheFiles)
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log("[ServiceWorker] Activated");

  e.waitUntil(

    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName){

        if (thisCacheName !== cacheName) {

          console.log("[ServiceWorker] Removing Cached files from", thisCacheName);
          return caches.delete(thisCacheName)
        }
      }))
    })
  )
})

self.addEventListener('fetch', function(e) {
  console.log("[ServiceWorker] Fetching", e.request.url);
})
