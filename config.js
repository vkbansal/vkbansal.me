"use strict"

module.exports = {
// use relative paths
// names starting with _ will be ignored (for pages/posts)
    location: {
        source: "src",
        destination: "public",
        layouts: "_layouts",
        posts: "_posts"
    },
    site: {
        title: "V.K.Bansal",
        subtitle: "",
        description: "",
        author: {
            name: "Vivek Kumar Bansal",
            email: "contact@vkbansal.me"
        },
        base_url: "http://vkbansal.me/",
        pretty_url: true
    },
    posts: {
        permalink: "/blog/:title",
        layout: "article.html",
        index: "/blog",
        pagination_dir: "/blog/page/:num",
        pagination_layout: "blog.html",
        limit: 3,
        feed: true,
        feed_limit: 15
    },
    format: {
        date: "YYYY-MM-DD",
        time: "HH:mm:ss"
    },
    server: {
        host: "localhost",
        port: "4000",
        protocol: "http"
    }
};
