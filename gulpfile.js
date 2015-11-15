"use strict";

let gulp = require("gulp"),
    path = require("path"),
    config = require("./scripts/config"),
    less = require("gulp-less"),
    minifyCss = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    posts = require("./scripts/posts"),
    pages = require("./scripts/pages"),
    livereload = require("gulp-livereload"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify");

const POSTS_PATH = path.resolve(config.location.source, config.location.posts) + "/**/*.md",
      PAGES_PATH = `${config.location.source}/**/*.html`;

gulp.task("default", ["css", "posts", "pages"]);

gulp.task("css", function() {
    return gulp.src("./src/_less/main.less")
        .pipe(less())
        .pipe(minifyCss({
            compatibility: '*,-units.pt,-units.pc'
        }))
        .pipe(rename({
            basename: "styles"
        }))
        .pipe(gulp.dest("./public/assets"))
        .pipe(livereload({start: false}));
});

gulp.task("js", function() {
    return gulp.src("./src/_js/main.js")
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest("./public/assets"))
        .pipe(livereload({start: false}));
});

gulp.task("posts", function() {
    return gulp.src(POSTS_PATH)
        .pipe(posts(config))
        .pipe(gulp.dest(config.location.destination))
        .pipe(livereload({start: false}));
});

gulp.task("pages", function() {
    return gulp.src(PAGES_PATH)
        .pipe(pages(config))
        .pipe(gulp.dest(config.location.destination))
        .pipe(livereload({start: false}));
});

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(POSTS_PATH, ["posts"]);
    gulp.watch(PAGES_PATH, ["pages"]);
    gulp.watch("./src/_less/**/*.less", ["css"]);
});
