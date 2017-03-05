import glob from 'glob';
import Promise from 'bluebird';
import { partition } from 'lodash';
import { isBefore } from 'date-fns';

import parseFilepath from '../utils/parse-path';

const globPromise = Promise.promisify(glob);

export default async function() {
    let files = await globPromise('pages/**/*.@(js|md)');

    files = await Promise.all(files.map(parseFilepath));

    let [posts, pages] = partition(files, (file) => file.isPost);

    posts.sort((a, b) => isBefore(a.date, b.date) ? 1 : -1);

    return {pages, posts};
};