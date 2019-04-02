let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');

gulp.src('cache/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest("cache/css"))
