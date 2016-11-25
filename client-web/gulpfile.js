var config = require('./config.js');
var gulp = require('gulp-param')(require('gulp'), process.argv);
var argv = require('yargs').argv;

var rename = require("gulp-rename");

var browserify = require('browserify');

var source = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var templateCache = require('gulp-angular-templatecache');

var sass = require('gulp-sass');
var concat = require('gulp-concat');
var replace = require('gulp-replace');

var md5 = require("gulp-md5-replace");

var browserify_css = require('browserify-css');

var uglifyify = require('uglifyify');

var jsonMinify = require('gulp-jsonminify');

var jsonMerge = require('gulp-merge-json');

var ngConstant = require('gulp-ng-constant');

gulp.task('index', function () {
    var mainModule = argv.module ? argv.module : 'app';
    gulp.src(['./assets/index.html'])
      .pipe(replace('<%mainModule%>', mainModule))
      .pipe(gulp.dest('./dist'));
});
gulp.task('sass', function () {
    return gulp.src(['./assets/**/*.scss'])
      .pipe(concat('style.scss'))
      .pipe(gulp.dest('./dist/css'))
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('style.css'))
      .pipe(md5('./dist/index.html', {length: 10, isEncrypted: true}))
      .pipe(gulp.dest('./dist/css'));
});
gulp.task('templates', function () {
    return gulp.src(['assets/**/*.html'])
      .pipe(templateCache({module: 'app'}))
      .pipe(md5('./dist/index.html', {length: 10, isEncrypted: true}))
      .pipe(gulp.dest('dist/js'));
});


gulp.task('scripts', function () {

    var sources = browserify({
        entries: ['assets/app/app.module.js'],
        debug: argv.debug,
        paths: ['./assets/app']
    })
        .transform(browserify_css, {global: true})
        .transform(uglifyify, {
            global: true,
            mangle: false,
            comments: true,
            compress: {
                angular: true
            }
        });

    return sources.bundle()
        .pipe(source('app.js'))
        .pipe(vinylBuffer())
        .pipe(md5('./dist/index.html', {length: 10, isEncrypted: true}))
        .pipe(gulp.dest('dist/js/'));

});


var locales = ['en', 'fr'];

gulp.task('locales', function () {
    locales.forEach(function (locale) {
        gulp.src(['./assets/app/**/' + locale + '.json'])
          .pipe(jsonMerge(locale + '.json'))
          .pipe(jsonMinify())
          .pipe(gulp.dest('./dist/i18n'));
    });
});


gulp.task('make', ['index', 'sass', 'templates', 'scripts', 'locales']);
