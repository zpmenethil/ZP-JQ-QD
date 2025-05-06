// // import { task, src as _src, dest as _dest, series } from 'gulp';
// // import plumber from 'gulp-plumber';
// // import fileInclude from 'gulp-file-include';

// // const onError = function (err) {
// // 	console.error(err);
// // 	this.emit('end');
// // };

// // const paths = {
// // 	html: {
// // 		src: 'src/html/',
// // 		dest: 'build/',
// // 	},
// // };

// // task('html', function () {
// // 	return _src(paths.html.src + 'index.html')
// // 		.pipe(plumber({ errorHandler: onError }))
// // 		.pipe(
// // 			fileInclude({
// // 				prefix: '@@',
// // 				basepath: paths.html.src,
// // 			})
// // 		)
// // 		.pipe(_dest(paths.html.dest));
// // });

// // task('build', series('html'));
// // task('default', series('build'));
// // gulpfile.js
// //
// // 
// import { task, src as _src, dest as _dest, series, watch } from 'gulp';
// import plumber from 'gulp-plumber';
// import fileInclude from 'gulp-file-include';
// import browserSync from 'browser-sync';

// const server = browserSync.create();

// const onError = function (err) {
//     console.error(err);
//     this.emit('end');
// };

// const paths = {
//     html: {
//         src: 'src/html/',
//         dest: 'build/',
//     }
// };

// // HTML Processing Task
// task('html', function () {
//     return _src(paths.html.src + 'index.html')
//         .pipe(plumber({ errorHandler: onError }))
//         .pipe(
//             fileInclude({
//                 prefix: '@@',
//                 basepath: paths.html.src,
//             })
//         )
//         .pipe(_dest(paths.html.dest));
// });

// // Copy assets (if you have any)
// task('assets', function() {
//     return _src(paths.assets.src)
//         .pipe(_dest(paths.assets.dest));
// });

// // Browser Sync Init task
// task('browserSync', function(done) {
//     server.init({
//         server: {
//             baseDir: paths.html.dest
//         },
//         port: 3000,
//         open: true,
//         notify: false
//     });
//     done();
// });

// // Browser Sync Reload task
// task('browserSyncReload', function(done) {
//     server.reload();
//     done();
// });

// // Watch task
// task('watch', function() {
//     // Watch HTML files
//     watch(paths.html.src + '**/*.html', series('html', 'browserSyncReload'));
// });

// // Build task
// task('build', series('html'));

// // Default task - build and serve with watchers
// task('default', series('build', 'browserSync', 'watch'));
// //
// //
import { task, src as _src, dest as _dest, series, watch } from 'gulp';
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
        src: 'src/css/**/*.css',
        dest: 'build/css/'
    },
    js: {
        // Watch the built JS files, not the source files
        watch: 'build/js/**/*.js',
    }
};

// HTML Processing Task
task('html', function () {
    return _src(paths.html.src + 'index.html')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(
            fileInclude({
                prefix: '@@',
                basepath: paths.html.src,
            })
        )
        .pipe(_dest(paths.html.dest));
});

// CSS Processing Task
task('css', function() {
    return _src(paths.css.src)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(_dest(paths.css.dest));
});

// Browser Sync Init task
task('browserSync', function(done) {
    server.init({
        server: {
            baseDir: paths.html.dest
        },
        port: 3000,
        open: true,
        notify: false
    });
    done();
});

// Browser Sync Reload task
task('browserSyncReload', function(done) {
    server.reload();
    done();
});

// Watch task
task('watch', function() {
    // Watch HTML files
    watch(paths.html.src + '**/*.html', series('html', 'browserSyncReload'));
    
    // Watch CSS files
    watch(paths.css.src, series('css', 'browserSyncReload'));
    
    // Watch built JS files (created by webpack in the other terminal)
    watch(paths.js.watch, series('browserSyncReload'));
});

// Build task (without JS - that's handled by webpack)
task('build', series('html', 'css'));

// Default task - build and serve with watchers
task('default', series('build', 'browserSync', 'watch'));