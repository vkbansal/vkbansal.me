"use strict";

let path = require("path");

let gulp = require("gulp"),
    less = require("gulp-less"),
    minifyCss = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    livereload = require("gulp-livereload"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify");

let config = require("./config"),
    build = require("./scripts/build"),
    plugins = require("./scripts/plugins"),
    handleErrors = require("./scripts/utils/gulp-handle-errors");

const POSTS_PATH = path.resolve(config.location.source, config.location.posts) + "/**/*.md",
      PAGES_PATH = `${config.location.source}/**/*.html`;

gulp.task("default", ["css", "posts", "pages"]);

gulp.task("css", function() {
    return gulp.src("./src/_less/main.less")
        .pipe(less()).on("error", handleErrors)
        .pipe(minifyCss({
            compatibility: '*,-units.pt,-units.pc'
        })).on("error", handleErrors)
        .pipe(rename({
            basename: "styles"
        }))
        .pipe(gulp.dest("./public/assets"))
        .pipe(livereload({start: false}));
});

gulp.task("js", function() {
    return gulp.src("./src/_js/main.js")
        .pipe(babel()).on("error", handleErrors)
        .pipe(uglify()).on("error", handleErrors)
        .pipe(gulp.dest("./public/assets"))
        .pipe(livereload({start: false}));
});

gulp.task("posts", function() {
    return gulp.src(POSTS_PATH)
        .pipe(build.posts(config, [
            plugins.postsList,
            plugins.recentJson,
            plugins.rss,
            plugins.tags
        ])).on("error", handleErrors)
        .pipe(gulp.dest(config.location.destination))
        .pipe(livereload({start: false}));
});

gulp.task("pages", function() {
    return gulp.src(PAGES_PATH)
        .pipe(build.pages(config)).on("error", handleErrors)
        .pipe(gulp.dest(config.location.destination))
        .pipe(livereload({start: false}));
});

gulp.task("navicons", function() {
    return gulp.src("./src/_img/navicons/*.svg")
        .pipe(build.svgSprite({
            name: "navicons.svg",
            id: "navicon-:basename"
        }))
        .pipe(gulp.dest("./src/_includes/"));
});

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch(POSTS_PATH, ["posts"]);
    gulp.watch(PAGES_PATH, ["pages", "posts"]);
    gulp.watch("./src/_less/**/*.less", ["css"]);
});
