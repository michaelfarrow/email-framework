
var gulp      = require('gulp'),
    inline    = require('gulp-inline'),
    inlineCss = require('gulp-inline-css')
    zip       = require('gulp-zip'),
    minify    = require('gulp-minify-css');


gulp.task('copy', function () {
	return gulp.src('src/images/**/*')
		.pipe(gulp.dest('build/images'));
});

gulp.task('compile', function () {
	return gulp.src('src/email.html')
		.pipe(inline({
			base: 'src/',
			css: minify()
		}))
		.pipe(inlineCss({
			removeStyleTags: false
		}))
		.pipe(gulp.dest('build/'));
});

gulp.task('zip', ['copy', 'compile'], function () {
	return gulp.src([
			'build/*',
			'!build/build.zip'
		], { base_dir: 'build' })
		.pipe(zip('build.zip'))
		.pipe(gulp.dest('build'));
});

gulp.task('build', [
	'zip',
]);

gulp.task('default', [
	'build',
]);
