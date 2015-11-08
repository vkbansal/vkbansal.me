"use strict";

let userConfig = require("../config"),
    merge = require("lodash/object/merge");

const isProduction = process.env.NODE_ENV === "production";

let defaultConfig = {
    location: {
        source: "src",
        destination: "public",
        layouts: "_layouts",
        posts: "_posts",
        pages: "."
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
        index: "blog",
        pagination_dir: "blog/:num",
        layout: "default.html",
        pretty: false,
        feed: false
    },
    pages: {
        permalink: ":title",
        default_layout: "default.html",
    },
    format: {
        date: "YYYY-MM-DD",
        time: "HH:mm:ss"
    },
    server: {
        host: "localhost",
        port: "4000"
    },
    data: {}
};

let config = merge(defaultConfig, userConfig);

if(!isProduction) {
    config.site.baseUrl = `${config.server.host}:${config.server.port}`
}

module.exports = config;
