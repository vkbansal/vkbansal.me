import path from 'path';
import { camelCase, times, forEach } from 'lodash';

import fs from 'scripts/utils/fs-promisified';
import settings from 'scripts/settings';
import { getBlogUrls } from 'utils';

const PROD = process.env.NODE_ENV === 'production';

const { blog } = settings;
const blogUrls = getBlogUrls(blog);

export default async function ({pages, posts}) {
    let importStatements = '';
    let postImportsMap = '';
    let pageImportsMap = '';
    let routes = [];
    let labels = {};
    let blogRenderer = null;
    let blogLabelsRenderer = null;

    forEach(posts, (post, index) => {
        if (PROD && post.draft) return;

        const postImportName = camelCase(post.slug);
        importStatements += `import ${postImportName} from '${post.file}';\n`
        postImportsMap += `'${post.slug}': ${postImportName},\n`;
        routes.push(post.url);
        forEach(post.tag, (tag) => {
            if (!Array.isArray(labels[tag])) {
                labels[tag] = [];
            }
            labels[tag].push(index);
        });
    });

    forEach(pages, (page) => {
        if (PROD && page.draft) return;

        const pageImportName = camelCase(page.file.replace(page.ext, ''));

        if (page.useForBlog) {
            blogRenderer = pageImportName;
        }

        if (page.useForBlogLabels) {
            blogLabelsRenderer = pageImportName;
        }

        importStatements += `import ${pageImportName} from '${page.file}';\n`
        pageImportsMap += `'${page.url}': ${pageImportName},\n`;

        if (!page.skip) routes.push(page.url);
    });


    if (blogRenderer) {
        pageImportsMap += `'${blogUrls.paginationUrl}': ${blogRenderer},\n`;

        const limit = blog.postsLimit;
        const total = posts.length;
        const numPages = Math.ceil(total / limit);

        times(numPages, (n) => {
            const pageNum = n + 1;

            if (pageNum === 1) return;

            routes.push(blogUrls.paginationUrl.replace(':num', pageNum));
        });
    }

    if (blogLabelsRenderer) {
        const limit = blog.postsLimit;

        pageImportsMap += `'${blogUrls.labelUrl}': ${blogLabelsRenderer},\n`;
        pageImportsMap += `'${blogUrls.labelPaginationUrl}': ${blogLabelsRenderer},\n`;

        forEach(labels, (labelPosts, label) => {
            const total = labelPosts.length;
            const numPages = Math.ceil(total / limit);
            const currentLabelUrl = blogUrls.labelPaginationUrl.replace(':label', label);

            times(numPages, (n) => {
                const pageNum = n + 1;

                if (pageNum === 1) {
                    routes.push(blogUrls.labelUrl.replace(':label', label));
                    return;
                }

                routes.push(currentLabelUrl.replace(':num', pageNum));
            });
        });
    }

    let template = await fs.readFileAsync(path.resolve(__dirname, '../templates/routes.template.js'), 'utf8');

    template = template
                .replace('/*${postImports}*/', importStatements)
                .replace('/*${postImportsMap}*/', postImportsMap)
                .replace('/*${pageImportsMap}*/', pageImportsMap);

    await fs.writeFileAsync(path.resolve(__dirname, '../_routes.js'), template, { encoding: 'utf8'});
    await fs.writeJsonAsync(path.resolve(__dirname, '../_routes.json'), routes);
    await fs.writeJsonAsync(path.resolve(__dirname, '../_posts.json'), posts);
    await fs.writeJsonAsync(path.resolve(__dirname, '../_pages.json'), pages);
    await fs.writeJsonAsync(path.resolve(__dirname, '../_tags.json'), labels);
}
