"use strict";

var gulp = require("gulp"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  sourceMaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  cleanCSS = require("gulp-clean-css"),
  sass = require("gulp-sass"),
  del = require("del"),
  runSequence = require("run-sequence");

var distPath = "css/",
  path = {
    styles: {
      distFiles: distPath + "**/*.css",
      distMapFiles: distPath + "**/*.map",
      scss: "scss/**/*.scss"
    }
  };

/* gulp - styles */

gulp.task("scss:compile",
  function () {
    return gulp.src(path.styles.scss)
      .pipe(sass())
      .pipe(gulp.dest(distPath));
  });

gulp.task("styles:map",
  function () {
    return gulp.src([
        path.styles.distFiles,
        `!${path.styles.distFiles}`
      ])
      .pipe(sourceMaps.init())
      .pipe(sourceMaps.write("/"))
      .pipe(gulp.dest(distPath));
  });

gulp.task("styles:min",
  function () {
    return gulp.src([
        path.styles.distFiles,
        `!${path.styles.distFiles}`
      ])
      .pipe(rename({ suffix: ".min" }))      
      .pipe(cleanCSS({ level: { 1: { specialComments: 1 } } }))
      .pipe(gulp.dest(distPath));
  });

gulp.task("styles",
  function () {
    return runSequence(
      "scss:compile",
      "styles:map",
      "styles:min"
    );
  });

/* gulp - clean */

gulp.task("clean",
  function () {
    return del.sync([
      path.styles.distFiles,
      path.styles.distMapFiles
    ]);
  });

/* gulp - watch */

gulp.task("watch", ["scss:compile"],
  function () {
    gulp.watch([path.styles.scss],
      function () {
        return runSequence("styles");
      });
  });

/* gulp - build */

gulp.task("build",
  function () {
    return runSequence(["styles"]);
  });

gulp.task("default",
  function () {
    return runSequence(["styles"], "watch");
  });
  