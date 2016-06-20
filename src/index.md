---
title: "Vivek Kumar Bansal, frontend designer and developer"
layout: "page.html"
active: "Home"
container: false
---
<div class="banner intro">
    <div class="container">
        <div class="text">
            <h1>Hello, I'm Vivek.</h1>
            <h2>A frontend web <span id="intro-type">developer<span></h2>
        </div>
        <figure>{% include "\_includes/web-design-banner.svg" %}</figure>
    </div>
</div>
<div class="home-wrapper">
    <section class="container" id="latest-blog-posts">
        <h2 class="heading">Latest Posts</h2>
        <div class="blog-articles">
        {% for post in recent_posts %}<div class="article">
            <a href="/blog/{{post.permalink}}">
                <p class="meta">{{post.date}}</p>
                <h2>{{post.title}}</h2>
                <p>{{post.description}}</p>
            </a>
        </div>
        {% endfor %}</div>
    </section>
</div>
