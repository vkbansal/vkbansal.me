"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("nunjucks"),
    md = require('markdown-it')({
        html: true
    }),
    _ = require("lodash");

let { File } = gutil;

function parsePath(filepath) {
    let extname = path.extname(filepath);

    return {
        dirname: path.dirname(filepath),
        basename: path.basename(filepath, extname),
        extname
    };
}

function createNewFile(path, content) {
    return new File({path, contents: new Buffer(content)});
}


let posts = function(options) {
    let { location: _location, posts: _posts } = options,
        posts = [];

    nj.configure(
        path.resolve(process.cwd(), _location.source),
        {
            watch: false
        }
    );

    function makePosts(file, unused, done) {

        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
          return done(new gutil.PluginError('posts', 'Streaming not supported'));
        }


        let { attributes, body } = fm(file.contents.toString("utf-8")),
            parsedPath = parsePath(file.relative),
            [year, month, day, ...title] = parsedPath.basename.split("-");

        title = title.join("-");

        let permalink = _posts.permalink
                        .replace(":year", year)
                        .replace(":month", month)
                        .replace(":day", day)
                        .replace(":title", _.kebabCase(title)),
            newPath = `${permalink}${_posts.pretty ? "/index" : "" }.html`,
            ajaxPath = `${permalink}${_posts.pretty ? "/" : "-" }ajax.html`;

        let contents = nj.render(
            path.join(_location.layouts, attributes.layout || _posts.layout),
            {
                content: md.render(body)
            }
        );

        file.contents = new Buffer(contents);
        file.path = path.join(file.base, ...newPath.split("/"));

        posts.push({
            permalink,
            file,
            attributes,
            title
        });

        this.push(
            createNewFile(
                path.join(...ajaxPath.split("/")),
                md.render(body)
            )
        );

        return done(null, file);
    }

    function makePostsList(done) {
        let pages = _.chunk(posts.reverse(), posts.limit),
            indexPath = `${_posts.index}${_posts.pretty ? "/index" : "" }.html`

        this.push(
            createNewFile(
                indexPath,
                "JSON.stringify"
            )
        );
        done();
    }

    return through.obj(makePosts, makePostsList);
};

module.exports = posts;
