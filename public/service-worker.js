const cacheName = "v2"
const cacheFiles = [
  './',
  './service-worker-registration.js',
  './search_q=Dam'
]

// Cache files 'installeren'
self.addEventListener('install', function(e) {
  // console.log("[ServiceWorker] Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
      // console.log("[ServiceWorker] Caching cacheFiles");
      cache.addAll(cacheFiles);
    })
  )
})

// Oude cachefiles verwijderen
self.addEventListener('activate', function(e) {
  // console.log("[ServiceWorker] Activated");
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== cacheName) {
            // console.log("[ServiceWorker] Removing cached files from", thisCacheName);
            return caches.delete(thisCacheName)
          }
      }))
    })
  )
})

// Fetchen van de cache
self.addEventListener('fetch', function(e) {
  // console.log("[ServiceWorker] Fetching", e.request.url);

  e.respondWith(
    // fetch(e.request)
    //   .then(function(response) {
    //     console.log("[ServiceWorker] Found in cache", e.request.url);
    //     // make clone of respone
    //     const responseClone = response.clone()
    //     // open cache
    //       caches.open(cacheName).then(function(cache) {
    //         cache.put(e.request, responseClone)
    //       })
    //       return response
    //   }).catch(function(err) {
    //     caches.match(e.request).then(function(response){
    //       return response
    //     })
    //   })
    fetch(e.request)
      .then(response => {
        console.log(response)
        //Clone maken van response
        const responseClone = response.clone()
        //open cache
        caches
          .open(cacheName)
          .then(cache => {
            // Response toevoegen aan cache
            cache.put(e.request, responseClone)
          })
        return response;
      }).catch(err => caches.match(e.request).then(response => response))
    )
})
