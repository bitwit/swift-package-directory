const gulp = require('gulp');

gulp.task('default', function() {

    var gulp = require('gulp');
    var sass = require('gulp-sass');
    
    return gulp.src(['./scss/bootstrap.scss', './scss/style.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
    
});

gulp.task('sass:watch', function () {
    gulp.watch('scss/*.scss', ['default']);
});