const bower = require('bower-json')

module.exports = (gulp) => {
	gulp.task('validate-bower', () => {
		bower.read('./bower.json', error => {
			if (error) console.error(`There was an error reading the file.\n  - ${error.message}`)
		})
	})
}
