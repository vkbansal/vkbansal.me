"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    nj = require("./nunjucks"),
    utils = require("./utils"),
    requireDir = require("require-dir");

module.exports = function(config) {

    let {location, site} = config,
        template = nj(path.resolve(process.cwd(), location.source)),
        data = requireDir(path.resolve(process.cwd(), location.source, "_data"));

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
            contents = template.render(file.relative, {site, data});

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
