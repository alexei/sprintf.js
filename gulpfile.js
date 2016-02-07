'use strict'

var pkg         = require('./package.json'),
    gulp        = require('gulp'),
    uglify      = require('gulp-uglify'),
    rename      = require('gulp-rename'),
    sourcemaps  = require('gulp-sourcemaps'),
    header      = require('gulp-header'),
    banner      = '/*! <%= pkg.name %> v<%= pkg.version %> | Copyright (c) 2007-present, <%= pkg.author %> | <%= pkg.license %> */\n'

gulp.task('dist', function() {
    return gulp.src([
            'src/*.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
})

gulp.task('default', ['dist'])
