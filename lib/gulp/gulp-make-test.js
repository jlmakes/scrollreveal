const rollup = require('rollup-stream');
const buble = require('rollup-plugin-buble');
const output = require('vinyl-source-stream');

module.exports = (gulp) => {

  gulp.task('make-test', () => {

    const rollupConfig = {
      entry: './test/spec/main.spec.js',
      plugins: [buble()],
    };

    return rollup(rollupConfig)
      .pipe(output('test.js'))
      .pipe(gulp.dest('./test'));
  });
};
