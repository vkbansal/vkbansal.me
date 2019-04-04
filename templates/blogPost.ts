export function render() {
    return /*html*/ `
    <Page {...this.props} className={$['blog-post']}>
                <div className={cx('container', $['container'])}>
                    <h1 className={$['title']}>{${post.title}${
        !PROD && post.draft ? ' [DRAFT]' : ''
    }}</h1>
                    <div className={$['intro']}>By <a href={author.website}>{author.name}</a> on {formatDate(post.date, 'MMMM Do, YYYY')} </div>
                    <div className={$['post']}>
                        <div dangerouslySetInnerHTML={{ __html: post.body }} />
                        <div className={$['footer']}>
                            <div className={$['tags']}>
                                {post.tag.map(tag => (
                                    <Tag key={tag} url={urls.labelUrl.replace(':label', tag)}>
                                        {tag}
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('container', $['recent-posts-container'])}>
                    <h4>Recent Posts</h4>
                    <ul className={$['recent-posts']}>
                        {this.props.posts
                            .slice(0, 4)
                            .filter(p => p.url !== match.url)
                            .slice(0, 3)
                            .map(recentPost => (
                                <li className={cx('col-4-12', $['recent-post'])} key={recentPost.name}>
                                    <Link to={recentPost.url} className={$['recent-post-link']}>
                                        <h4>{recentPost.title}</h4>
                                        <p className={$['description']}>{recentPost.description}</p>
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div id='disqus_thread' className='container' />
            </Page>
    `;
}

export function styles() {
    return `
    @import 'variables.scss';
    @import 'mixins.scss';

    .blog-post {
        .container {
            @media (min-width: 48em) {
                width: 720px;
            }
        }

        .post {
            max-width: 100%;
            overflow: hidden;
        }

        .sidebar {
            min-width: 240px;
            max-width: 240px;
            padding-left: 28px;
        }

        .title {
            font-weight: bold;
            font-size: 44px;
            line-height: 50px;
            letter-spacing: -1px;
            margin: 0 0 8px 0;
            padding: 0;
        }

        .intro {
            font-size: 16px;
            font-weight: 300;
            line-height: 28px;
            color: #aaa;
            margin: 0 0 16px 0;
        }

        :global(.img-center) {
            display: block;
            margin: 0 auto;
        }

        .footer {
            border-top: 1px solid $color-divider;
            // border-bottom: 1px solid $color-divider;
            margin: 28px 0;
            padding: 28px 0;
            display: flex;
        }

        .tags {
            display: inline-block;
        }

        .recent-posts-container {
            border-top: 1px solid #ddd;
            padding: 30px 0 20px 0;
        }

        .recent-posts {
            list-style-type: none;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: space-between;
        }

        .recent-post {
            display: inline-block;
            margin: 20px 10px;
            border: 1px solid #ddd;

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }

        .recent-post-link {
            text-decoration: none;
            color: $base-font-color;
            display: block;
            padding: 20px;

            .description {
                font-size: 14px;
            }
        }

        :global(#disqus_thread) {
            margin: 0 auto 16px auto;
        }
    }`;
}
