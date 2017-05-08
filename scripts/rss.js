import RSS from 'rss';

export default function ({ settings, posts }) {
    let feedOptions = {
        title: settings.site.title,
        description: settings.site.description,
        feed_url: settings.site.base_url.replace(/\/$/, '') + '/blog/feed.xml',
        site_url: settings.site.base_url
    };

    let feed = new RSS(feedOptions);

    posts.slice(0, 15).forEach((post) => {
        let itemOptions = {
            title: post.title,
            description: post.description,
            url: post.permalink,
            date: post.date
        };

        feed.item(itemOptions);
    });

    return feed.xml({ indent: true });
}


