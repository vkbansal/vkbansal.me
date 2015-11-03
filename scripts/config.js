"use strict";

let userConfig = require("../config"),
    _ = require("lodash");

const isProduction = process.env.NODE_ENV === "production";

let defaultConfig = {
    location: {
        source: "src",
        destination: "public",
        layouts: "src/_layouts",
        posts: "src/_posts"
        pages: "src"
    },
    site: {
        title: "",
        subtitle: "",
        description: "",
        author: "",
        baseUrl: ""
    },
    posts: {
        permalink: "posts/:year/:month/:day/:title",
        limit: 10,
        pagination_dir: "posts/page:num",
        default_layout: "default.html",
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

let config = _.merge(defaultConfig, userConfig);

if(!isProduction) {
    config.site.baseUrl = `${config.server.host}:${config.server.port}`
}

module.exports = config;
