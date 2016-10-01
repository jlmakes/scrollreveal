var bower = require('bower-json')

module.exports = (gulp) => {
  gulp.task('validate-bower', () => {
    bower.read('./bower.json', (err, json) => {
      if (err) {
        console.error('There was an error reading the file:')
        console.error(err.message)
        return
      }
    })
  })
}
