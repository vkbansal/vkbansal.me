import formatDate from 'date-fns/format';

import { PostContents } from '../../typings/common';
import { useStyles } from '../../scripts/useStyles';

export async function render(post: PostContents, showTags: boolean, isProduction?: boolean) {
    const styles = await useStyles(articleStyles);

    return /* html */ `
    <div class="${styles['article-preview']}">
        <p class="${styles['article-date']}">
        ${formatDate(post.attributes.date, 'MMMM Do, YYYY')}
        </p>
        <a href="${post.url}" class="${styles['article-link']}">
            <h2 class="styles['title']">
                ${post.attributes.title}
                ${!isProduction && post.attributes.isDraft ? ' [DRAFT]' : ''}
            </h2>
            <p class="styles['description']">${post.attributes.description}</p>
            <p class="styles['read-more']">Read more…</p>
        </a>
        ${
            showTags
                ? /* html */ `
        <div class="styles['tags']">
            ${post.attributes.tag
                .map(
                    tag => `
                <span key="tag" url="urls.labelUrl.replace(':label', tag)">
                    ${tag}
                </span>`
                )
                .join('\n')}
        </div>`
                : ''
        }
</div>`;
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
