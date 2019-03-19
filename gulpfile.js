const gulp = require('gulp');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');

const inputDir = "public/";
const outputDir = 'cache/';
const manifestFilename = 'rev-manifest.json';

function defaultTask(cb) {

  gulp.src(["public/" +'*/.{css,js}' ])
    .pipe(rev()) .pipe(gulp.dest(inputDir))
    .pipe(rev.manifest(manifestFilename))
    .pipe(gulp.dest(outputDir)
  );

  const baseDir = 'cache/';
  gulp.src(baseDir + '*/.ejs')
    .pipe(revReplace({manifest: gulp.src(baseDir + manifestFilename)}))
    .pipe(gulp.dest(baseDir));
  cb();
}

exports.default = defaultTask
