let showHeader = {
  onScroll: function () {
    window.onscroll = function() {
      let scrollPosY = window.pageYOffset | document.body.scrollTop;
      // console.log(scrollPosY);

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

    // let FontFaceObserver = '/node_modules/fontfaceobserver/fontfaceobserver.js'
    //
    // let font = new FontFaceObserver('limelight');
    // let html = document.documentElement;
    //
    // font.load().then(function () {
    //   html.className += 'fonts-loaded'
    // })

    // var script = document.createElement('script');
    // document.head.appendChild(script)
    // script.src = '/js/fontfaceobserver.js';
    // script.async = true;
    document.body.onload = function (){
      loadFonts().then(onFontsLoaded);
    };


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
    }
  }
}
font.loader()
