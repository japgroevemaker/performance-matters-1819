let showHeader = {
  onScroll: function () {
    window.onscroll = function() {
      let scrollPosY = window.pageYOffset | document.body.scrollTop;

      let searchBar = document.querySelector("#search-bar");

      if (scrollPosY > 500) {
        searchBar.classList.add('sticky')
      } else {
        searchBar.classList.remove('sticky');
      }
    }
  }
}
showHeader.onScroll()

let font = {
  loader: function () {

fetch("./rev-manifest.json")
  .then(res => res.json())
  .then(data => {

    var script = document.createElement('script');
    document.head.appendChild(script)
    script.src = data["js/fontfaceobserver.js"];
    script.async = true;
    script.onload = function (){
      loadFonts().then(onFontsLoaded);
    };
  })

    function loadFonts() {
      var headings = new FontFaceObserver('Limelight')
      var paragraph = new FontFaceObserver('Poppins');
      return Promise.all([
        headings.load(),
        paragraph.load()
      ])
    }

    function onFontsLoaded() {
      document.documentElement.className += 'fonts-loaded'
      document.cookie = 'fonts-loaded'
    }
  }
}
font.loader()

let onlineOffline = {
  check: function(){

    let button = document.querySelector('#button')
    let offline = document.querySelector('#offline');
    let close = document.querySelector('#offline h2');

    close.addEventListener('click', function() {
      offline.classList.remove('show')
    })

    if (navigator.onLine == false) {
      offline.classList.add('show')
      button.disabled = 'disabled'
      button.style.backgroundColor = '#ccc'
    } else {
      offline.classList.remove('show')
      button.style.backgroundColor = 'var(--barley-brown)'
      button.disabled = ''
    }

    window.addEventListener("offline", function(e){
      offline.classList.add('show')
      button.disabled = 'disabled'
      button.style.backgroundColor = '#ccc'
    })

    window.addEventListener("online", function (e) {
      offline.classList.remove('show')
      button.style.backgroundColor = 'var(--barley-brown)'
      button.disabled = ''
    })
  }
}
onlineOffline.check();
