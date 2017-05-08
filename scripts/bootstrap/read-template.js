import path from 'path';

import fs from 'fs-extra';
import handlebars from 'handlebars';

export default async function (filename) {
    const template = await fs.readFile(path.resolve(__dirname, '../templates', filename), 'utf8');

    return handlebars.compile(template);
}
