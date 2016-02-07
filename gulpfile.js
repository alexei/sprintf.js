'use strict'

var gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps')

gulp.task('dist', function() {
    return gulp.src([
            'src/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
})

gulp.task('default', ['dist'])
