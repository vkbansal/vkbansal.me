import cx from 'classnames';
import { format as formatDate } from 'date-fns';

import { RenderArgs } from '../typings/common';
import { html } from '../scripts/html';
import { useStyles } from '../scripts/useStyles';
import { Tags } from './partials/Tags';

export async function render(props: RenderArgs) {
    const styles = await useStyles(blogStyles);
    const attributes = props.attributes!;
    const recentPosts = props.posts
        .slice(0, 4)
        .filter(post => post.attributes!.title !== attributes.title)
        .slice(0, 3);

    return (
        <section class={cx('container', styles['blog-post'])}>
            <h1 class={styles['title']}>{attributes.title}</h1>
            <div class={styles['subtitle']}>
                By{' '}
                <a href={attributes.author.site} target="_blank">
                    {attributes.author.name}
                </a>{' '}
                on {formatDate(attributes.date, 'MMMM do, yyyy')}{' '}
            </div>
            <div class={styles['content']}>{props.content}</div>
            <Tags tags={attributes.tag} />
            <div class={styles['recent-posts']}>
                <h4>Recent Posts</h4>
                <div class={styles['posts']}>
                    {recentPosts.map(post => (
                        <a class={styles['recent-post-link']} href={post.url}>
                            <h4>{post.attributes.title}</h4>
                            <span class={styles['desc']}>{post.attributes.description}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}

const blogStyles = `
@import 'variables.scss';

.blog-post {
    width: 100%;

    @media (min-width: $screen-xs) {
        width: 480px;
    }

    @media (min-width: $screen-sm) {
        width: 720px;
    }

    @media (min-width: $screen-md) {
        width: 720px;
    }

    @media (min-width: $screen-lg) {
        width: 720px;
    }

    @media print {
        width: 100%;
    }

    & .title {
        margin: 0 0 0.25em 0;;
    }

    & .subtitle {
        color: lighten($color-dark, 30%);
        margin: 0 0 1.25em 0;
    }

    & .content {
        padding-bottom: 28px;
        margin-bottom: 28px;
        border-bottom: 1px solid $color-divider;
    }

    & .recent-posts {
        padding: 28px 0;
        margin-top: 28px;
        border-top: 1px solid $color-divider;

        & .posts {
            display: grid;
            grid-column-gap: 8px;
            grid-row-gap: 8px;
            grid-auto-rows: 100px;

            @media (min-width: $screen-sm) {
                grid-template-columns: repeat(2, 1fr);
                grid-auto-rows: 150px;
            }

            @media (min-width: $screen-md) {
                grid-template-columns: repeat(3, 1fr);
                grid-auto-rows: 200px;
            }
        }
    }

    .recent-post-link {
        display: block;
        border: 1px solid $color-divider;
        padding: 16px;
        height: 100px;
        overflow: hidden;
        color: $color-dark;

        @media (min-width: $screen-sm) {
            height: 150px;
        }

        @media (min-width: $screen-md) {
            height: 200px;
        }

        &:hover {
            text-decoration: none;
        }

        & .desc {
            white-space: nowrap;
            overflow: hidden;
            display: block;
            text-overflow: ellipsis;

            @media (min-width: $screen-sm) {
                white-space: initial;
            }
        }
    }
}
`;
