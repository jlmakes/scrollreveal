

const pump = require('pump');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

module.exports = (gulp) => {
  gulp.task('dist-min', (done) => {
    pump(
      [
        gulp.src('src/scrollreveal.js'),
        stripDebug(),
        uglify(),
        rename('scrollreveal.min.js'),
        gulp.dest('dist'),
      ],
      done
    );
  });
};
