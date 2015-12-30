var gulp    = require('gulp');
var uglify  = require('gulp-uglify');
var umd     = require('gulp-wrap-umd');
var rename  = require('gulp-rename');
var bower   = require('bower-json');
var browser = require('browser-sync').create();


gulp.task( 'dist', function() {
  gulp.src('scrollreveal.js')
    .pipe( umd({ namespace: 'ScrollReveal', exports: 'this.ScrollReveal' }) )
    .pipe( gulp.dest('dist') )
});

gulp.task( 'dev', function() {
  gulp.src('scrollreveal.js')
    .pipe( gulp.dest('dev') );
});

gulp.task( 'validate', function() {
  bower.read('./bower.json', function( err, json ) {
    if ( err ) {
      console.error('There was an error reading the file');
      console.error( err.message );
      return;
    }
  });
});

gulp.task( 'dist:minify', function() {
  gulp.src('scrollreveal.js')
    .pipe( umd({ namespace: 'ScrollReveal', exports: 'this.ScrollReveal' }) )
    .pipe( uglify() )
    .pipe( rename('scrollreveal.min.js') )
    .pipe( gulp.dest('dist') )
})

gulp.task( 'default', function() {
  browser.init({ server: { baseDir: "./dev" } });
  gulp.start(['dev']);
  gulp.watch([ 'scrollreveal.js '], [ 'dev' ])
  gulp.watch([ 'dev/*.*' ]).on( "change", browser.reload );
});

gulp.task( 'build', [ 'validate','dist', 'dist:minify' ]);
