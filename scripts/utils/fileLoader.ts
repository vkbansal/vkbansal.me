import * as path from 'path';
import * as fs from 'fs-extra';

import { fileHash, isProduction } from './miscUtils';

const IMAGE_EXT_REGEX = /\.(jpe?g|png|svg|gif)/i;

export function fileLoader(srcPath: string, filePath: string, outputPath: string) {
    const actualSrcPath = path.join(path.dirname(filePath), srcPath);
    const parsedPath = path.parse(srcPath);

    if (!fs.existsSync(actualSrcPath)) {
        throw new Error(`${actualSrcPath} does not exists`);
    }

    const hash = isProduction() ? fileHash(actualSrcPath).substr(0, 12) : parsedPath.name;

    if (IMAGE_EXT_REGEX.test(parsedPath.ext)) {
        const newPath = `/images/${hash}${parsedPath.ext}`;
        const newDiskPath = path.join(outputPath, `./${newPath}`);

        fs.ensureDirSync(path.dirname(newDiskPath));
        fs.copyFileSync(actualSrcPath, newDiskPath);

        return newPath;
    }

    return '';
}
