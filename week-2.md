# Week 2
Minor Web Development - Performance Matters
### Opdracht 1: Optimaliseer de first meaningful paint
Er waren een aantal zaken waarmee je de first meaningfull paint kon optimaliseren. Ik heb gekozen voor `caching` en voor `font-loading`.

### Caching
Het toepassen van caching was simpel. Door het toevoegen van deze regels code werd je website gecached.
```js
app.set('view engine', 'ejs');
app.use(compression())
app.use((req, res, next)  =>{
  res.setHeader('Cache-Control', 'max-age=' + 365 * 24 * 60 * 60);
  next();
})
```
Hierdoor werd mijn website heel snel geladen omdat hij als het ware opgeslagen werd.
Er is echter een probleem wat deze `caching` met zich mee neemt. Omdat je `CSS` en je `Javascript` bestanden worden opgeslagen, worden deze niet ge-update zodra je er aanpassingen in doorvoert. Dit wilde ik veranderen door `gulp-rev` te gaan gebruiken.

Als eerst maakte ik een `revision-hash.js` file aan waarin ik `gulp` en `gulp-rev` require.
```js
const gulp = require('gulp');
const rev = require('gulp-rev');
const inputDir = "./cache/";
const manifestFilename = 'rev-manifest.json';

gulp.src(["public/" + '**/*.{css,js}' ])
  .pipe(rev())
  .pipe(gulp.dest(inputDir))
  .pipe(rev.manifest(manifestFilename))
  .pipe(gulp.dest(inputDir));
```
Hier geef ik ook aan waar `gulp` de `CSS` en `Javascript` bronbestanden kan vinden.
Omdat er al een `"css/style.css": "css/style-1980fc2e8b.css"` bestand aangemaakt door `gulp-rev` deze zal ik alleen nog moeten uitlezen. Dit doe ik doormiddel van de volgende functie in mijn `index.js`.
```js
function revUrl(url) {
    let fileName = JSON.parse(fs.readFileSync("cache/rev-manifest.json", 'utf8'))
    return fileName[url]
}
```
Daarna moest het nog in `node` geimplementeerd worden, zodat mijn `link` tag steeds opnieuw aangepast wordt.
Dit heb ik zo gedaan:
```js
app.use((req, res, next) => {
  res.locals = {
    css: revUrl("css/style.css"),
    js: revUrl("js/client.js"),
    fontjs: revUrl("js/fontfaceobserver.js")
  }
  next()
})
```
Vervolgens moest ik de wijziging in mijn `link` tag doorvoeren.
```html
<link rel="stylesheet" type="text/css" href="/<%=css%>"/>
```
Daarna vervolgens eenmalig in de console `npm run revision` intypen en dan wordt alles geminifyd. Als ik nu in de toekomst mijn app start met `npm start` voert hij automatisch updates door voor `CSS` en `Javascript`.

De website is significant sneller geworden.
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/no-caching2.png)
![After](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/caching.png)

### Font-loading
Font-loading zorgt ervoor dat je eigenlijk altijd iets te zien krijgt als het om een font gaat. Je fallback font wordt getoond en pas als alles geladen is, wordt je custom font geladen. Dit verbeterd de performance.

Als eerst defenieer je het standaard fallback font.
```CSS
html {
  font-family: Baskerville, serif;
}

html p, a {
  font-family: Baskerville, serif;
}
```

Vervolgens defenieer je je custom fonts en de `class` waarin deze zit
```css
html.fonts-loaded h1 {
  font-family: var(--headings), Georgia;
}

html.fonts-loaded p, a  {
  font-family: var(--paragraph);
}
```
Daarna duik je client-side `javascript` in en ga je er voor zorgen dat deze async ingeladen wordt.
```js
let font = {
  loader: function () {

    var script = document.createElement('script');
    document.head.appendChild(script)
    script.src = "/js/fontfaceobserver-16d7f1d0e2.js";
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
```
Een kleine aanpassing met toch veel effect.
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/before_font.png)

# CSS + JS minifier
In een later stadium heb ik er ook een CSS en een JS minifier aan toegevoegd.
Dit heb ik gedaan omdat mijn CSS en JS bestand toch wel groot zijn geworden na de styling + het implementeren van de functionaliteiten. Daarnaast had ik natuurlijk ook nog te maken met het `fontfaceobserver.js` bestand.

## Implementatie
In het `revision-mincss.js` bestand doe je het volgende.
```js
let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');

gulp.src('cache/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest("cache/css"))
```
Vervolgens doe je het soort gelijke in het `revision-minjs.js` bestand.
```js
let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;

gulp.src('cache/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest("cache/js"))
```
In de basis vertel je hier waar je de bestanden die geminifyd moeten worden gevonden kunnen worden en waar ze weer neergezet moeten worden als ze geminifyd zijn.

Daarna duik je je `scripts` van je `package.json` in.
```js
"start": "npm run revision && nodemon index.js",
"postbuild": "npm run revision",
"revision": "node tasks/revision-hash.js && node tasks/revision-mincss.js && node tasks/revision-minjs.js",
"mincss": "node tasks/revision-mincss.js",
"minjs": "node tasks/revision-minjs.js"
```
Hier vertel je je dependencies waar ze de css + js minifier kunnen vinden en dat ze hem moeten draaien als de app gestart word.

## Resultaten
De JS minifier voegt toe aan de performance van de website.
Voor
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/noJSmin.png)
Na
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/JSmin.png)

De CSS minifier zet echter niet veel zode aan de dijk
Voor
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/noCSSmin.png)
Na
![Before](https://github.com/japgroevemaker/performance-matters-1819/blob/master/images/CSSmin.png)
