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
