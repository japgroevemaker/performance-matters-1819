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
    // let font = new FontFaceObserver('tieten');
    // let html = document.documentElement;
    //
    // font.load().then(function () {
    //   html.className += 'fonts-loaded'
    // })

    var script = document.createElement('script');
    script.src = '../node_modules/fontfaceobserver/fontfaceobserver.js'
    script.async = true
    script.onLoad = function (){
      loadFonts().then(onFontsLoaded);
    };
    document.head.appendChild(script)

    function loadFonts() {
      var headings = new FontFaceObserver('Limelight')
      var paragraph = new FontFaceObserver('Poppins');
      return Promise.all([
        headings.load(),
        paragraph.load()
      ])
    }

    function onFontsLoaded() {
      let html = document.documentElement
      html.documentElement.className += 'fonts-loaded'
    }
  }
}
font.loader()
