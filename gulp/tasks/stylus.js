module.exports = function () {
    $.gulp.task('stylus',function () {
        return $.gulp.src('src/static/stylus/main.styl')
            .pipe($.gulpPlugins.sourcemaps.init())
            .pipe($.gulpPlugins.stylus({
                compress: true
            }))
            .pipe($.gulpPlugins.autoprefixer({
                browsers: ['last 10 versions']
            }))
            .on("error", $.gulpPlugins.notify.onError({
                title: "style"
            }))
            .pipe($.gulpPlugins.csso())
            .pipe($.gulpPlugins.sourcemaps.write())
            .pipe($.gulp.dest('build/static/css/'))
            .on('end', $.browserSync.reload);
    });
}