

module.exports = (gulp, browser) => {
  gulp.task('watch', () => {
    gulp.watch(['src/**/*.js'], ['dev']);
    gulp.watch(['dev/*.*']).on('change', browser.reload);
  });
};
