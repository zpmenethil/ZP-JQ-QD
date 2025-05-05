const gulp = require('gulp');
const plumber = require('gulp-plumber');
// Removed browserSync import
const fileInclude = require('gulp-file-include');

// Error handling
const onError = function (err) {
	console.error(err);
	this.emit('end');
};

// Define paths (only HTML now)
const paths = {
	html: {
		src: 'src/html/',
		dest: 'build/'
	}
};

// HTML task - combine partials
gulp.task('html', function () {
	return gulp
		.src(paths.html.src + 'index.html')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: paths.html.src
			})
		)
		.pipe(gulp.dest(paths.html.dest));
});

gulp.task('build', gulp.series('html'));
gulp.task('default', gulp.series('build'));
