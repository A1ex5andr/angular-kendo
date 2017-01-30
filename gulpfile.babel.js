import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import connect from 'gulp-connect';
import concat from 'gulp-concat';
import order from 'gulp-order';
import uglify from 'gulp-uglify';
import bower from 'main-bower-files';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import watchify from 'watchify';
import babel from 'babelify';

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

gulp.task('bower', () => {
    gulp.src(bower({
        paths: {
            bowerJson: 'bower.json',
            bowerDirectory: 'bower_components'
        }
    }))
        .pipe(order([
            "*angular*",
            "*angular-route*",
            "*angular-loader*",
            "*angular-mocks*"
        ]))
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dir.root + '/scripts/'));
});

gulp.task('js', () => {
    let bundler = watchify(browserify(dir.source + '/index.js', { debug: true }).transform(babel));

    function rebundle() {
        bundler.bundle()
            .on('error', (err) => {console.log(err); this.emit('end')})
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dir.root + '/scripts/'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();

});
function watch() {
    return compile(true);
};

gulp.task('watch', () => {
    gulp.watch(dir.source + '/sass/**/*.scss', ['sass']);
    gulp.watch(dir.root + '/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'js', 'bower', 'sass']);