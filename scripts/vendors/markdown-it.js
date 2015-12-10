"use strict";

let illuminate = require('illuminate-js'),
    md = require('markdown-it');

module.exports = md({
    html: true,
    highlight(text, language) {
        if (illuminate.getLanguage(language)) {
            return illuminate.highlight(text, language);
        }
        return "";
    }
});
