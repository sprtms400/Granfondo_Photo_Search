import gulp from 'gulp'
import ts from 'gulp-typescript' // Typescript 코드에 gulp를 이용하기위한 패키지
import { deleteAsync } from 'del'

const tsProject = ts.createProject('tsconfig.json')


gulp.task('bulid-src', () => {
    const tsProject = ts.createProject('./tscondig.json')
    return gulp.src(['server.ts', './src/**/*.ts'])
    .pipe(tsProject()).js
    .pipe(gulp.dest('./dist'));
})

gulp.task('build-src-ts', () => {
    const tsProject = ts.createProject('./tsconfig.json');
    return tsProject.src()
})

/**
 * Clean up build directory
 */
gulp.task('clean', () => {
    return deleteAsync(['./dist']);
})