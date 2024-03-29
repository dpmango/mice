var gulp   = require('gulp');
var config = require('../config');

gulp.task('copy:fonts', function() {
  return gulp
    .src(config.src.fonts + '/*.{ttf,eot,woff,woff2}')
    .pipe(gulp.dest(config.dest.fonts));
});

gulp.task('copy:video', function() {
  return gulp
    .src(config.src.root + '/video/**.*')
    .pipe(gulp.dest(config.dest.root + '/video'));
});

gulp.task('copy:vendor', function() {
  return gulp
    .src(config.src.vendor + '/**/*.*')
    .pipe(gulp.dest(config.dest.vendor));
});

gulp.task('copy:rootfiles', function() {
  return gulp
    .src(config.src.root + '/*.*')
    .pipe(gulp.dest(config.dest.root));
});

gulp.task('copy', [
  'copy:rootfiles',
  'copy:vendor',
  'copy:video',
  'copy:fonts'
]);

gulp.task('copy:watch', function() {
  gulp.watch(config.src.root + '/*.*', ['copy:rootfiles']);
  gulp.watch(config.src.vendor + '/**/*.*', ['copy:vendor']);
  gulp.watch(config.src.root + '/video/**.*', ['copy:video']);
  gulp.watch(config.src.fonts + '/*.{ttf,eot,woff,woff2}', ['copy:fonts']);
});
