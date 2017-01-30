import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import connect from 'gulp-connect';

const dir = {
    source: 'src',
    root: 'app'
};

const sassPaths = {
    src: `${dir.source}/sass/styles.scss`,
    dest: `${dir.root}/styles/`
};

gulp.task('connect', () => {
    connect.server({
        root: dir.root,
        livereload: true
    })
});

gulp.task('sass', () => {
    return gulp.src(sassPaths.src)
        .pipe(sourcemaps.init())
        .pipe(sass({errLogConsole: true}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(sassPaths.dest));
});

gulp.task('livereload', () => {
    gulp.src(dir.root + '/**/*')
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(dir.source + '/sass/**/*.scss', ['sass']);
    gulp.watch(dir.root + '/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'sass']);