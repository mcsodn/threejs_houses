module.exports = function () {
    $.gulp.task('img', function () {
        return $.gulp.src('src/static/img/**/*.{png,jpg,jpeg,gif}')
            .pipe($.gp.tinypng('v1ehPsZ-RHfMWp-99T2fDqP9gjP-1rNB'))
            .pipe($.gulp.dest('build/static/img/'));
    });
}