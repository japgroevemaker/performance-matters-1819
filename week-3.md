
![live Demo](https://performance-matters-1819-cdfvmirfsb.now.sh/)
# Week 3
In week 3 van performance matters was het de bedoeling een service worker in onze app te implementeren. Daarnaast moest de app ook op een online webserver geinstalleerd worden.

## Service Worker
Na het college van Declan ging ik hoopvol aan de slag. Als eerst was het zaak de service worker aan te roepen en te registreren.
```js
fetch("./rev-manifest.json")
  .then(res => res.json())
  .then(data => {
    if("serviceWorker" in navigator){

      navigator.serviceWorker
        .register(data["service-worker.js"])
        .then(function(registration){
          console.log("Service worker registered");
        })
        .catch(function(err) {
          console.log("service worker failed to register", err);
        })
    }
  })
```
Omdat ik ```gulp-rev``` gebruik en daarom mijn ```service-worker.js``` steeds wordt ge-update onder een andere bestandsnaam, was het zaak om deze te fetchen vanuit ```rev-manifest.json```.
Vervolgens ben ik aan de hand van dit [filmpje](https://www.youtube.com/watch?v=BfL3pprhnms) verder gegaan met het implementeren van de service worker. Hieronder vertel ik beknopt wat ik gedaan heb.

Als eerst heb ik de versie aangegeven, dit doe je om er zo voor te zorgen dat je je cache als het waren kan updaten. Daarna heb ik gedefenieerd wat ik wil dat er sowieso gecached wordt, ongeacht of hier op gezocht wordt of niet. De zoekterm ```Dam``` zal offline dus altijd beschikbaar zijn in mijn geval.
```js
const cacheName = "v1"
const cacheFiles = [
  './',
  './service-worker-registration.js',
  './search_q=Dam'
]
```
Vervolgens krijg je te maken met het `install`, `activate` en `fetch` event.
Als eerst het `install` event.
```js
self.addEventListener('install', function(e) {
  console.log("[ServiceWorker] Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then(function(cache) {
      cache.addAll(cacheFiles);
    })
  )
})
```
Hier in vertel je je cache dat hij de eerder gedefineerde `cacheFiles` aan de cache moet toevoegen.

In het `activate` event verwijderen we bestanden uit de cache die niet meer nodig zijn.
```js
self.addEventListener('activate', function(e) {

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
```
Er wordt door de cache heen `geloopt` en alles wat niet correspondeert met de huidige versie van de service worker, wordt verwijderd.

In het `fetch` event haal je je gecachde bestande op.
```js
self.addEventListener('fetch', function(e) {
  console.log("[ServiceWorker] Fetching", e.request.url);

  e.respondWith(

    fetch(e.request)
      .then(response => {

        //make clone of response
        const responseClone = response.clone()
        //open cache
        caches
          .open(cacheName)
          .then(cache => {
            // Add response to cache
            cache.put(e.request, responseClone)
          })
        return response;
      }).catch(err => caches.match(e.request).then(response => response))
    )
})
```

## Webserver
Ik heb mijn app geinstalleerd op [NOW](https://zeit.co/now). Dit ging echter niet zonder slag of stoot. Toen ik hem gedeployed had kreeg ik, als plaatjes wilde inladen, deze foutmelding. ![mixed content](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/mixedcontent.png)
Dit kwam omdat mijn app over `HTTPS` geserveerd werd, maar de afbeeldingen die ik ophaalde werden over `HTTP` geserveerd.

Maar na wat [googlen](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/fixing-mixed-content) kwam ik er achter dat ik deze regel code in de `head` moet zetten.
```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```
Dit stukje code zorgt ervoor dat de browser alle mixed content upgrade voordat de browser een netwerk request stuurt.

## Opsomming
Toen ik begon aan dit vak was mijn app nog niet je van het als het om Performance gaat
![Audit 1](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/audit1_overview.png)

Maar nu na 3 weken kan ik zeggen dat de missie, met mijn huidige kennis, toch aardig geslaagd is.
![Final Audit](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/final_audit.png)

### Wat ik nog wil doen
- [ ] Data in 'chuncks' serveren.
- [ ] Foto's kunnen opslaan.
- [ ] Dominant color in afbeelding vinden en deze gebruiken als placeholder.
