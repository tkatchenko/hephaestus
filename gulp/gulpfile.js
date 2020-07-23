const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const connect = require('gulp-connect');
const replace = require('gulp-replace');

function server(done) {
  connect.server({
    root: '../',
    livereload: true,
    port: 8080,
  });

  done();
}

function styles() {
  return gulp.src('../scss/index.scss')
    .pipe(sass().on('error', (error) => console.log(error)))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('../build'))
    .pipe(connect.reload());
}

function scripts() {
  return gulp.src(['../js/index.js'])
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'scripts.js',
      }
    }))
    .pipe(gulp.dest('../build'))
    .pipe(connect.reload());
}

function buildScripts() {
  return gulp.src(['../js/index.js'])
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'scripts.js',
      }
    }))
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('../build'))
    .pipe(connect.reload());
}

function buildVersion() {
  return gulp.src(['../index.html'])
    .pipe(replace(/\?v=\d+/g, '?v=' + Math.floor((Math.random() * 1000000) + 1)))
    .pipe(gulp.dest('../'));
}

function watcher() {
  gulp.watch('../scss/**/*.scss', styles);
  gulp.watch('../js/**/*.js', scripts);
}

exports.default = gulp.series(
  gulp.parallel(server, styles, scripts),
  watcher
);

exports.build = gulp.series(
  gulp.parallel(styles, buildScripts, buildVersion)
);
