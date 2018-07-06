'use strict';

var gulp = require('gulp'),
    gulp_plugins = require('gulp-load-plugins')();


gulp.task('pug',function () {
    return gulp.src('src/pug/pages/*.pug')
        .pipe(gulp_plugins.pug({
            pretty:true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('stylus',function () {
    return gulp.src('src/static/stylus/main.styl')
        .pipe(gulp_plugins.sourcemaps.init())
        .pipe(gulp_plugins.stylus({
            compress: true
        }))
        .pipe(gulp_plugins.autoprefixer({
            browsers: ['last 10 versions']
        }))
        .on("error", gulp_plugins.notify.onError({
            title: "style"
        }))
        .pipe(gulp_plugins.csso())
        .pipe(gulp_plugins.sourcemaps.write())
        .pipe(gulp.dest('build/static/css/'));
});

gulp.task('watch',function () {
    gulp.watch('src/pug/**/*pug', gulp.series('pug'))
    gulp.watch('src/static/stylus/**/*.styl', gulp.series('stylus'))
})

gulp.task('default',gulp.series(
    gulp.parallel('pug','stylus'),
    'watch'
));