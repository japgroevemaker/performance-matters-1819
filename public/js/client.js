let getSrc = {
  schnitz: function () {
    let img = document.querySelectorAll('img');
    let div = document.querySelectorAll('.small-img')

    img.forEach(values => {
    img = values.getAttribute('src');
      console.log(img);
    })

    div.forEach(jozef => {
      jozef.style.backgroundImage = "url(" + img + ")"
    })


  }
}
// getSrc.schnitz()
