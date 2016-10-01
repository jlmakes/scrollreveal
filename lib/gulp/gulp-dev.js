module.exports = (gulp) => {
  gulp.task('dev', () => {
    return gulp.src('src/scrollreveal.js')
      .pipe(gulp.dest('dev'))
  })
}
