const cacheName = "v5"
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
      return cache.addAll(cacheFiles)
    })
  )
})

self.addEventListener('activate', function(e) {
  console.log("[ServiceWorker] Activated");
})

self.addEventListener('fetch', function(e) {
  console.log("[ServiceWorker] Fetching", e.request.url);
})
