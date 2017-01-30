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


// TODO ENV variable
const env = process.env.NODE_ENV;
env ? console.log(env) : console.log('=> process.env.NODE_ENV - not found');

const dir = {
    source: 'src',
    root: 'app'
};

const sassPaths = {
    src: `${dir.source}/sass/styles.scss`,
    dest: `${dir.root}/styles/`
};

const watch = () => {
    return compile(true);
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
        // TODO detect why it emptys bower_components folder
        // .pipe(order([
        //     "*angular*",
        //     "*angular-route*",
        //     "*angular-loader*",
        //     "*angular-mocks*"
        // ]))
        .pipe(concat('vendors.min.js'))
        // .pipe(uglify()) // TODO if prod only
        .pipe(gulp.dest(dir.root + '/scripts/'));
});

gulp.task('js', () => {
    let bundler = watchify(browserify(dir.source + '/index.js', { debug: true }).transform(babel));

    let rebundle = () => {
        bundler.bundle()
            .on('error', (err) => {console.log(err); this.emit('end')})
            .pipe(source('app.min.js'))
            .pipe(buffer())
            // .pipe(uglify()) // TODO if prod only
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(dir.root + '/scripts/'));
    };

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();

});

gulp.task('html',() => {
    gulp.src(dir.source + '/**/*.html')
        .pipe(gulp.dest(dir.root));
});

gulp.task('watch', () => {
    gulp.watch(dir.source + '/sass/**/*.scss', ['sass']);
    gulp.watch(dir.root + '/**/*', ['livereload']);
});

gulp.task('default', ['connect', 'watch', 'bower', 'html', 'sass', 'js' ]);