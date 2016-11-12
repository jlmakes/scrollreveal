const rename = require('gulp-rename');
const rollup = require('gulp-rollup');
const buble = require('rollup-plugin-buble');


function makeTest () {

  const stream = this.src([
    './src/**/*.js',
    './test/**/*.spec.js',
  ]);

  const rollupConfig = {
    entry: './test/spec/main.spec.js',
    plugins: [buble()],
  };

  stream.pipe(rollup(rollupConfig));
  stream.pipe(rename('test.js'));
  stream.pipe(this.dest('./test'));

  return stream;
}


module.exports = gulp => gulp.task('make-test', makeTest);
