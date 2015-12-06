(function(){
    let burger = document.getElementById("nav-btn"),
        nav = document.getElementById("main-nav");

    burger.addEventListener("click", (e) => {
      e.preventDefault();
      nav.classList.toggle("open");
      document.body.classList.toggle("open");
    });

    if (document.body.classList.contains("home")) {
        let request = new XMLHttpRequest();
        request.open("GET", "/blog/recent.json", true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText),
                    homePageRecent = document.querySelector("#latest-blog-posts .blog-articles");

                if (homePageRecent) {
                    homePageRecent.innerHTML = data.reduce((prev, post) => (
                        `${prev}<div class="article">
                            <a href="${post.permalink}">
                                <p class="meta">${post.date}</p>
                                <h2>${post.title}</h2>
                                <p>${post.description}</p>
                            </a>
                        </div>`
                    ), "");
                }

            }
        }

        request.send();
    }
})();
