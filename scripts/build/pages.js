"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    nj = require("../vendors/nunjucks"),
    utils = require("../utils"),
    requireDir = require("require-dir");

module.exports = function(config) {

    let { location, site } = config,
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
            templatePath = file.relative,
            basePath = file.base,
            templateData = {
                site,
                data,
                env: process.env.NODE_ENV || "development"
            },
            contents = template.render(templatePath, templateData);

        file.contents = new Buffer(contents);

        let ajaxPath;

        if (site.pretty_url && parsedPath.basename !== "index") {
            ajaxPath = path.join(parsedPath.dirname, parsedPath.basename, "index.json");
            file.path = path.join(basePath, parsedPath.dirname, parsedPath.basename, "index.html");
        } else {
            ajaxPath = path.join(parsedPath.dirname, `${parsedPath.basename}.json`);
        }

        templateData.ajax = true;
        contents = template.render(templatePath, templateData);
        this.push(utils.createNewFile(ajaxPath, contents));

        done(null, file);
    }

    function flush(done) {
        done();
    }

    return through.obj(transform, flush);
};
