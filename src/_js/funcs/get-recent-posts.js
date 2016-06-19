"use strict";

import { get } from "../requests";

export default function () {
    let homePageRecent = document.querySelector("#latest-blog-posts .blog-articles");

    if (!homePageRecent && !recentPosts) return;

    get("/blog/recent.json", function(data) {
        if (homePageRecent) {
            homePageRecent.innerHTML = data.reduce((prev, post) => (
                `${prev}
                <div class="article">
                    <a href="${post.permalink}">
                        <p class="meta">${post.date}</p>
                        <h2>${post.title}</h2>
                        <p>${post.description}</p>
                    </a>
                </div>`
            ), "");
        }
    });
}
