if("serviceWorker" in navigator){

  navigator.serviceWorker
    .register("./service-worker.js", {scope: './'})
    .then(function(registration){
      console.log("Service worker registered", registration);
    })
    .catch(function(err) {
      console.log("service worker failed to register", err);
    })
}
