module.exports = function (gulp) {
  gulp.task('dist', function () {
    return gulp.src('src/scrollreveal.js')
      .pipe(gulp.dest('dist'))
  })
}
