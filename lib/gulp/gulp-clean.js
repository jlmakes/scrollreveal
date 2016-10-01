var del = require('del');

module.exports = (gulp) => {
  gulp.task('clean', (done) => {
    return del('dist/**', done)
  });
}
