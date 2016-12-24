module.exports = (gulp, browser) => {
	gulp.task('coverage', () => {

		browser.init({
			server: {
				baseDir: 'coverage/PhantomJS 2.1.1 (Mac OS X 0.0.0)/lcov-report/',
			},
		})

		gulp.watch(['coverage/PhantomJS 2.1.1 (Mac OS X 0.0.0)/lcov-report/**'])
			.on('change', browser.reload)
	})
}
