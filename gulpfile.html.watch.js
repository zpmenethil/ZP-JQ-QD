import { task, src, dest, series, watch } from 'gulp';
import plumber from 'gulp-plumber';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';

const server = browserSync.create();

const onError = function (err) {
	console.error(err);
	this.emit('end');
};

const paths = {
	html: {
		src: 'src/html/',
		dest: 'build/',
	},
	css: {
		watch: 'build/css/**/*.css',
	},
	js: {
		watch: 'build/js/**/*.js',
	},
};

task('html', function () {
	return src(paths.html.src + 'index.html')
		.pipe(plumber({ errorHandler: onError }))
		.pipe(
			fileInclude({
				prefix: '@@',
				basepath: paths.html.src,
			})
		)
		.pipe(dest(paths.html.dest));
});

task('browserSync', function (done) {
	server.init({
		server: {
			baseDir: paths.html.dest,
		},
		port: 3000,
		open: true,
		notify: false,
	});
	done();
});

task('browserSyncReload', function (done) {
	server.reload();
	done();
});

task('watch', function () {
	watch(paths.html.src + '**/*.html', series('html', 'browserSyncReload'));
	watch(paths.css.watch, series('browserSyncReload'));
	watch(paths.js.watch, series('browserSyncReload'));
});

task('build', series('html'));

task('default', series('build', 'browserSync', 'watch'));
