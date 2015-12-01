"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("../vendors/nunjucks"),
    md = require('markdown-it')({
        html: true
    }),
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


        let { attributes, body } = fm(file.contents.toString("utf-8")),
            parsedPath = utils.parsePath(file.relative),
            [year, month, day, ...title] = parsedPath.basename.split("-"),
            date = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

        if(attributes.draft) return done();

        if (attributes.date) attributes.date = moment(attributes.date);

        title = title.join("-");

        let permalink = _posts.permalink
                        .replace(":year", year)
                        .replace(":month", month)
                        .replace(":day", day)
                        .replace(":title", _.kebabCase(title)),
            filePath = `${permalink}${_site.pretty_url ? "/index" : "" }.html`,
            ajaxPath = `${permalink}${_site.pretty_url ? "/" : "-" }ajax.html`;

        let contents = template.render(
            path.join(_location.layouts, attributes.layout || _posts.layout),
            {
                content: md.render(body),
                site: _site,
                data
            }
        );

        file.contents = new Buffer(contents);
        file.path = path.join(file.base, ...filePath.split("/"));

        posts.push(
            _.merge({
                    permalink,
                    file,
                    title,
                    date,
                },
                attributes
            )
        );

        this.push(
            utils.createNewFile(
                path.join(...ajaxPath.split("/")),
                md.render(body)
            )
        );

        return done(null, file);
    }

    // flush function for through2
    function flush(done) {
        posts.reverse();

        plugins.forEach((plugin) => plugin(posts.slice(0), options, this.push.bind(this), template));

        done();
    }

    return through.obj(transform, flush);
};
