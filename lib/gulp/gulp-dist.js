module.exports = (gulp) => {
  gulp.task('dist', () => {
    return gulp.src('src/scrollreveal.js')
      .pipe(gulp.dest('dist'))
  })
}
