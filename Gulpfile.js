var gulp       = require( 'gulp' )
  , uglify     = require( 'gulp-uglify' )
  , umd        = require( 'gulp-wrap-umd' )
  , rename     = require( 'gulp-rename' )
  , livereload = require( 'gulp-livereload' )

gulp.task( 'wrap', function() {

  gulp.src( 'scrollReveal.js' )
    .pipe( umd({ namespace: 'scrollReveal', exports: 'scrollReveal' }) )
    .pipe( gulp.dest( 'dist' ) )
})

gulp.task( 'minify', function() {

  gulp.src( 'scrollReveal.js' )
    .pipe( umd({ namespace: 'scrollReveal', exports: 'scrollReveal' }) )
    .pipe( uglify() )
    .pipe( rename( 'scrollReveal.min.js' ) )
    .pipe( gulp.dest( 'dist' ) )
})

gulp.task( 'default', function() {

  livereload.listen()
  gulp.watch([ 'dev/*.html', '*.js']).on( 'change', livereload.changed )
})

gulp.task( 'build', [ 'wrap', 'minify' ])
