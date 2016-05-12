"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("../vendors/nunjucks"),
    md = require("../vendors/markdown-it"),
    utils = require("../utils"),
    R = require("ramda"),
    requireDir = require("require-dir");

module.exports = function() {
    let template = nj(path.resolve(process.cwd(), "src")),
        data = requireDir(path.resolve(process.cwd(), "src", "_data"));

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

        let { attributes, body } = fm(file.contents.toString("utf-8")),
            parsedPath = utils.parsePath(file.relative),
            templateData = R.merge({}, attributes),
            basePath = path.join(file.base, parsedPath.dirname, parsedPath.basename);

        basePath = parsedPath.basename === "index" ? `${basePath}.html`: path.join(basePath, "index.html");
        templateData.data = data;
        templateData.content = template.renderString(md.render(body));
        templateData.env = process.env.NODE_ENV || "development";

        let content = template.render(
            path.join("_layouts", attributes.layout || "page.html"),
            templateData
        );

        file.contents = new Buffer(content);
        file.path =  basePath;

        done(null, file);
    }

    function flush(done) {
        done();
    }

    return through.obj(transform, flush);
};
