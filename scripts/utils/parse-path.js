import path from 'path';

import frontMatter from 'front-matter';
import fs from './fs-promisified';

const POST_REGEX = /^(\d{4}-\d{2}-\d{2})-([\w\-]+)$/;
export default async function (file) {
    const fileInfo = path.parse(file);
    const { ext, name, dir } = fileInfo;

    let url = file.replace(/^pages/, '');
    let data = { name, file, url };

    switch (ext) {
        case '.md':
            if (url.startsWith('/blog')) {
                let postname;

                if(name === 'index' || name === 'readme') {
                    postname = path.basename(dir);
                    url = path.dirname(url);
                } else {
                    postname = name;
                    url = url.replace(ext, '');
                }

                const match = postname.match(POST_REGEX);

                if(!match) {
                    throw new Error(`Invalid post name given: "${postname}" for "${file}"`);
                }

                const [, date, slug] = match;

                const content = await fs.readFileAsync(file, 'utf-8')
                const meta = frontMatter(content);

                Object.assign(data, {
                    isPost: true,
                    date,
                    slug,
                    url: url.replace(postname, slug)
                }, meta.attributes);
            } else {
                if(name === 'index' || name === 'readme') {
                    url = path.dirname(url);
                } else {
                    url = url.replace(ext, '');
                }
            }
        break;

        case '.js':
            if (name === 'index') {
                url = path.dirname(url);
            } else {
                url = url.replace(ext, '');
            }

            // let meta = await import(file);
            let meta = require(file);

            Object.assign(data, {
                url
            }, meta.attributes);
        break;
    }

    return data;
};
