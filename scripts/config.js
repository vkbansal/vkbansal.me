"use strict";

let userConfig = require("../config"),
    merge = require("lodash/object/merge");

const isProduction = process.env.NODE_ENV === "production";

let defaultConfig = {
    location: {
        source: "src",
        destination: "public",
        layouts: "_layouts",
        posts: "_posts"
    },
    site: {
        title: "",
        subtitle: "",
        description: "",
        author: "",
        base_url: "",
        pretty_url: false
    },
    posts: {
        permalink: "posts/:year/:month/:day/:title",
        layout: "default.html",
        index: "blog",
        limit: 10,
        index_layout: "",
        pagination_dir: "blog/page/:num",
        pagination_layout: "",
        feed: false
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

let config = merge(defaultConfig, userConfig);

module.exports = config;
