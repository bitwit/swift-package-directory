const gulp = require('gulp');
const babel = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');

gulp.task('styles', () => {
	return gulp.src(['./scss/bootstrap.scss', './scss/style.scss'])
		.pipe(sass().on('error', sass.logError))
		// .pipe(concat('style.css'))
		.pipe(gulp.dest('./public/css'))
});

gulp.task('js', () => {
	return browserify('js/app.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['env','react']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulp.dest('public/js'))
		.pipe(reload({stream:true}));
});

gulp.task('bs', () => {
	return browserSync.init({
		server: {
			baseDir: './public'
		}
	});
});

gulp.task('default', ['bs','js','styles'], () => {
	gulp.watch('js/**/*.js',['js']);
	gulp.watch('css/**/*.scss',['styles']);
	gulp.watch('./public/css/style.css',reload);
});

gulp.task('build', ['js','styles']);
