module.exports = function (gulp, browser) {
  gulp.task('server', function () {
    browser.init({
      server: {
        baseDir: 'dev'
      }
    })
  })
}
