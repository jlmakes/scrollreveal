var bower = require('bower-json')

module.exports = function (gulp) {
  gulp.task('validate-bower', function () {
    bower.read('./bower.json', function (err, json) {
      if (err) {
        console.error('There was an error reading the file:')
        console.error(err.message)
        return
      }
    })
  })
}
