module.exports = (gulp) => {
  gulp.task('dist', () => gulp
    .src('src/scrollreveal.js')
    .pipe(gulp.dest('dist'))
  );
};
