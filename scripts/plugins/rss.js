"use strict";

let RSS = require("rss"),
    utils = require("../utils");

module.exports = function(posts, options, add) {
    if (!options.posts.feed) return;

    let feedOptions = {
        title: options.site.title,
        description: options.site.description,
        feed_url: options.site.base_url.replace(/\/$/, "") + "/feed.xml",
        site_url: options.site.base_url
    };

    let feed = new RSS(feedOptions);

    add(
        utils.createNewFile(
            "feed.xml",
            feed.xml()
        )
    );
};
