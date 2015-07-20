var karma = require('karma').server;
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('default', function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    action: 'watch'
  });
});

gulp.task('build', function() {
  return gulp.src('./angular-fng.js')
    .pipe(rename('./angular-fng.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'))
});