if("serviceWorker" in navigator){

  navigator.serviceWorker
    .register("./service-worker-d41d8cd98f.js", {scope: './'})
    .then(function(registration){
      console.log("Service worker registered", registration);
    })
    .catch(function(err) {
      console.log("service worker failed to register", err);
    })
}
