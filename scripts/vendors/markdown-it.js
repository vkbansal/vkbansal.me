"use strict";

let illuminate = require("illuminate-js"),
    md = require("markdown-it"),
    mathjax = require("markdown-it-mathjax"),
    decorate = require("markdown-it-decorate");

module.exports = md({
    html: true,
    highlight(text, language) {
        if (illuminate.getLanguage(language)) {
            return illuminate.highlight(text, language);
        }
        return "";
    }
}).use(mathjax)
    .use(decorate);
