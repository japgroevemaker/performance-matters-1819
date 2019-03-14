# App ombouwen naar server-side
In de eerste week was de opdracht je OBA app zo om te bouwen dat de API server-side gerenderd wordt. Dit doen we met behulp van ```nodejs```, ```express``` en ```ejs```.

### ```npm```
Ik heb als eerst mijn terminal geopend en ben naar de juiste directory gegaan. Toen ik in die directory zat heb ik ```npm init``` in de terminal ingetypt, deze command maakt ```package.json``` aan. ```package.json``` is de basis van je app. Daarna heb ik ```npm install express, node-fetch, ejs``` ingetypt in de commandline. Dit zorgt ervoor dat de juiste ```node-modules``` in de juiste directory worden geinstalleerd worden. ```node``` heb ik niet hoeven installeren omdat dit al globaal op mijn computer geinstalleerd is en daarom niet nog een keer geinstalleerd hoeft te worden.

### Wat is ```nodeJS``` ?
a ```nodeJS``` is een gratis ```JavaScript``` open source cross platform dat je in staat stelt snel een netwerk applicatie te bouwen.

### Wat is ```express```?
, ```express``` is een light-weight web applicatie die je helpt je web applicatie server-side te organiseren.

### Het opzetten
Het implementeren werkte als volgt:

Dit is de ```index.js```, als het ware de "server".
```js
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get("/", function(req, res) {
  res.render("index")
});

app.listen(4444)
console.log('Port 4444');
```
Dit is de basis structuur, vervolgens ga je deze aanpassen en er voor zorgen dat de API van de OBA server-side binnen wordt gehaald en wordt gerenderd.
Dit ziet er als volgt uit:

```js
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({extended: false}) // kijkt naar values in form
const app = express();
const fetch = require("node-fetch")

let data
let zoekTerm = ""

app.set('view engine', 'ejs');
app.use(express.static('public')) // in welke map staan je EJS bestanden

app.get("/", (req, res) => {
  res.render('index')
})

app.post("/", parser, (req, res) => {
  zoekTerm = req.body.zoekTerm
  res.redirect(`/search_q=${zoekTerm}`)
})

app.get("/search_q=:id", (req,res) => {
  let zoekTerm = req.params.id
  search(res, zoekTerm)
})

app.get("/search_q=:id/detail=:num", (req, res) => {

  let queryZoekTerm = req.params.id
  let num = req.params.num

  if(queryZoekTerm === zoekTerm) {
    res.render("detail", {data: data, queryZoekTerm, num})
  } else {
    zoekTerm = queryZoekTerm
    search(res, queryZoekTerm, num)
  }
})

function search(res, zoekTerm, num) {

  const baseURL = "https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query="
  const endUrl = "&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on"
  const sparqlquery = `
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>

    SELECT ?cho ?title ?img ?endDate ?creator ?provenance ?description WHERE {
     ?cho dc:type ?type .
        ?cho dc:title ?title .
        ?cho dc:creator ?creator .
        ?cho dct:provenance ?provenance .
        ?cho dc:description ?description .
      ?cho foaf:depiction ?img .
      ?cho sem:hasEndTimeStamp ?endDate .

      FILTER REGEX(?title, '${zoekTerm}', 'i')
  }`;
  fetch(`${baseURL}${sparqlquery}${endUrl}`)
  .then(resp => resp.json())
  .then(resp => {
    data = resp.results.bindings

    if(num){
      res.render("detail", {data: data, num})
    } else {
      res.render("index", {data: data, zoekTerm})
    }
  }).catch(err => console.log(err));
}

app.listen(4444)
console.log('Port 4444');
```


Vervolgens maak je een ```index.ejs``` bestand aan, via dit bestand wordt alles in de ```DOM``` gerenderd.

```html
<% include header.ejs %>
<header>
  <img src="/image/logo.svg" />
  <h1>Doorzoek het stadsarchief</h1>
  <p>Vul een aan Amsterdam gerelateerde zoekterm in. Bijvoorbeeld: Rokin</p>
</header>

<form class="" action="/" method="post">
  <input type="text" name="zoekTerm" placeholder="Zoek">
  <input type="submit" name="button" value="Zoek">
</form>
<p id="error">Uw zoek opdracht heeft geen resultaten opgeleverd</p>
<section id="images">
  <div>
    <% if(locals.data) { %>
      <% data.forEach((el, i) => { %>
        <a href="/search_q=<%=zoekTerm%>/detail=<%=i%>">
          <img src="<%=el['img']['value']%>" alt="<%=el['title']['value']%>">
        </a>
      <% }) %>
    <% } %>
  </p>
</section>
<div class="loader"></div>
<% include footer.ejs %>
```
### De app starten
Je opent je terminal en navigeert naar folder waar de app staat. Omdat ik ```nodemon``` heb geinstalleerd, hoef je simpelweg alleen ```nodemon``` aan de terminal door te geven en de app start.
