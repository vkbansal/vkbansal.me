"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("../vendors/nunjucks"),
    md = require("../vendors/markdown-it"),
    _ = require("lodash"),
    moment = require("moment"),
    utils = require("../utils"),
    requireDir = require("require-dir");

module.exports = function(options, plugins = []) {
    let {
            location: _location,
            posts: _posts,
            site: _site
        } = options,
        posts = [],
        data = requireDir(path.resolve(process.cwd(), _location.source, "_data")),
        template = nj(path.resolve(process.cwd(), _location.source));

    // transform function for through2
    function transform(file, unused, done) {

        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('posts', 'Streaming not supported'));
        }


        let { attributes, body } = fm(file.contents.toString("utf-8"));

        if (process.env.NODE_ENV === "production" && attributes.draft) return done();

        let dirname = path.dirname(file.relative),
            parsedPath = utils.parsePath(file.relative),
            [year, month, day, ...title] = parsedPath.basename.split("-"),
            date = moment.utc(`${year}-${month}-${day}`, "YYYY-MM-DD");

        if (attributes.date) attributes.date = moment.utc(attributes.date);

        if (dirname === ".") dirname = "";

        title = title.join("-");
        title = _.kebabCase(attributes.title || title);

        let permalink = `${_posts.base_dir}/${dirname}/${title}`.replace(/[\/\\]+/g, "/"),
            filePath = `${permalink}${_site.pretty_url ? "/index" : "" }.html`,
            ajaxPath = `${permalink}${_site.pretty_url ? "/" : "-" }index.json`;

        let templateData = _.merge(
            {
                permalink,
                file,
                title,
                slug: title,
                data,
                date,
                site: _site,
                author: _site.author,
                config: _posts,
                content: md.render(body),
                env: process.env.NODE_ENV || "development"
            },
            attributes
        );

        let contents = template.render(
            path.join(_location.layouts, attributes.layout || _posts.layout),
            templateData
        );

        file.contents = new Buffer(contents);
        file.path = path.resolve(file.base,...filePath.split("/"));

        posts.push(
            _.merge(
                { file },
                templateData
            )
        );

        templateData.ajax = true;

        contents = template.render(
            path.join(_location.layouts, attributes.layout || _posts.layout),
            templateData
        );

        this.push(
            utils.createNewFile(
                path.join(...ajaxPath.split("/")),
                contents
            )
        );

        return done(null, file);
    }

    // flush function for through2
    function flush(done) {
        posts.reverse();

        plugins.forEach((plugin) => plugin(
            {
                posts: posts.slice(0),
                options,
                add: this.push.bind(this),
                template,
                data: { site: _site, data, config: _posts }
            }
        ));

        done();
    }

    return through.obj(transform, flush);
};
