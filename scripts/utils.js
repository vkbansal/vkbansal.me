"use strict";

let path = require("path"),
    gutil = require("gulp-util");

module.exports = {
    /**
     * Parse given file path
     * @param  {String} filepath Path to the file
     * @return {Object}          Parsed path object
     */
    parsePath(filepath) {
        let extname = path.extname(filepath);

        return {
            dirname: path.dirname(filepath),
            basename: path.basename(filepath, extname),
            extname
        };
    },

    /**
     * Creates New File
     * @param  {String} path    Path of the file
     * @param  {String} content Content for the file
     * @return {Object}         File Object
     */
    createNewFile(path, content) {
        return new gutil.File({path, contents: new Buffer(content)});
    }
};
