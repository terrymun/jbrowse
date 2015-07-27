var gulp = require('gulp');
var gulp_uglify = require('gulp-uglify');
var gulp_rename = require('gulp-rename');
var gulp_concat = require('gulp-concat');

gulp.task('build', function() {
  gulp.src([
    '*.json','*.conf','*.html','*.css'
  ]).pipe(gulp.dest('dist/'))

  gulp.src([
    'img/*.png'
  ]).pipe(gulp.dest('dist/img/'))

  gulp.src([
    'src/**/*.js','src/**/**/*.js',
    'src/**/*.css','src/**/**/*.css',
    'src/**/*.html','src/**/**/*.html',
    'src/**/*.png','src/**/**/*.png',
    'src/**/*.gif','src/**/**/*.gif',
    'src/**/*.jpg','src/**/**/*.jpg',
  ])
  .pipe(gulp.dest('dist/src/'))


  gulp.src([
    'plugins/**/js/*.js','plugins/**/js/**/*.js',
    'plugins/**/css/*.css','plugins/**/css/**/*.css',
  ])
  .pipe(gulp.dest('dist/plugins/'))


  //.pipe(gulp_concat('concat.js'))
  //.pipe(gulp.dest('dist'))
  //.pipe(gulp_rename('uglify.js'))
  //.pipe(gulp_uglify({ mangle: false })).on('error', errorHandler)
  //.pipe(gulp.dest('dist'))

  return 1
});

gulp.task('default', ['build']);


// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
