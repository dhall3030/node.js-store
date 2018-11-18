'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var minify = require('gulp-minify');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.sass')
    .pipe(sass({
    	  indentedSyntax: true,
    	  outputStyle: 'compressed',
          includePaths: ['node_modules/susy/sass']
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('scss', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
		  outputStyle: 'compressed',
          includePaths: ['node_modules/susy/sass']


    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});


gulp.task('compress', function() {
  gulp.src('./js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('./public/javascripts'))
});
 
gulp.task('watch', function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
  gulp.watch('./sass/**/*.scss', ['scss']);
  gulp.watch('./js/**/*.js', ['compress']);
});