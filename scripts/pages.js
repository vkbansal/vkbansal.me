"use strict";

let through = require("through2");

module.exports = function() {
    function transform(file, encoding, done) {
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('posts', 'Streaming not supported'));
        }

        let relPath = file.path.replace(file.base, "");

        if (relPath.charAt(0) === "_") {
            return done();
        }

        console.log(relPath);

        done(null, file);

    }

    function flush(done) {
        done();
    }

    return through.obj(transform, flush);
};
