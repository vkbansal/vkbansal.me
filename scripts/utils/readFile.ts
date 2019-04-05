import * as path from 'path';
import * as fs from 'fs-extra';

import { getURL, BLOG_REGEX, renderMarkdown } from './miscUtils';

import {
    AllContent,
    TSFileContents,
    MDFileContents,
    PostContents,
    PageTypes
} from '../../typings/common';

export async function readFile(filePath: string): Promise<AllContent> {
    const { ext, name, dir } = path.parse(filePath);
    const absPath = path.resolve(process.cwd(), filePath);
    const url = getURL(dir, name);

    switch (ext) {
        case '.ts':
            const tsContents = await import(absPath);

            if (!Object.prototype.hasOwnProperty.call(tsContents, 'render')) {
                throw new Error(`"${filePath}" does not have a export named "render"!`);
            }

            const tsFileContents: TSFileContents = {
                type: PageTypes.PAGE_TS,
                url,
                render: tsContents.render,
                styles: tsContents.styles,
                attributes: tsContents.attributes,
                rawPath: filePath
            };

            return tsFileContents;
        case '.md':
            const mdContents = renderMarkdown(fs.readFileSync(absPath, 'utf8'));

            if (BLOG_REGEX.test(url)) {
                type: PageTypes.POST;

                const postContents: PostContents = {
                    type: PageTypes.POST,
                    url,
                    attributes: mdContents.attributes,
                    content: mdContents.body,
                    date: '',
                    rawPath: filePath
                };

                return postContents;
            }

            const mdFileContents: MDFileContents = {
                type: PageTypes.PAGE_MD,
                url,
                attributes: mdContents.attributes,
                content: mdContents.body,
                rawPath: filePath
            };

            return mdFileContents;

        default:
            throw new Error(`extension "${ext}" not supported!`);
    }
}
