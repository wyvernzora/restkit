/**
 * gulpfile.js
 *
 * @author  Denis Luchkin-Zhou <denis@ricepo.com>
 * @license MIT
 */
require('babel-core/register');

const gulp         = require('gulp');
const gutil        = require('gulp-util');

const del          = require('del');
const babel        = require('gulp-babel');
const eslint       = require('gulp-eslint');
const notify       = require('gulp-notify');
const changed      = require('gulp-changed');
const sourcemaps   = require('gulp-sourcemaps');


/*!
 * Default build target.
 */
gulp.task('default', [ 'test' ]);


/*!
 * Delete previous builds.
 */
gulp.task('clean', function() {
  return del([ 'lib/**' ]);
});


/*!
 * Incremental build (use with watch).
 */
const build = function() {

  return gulp.src(['src/**/*.js'], { base: 'src' })
    .pipe(changed('lib'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('lib'))
    .pipe(notify({ message: 'Build Successful', onLast: true }));

};
gulp.task('build', ['lint'], build);
gulp.task('rebuild', [ 'relint' ], build);


/*!
 * Lint all source files.
 */
const lint = function() {

  return gulp.src(['src/**/*.js'])
    .pipe(changed('lib'))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());

};
gulp.task('lint', lint);
gulp.task('relint', ['clean'], lint);


/*!
 * Automatically rebuild on save.
 */
gulp.task('watch', ['rebuild'], function() {
  gulp.watch('src/**/*.js', ['build']);
});
