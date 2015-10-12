var gulp       = require( 'gulp' )
  , uglify     = require( 'gulp-uglify' )
  , umd        = require( 'gulp-wrap-umd' )
  , rename     = require( 'gulp-rename' )
  , livereload = require( 'gulp-livereload' )

gulp.task( 'wrap', function() {

  gulp.src( 'ScrollReveal.js' )
    .pipe( umd({ namespace: 'ScrollReveal', exports: 'ScrollReveal' }) )
    .pipe( gulp.dest( 'dist' ) )
})

gulp.task( 'minify', function() {

  gulp.src( 'ScrollReveal.js' )
    .pipe( umd({ namespace: 'ScrollReveal', exports: 'ScrollReveal' }) )
    .pipe( uglify() )
    .pipe( rename( 'ScrollReveal.min.js' ) )
    .pipe( gulp.dest( 'dist' ) )
})

gulp.task( 'default', function() {

  livereload.listen()
  gulp.watch([ 'dev/*.html', '*.js' ]).on( 'change', livereload.changed )
})

gulp.task( 'build', [ 'wrap', 'minify' ])
