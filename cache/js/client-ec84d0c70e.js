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

    var script = document.createElement('script');
    document.head.appendChild(script)
    script.src = "/js/fontfaceobserver.js";
    script.async = true;
    script.onload = function (){
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
      document.cookie = 'fonts-loaded'
    }
  }
}
font.loader()
