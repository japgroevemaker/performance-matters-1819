const cacheName = "v7.6"
const cacheFiles = [
  './',
  './style.css',
  './client.js',
  './fontfaceobserver.js',
  './service-worker-registration.js',
  './search_q=appel'
]

self.addEventListener('install', function(e) {
  console.log("[ServiceWorker] Installed");

  e.waitUntil(
    caches.open(cacheName).then(function(cache) {

      console.log("[ServiceWorker] Caching cacheFiles");
      cache.addAll(cacheFiles);
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log("[ServiceWorker] Activated");
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            console.log("[ServiceWorker] Removing cached files from", thisCacheName);
            return caches.delete(thisCacheName)
          }
      }))
    })
  )
})

self.addEventListener('fetch', function(e) {
  console.log("[ServiceWorker] Fetching", e.request.url);


    e.respondWitch(
      console.log("[ServiceWorker] found in cache", e.request.url);
        fetch(e.request).catch(() => caches.match(e.request))
      )

})
