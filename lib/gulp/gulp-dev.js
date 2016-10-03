var rollup = require('gulp-rollup')
var buble = require('rollup-plugin-buble')

module.exports = (gulp) => {
  gulp.task('dev', () => {
    return gulp.src('./src/**/*.js')
      .pipe(rollup({
        entry: './src/scrollreveal.js',
        plugins: [buble()]
      }))
      .pipe(gulp.dest('./dev'))
  })
}
