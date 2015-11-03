"use strict"
// use relative paths
// names starting with _ will be ignored (for pages/posts)
let config = {
    // location: {
    //     source: "src",
    //     destination: "public",
    //     layouts: "src/_layouts",
    //     posts: "src/_posts"
    // },
    site: {
        title: "V.K.Bansal",
        subtitle: "",
        description: "",
        author: "",
        baseUrl: "http://vkbansal.me/"
    },
    posts: {
        permalink: "/posts/:title",
        limit: 10,
        pagination_dir: "",
        default_layout: "default.html"
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
