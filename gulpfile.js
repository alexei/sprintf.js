'use strict'

var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename')

gulp.task('dist', function() {
    return gulp.src([
            'src/*.js'
        ])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'))
})

gulp.task('default', ['dist'])
