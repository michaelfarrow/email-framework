
var gulp      = require('gulp'),
    inline    = require('gulp-inline'),
    inlineCss = require('gulp-inline-css')
    zip       = require('gulp-zip'),
    minify    = require('gulp-minify-css'),
    htmllint  = require('gulp-htmllint'),
    csslint   = require('gulp-csslint');


gulp.task('htmllint', function () {
	return gulp.src('src/email.html')
		.pipe(htmllint('.htmllintrc'));
});

gulp.task('csslint', function () {
	return gulp.src('src/style.css')
		.pipe(csslint('.csslintrc'))
		.pipe(csslint.reporter());
});

gulp.task('copy', function () {
	return gulp.src('src/images/**/*')
		.pipe(gulp.dest('build/images'));
});

gulp.task('compile', ['htmllint', 'csslint'], function () {
	return gulp.src('src/email.html')
		.pipe(inline({
			base: 'src/',
			css: minify(),
			disabledTypes: ['svg', 'img', 'js']
		}))
		.pipe(inlineCss({
			removeStyleTags: false
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('zip', ['copy', 'compile'], function () {
	return gulp.src([
			'build/**/*',
			'!build/build.zip',
			'!build/build/**/*',
			'!build/build/'
		], { base_dir: 'build' })
		.pipe(zip('build.zip'))
		.pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
	gulp.watch('src/*.html', ['htmllint']);
	gulp.watch('src/*.css', ['csslint']);
});

gulp.task('build', [
	'zip',
]);

gulp.task('default', [
	'build',
]);
