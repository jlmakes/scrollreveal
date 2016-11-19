module.exports = (gulp, browser) => {
  gulp.task('dev-server', () => {

    browser.init({
      server: {
        baseDir: 'dev',
      },
    });

    gulp.watch(['src/**/*.js'], ['dev']);
    gulp.watch(['dev/*.*']).on('change', browser.reload);
  });
};
