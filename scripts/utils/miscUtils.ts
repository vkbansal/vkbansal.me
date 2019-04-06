import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import frontMatter from 'front-matter';
import markdown from 'markdown-it';
import mathjax from 'markdown-it-mathjax';
import decorate from 'markdown-it-decorate';
import { highlight, getLanguage } from 'illuminate-js';
import { DefaultTreeElement } from 'parse5';

import { MDFileAttributes } from '../../typings/common';

export const BLOG_REGEX = /^\/?blog/;
export const INDEX_FILES_REGEX = /(index|readme)/i;
export const PAGES_REGEX = /^pages/;
export const POST_REGEX = /^(\d{4}-\d{2}-\d{2})-([\w-]+)$/;

export function getURL(dir: string, name: string) {
    let url = dir.replace(PAGES_REGEX, '');
    let finalIdentifier = name;

    if (INDEX_FILES_REGEX.test(finalIdentifier)) {
        /**
         * if finalIdentifier is 'readme' or 'index'
         * update it to the last part of url
         * and also update the url
         *
         * @example before
         * finalIdentifier = 'index'
         * url =  '/about/'
         */
        finalIdentifier = path.basename(url);
        url = url.replace(finalIdentifier, '').slice(0, -1);

        /**
         * @example After
         * finalIdentifier = 'about'
         * url =  '/'
         */
    }

    const match = finalIdentifier.match(POST_REGEX);

    if (match && !BLOG_REGEX.test(url)) {
        throw new Error(`${path.join(dir, name)} follows invalid naming schema`);
    }

    if (match) {
        const [, , slug] = match;
        finalIdentifier = slug;
    }

    return `${url}/${finalIdentifier}`;

    return name;
}

export function isProduction() {
    return process.env.NODE_ENV === 'production';
}

export function stringHash(
    content: string,
    algorithm = 'sha1',
    encoding: crypto.HexBase64Latin1Encoding = 'base64'
): string {
    const hash = crypto.createHash(algorithm);
    hash.update(content, 'utf8');
    return hash.digest(encoding);
}

export function fileHash(filePath: string): string {
    const data = fs.readFileSync(filePath, 'utf8');

    return stringHash(data);
}

export type CallBack = (node: DefaultTreeElement) => DefaultTreeElement;

export function walkParse5(node: DefaultTreeElement, callback: CallBack) {
    if (Array.isArray(node.childNodes) && node.childNodes.length > 0) {
        node.childNodes = node.childNodes.map(childNode => walkParse5(childNode as any, callback));
    }

    return callback(node);
}

const md = markdown({
    html: true,
    highlight(text, language) {
        if (getLanguage(language)) {
            return highlight(text, language);
        }
        return '';
    }
})
    .use(mathjax)
    .use(decorate);

export function renderMarkdown(content: string) {
    const meta = frontMatter<MDFileAttributes | undefined>(content);

    return { attributes: meta.attributes, body: md.render(meta.body) };
}

