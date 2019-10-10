const gulp = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const livereload = require('gulp-livereload');
 
function styles() {
  return gulp.src('../scss/index.scss')
    .pipe(sass().on('error', (error) => console.log(error)))
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('../build'))
    .pipe(livereload().on('error', (error) => console.log(error)));
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
    .pipe(livereload().on('error', (error) => console.log(error)));
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
    .pipe(livereload().on('error', (error) => console.log(error)));
}

function watcher() {
  livereload.listen();
  gulp.watch('../scss/**/*.scss', styles);
  gulp.watch('../js/**/*.js', scripts);
}

exports.default = gulp.series(
  gulp.parallel(styles, scripts),
  watcher
);

exports.build = gulp.series(
  gulp.parallel(styles, buildScripts)
);
