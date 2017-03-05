import path from 'path';
import { camelCase, times } from 'lodash';
import fs from '../utils/fs-promisified';
import settings from '../settings';

const PROD = process.env.NODE_ENV === 'production';

export default async function ({pages, posts}) {
    let importStatements = '';
    let postImportsMap = '';
    let pageImportsMap = '';
    let routes = [];
    let blogPaginationRenderer = null;

    posts.forEach(post => {
        if (PROD && post.draft) return;

        const postImportName = camelCase(post.slug);
        importStatements += `import ${postImportName} from '${post.file}';\n`
        postImportsMap += `'${post.slug}': ${postImportName},\n`;
        routes.push(post.url);
    });

    pages.forEach((page) => {
        if (PROD && page.draft) return;

        const pageImportName = camelCase(page.file.replace(page.ext, ''));

        if (page.useForBlogPagination) {
            blogPaginationRenderer = pageImportName;
        }

        importStatements += `import ${pageImportName} from '${page.file}';\n`
        pageImportsMap += `'${page.url}': ${pageImportName},\n`;

        routes.push(page.url);
    });

    if (settings.blog.pagination) {
        const limit = settings.blog.postsLimit;
        const total = posts.length;
        const numPages = Math.ceil(total / limit);

        times(numPages, (n) => {
            const pageNum = n + 1;

            if (pageNum === 1) return;

            const url = settings.blog.paginationUrl.replace(':num', pageNum);
            routes.push(url);
        });

        if (blogPaginationRenderer) {
            pageImportsMap += `'${settings.blog.paginationUrl}': ${blogPaginationRenderer},\n`
        }
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
}
