var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var runSequence = require('run-sequence');
var del = require('del');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');

var paths = {
  js: '../assets/src/js/**/*.js',
  sass: '../assets/src/sass/main.scss',
  sassWatch: '../assets/src/sass/**/*.scss',
  css: '../assets/src/css/**/*.css',
  images: '../assets/src/images/**/*',
  other: '../assets/src/other/**/*',
  html: '../**/*.html',
  dist: '../assets/dist'
};

gulp.task('styles', function() {
  return gulp.src([paths.css, paths.sass])
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(sass({errLogToConsole: true}))
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(paths.dist + '/css'))
    .pipe(livereload());
});

gulp.task('styles-build', function() {
  return gulp.src([paths.css, paths.sass])
    .pipe(sass({errLogToConsole: true}))
    .pipe(cleanCss())
    .pipe(concat('all.min.css'))
    .pipe(gulp.dest(paths.dist + '/css'));
});

gulp.task('scripts', function() {
  return gulp.src([paths.js])
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(paths.dist + '/js'))
    .pipe(livereload());
});

gulp.task('scripts-build', function() {
  return gulp.src([paths.js])
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest(paths.dist + '/js'));
});

gulp.task('images', function() {
  return gulp.src([paths.images])
    .pipe(gulp.dest(paths.dist + '/images'))
    .pipe(livereload());
});

gulp.task('images-build', function() {
  return gulp.src([paths.images])
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 7,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest(paths.dist + '/images'));
});

gulp.task('other', function() {
  return gulp.src([paths.other])
    .pipe(gulp.dest(paths.dist + '/other'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch([paths.sassWatch, paths.css], ['styles']);
  gulp.watch([paths.js], ['scripts']);
  gulp.watch([paths.images], ['images']);
  gulp.watch([paths.other], ['other']);
  gulp.watch([paths.html], function() {
    livereload.reload();
  });
});

gulp.task('delete', function () {
  return del([paths.dist + '/**/*'], {force: true});
});

gulp.task('default', function(callback) {
  runSequence('delete', ['watch', 'styles', 'scripts', 'images', 'other'], callback);
});

gulp.task('build', function(callback) {
  runSequence('delete', ['styles-build', 'scripts-build', 'images-build', 'other'], callback);
});
