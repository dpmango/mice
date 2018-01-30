var gulp        = require('gulp');
var ftp         = require('vinyl-ftp');
var gutil       = require( 'gulp-util' );

gulp.task('deploy', function () {

  var conn = ftp.create( {
    host:     'mice.dev.glyf.ru',
    user:     's_khmelevskoy',
    password: '@SSP6sJ3',
    port: 22,
    parallel: 10,
    log:      gutil.log
  });

  const path = '/mice/test';

  var globs = [
    '/dist/**/*.*'
  ];

  // return gulp.src( globs, { base: '.', buffer: false } )
  // 		// .pipe( conn.newer(path ) ) // only upload newer files
  // 		.pipe( conn.dest( path ) );

  // conn.rmdir(path, function(e){
  //   console.log(e)
  //   if (e === undefined) {
  //     // using base = '.' will transfer everything to /public_html correctly
  //     // turn off buffering in gulp.src for best performance
  //     return gulp.src(globs, {base: 'dist', buffer: false})
  //       // .pipe(conn.newer(path)) // only upload newer files
  //       .pipe(conn.dest(path));
  //   }
  //   return console.log(e);
  // });
});
