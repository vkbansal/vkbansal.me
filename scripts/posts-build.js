"use strict";

let Stream = require("stream"),
    gutil = require("gulp-util"),
    md = require('markdown-it')({
        html: true
    });

let posts = function(transform, options) {

    let stream = new Stream.Transform({ objectMode: true });

    stream._transform = function(file, unused, done) {

        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('gulp-xml-edit', 'Streaming not supported'));
        }

        let content = file.contents.toString("utf-8");

        console.log(content)
    };

    return stream;
};

module.exports = posts;
