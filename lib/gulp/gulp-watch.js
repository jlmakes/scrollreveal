module.exports = (gulp, browser) => {
  gulp.task('watch', () => {
    gulp.watch(['src/scrollreveal.js'], ['dev'])
    gulp.watch(['dev/*.*']).on('change', browser.reload)
  })
}
