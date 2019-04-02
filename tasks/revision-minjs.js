let gulp = require('gulp');
let uglify = require('gulp-uglify-es').default;

gulp.src('cache/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest("cache/js"))
