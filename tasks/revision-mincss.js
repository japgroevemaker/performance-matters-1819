let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');

// src waar gulp het bronbestand kan vinden
// Het verder gaan in het 'buizenstelsel' en het schoonmaken(minifyen) van het CSS bestand
// Het terugplaatsen van het geminifyde bestand
gulp.src('cache/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest("cache/css"))
