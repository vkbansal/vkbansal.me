import { chunk, flatten } from 'lodash';
import { html, render as renderHTML } from '../../scripts/html';

import { RenderArgs, Page, PostContents } from '../../typings/common';
import { ArticlePreview } from '../../templates/partials/ArticlePreview';
import { Pagination } from '../../templates/partials/Pagination';
import meta from '../meta.json';

export async function render(props: RenderArgs, skipLabelPages?: boolean): Promise<Page[]> {
    const pageChunks = chunk(props.posts, meta.blog.postsLimit);
    const getUrl = getBlogUrl(props.url);

    const pagesPromises = pageChunks.map<Promise<Page>>(async (posts, i) => {
        const pageNum = i + 1;

        return {
            url: getUrl(pageNum),
            content: await renderHTML(
                <BlogPage
                    posts={posts}
                    page={pageNum}
                    isProduction={props.isProduction}
                    baseUrl={props.url}
                    total={pageChunks.length}
                />
            )
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

interface BlogPageProps {
    posts: PostContents[];
    page: number;
    total: number;
    baseUrl: string;
    isProduction: boolean;
}

async function BlogPage(props: BlogPageProps): Promise<string> {
    return (
        <div class="container">
            <section class="articles">
                {props.posts.map(post => (
                    <ArticlePreview
                        post={post}
                        isProduction={props.isProduction}
                        showTags={false}
                    />
                ))}
            </section>
            <Pagination
                currentPage={props.page}
                totalPages={props.total}
                getUrl={getBlogUrl(props.baseUrl)}
            />
        </div>
    );
}
