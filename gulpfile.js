"use strict";

require("dotenv").load();

let path = require("path");

let gulp = require("gulp"),
    del = require("del"),
    less = require("gulp-less"),
    cleanCss = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    livereload = require("gulp-livereload"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify");

let build = require("./scripts/build"),
    handleErrors = require("./scripts/utils/gulp-handle-errors");

const POSTS_IN_PATH = "src/_posts/**/*.md",
      PAGES_IN_PATH = ["src/**/*.md", "!_*/**/.md"],
      PAGES_OUT_PATH = "public",
      POSTS_OUT_PATH = `${PAGES_OUT_PATH}/blog`;

gulp.task("default", ["css", "js", "posts", "pages", "navicons", "include"]);

gulp.task("clean", function() {
    return del([
        "public/**/*",
        "!public/.gitkeep"
    ]);
});

gulp.task("include", function() {
    return gulp.src("./include/**/*.*")
        .pipe(gulp.dest("./public"));
});

gulp.task("css", function() {
    return gulp.src("./src/_less/main.less")
        .pipe(less()).on("error", handleErrors)
        .pipe(cleanCss({
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

gulp.task("post_assets", function() {
    let PATH = "src/_posts";

    return gulp.src([`${PATH}/**/*.*`, `!${PATH}/**/*.md`])
        .pipe(gulp.dest(POSTS_OUT_PATH));
});

gulp.task("posts", ["post_assets"], function() {
    return gulp.src(POSTS_IN_PATH)
        .pipe(build.posts())
        .on("error", handleErrors)
        .pipe(gulp.dest(POSTS_OUT_PATH))
        .pipe(livereload({start: false}));
});

gulp.task("pages", function() {
    return gulp.src(PAGES_IN_PATH)
        .pipe(build.pages()).on("error", handleErrors)
        .pipe(gulp.dest(PAGES_OUT_PATH))
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
    gulp.watch(POSTS_IN_PATH, ["posts"]);
    gulp.watch(PAGES_IN_PATH, ["pages", "posts"]);
    gulp.watch("./src/_less/**/*.less", ["css"]);
});
