"use strict";

let gutil = require("gulp-util");

/**
 * Creates New File
 * @param  {String} path    Path of the file
 * @param  {String} content Content for the file
 * @return {Object}         File Object
 */
module.exports = function(path, content) {
    return new gutil.File({path, contents: new Buffer(content)});
};
