import { RenderArgs } from '../typings/common';

export function render(props: RenderArgs) {
    return props.content;
}
/*
<section className='container'>
    <div className={styles['articles']}>
        {props.posts.slice(skip, skip + blog.postsLimit).map(post => (
            <ArticlePreview
                key={post.name}
                post={post}
                className={styles['blog-page-article']}
                showTags />
        ))}
    </div>
    <Pagination pages={numPages} currentPage={page} url={url} />
</section>

.blogs-list {
    .blog-page-article {
        &:first-child {
            border-top: none;
        }
    }

    .articles {
        margin-bottom: 30px;
    }
}

<div className={cx(styles['article-preview'], className)}>
            <p className={styles['meta']}>{formatDate(post.date, 'MMMM Do, YYYY')}</p>
            <Link to={post.url} className={styles['link']}>
                <h2 className={styles['title']}>{`${post.title}${!PROD && post.draft ? ' [DRAFT]' : ''}`}</h2>
                <p className={styles['description']}>{post.description}</p>
                <p className={styles['read-more']}>Read more…</p>
            </Link>
            {showTags && (
                <div className={styles['tags']}>
                    {post.tag.map(tag => (
                        <Tag key={tag} url={urls.labelUrl.replace(':label', tag)}>
                            {tag}
                        </Tag>
                    ))}
                </div>
            )}
        </div>

        @import "variables.scss";

.article-preview {
    display: block;
    padding: 48px 0;
    border-top: 1px solid #ddd;

    .meta {
        color: rgba(0, 0, 0, 0.7);
        font-size: 13px;
    }

    .link {
        color: #333;

        &:hover, &:active {
            color: inherit;
            text-decoration: none;
        }
    }

    .title {
        margin: 0 0 0 -1.8px;
    }

    .description {
         color: rgba(0, 0, 0, 0.7);
    }

    .tags {
        padding-top: 24px;
    }

    .read-more {
        color: $color-primary;
    }
}

*/
