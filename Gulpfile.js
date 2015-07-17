var karma = require('karma').server;
var gulp = require('gulp');

gulp.task('default', function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    action: 'watch'
  });
});