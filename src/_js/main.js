(function(){
    let burger = document.getElementById("nav-btn"),
        nav = document.getElementById("main-nav");

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      nav.classList.toggle("open");
      document.body.classList.toggle("open");
    });

    function getRecentPosts () {
        let request = new XMLHttpRequest();
        request.open("GET", "/blog/recent.json", true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText),
                    homePageRecent = document.querySelector("#latest-blog-posts .blog-articles"),
                    recentPosts = document.getElementById("recent-posts");

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

            }
        }

        request.send();
    }

    getRecentPosts();
})();
