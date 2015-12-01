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

    posts.slice(0, options.posts.feed_limit).forEach((post) => {
        let itemOptions = {
            title: post.title,
            description: post.description,
            url: post.permalink,
            date: post.date.toDate()
        };

        feed.item(itemOptions);
    });

    add(
        utils.createNewFile(
            "feed.xml",
            feed.xml({indent: true})
        )
    );
};
