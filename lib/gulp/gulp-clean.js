const del = require('del');

module.exports = (gulp) => {
	gulp.task('clean', done => del('dist/**', done));
};
