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
        permalink: "/posts/:title",
        pretty: true,
        layout: "article.html",
        pagination_dir: "",
        limit: 10,
        feed: false
    },
    format: {
        date: "YYYY-MM-DD",
        time: "HH:mm:ss"
    },
    server: {
        host: "localhost",
        port: "4000"
    }
};

module.exports = config;
