"use strict";

let path = require("path"),
    _ = require("lodash"),
    utils = require("../utils");

module.exports = function(posts, options, add, template) {
    let pages = _.chunk(posts, options.posts.limit),
        indexPath = `${options.posts.index}${options.site.pretty_url ? "/index" : "" }.html`,
        indexPage = pages.shift();

    const LAYOUT = path.join(options.location.layouts, options.posts.index_layout || options.posts.pagination_layout);

    function getPageNumLink(num) {
        return `${options.posts.pagination_dir.replace(":num", num)}${options.site.pretty_url ? "/index" : "" }.html`
    }

    function cleanPath(path) {
        return options.site.pretty_url ? path.replace(/index\.html$/, "") : path;
    }

    //Blog Index Page
    add(
        utils.createNewFile(
            path.join(...indexPath.split("/")),
            template.render(LAYOUT, {
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

    //Pagination pages >= 2
    pages.forEach((page, i) => {
        let num = i + 2;
        add(
            utils.createNewFile(
                path.join(...getPageNumLink(num).split("/")),
                template.render(LAYOUT, {
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
};
