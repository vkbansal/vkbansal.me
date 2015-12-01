"use strict";

let path = require("path");

/**
 * Parse given file path
 * @param  {String} filepath Path to the file
 * @return {Object}          Parsed path object
 */
module.exports = function(filepath) {
    let extname = path.extname(filepath);

    return {
        dirname: path.dirname(filepath),
        basename: path.basename(filepath, extname),
        extname
    };
};
