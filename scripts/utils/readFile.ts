import * as path from 'path';
import * as fs from 'fs-extra';

import { getURL, renderMarkdown } from './miscUtils';

import { AllFileContent, TSFileContents, MDFileContents, FileType } from '../../typings/common';

export async function readFile(filePath: string): Promise<AllFileContent> {
    const { ext, name, dir } = path.parse(filePath);
    const absPath = path.resolve(process.cwd(), filePath);
    const url = getURL(dir, name);

    switch (ext) {
        case '.ts':
        case '.tsx':
            const tsContents = await import(absPath);

            if (!Object.prototype.hasOwnProperty.call(tsContents, 'render')) {
                throw new Error(`"${filePath}" does not have a export named "render"!`);
            }

            const tsFileContents: TSFileContents = {
                type: FileType.TS,
                url,
                render: tsContents.render,
                styles: tsContents.styles,
                attributes: tsContents.attributes,
                rawPath: filePath
            };

            return tsFileContents;
        case '.md':
            const mdContents = renderMarkdown(fs.readFileSync(absPath, 'utf8'));
            const isPost = url.startsWith('/blog');

            if (isPost && !mdContents.attributes) {
                throw new Error(
                    `${filePath} is a post, but does not have attributes defined in header`
                );
            }

            const mdFileContents: MDFileContents = {
                type: FileType.MD,
                url,
                attributes: mdContents.attributes,
                content: mdContents.body,
                rawPath: filePath,
                isPost
            };

            return mdFileContents;

        default:
            throw new Error(`extension "${ext}" not supported!`);
    }
}
