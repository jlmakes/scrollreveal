const rollup = require('gulp-rollup');
const buble = require('rollup-plugin-buble');

module.exports = (gulp) => {
  gulp.task('dev', () => gulp
    .src('./src/**/*.js')
    .pipe(rollup({
      entry: './src/main.js',
      plugins: [buble()],
    }))
    .pipe(gulp.dest('./dev'))
  );
};
