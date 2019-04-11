import { chunk, flatten } from 'lodash';

import { RenderArgs, Page, PostContents } from '../../typings/common';
import meta from '../meta.json';
import { render as renderArticle } from '../../templates/partials/ArticlePreview';
import { render as renderPagination } from '../../templates/partials/Pagination';

export async function render(props: RenderArgs, skipLabelPages?: boolean): Promise<Page[]> {
    const pages = chunk(props.posts, meta.blog.postsLimit);
    const getUrl = getBlogUrl(props.url);
    const pagesPromises = pages.map<Promise<Page>>(async (articles, i) => {
        const pageNum = i + 1;
        const posts = await Promise.all(articles.map(post => renderArticle(post, true)));
        const content = await renderPage(posts.join('\n'), pageNum, pages.length, props.url);

        return {
            url: getUrl(pageNum),
            content
        };
    });
    const renderedPages = await Promise.all(pagesPromises);

    if (!skipLabelPages) {
        const tags = new Set<string>();
        const groupedPosts: Record<string, PostContents[]> = {};

        props.posts.forEach(post => {
            post.attributes.tag.forEach(tag => {
                tags.add(tag);

                if (!groupedPosts[tag]) {
                    groupedPosts[tag] = [];
                }

                groupedPosts[tag].push(post);
            });
        });

        const a = await Promise.all(
            [...tags].map(async key => {
                const p = render(
                    {
                        ...props,
                        posts: groupedPosts[key],
                        url: `${props.url}label/${key}/`
                    },
                    true
                );

                return p;
            })
        );

        return [...renderedPages, ...flatten(a)];
    }

    return renderedPages;
}

function getBlogUrl(baseUrl: string) {
    return (page: number) => (page > 1 ? `${baseUrl}page/${page}` : baseUrl);
}

async function renderPage(
    content: string,
    page: number,
    total: number,
    baseUrl: string
): Promise<string> {
    const pagination = await renderPagination(page, total, getBlogUrl(baseUrl));

    return /* html*/ `
    <div class="container" data-page="${page}">
        <section class="articles">
            ${content}
        </section>
        ${pagination}
    </div>`;
}
