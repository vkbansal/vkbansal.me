"use strict";

let config = require("./config"),
    fs = require("fs"),
    path = require("path"),
    glob = require("glob"),
    fm = require("front-matter");

const posts_dir = path.resolve(process.cwd(), config.location.posts);

/**
 * Load posts from "_posts"
 */
let posts = glob.sync("*.md", {cwd: posts_dir })
    .reverse()
    .map(function(file) {
        let post = fm(fs.readFileSync(path.resolve(posts_dir, file), "utf8"));
        post.file = {
            name: file,
            date: file.substring(0, 10),
            title: file.substring(11).substring(0, file.length - 14)
        };
        return post;
    });

module.exports = posts;
