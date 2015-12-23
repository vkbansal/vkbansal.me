(function(){

    function getPage(e) {
        let t = e.target;
        if (t.tagName !== "A" || !t.hasAttribute("data-ajax")) {
            return;
        }

        e.preventDefault();
        fetchPage(t.getAttribute("href"));
    }

    function fetchPage(link) {
        let path = link.replace(/\/$/g, "") + "/index.json",
            request = new XMLHttpRequest();

        request.open("GET", path, true);

        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText);
                loadPage(data);
                history.pushState(data, data.title, link);
            }
        };

        request.send();
    }

    function loadPage(data) {
        document.title = data.title;
        document.body.className = data.body_class;
        document.getElementById("site-content").innerHTML = data.content;
    }

    window.onpopstate = function(e) {
        console.log(e.target.location);
        if (e.state) {
            loadPage(e.state);
        } else {
            fetchPage(window.location.pathname);
        }
    };

    document.body.addEventListener("click", getPage);

})();
