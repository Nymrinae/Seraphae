import gulp from 'gulp'
import gulpTS from 'gulp-typescript'
import gulpSourcemaps from 'gulp-sourcemaps'
import gulpNodemon from 'gulp-nodemon'
import gulpCached from 'gulp-cached'

const project = gulpTS.createProject('tsconfig.json')

gulp.task('build', () => {
    const tsCompile = gulp.src('./src/**/*.ts')
        .pipe(gulpCached('./build/'))
        .pipe(gulpSourcemaps.init())
        .pipe(project())

    tsCompile.dts.pipe(gulp.dest('./build/'))

    return tsCompile.js
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest('./build/'))
});

gulp.task('watch', gulp.series(['build'], () => {
    gulp.watch('./src/**/*.ts', gulp.series(['build']));
}));

gulp.task('start',gulp.series(['build'], () => {
    return gulpNodemon({
        script: './build/index.js',
        watch: './build/index.js'
    });
}));

gulp.task('dev', gulp.parallel(['watch'], () => {
    return gulpNodemon({
        script: './build/index.js',
        watch: './build/'
    })
}));
