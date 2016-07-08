module.exports = function (gulp) {
  gulp.task('dev', function () {
    return gulp.src('src/scrollreveal.js')
      .pipe(gulp.dest('dev'))
  })
}
