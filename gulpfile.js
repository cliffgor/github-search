////allows us to run our app in the browser well////

var gulp = require('gulp');
var concat = require('gulp-concat');
var jsBrowserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');
var jshint = require('gulp-jshint')
var lib = require('bower-files')({
    "overrides": {
        "bootstrap": {
            "main": [
                "less/bootstrap.less",
                "dist/css/bootstrap.css",
                "dist/js/bootstrap.js"
            ]
        }
    }
});

var gulp = require('gulp');
var browserSync = require('browser-sync').create();


////it uses gulp.src to pull in all files used in the browser////
gulp.task('concatInterface', function() {
    return gulp.src(['./js/*-interface.js'])
        .pipe(concat('allConcat.js'))
        .pipe(gulp.dest('./tmp'));
});


////this calls the browserify function exported from the browserify package  modified to put all client-side JavaScript into one file before browserifying it.////
///this is an array of dipendancies///
gulp.task('jsBrowserify', ['concatInterface'], function() {
    return jsBrowserify({
            entries: ['./tmp/allConcat.js']
        })
        .bundle()
        .pipe(source('app.js'))
        .pipe(gulp.dest('./build/js'));
});


////task to minify app.js////
gulp.task("minifyScripts", ["jsBrowserify"], function() {
    return gulp.src("./build/js/app.js")
        .pipe(uglify())
        .pipe(gulp.dest("./build/js"));
});

////build task////
gulp.task("build", function() {
    if (buildProduction) {
        gulp.start('minifyScripts');
    } else {
        gulp.start('jsBrowserify');
    }
});

////task to delete paths in tmp and build file////
gulp.task("clean", function() {
    return del(['build', 'tmp']);
});



////a task that helps in debugging////
gulp.task('jshint', function() {
    return gulp.src(['js/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});




gulp.task('bowerJS', function() {
    return gulp.src(lib.ext('js').files)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});




gulp.task('bowerCSS', function() {
    return gulp.src(lib.ext('css').files)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./build/css'));
});


gulp.task('bower', ['bowerJS', 'bowerCSS']);



gulp.task("build", ['clean'], function() {
    if (buildProduction) {
        gulp.start('minifyScripts');
    } else {
        gulp.start('jsBrowserify');
        gulp.start('serve');
    }
    gulp.start('bower');
    // gulp.start('cssBuild');

});



gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });
});



// This is an array of file names that  gulp to keeps an eye on//
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    // this is an array of tasks to run whenever any of the aforementioned files change. //
    gulp.watch(['js/*.js'], ['jsBuild']);
});

// This task lists an array of dependency tasks that need to be run whenever any of the js files change//
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function() {
    browserSync.reload();
});



gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    gulp.watch(['js/*.js'], ['jsBuild']);
    gulp.watch(['bower.json'], ['bowerBuild']);

});



gulp.task('bowerBuild', ['bower'], function() {
    browserSync.reload();
});



// to keep track of more than one html//
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    gulp.watch(['js/*.js'], ['jsBuild']);
    gulp.watch(['bower.json'], ['bowerBuild']);
    gulp.watch(['*.html'], ['htmlBuild']);
});

gulp.task('htmlBuild', function() {
    browserSync.reload();
});
