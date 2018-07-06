module.exports = function () {
    $.gulp.task('server', function() {
        $.browserSync.init({
            server: {
                baseDir: "./build"
            }
        });
        $.browserSync.watch('build',$.browserSync.reload)
    });
}