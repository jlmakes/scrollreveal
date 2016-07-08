var del = require('del')

module.exports = function (gulp) {
  gulp.task('clean', function (done) {
    return del('dist/**', done)
  })
}
