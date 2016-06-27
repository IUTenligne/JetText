'use strict';
 
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    shell = require('gulp-shell'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    plumber = require('gulp-plumber'),
		sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    react = require('gulp-react'),
    uglify = require('gulp-uglify'),
    reactify = require('reactify');
 
gulp.task('sass', function () {
  gulp.src('./frontend/stylesheets/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
      .on('error', function(){
        gutil.log(gutil.colors.red('（ ﾟДﾟ） Aaargh, something bad happened !'));
      })
    )
    .pipe(concat("main.css"))
    .pipe(gulp.dest('./app/assets/stylesheets'))
    .on('end', function() { 
      gutil.log(gutil.colors.magenta('ʕ•ᴥ•ʔ ') + gutil.colors.green(' CSS generated !'))
    });
});

gulp.task('editor', function () {
  gulp.src('./frontend/stylesheets/editor/*.scss')
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
      .on('error', function(){
        gutil.log(gutil.colors.red('（ ﾟДﾟ） Aaargh, something bad happened !'));
      })
    )
    .pipe(concat("main.css"))
    .pipe(gulp.dest('./app/assets/stylesheets'))
    .on('end', function() { 
      gutil.log(gutil.colors.magenta('ʕ•ᴥ•ʔ ') + gutil.colors.green(' CSS generated !'))
    });
});

gulp.task('template', function () {
  gulp.src('./frontend/templates/template.scss')
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
      .on('error', function(){
        gutil.log(gutil.colors.red(' ( ⓛ ω ⓛ ) not good'));
      })
    )
    .pipe(concat("template.css"))
    .pipe(gulp.dest('./public/templates/iutenligne/assets/css'))
    .on('end', function() { 
      gutil.log(gutil.colors.green('/ᐠ｡ꞈ｡ᐟ\\') + gutil.colors.green(' CSS generated !'))
    });
});

gulp.task('template2', function () {
  gulp.src('./frontend/templates/template2.scss')
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError)
      .on('error', function(){
        gutil.log(gutil.colors.red(' ( ⓛ ω ⓛ ) not good'));
      })
    )
    .pipe(concat("template2.css"))
    .pipe(gulp.dest('./public/templates/iutenligne/assets/css'))
    .on('end', function() { 
      gutil.log(gutil.colors.green('/ᐠ｡ꞈ｡ᐟ\\') + gutil.colors.green(' CSS generated !'))
    });
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./frontend/stylesheets/**/*.scss', ['sass']);
});

gulp.task("es6", function () {
  var bundler = browserify('./frontend/javascripts/app.js').transform(babelify, {presets: ["es2015"]})
  return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./app/assets/javascripts'))
    .on('end', function() { 
      gutil.log(gutil.colors.magenta('༼ つ ◕_◕ ༽つ  Yeah !') + gutil.colors.green(' JS correctly generated !'));
    })
});

gulp.task('watch', function () {
  gulp.watch('./frontend/stylesheets/**/*.scss', ['sass']);
  gulp.watch('./frontend/stylesheets/editor/*.scss', ['editor']);
  gulp.watch('./frontend/templates/template.scss', ['template']);
  gulp.watch('./frontend/templates/template2.scss', ['template2']);
  gulp.watch('./frontend/javascripts/**/*.es6', ['js']);
  gulp.watch('./frontend/react/**/*.jsx', ['react']);
});

gulp.task('js:watch', function () {
  gulp.watch('./frontend/javascripts/**/*.es6', ['js']);
});

gulp.task('react:watch', function () {
  gulp.watch('./frontend/react/**/*.js', ['react']);
  gulp.watch('./frontend/react/**/*.jsx', ['react']);
});

gulp.task("js", function () {
  return gulp.src("./frontend/javascripts/**/*.es6")
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./app/assets/javascripts/"))
    .on('end', function() { 
      gutil.log(gutil.colors.magenta('༼ つ ◕_◕ ༽つ  Yeah !') + gutil.colors.green(' JS correctly generated !'));
    });
});

gulp.task("react", function () {
  var bundler = browserify('./frontend/react/app.js').transform(babelify, {presets: ["es2015", "react"]})
  return bundler.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(concat("main.js"))
    //.pipe(sourcemaps.write("."))
    //.pipe(uglify())
    .pipe(gulp.dest("./app/assets/javascripts/"));
});