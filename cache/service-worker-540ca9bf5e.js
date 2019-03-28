const cacheName = "v7.4"
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

  e.respondWith(

    caches.match(e.request).then(function(response) {

      if (response) {
        console.log("[ServiceWorker] Found in cache", e.request.url);
        return response;
      }
      let requestClone = e.request.clone();

      fetch(requestClone)
        .then(function(response) {
          if (!response) {
            console.log("[ServiceWorker] No response from fetch");
            return response
          }
          let responseClone = response.clone();

          caches.open(cacheName).then(function(cache) {
            cache.put(e.request, responseClone);
            return response;
          });
        })
        .catch(function(err) {
          console.log("[ServiceWorker] Error fetching & caching new");
        })
    })
  )
})
