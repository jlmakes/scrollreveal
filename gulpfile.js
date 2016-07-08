var gulp = require('gulp')
var fs = require('fs')
var run = require('run-sequence')
var browser = require('browser-sync').create()

fs.readdirSync('lib/gulp').forEach(function (file) {
  if (file.match(/.+\.js/g)) {
    require(`./lib/gulp/${file}`)(gulp, browser)
  }
})

gulp.task('build', function (done) {
  run(
    'validate-bower',
    'clean',
    [
      'dist',
      'dist-min'
    ],
    done
  )
})

gulp.task('default', function (done) {
  run(
    'dev',
    [
      'server',
      'watch'
    ],
    done
  )
})
