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

gulp.task('copyFonts', () => {
	return gulp.src('./src/fonts/**/**')
		.pipe(gulp.dest('./public/fonts'))
});

gulp.task('copyImages', () => {
	return gulp.src('./src/images/**/**')
		.pipe(gulp.dest('./public/images'))
});

gulp.task('copyHTML', () => {
	return gulp.src('./src/**.html')
		.pipe(gulp.dest('./public'))
});

gulp.task('copyJSLibs', () => {
	return gulp.src(['./src/js/**.js', '!./src/js/main.js'])
		.pipe(gulp.dest('./public/js'))
});

gulp.task('styles', () => {
	return gulp.src(['./src/scss/bootstrap.scss', './src/scss/style.scss'])
		.pipe(sass().on('error', sass.logError))
		// .pipe(concat('style.css'))
		.pipe(gulp.dest('./public/css'))
});

gulp.task('js', () => {
	return browserify('./src/js/main.js', {debug: true})
		.transform('babelify', {
			sourceMaps: true,
			presets: ['env','react']
		})
		.bundle()
		.on('error',notify.onError({
			message: "Error: <%= error.message %>",
			title: 'Error in JS 💀'
		}))
		.pipe(source('main.js'))
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

gulp.task('default', ['bs', 'build'], () => {
	gulp.watch('./src/**.html',['copyHTML']);
	gulp.watch('./src/js/**/*.js',['js']);
	gulp.watch('./src/css/**/*.scss',['styles']);

	gulp.watch('./public/css/style.css',reload);
	gulp.watch('./public/*.html',reload);
});

gulp.task('build', ['js','styles', 'copyFonts', 'copyImages', 'copyHTML', 'copyJSLibs']);
