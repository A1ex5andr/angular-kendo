var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var source = 'src';
var dest = 'app';

gulp.task('connect', function () {
    connect.server({
        root: dest,
        livereload: true
    })
});

gulp.task('sass', function () {
    return gulp.src(source + '/sass/*.scss')
        .pipe(sass({errLogConsole: true}))
        .pipe(gulp.dest(dest + '/styles/'))
});

gulp.task('livereload', function () {
    gulp.src(dest + '/**/*')
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(source + '/sass/**/*.scss', ['sass']);
    gulp.watch(dest + '/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'sass']);