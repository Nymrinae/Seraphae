import gulp from 'gulp'
import gulpTS from 'gulp-typescript'
import gulpSourcemaps from 'gulp-sourcemaps'
import gulpNodemon from 'gulp-nodemon'
import gulpChanged from 'gulp-changed'

import del from 'del';
import path from 'path';

const project = gulpTS.createProject("tsconfig.json");

gulp.task('build', () => {
    del.sync(['./build/**/*.*']);
    const tsCompile = gulp.src('./src/**/*.ts')
        .pipe(gulpSourcemaps.init())
        .pipe(project());

    return tsCompile.js.pipe(gulpSourcemaps.write({
        sourceRoot: file => path.relative(path.join(file.cwd, file.path), file.base)
    }))
    .pipe(gulp.dest('./build/'));
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

gulp.task('serve', gulp.parallel(['watch'], () => {
    return gulpNodemon({
        script: './build/index.js',
        watch: './build/'
    })
}));
