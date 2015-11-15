"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    nj = require("nunjucks"),
    utils = require("./utils");

module.exports = function(config) {

    let {location, site, data} = config;

    // Setup templating
    nj.configure(
        path.resolve(process.cwd(), location.source),
        {
            watch: false
        }
    );

    function transform(file, encoding, done) {
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('posts', 'Streaming not supported'));
        }


        if (file.relative.charAt(0) === "_") {
            return done();
        }

        let parsedPath = utils.parsePath(file.relative),
            contents = nj.render(file.relative, {site, data});

        file.contents = new Buffer(contents);

        if (site.pretty_url && parsedPath.basename !== "index") {
            file.path = path.join(file.base, parsedPath.dirname, parsedPath.basename, "index.html");
        }

        done(null, file);

    }

    function flush(done) {
        done();
    }

    return through.obj(transform, flush);
};
