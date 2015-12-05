"use strict";

let path = require("path"),
    _ = require("lodash"),
    utils = require("../utils");

module.exports = function({posts, options, add}) {
    let recent = posts.slice(0, options.posts.limit)
        .map((post) => _.pick(post, ["title", "permalink"]));

    add(
        utils.createNewFile(
            path.join(...options.posts.index.split("/"), "recent.json"),
            JSON.stringify(recent, null, 2)
        )
    );
};
