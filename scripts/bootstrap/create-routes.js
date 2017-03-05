import path from 'path';
import { camelCase } from 'lodash';
import fs from '../utils/fs-promisified';

const PROD = process.env.NODE_ENV === 'production';

export default async function ({pages, posts}) {
    let importStatements = '';
    let postImportsMap = '';
    let pageImportsMap = '';
    let routes = [];

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

        importStatements += `import ${pageImportName} from '${page.file}';\n`
        pageImportsMap += `'${page.url}': ${pageImportName},\n`;

        routes.push(page.url);
    });

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
