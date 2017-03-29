import path from 'path';

import handlebars from 'handlebars';

import fs from '../utils/fs-promisified';

export default async function (filename) {
    const template = await fs.readFileAsync(path.resolve(__dirname, '../templates', filename), 'utf8');

    return handlebars.compile(template);
}
