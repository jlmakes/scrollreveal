var bower = require('bower-json')
var browser = require('browser-sync').create()
var gulp = require('gulp')
var rename = require('gulp-rename')
var stripDebug = require('gulp-strip-debug')
var uglify = require('gulp-uglify')

/**
 * Development Tasks
 */

gulp.task('dev', function () {
  gulp.src('dist/scrollreveal.min.js')
    .pipe(gulp.dest('dev'))
})

gulp.task('default', function () {
  browser.init({ server: { baseDir: './dev' } })
  gulp.start(['dev'])
  gulp.watch(['scrollreveal.js'], ['dev'])
  gulp.watch(['dev/*.*']).on('change', browser.reload)
})

/**
 * Deployment Tasks
 */

gulp.task('validate', function () {
  bower.read('./bower.json', function (err, json) {
    if (err) {
      console.error('There was an error reading the file:')
      console.error(err.message)
      return
    }
  })
})

gulp.task('dist', function () {
  gulp.src('scrollreveal.js')
    .pipe(gulp.dest('dist'))
})

gulp.task('dist:minify', function () {
  gulp.src('scrollreveal.js')
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(rename('scrollreveal.min.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['validate', 'dist', 'dist:minify'])
