module.exports = (gulp, browser) => {
  gulp.task('server', () => {
    browser.init({
      server: {
        baseDir: 'dev',
      },
    });
  });
};
