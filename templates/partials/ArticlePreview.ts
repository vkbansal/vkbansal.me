import formatDate from 'date-fns/format';

import { PostContents } from '../../typings/common';

export function render(post: PostContents, showTags: boolean, isProduction?: boolean) {
    return `
        <div class="cx(styles['article-preview'], class)">
            <p class="styles['meta']">${formatDate(post.attributes.date, 'MMMM Do, YYYY')}</p>
            <a href="${post.url}" class="styles['link']">
                <h2 class="styles['title']">
                    ${post.attributes.title}
                    ${!isProduction && post.attributes.isDraft ? ' [DRAFT]' : ''}
                </h2>
                <p class="styles['description']">${post.attributes.description}</p>
                <p class="styles['read-more']">Read more…</p>
            </a>
            ${
                showTags
                    ? `
                <div class="styles['tags']">
                    {post.tag.map(tag => (
                        <Tag key="tag" url="urls.labelUrl.replace(':label', tag)">
                            {tag}
                        </Tag>
                    ))}
                </div>`
                    : ''
            }
        </div>
    `;
}

export function styles() {}
