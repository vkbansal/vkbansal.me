"use strict";

import { get } from "../requests";

export default function () {
    let homePageRecent = document.querySelector("#latest-blog-posts .blog-articles"),
    recentPosts = document.getElementById("recent-posts");

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
        } else if (recentPosts) {
            let current = recentPosts.getAttribute("data-current");

            recentPosts.innerHTML = data
                .filter((post) => post.permalink !== current)
                .reduce((prev, post) => (
                    `${prev}
                    <li>
                        <a href="${post.permalink}" title="${post.title}">
                            ${post.title}
                        </a>
                    </li>`
                ), "")
        }
    });
}
