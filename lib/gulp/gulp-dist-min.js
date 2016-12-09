const rollup = require('rollup-stream');
const buble = require('rollup-plugin-buble');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const output = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

module.exports = (gulp) => {

	gulp.task('dist-min', () => {

		const rollupConfig = {
			entry: './src/index.js',
			plugins: [buble()],
		};

		return rollup(rollupConfig)
			.pipe(output('scrollreveal.min.js'))
			.pipe(buffer())
			.pipe(stripDebug())
			.pipe(uglify())
			.pipe(gulp.dest('./dist'));
	});
};
