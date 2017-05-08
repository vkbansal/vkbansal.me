import path from 'path';

import fs from 'fs-extra';
import { camelCase, times, forEach } from 'lodash';

import settings from 'scripts/settings';
import { getBlogUrls } from 'utils';

const { blog } = settings;
const blogUrls = getBlogUrls(blog);

export default async function ({ pages, posts }) {
    let importStatements = '';
    let postImportsMap = '';
    let pageJSImportsMap = '';
    let pageMarkdownImportsMap = '';
    let routes = [];
    let labels = {};
    let blogRenderer = null;
    let blogLabelsRenderer = null;

    forEach(posts, (post, index) => {
        const postImportName = camelCase(post.slug);
        importStatements += `import ${postImportName} from '${post.file}';\n`;
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
        const pageImportName = camelCase(page.file.replace(page.ext, ''));

        importStatements += `import ${pageImportName} from '${page.file}';\n`;

        switch (page.ext) {
            case '.js':
                if (page.useForBlog) {
                    blogRenderer = pageImportName;
                }

                if (page.useForBlogLabels) {
                    blogLabelsRenderer = pageImportName;
                }
                pageJSImportsMap += `'${page.url}': ${pageImportName},\n`;
                break;
            case '.md':
                pageMarkdownImportsMap += `'${page.url}': ${pageImportName},\n`;
                break;
            default:
                return;
        }


        if (!page.skip) routes.push(page.url);
    });


    if (blogRenderer) {
        pageJSImportsMap += `'${blogUrls.paginationUrl}': ${blogRenderer},\n`;

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

        pageJSImportsMap += `'${blogUrls.labelUrl}': ${blogLabelsRenderer},\n`;
        pageJSImportsMap += `'${blogUrls.labelPaginationUrl}': ${blogLabelsRenderer},\n`;

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

    let template = await fs.readFile(path.resolve(__dirname, '../templates/routes.template.js'), 'utf8');

    /* eslint-disable no-template-curly-in-string*/
    template = template
                .replace('/* ${postImports} */', importStatements)
                .replace('/* ${postImportsMap} */', postImportsMap)
                .replace('/* ${pageJSImportsMap} */', pageJSImportsMap)
                .replace('/* ${pageMarkdownImportsMap} */', pageMarkdownImportsMap);
    /* eslint-enable no-template-curly-in-string*/

    await fs.writeFile(path.resolve(__dirname, '../_routes.js'), template, { encoding: 'utf8' });
    await fs.writeJson(path.resolve(__dirname, '../_routes.json'), routes);
    await fs.writeJson(path.resolve(__dirname, '../_posts.json'), posts);
    await fs.writeJson(path.resolve(__dirname, '../_pages.json'), pages);
    await fs.writeJson(path.resolve(__dirname, '../_tags.json'), labels);
}
