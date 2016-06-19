"use strict";

let illuminate = require("illuminate-js"),
    md = require("markdown-it"),
    mathjax = require("markdown-it-mathjax"),
    decorate = require("markdown-it-decorate"),
    span = require("../utils/markdown-it-span"),
    svg_inline = require("../utils/markdown-it-inline-svg");

module.exports = md({
    html: true,
    highlight(text, language) {
        if (illuminate.getLanguage(language)) {
            return illuminate.highlight(text, language);
        }
        return "";
    }
}).use(mathjax)
    .use(decorate)
    .use(span)
    .use(svg_inline);
