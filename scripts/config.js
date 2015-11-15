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
        layout: "default.html",
        index: "blog",
        limit: 10,
        index_layout: "",
        pagination_dir: "blog/page/:num",
        pagination_layout: "",
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
