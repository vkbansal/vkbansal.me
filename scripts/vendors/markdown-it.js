"use strict";

let hljs = require('highlight.js'),
    md = require('markdown-it');

module.exports = md({
    html: true
});
