
var gulp      = require('gulp'),
	inline    = require('gulp-inline'),
	inlineCss = require('gulp-inline-css')
	zip       = require('gulp-zip'),
	minify    = require('gulp-minify-css'),
	htmllint  = require('gulp-htmllint'),
	csslint   = require('gulp-csslint'),
	compass   = require('gulp-compass');


function handleError(err) {
	this.emit('end');
}

gulp.task('htmllint', function () {
	return gulp.src('src/email.html')
		.pipe(htmllint('.htmllintrc'));
});

gulp.task('csslint', ['compile-compass'], function () {
	return gulp.src('src/style.css')
		.pipe(csslint('.csslintrc'))
		.pipe(csslint.reporter());
});

gulp.task('copy', function () {
	return gulp.src('src/images/**/*')
		.pipe(gulp.dest('build/images'));
});

gulp.task('compile-compass', function() {
	return gulp.src('src/*.scss')
		.pipe(compass({
			css: 'src',
			sass: 'src',
			image: 'src'
		}))
		.on('error', handleError);
});

gulp.task('compile', ['htmllint', 'csslint'], function () {
	return gulp.src('src/email.html')
		.pipe(inline({
			css: minify,
			base: 'src/',
			disabledTypes: ['svg', 'img', 'js'],
			ignore: ['editable.css']
		}))
		.pipe(inlineCss({
			removeLinkTags: false,
			removeStyleTags: false,
			applyStyleTags: true,
			applyLinkTags: false
		}))
		.pipe(inline({
			css: minify,
			base: 'src/',
			disabledTypes: ['svg', 'img', 'js'],
			ignore: ['main.css']
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
	gulp.watch('src/*.scss', ['compile-compass']);
});

gulp.task('build', [
	'zip',
]);

gulp.task('default', [
	'build',
]);
