const rollup = require('rollup-stream');
const buble = require('rollup-plugin-buble');
const output = require('vinyl-source-stream');

module.exports = (gulp) => {

	gulp.task('dist', () => {

		const rollupConfig = {
			entry: './src/main.js',
			plugins: [buble()],
		};

		return rollup(rollupConfig)
			.pipe(output('scrollreveal.js'))
			.pipe(gulp.dest('./dist'));
	});
};
