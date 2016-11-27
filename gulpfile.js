const gulp = require('gulp');
const fs = require('fs');
const run = require('run-sequence');
const browser = require('browser-sync').create();


fs.readdirSync('lib/gulp').forEach((file) => {
	if (file.match(/.+\.js/g)) {
		require(`./lib/gulp/${file}`)(gulp, browser);
	}
});


gulp.task('build', (done) => {
	run(
		'validate-bower',
		'clean',
		[
			'dist',
			'dist-min',
		],
		done
	);
});


gulp.task('default', (done) => {
	run(
		'dev',
		'dev-server',
		done
	);
});
