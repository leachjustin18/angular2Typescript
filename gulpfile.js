var gulp = require('gulp');
var server = require('gulp-server-livereload');
var ts = require('gulp-typescript');
var watch = require('gulp-watch');
var merge = require('merge2');
var clean = require('gulp-dest-clean');

//Type script options
var tsProject = ts.createProject({
    module: "system",
    sourceMap: true,
    noImplicitAny: true,
    experimentalDecorators: true
});

//Watch tasks we use.  Put them in own array for DRY principle.
var watchTasks = ['cleanDev', 'scripts', 'moveHTML'];

//Web server: https://www.npmjs.com/package/gulp-server-livereload/
gulp.task('webserver', function () {
    gulp.src('')
        .pipe(server({
            livereload: true,
            open: true,
            directoryListing: true
        }));
});

//Move html into dev
gulp.task('moveHTML', function () {
    return gulp.src('app/**/*html')

        .pipe(gulp.dest('dev'))
});


//Compile TS into JS and move files into dev.  Also have definitions
gulp.task('scripts', function () {
    var tsResult = gulp.src('app/**/**.ts')
        .pipe(ts(tsProject));

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest('dev/definations')),
        tsResult.js.pipe(gulp.dest('dev'))
    ]);
});

gulp.task('cleanDev', function () {
    return gulp.src('dev')
        .pipe(clean('dev'));
});

//Watch files
gulp.task('watch', ['scripts', 'moveHTML', 'cleanDev'], function () {
    gulp.watch('app/**/**.ts', watchTasks);
    gulp.watch('app/**/*.html', watchTasks);
});




//Serve 
gulp.task('serve', ['watch', 'webserver'], function () {

});