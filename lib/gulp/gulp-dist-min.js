var pump = require('pump')
var stripDebug = require('gulp-strip-debug')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')

module.exports = function (gulp) {
  gulp.task('dist-min', function (done) {
    pump(
      [
        gulp.src('src/scrollreveal.js'),
        stripDebug(),
        uglify(),
        rename('scrollreveal.min.js'),
        gulp.dest('dist')
      ],
      done
    )
  })
}
