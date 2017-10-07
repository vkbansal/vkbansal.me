import util from 'util';

import glob from 'glob';
import { partition } from 'lodash';
import { isBefore } from 'date-fns';

import parseFilepath from '../utils/parse-path';

const globPromise = util.promisify(glob);

export default async function () {
    let files = await globPromise('pages/**/*.@(js|md)');

    files = await Promise.all(files.map(parseFilepath));

    let [posts, pages] = partition(files, file => file.isPost);

    if (process.env.NODE_ENV === 'production') {
        posts = posts.filter(post => !post.draft);
        pages = pages.filter(page => !page.draft);
    }

    posts.sort((a, b) => isBefore(a.date, b.date) ? 1 : -1); // eslint-disable-line no-confusing-arrow

    return { pages, posts };
}
