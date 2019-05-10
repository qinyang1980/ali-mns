const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const GitVersionJson = require('git-version-json');

gulp.task('build', ['tsc'], () => {
  gulp
    .src('./dist/GA.js')
    .pipe(header('const gitVersion = ${version};\n', { version: GitVersionJson.getGitVerStr() }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('tsc', shell.task(['tsc']));
gulp.task('default', ['build']);
