// const cacheName = "v2"
//
// const cacheAssets = [
//   "./",
//   "./search?q=joep"
// ]
//
// self.addEventListener("install", e => {
//   console.log("installed");
//
//   e.waitUntil(
//     caches
//       .open(cacheName)
//       .then(cache => {
//         console.log("Sercive Worker: Caching files")
//         cache.addAll(cacheAssets)
//       })
//       .then(() => self.skipWaiting())
//   )
// })
//
// self.addEventListener("activate", e => {
//   console.log("service worker activated");
//   e.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all()
//         cacheNames.map(cache => {
//           if(cache !== cacheName){
//             console.log("SW clearing old cache")
//             return caches.delete(cache)
//           }
//         })
//     })
//   )
// })
//
// self.addEventListener("fetch", e => {
//   console.log("FETCHED")
//   e.respondWith(
//     fetch(e.request).catch(() => caches.match(e.request))
//   )
// })




const cacheName = "v40.5"
const cacheFiles = [
  './',
  './service-worker-registration.js',
  './search_q=joep'
]

self.addEventListener('install', function(e) {
  console.log("[ServiceWorker] Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
      console.log("[ServiceWorker] Caching cacheFiles");
      cache.addAll(cacheFiles);
    }).then(() => self.skipWaiting())
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
    fetch(e.request)
      .then(function(response) {
        console.log("[ServiceWorker] Found in cache", e.request.url);
        // make clone of respone
        const responseClone = response.clone()
        // open cache
          caches.open(cacheName).then(function(cache) {
            cache.put(e.request, responseClone)
          })
          return response
      }).catch(function(err) {
        caches.match(e.request).then(function(response){
          return response
        })
      })
    )
})
