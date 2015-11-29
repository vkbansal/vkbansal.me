"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("nunjucks"),
    md = require('markdown-it')({
        html: true
    }),
    _ = require("lodash"),
    moment = require("moment"),
    utils = require("./utils"),
    requireDir = require("require-dir");

module.exports = function(options) {
    let {
            location: _location,
            posts: _posts,
            site: _site
        } = options,
        posts = [],
        data = requireDir(path.resolve(process.cwd(), _location.source, "_data"));

    // Setup templating
    nj.configure(
        path.resolve(process.cwd(), _location.source),
        {
            watch: false,
            autoescape: false
        }
    );

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

        let contents = nj.render(
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
        let pages = _.chunk(posts.reverse(), _posts.limit),
            indexPath = `${_posts.index}${_site.pretty_url ? "/index" : "" }.html`,
            indexPage = pages.shift();

        const LAYOUT = path.join(_location.layouts, _posts.index_layout || _posts.pagination_layout);

        function getPageNumLink(num) {
            return `${_posts.pagination_dir.replace(":num", num)}${_site.pretty_url ? "/index" : "" }.html`
        }

        function cleanPath(path) {
            return _site.pretty_url ? path.replace(/index\.html$/, "") : path;
        }

        //Blog Index Page
        this.push(
            utils.createNewFile(
                path.join(...indexPath.split("/")),
                nj.render(LAYOUT, {
                    posts: indexPage,
                    pages: {
                        total: pages.length + 1,
                        current: 1
                    },
                    links: {
                        prev: false,
                        next: pages.length > 0 ? cleanPath(getPageNumLink(2)) : false
                    }
                })
            )
        );

        let recent = indexPage.map((post) => _.pick(post, ["title", "permalink"]));

        // Recent Posts JSON
        this.push(
            utils.createNewFile(
                path.join(_posts.index, "recent.json"),
                JSON.stringify(recent, null, 2)
            )
        );

        //Pagination pages >= 2
        pages.forEach((page, i) => {
            let num = i + 2;
            this.push(
                utils.createNewFile(
                    path.join(...getPageNumLink(num).split("/")),
                    nj.render(LAYOUT, {
                        posts: page,
                        pages: {
                            total: pages.length + 1,
                            current: num,
                        },
                        links: {
                            prev: num === 2 ? cleanPath(indexPath) : cleanPath(getPageNumLink(num - 1)),
                            next: pages.length - 1 > i ? cleanPath(getPageNumLink(num + 1)) : false
                        }
                    })
                )
            );
        })

        done();
    }

    return through.obj(transform, flush);
};
