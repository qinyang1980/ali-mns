const gulp = require('gulp');
const shell = require('gulp-shell');
const gulp_tslint = require('gulp-tslint');
const header = require('gulp-header');
const GitVersionJson = require('git-version-json');

gulp.task('build', ['tslint', 'tsc'], () => {
  gulp
    .src('./dist/GA.js')
    .pipe(header('const gitVersion = ${version};\n', { version: GitVersionJson.getGitVerStr() }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('tslint', () => {
  return gulp
    .src(['./src/**/*.ts', '!**/*.d.ts', '!node_modules/**'])
    .pipe(
      gulp_tslint({
        formatter: 'verbose',
      }),
    )
    .pipe(
      gulp_tslint.report({
        emitError: true,
        summarizeFailureOutput: true,
      }),
    );
});

gulp.task('tsc', shell.task(['tsc']));
gulp.task('default', ['build']);
