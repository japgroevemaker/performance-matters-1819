const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const parser = bodyParser.urlencoded({extended: false}) // kijkt naar values in form
const app = express();
const fetch = require("node-fetch")
const compression = require("compression")
const fs = require("fs")
const revManifest = '/rev-manifest.json';


let data
let zoekTerm = ""
let zoekGeschiedenis = []

console.log(app.locals.title);

// Welke templating gebruik je?
app.set('view engine', 'ejs');

// Tekst compression
app.use(compression())

// Het cachen van je app
app.use((req, res, next)  =>{
  res.setHeader('Cache-Control', 'max-age=' + 365 * 24 * 60 * 60);
  next();
})

// Waar kan revision-hash.js je bestanden vinden
app.use((req, res, next) => {
  res.locals = {
    css: revUrl("css/style.css"),
    js: revUrl("js/client.js"),
    sw: revUrl("service-worker-registration.js"),
    font: revUrl("js/fontfaceobserver.js")
  }
  next()
})

// in welke map staan je bron bestanden
app.use(express.static('cache/'))

// Hier render je de homepagina
app.get("/", (req, res) => {
  res.render('index')
})

// Wordt getriggered als je de zoekfunctie gebruikt en generenderd op de homepagina
app.post("/", parser, (req, res) => {
  zoekTerm = req.body.zoekTerm
  console.log(zoekGeschiedenis);
  res.redirect(`/search_q=${zoekTerm}`);
})

// Hier wordt het resultaat van de zoekopdracht opgehaald
app.get("/search_q=:id", (req,res) => {
  let zoekTerm = req.params.id
  console.log();
  search(res, zoekTerm)
})

// Hier wordt de aangeklikte afbeelding opgehaald en gerenderd.
// Ook wordt hier gekeken naar of de data al bestaat, als dit het geval is hoeft hij niet opnieuw opgehaald te worden.
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

// Definieren van de API van de OBA
function search(res, zoekTerm, num) {
  zoekGeschiedenis.push(zoekTerm)
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
  } LIMIT 1000`;

  // Fetchen van de API
  fetch(`${baseURL}${sparqlquery}${endUrl}`).then(resp => resp.json()).then(resp => {
    data = resp.results.bindings

    // het renderen van het juiste nummer bij de juiste detailpagina
    if(num){
      res.render("detail", {data: data, num})
    } else {
      res.render("index", {data: data, zoekTerm, zoekGeschiedenis})
    }
  }).catch(err => console.log(err));
}

// het uitlezen van het rev-manifest.json bestand
function revUrl(url) {
    let fileName = JSON.parse(fs.readFileSync("cache/rev-manifest.json", 'utf8'))
    return fileName[url]
}

// Op welke port de app gedraaid wordt.
app.listen(4444)
console.log('Port 4444');
