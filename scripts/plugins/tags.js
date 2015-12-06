"use strict";

let path = require("path"),
    _ = require("lodash"),
    utils = require("../utils");

module.exports = function({posts, options, add, template, data}) {
    let tags = {};

    posts.forEach((post) => {
        if (!Array.isArray(post.tag)) return;

        post.tag.forEach((tag) => {
            if (!Array.isArray(tags[tag])) {
                tags[tag] = [post];
            } else {
                tags[tag].push(post);
            }
        });
    });

    const LAYOUT = path.join(options.location.layouts, options.posts.index_layout || options.posts.tags_layout);

    function getPageNumLink(num, tag) {
        return `${options.posts.tags_pagination.replace(":num", num).replace(":tag", tag)}${options.site.pretty_url ? "/index" : "" }.html`
    }

    function cleanPath(path) {
        return options.site.pretty_url ? path.replace(/index\.html$/, "") : path;
    }

    _.each(tags, (group, tag) => {
        let pages = _.chunk(group, options.posts.limit),
        indexPath = `${options.posts.tags_dir.replace(":tag", tag)}${options.site.pretty_url ? "/index" : "" }.html`,
        indexPage = pages.shift();

        //Index Page
        add(
            utils.createNewFile(
                path.join(...indexPath.split("/")),
                template.render(
                    LAYOUT,
                    _.merge({
                        posts: indexPage,
                        pages: {
                            total: pages.length + 1,
                            current: 1
                        },
                        links: {
                            prev: false,
                            next: pages.length > 0 ? cleanPath(getPageNumLink(2, tag)) : false
                        },
                        tag_applied: tag
                    }, data)
                )
            )
        );

        //Pagination pages >= 2
        pages.forEach((page, i) => {
            let num = i + 2;
            add(
                utils.createNewFile(
                    path.join(...getPageNumLink(num).split("/")),
                    template.render(
                        LAYOUT,
                            _.merge({
                            posts: page,
                            pages: {
                                total: pages.length + 1,
                                current: num,
                            },
                            links: {
                                prev: num === 2 ? cleanPath(indexPath) : cleanPath(getPageNumLink(num - 1, tag)),
                                next: pages.length - 1 > i ? cleanPath(getPageNumLink(num + 1, tag)) : false
                            },
                            tag_applied: tag
                        }, data)
                    )
                )
            );
        })
    });
};
