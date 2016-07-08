module.exports = function (gulp, browser) {
  gulp.task('watch', function () {
    gulp.watch(['src/scrollreveal.js'], ['dev'])
    gulp.watch(['dev/*.*']).on('change', browser.reload)
  })
}
