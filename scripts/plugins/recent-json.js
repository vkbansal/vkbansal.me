"use strict";

let path = require("path"),
    utils = require("../utils");

module.exports = function({posts, options, add}) {
    let recent = posts.slice(0, options.posts.limit)
        .map((post) => ({
            permalink: post.permalink,
            title: post.title,
            description: post.description,
            date: post.date.format("MMMM Do, YYYY"),
            tags: post.tag
        }));

    add(
        utils.createNewFile(
            path.join(...options.posts.index.split("/"), "recent.json"),
            JSON.stringify(recent, null, 2)
        )
    );
};
