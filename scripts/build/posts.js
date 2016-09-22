"use strict";

let through = require("through2"),
    path = require("path"),
    gutil = require("gulp-util"),
    fm = require("front-matter"),
    nj = require("../vendors/nunjucks"),
    md = require("../vendors/markdown-it"),
    R = require("ramda"),
    moment = require("moment"),
    utils = require("../utils"),
    requireDir = require("require-dir"),
    cheerio = require("cheerio"),
    RSS = require("rss");

module.exports = function(options) {
    let posts = [],
        data = requireDir(path.resolve(process.cwd(), "src", "_data")),
        template = nj(path.resolve(process.cwd(), "src"));

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

        let permalink = `${dirname}/${title}`.replace(/[\/\\]+/g, "/").replace(/^[\/\\]/, ''),
            post = Object.assign(
                {
                    permalink,
                    slug: title,
                    title,
                    data,
                    date,
                    site: data.site,
                    author: data.site.author,
                    content: md.render(body),
                    env: process.env.NODE_ENV || "development"
                },
                attributes
            );

        posts.push(post);

        return done();
    }

    // flush function for through2
    function flush(done) {
        posts.sort((a, b) => b.date.unix() - a.date.unix());

        let all_tags = R.pipe(R.pluck("tag")(R.__), R.flatten, R.uniq)(posts).sort(),
            recent_posts = posts.slice(0, 5),
            tags_group = {};

        // All the posts
        posts.forEach((post) => {
            post.all_tags = all_tags;
            post.recent_posts = recent_posts;

            let content = template.render(
                path.join("_layouts", post.layout || "article.html"),
                post
            );

            let $ = cheerio.load(content);

            $("img").each(function() {
                let src = $(this).attr("src");

                if(!/^\/|http(s)?/.test(src)) {
                    $(this).attr("src", `../${src}`);
                }
            });

            this.push(
                utils.createNewFile(
                    path.join(...post.permalink.split("/"), "index.html"),
                    $.html()
                )
            );

            if (!Array.isArray(post.tag)) return;

            post.tag.forEach((tag) => {
                if (!Array.isArray(tags_group[tag])) {
                    tags_group[tag] = [post];
                } else {
                    tags_group[tag].push(post);
                }
            });
        });

        // Blog Index
        makePages.call(
            this,
            posts,
            "Blog",
            {
                getPageNumLink: (num) => `/blog/page/${num}/`,
                getPageNumPath: (num) => `page/${num}/index.html`,
                getIndexLink: () => "/blog/",
                getIndexPath: () => "index.html"
            }
        );

        // Label Pages
        Object.keys(tags_group).forEach((tag) => {
            let group = tags_group[tag];

            makePages.call(
                this,
                group,
                `${tag} | Blog`,
                {
                    getPageNumLink: (num) => `/blog/labels/${tag}/page/${num}/`,
                    getPageNumPath: (num) => `labels/${tag}/page/${num}/index.html`,
                    getIndexLink: () => `/blog/labels/${tag}/`,
                    getIndexPath: () => `labels/${tag}/index.html`
                },
                {
                    tag_applied: tag
                }
            )
        });

        // Recent Posts JSON
        let recent = posts.slice(0, 5).map((post) => ({
                permalink: post.permalink,
                title: post.title,
                description: post.description,
                date: post.date.format("MMMM Do, YYYY"),
                tags: post.tag
            }));

        this.push(utils.createNewFile("recent.json", JSON.stringify(recent)));

        done();
    }

    function makePages(group, title, { getPageNumLink, getPageNumPath, getIndexLink, getIndexPath }, extradata) {
        let pages = R.splitEvery(5, group),
            indexPage = pages.shift(),
            indexPageData = Object.assign({
                posts: indexPage,
                pages: {
                    total: pages.length + 1,
                    current: 1
                },
                links: {
                    prev: false,
                    next: pages.length > 0 ? getPageNumLink(2) : false
                },
                title,
                data
            }, extradata);

        //Blog Index Page
        this.push(
            utils.createNewFile(
                getIndexPath(),
                template.render("_layouts/blog.html", indexPageData)
            )
        );

        //Pagination pages >= 2
        pages.forEach((page, i) => {
            let num = i + 2,
                pageData = Object.assign({
                    posts: page,
                    pages: {
                        total: pages.length + 1,
                        current: num,
                    },
                    links: {
                        prev: num === 2 ? getIndexLink() : getPageNumLink(num - 1),
                        next: pages.length - 1 > i ? getPageNumLink(num + 1) : false
                    },
                    title: `Page ${num} | ${title}`,
                    data,
                }, extradata);

            this.push(
                utils.createNewFile(
                    path.join(...getPageNumPath(num).split("/")),
                    template.render("_layouts/blog.html", pageData)
                )
            );

            /**
             * Generate RSS Feed
             */

            let feedOptions = {
                title: data.site.title,
                description: data.site.description,
                feed_url: data.site.base_url.replace(/\/$/, "") + "/blog/feed.xml",
                site_url: data.site.base_url
            };

            let feed = new RSS(feedOptions);

            posts.slice(0, 15).forEach((post) => {
                let itemOptions = {
                    title: post.title,
                    description: post.description,
                    url: post.permalink,
                    date: post.date.toDate()
                };

                feed.item(itemOptions);
            });

            this.push(utils.createNewFile("feed.xml", feed.xml({indent: true})));
        })
    }

    return through.obj(transform, flush);
};
