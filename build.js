"use strict";

let fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    mkdirp = require("mkdirp"),
    _ = require("lodash"),
    yml = require("yaml-js"),
    fm = require("front-matter"),
    nj = require("nunjucks"),
    md = require('markdown-it')({
        html: true
    });


_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

/**
 * Paths to various folders and files
 * @type Object
 */
const paths = {
    src:  path.join(__dirname, "src"),
    config: path.join(__dirname, "_config.yml"),
    posts: path.join(__dirname, "src", "_posts"),
    data: path.join(__dirname, "src", "_data")
};

nj.configure(paths.src, { watch: false });

/**
 * Configuration from "_config.yml"
 * @type Object
 */
const config = yml.load(fs.readFileSync(paths.config, "utf8"));

/**
 * Data from ".yml" files from "_data" folder
 * @type Object
 */
// let siteData = _.transform(fs.readdirSync(paths.data), function(result, file) {
//     result[file] = yml.load(fs.readFileSync(path.join(paths.data, file), "utf8"));
// }, {});


/**
 * Load posts from "_posts"
 */
let posts = glob.sync("_posts/**/*.md", {cwd: paths.src }).reverse()
    .map(function(file) {
        let post = fm(fs.readFileSync(path.join(paths.src, file), "utf8"));
        post.content = md.render(post.body);
        delete post.body
        return post;
    });

_.each(posts, function(post) {
    let attributes = post.attributes,
        slug = attributes.slug,
        title = attributes.title,
        draft = attributes.draft;

    if (draft === true) {
        return;
    }

    let filePath = path.join(__dirname, config.output || "public", config.permalink, _.kebabCase(slug || title), "index.html");

    mkdirp.sync(path.dirname(filePath));
    fs.writeFileSync(filePath, nj.render("_layouts/article.html", post));
});

console.log(glob.sync("**/*.md", {
    cwd: paths.src,
    ignore: "_**/*.md"
}));

// console.log(glob.sync("**/*.html", {
//     cwd: paths.src,
//     ignore: "_**/*.html"
// }));
