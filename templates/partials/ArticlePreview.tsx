import formatDate from 'date-fns/format';

import { html } from '../../scripts/html';
import { PostContents } from '../../typings/common';
import { useStyles } from '../../scripts/useStyles';
import { Tags } from './Tags';

export interface ArticlePreviewProps {
    post: PostContents;
    showTags: boolean;
    isProduction?: boolean;
}

export async function ArticlePreview({ post, isProduction, showTags }: ArticlePreviewProps) {
    const styles = await useStyles(articleStyles);

    return (
        <div class={styles['article-preview']}>
            <p class={styles['article-date']}>
                {formatDate(post.attributes.date, 'MMMM Do, YYYY')}
            </p>
            <a href={post.url} class={styles['article-link']}>
                <h2 class="styles['title']">
                    {post.attributes.title}
                    {!isProduction && post.attributes.isDraft ? ' [DRAFT]' : ''}
                </h2>
                <p class="styles['description']">{post.attributes.description}</p>
                <p class="styles['read-more']">Read more…</p>
            </a>
            {showTags ? <Tags tags={post.attributes.tag} /> : null}
        </div>
    );
}

export const articleStyles = /* css */ `
@import "variables.scss";

.article-preview {
    border-bottom: 1px solid $color-divider;
    padding: 48px 0;

    &:last-of-type {
        border-bottom: none;
    }

    .article-date {
        color: rgba(0, 0, 0, 0.7);
        font-size: 0.67 rem;
    }

    .article-link {
        &:hover {
            text-decoration: none;
        }
    }
}
`;
