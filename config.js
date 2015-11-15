"use strict"
// use relative paths
// names starting with _ will be ignored (for pages/posts)
let config = {
    location: {
        // source: "src",
        // destination: "public",
        // layouts: "_layouts",
        // posts: "_posts"
    },
    site: {
        title: "V.K.Bansal",
        subtitle: "",
        description: "",
        author: "",
        baseUrl: "http://vkbansal.me/"
    },
    posts: {
        permalink: "/blog/:title",
        pretty: true,
        layout: "article.html",
        index: "/blog",
        pagination_dir: "/blog/page/:num",
        pagination_layout: "blog.html",
        limit: 3,
        feed: false
    },
    server: {
        host: "localhost",
        port: "4000"
    }
};

module.exports = config;
