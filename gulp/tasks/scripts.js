module.exports = function () {
    $.gulp.task('scripts:lib',function () {
        return $.gulp.src(['node_modules/jquery/dist/jquery.min.js','node_modules/three/build/three.min.js','node_modules/three/examples/js/controls/OrbitControls.js'])

            .pipe($.gulpPlugins.concat('libs.min.js'))
            .pipe($.gulp.dest('build/static/js/'))
            .pipe($.browserSync.reload({
                stream: true
            }));

    });

    $.gulp.task('scripts',function () {
        return $.gulp.src(['src/static/js/main.js','src/static/js/three/three_main.js'])

            .pipe($.gulpPlugins.concat('main.min.js'))
            .pipe($.gulp.dest('build/static/js/'))
            .pipe($.browserSync.reload({
                stream: true
            }));
    });
}