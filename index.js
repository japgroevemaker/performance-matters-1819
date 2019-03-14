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
    // console.log(resp.results.bindings);
    if(num){
      res.render("detail", {data: data, num})
    } else {
      res.render("index", {data: data, zoekTerm})
    }
  }).catch(err => console.log(err));
}

app.listen(4444)
console.log('Port 4444');
