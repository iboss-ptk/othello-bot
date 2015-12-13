require("babel-register")();

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var serve = require('gulp-serve');

var mocha = require('gulp-mocha');

var srcList = [
  // load ordering
  './src/util.js',
  './src/negamax.js',
  './src/main.js'
];

gulp.task('default', function() {

}) ;

gulp.task('serve', serve('.'));

gulp.task('test', function () {
  return gulp.src('test/*.js', {read: false})
    // gulp-mocha needs filepaths so you can't have any plugins before it
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task("build", function () {
  return gulp.src(srcList)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(sourcemaps.init())
    .pipe(concat('bot.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("."));
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.js', './test/*.js'], ['test', 'build']);
});