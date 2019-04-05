import * as path from 'path';
import * as fs from 'fs-extra';

import { DefaultTreeElement } from 'parse5';

import { AllContent } from '../../typings/common';
import { fileHash } from './miscUtils';

export function img(node: DefaultTreeElement, file: AllContent): DefaultTreeElement {
    const PROD = process.env.NODE_ENV === 'production';
    const src = node.attrs.find(attr => attr.name === 'src');

    if (!src) return node;

    const srcPath = src.value;
    const actualSrcPath = path.join(path.dirname(file.rawPath), srcPath);
    const parsedPath = path.parse(srcPath);

    if (!fs.existsSync(actualSrcPath)) {
        throw new Error(`${actualSrcPath} does not exists`);
    }

    const hash = PROD ? fileHash(actualSrcPath).substr(0, 12) : parsedPath.name;
    const newPath = `/images/${hash}${parsedPath.ext}`;

    src.value = newPath;

    console.log(hash, actualSrcPath);

    return node;
}
