import path from 'path';

import frontMatter from 'front-matter';
import * as babylon from 'babylon';
import traverse from 'babel-traverse';

import fs from './fs-promisified';
import settings from '../settings';

const BLOG_REGEX = new RegExp('^\/?' + settings.blog.prefix);
const POST_REGEX = /^(\d{4}-\d{2}-\d{2})-([\w\-]+)$/;

const getUrl = ({name, url, ext}) => {
    if (
        (ext === '.js' && name === 'index') ||
        (ext === '.md' && (name === 'readme' || name === 'index'))
    ) {
        return path.dirname(url);
    }

    return url.replace(ext, '');
}

export default async function (file) {
    const fileInfo = path.parse(file);
    const { ext, name, dir } = fileInfo;

    let url = file.replace(/^pages/, '');
    let data = { name, file, url, ext };

    switch (ext) {
        case '.md':
            const mdContent = await fs.readFileAsync(file, 'utf-8')
            const meta = frontMatter(mdContent);
            url = getUrl({name, path, url, ext});
            let mdData = {};

            if (BLOG_REGEX.test(url)) {
                let postname;

                if(name === 'index' || name === 'readme') {
                    postname = path.basename(dir);
                } else {
                    postname = name;
                }

                const match = postname.match(POST_REGEX);

                if(!match) {
                    throw new Error(`Invalid post name given: "${postname}" for "${file}"`);
                }

                const [, date, slug] = match;

                mdData = {
                    isPost: true,
                    date,
                    slug
                };

            }

            Object.assign(data, mdData, {url}, meta.attributes);
        break;

        case '.js':
            url = getUrl({name, url, ext});

            const content = await fs.readFileAsync(file, 'utf-8');
            const ast = babylon.parse(content, {
                sourceType: 'module',
                plugins: [
                    'jsx',
                    'objectRestSpread',
                    'classProperties',
                    'dynamicImport'
                ]
            });

            let attributes = {};

            traverse(ast, {
                // search for a named export 'attributes';
                ExportNamedDeclaration(astPath) {
                    const attributesNode = astPath.node.declaration.declarations.find((declaration) => {
                        return declaration.id.name === 'attributes';
                    });

                    if (!attributesNode || attributesNode.init.type !== 'ObjectExpression') return;

                    attributesNode.init.properties.forEach((objectProperty) => {
                        attributes[objectProperty.key.name] = objectProperty.value.value;
                    });
                }
            });

            Object.assign(data, {
                url
            }, attributes);
        break;
    }

    return data;
};
