"use strict";

let gulp = require("gulp"),
    stylus = require("gulp-stylus"),
    minifyCss = require("gulp-minify-css"),
    posts = require("./scripts/posts");

gulp.task("css", function() {
    return gulp.src("./src/_styl/main.styl")
        .pipe(stylus())
        .pipe(minifyCss())
        .pipe(gulp.dest("./public/css/"));
});

gulp.task("posts", function() {
    return gulp.src("./src/_posts/**/*.md")
        .pipe(posts());
});
