import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import { isValid as isValidDate } from 'date-fns';
import frontMatter from 'front-matter';
import markdown from 'markdown-it';
import mathjax from 'markdown-it-mathjax';
import decorate from 'markdown-it-decorate';
import { highlight, getLanguage, addLanguage, addPlugin } from 'illuminate-js';
import {
    javascript,
    typescript,
    json5,
    markup,
    markdown as mdLang,
    scss,
    sql,
    css,
    bash
} from 'illuminate-js/lib/languages';
import { showLanguage } from 'illuminate-js/lib/plugins/showLanguage';
import { DefaultTreeElement } from 'parse5';

addLanguage('javascript', javascript);
addLanguage('js', javascript);
addLanguage('css', css);
addLanguage('scss', scss);
addLanguage('typescript', typescript);
addLanguage('ts', typescript);
addLanguage('json', json5);
addLanguage('html', markup);
addLanguage('html', markup);
addLanguage('xml', markup);
addLanguage('svg', markup);
addLanguage('markdown', mdLang);
addLanguage('md', mdLang);
addLanguage('sql', sql);
addLanguage('bash', bash);
addLanguage('sh', bash);

addPlugin(showLanguage);

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

    return `${url}/${finalIdentifier}/`;
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

export function validatePostAttributes(attributes: MDFileAttributes): string | boolean {
    if (
        !('title' in attributes) ||
        typeof attributes.title !== 'string' ||
        attributes.title.length < 3
    ) {
        return 'title is not valid';
    }

    if (
        !('date' in attributes) ||
        !(attributes.date instanceof Date) ||
        !isValidDate(attributes.date)
    ) {
        return 'date is not valid';
    }

    if (!('description' in attributes) || attributes.description.length < 3) {
        return 'description is not valid';
    }

    if (!('tag' in attributes) || !Array.isArray(attributes.tag) || attributes.tag.length === 0) {
        return 'tag is not an array of strings';
    }

    if (!('author' in attributes) || !attributes.author.name || !attributes.author.site) {
        return 'author is not in specified format { name: string; site: string; }';
    }

    return true;
}

export function getPageNumbers(
    currentPage: number,
    totalPages: number,
    primaryGroupLimit = 5,
    secondaryGroupLimit = 2
): Array<number | null> {
    if (currentPage < 1 || totalPages < 1 || primaryGroupLimit < 1 || secondaryGroupLimit < 1) {
        throw new Error('All the arguments must be +ve integers');
    }

    if (currentPage > totalPages) {
        throw new Error('currentPage cannot be greater than totalPages');
    }

    // if (primaryGroupLimit > totalPages) {
    //     throw new Error('primaryGroupLimit cannot be greater than totalPages');
    // }

    // if (secondaryGroupLimit > totalPages) {
    //     throw new Error('secondaryGroupLimit cannot be greater than totalPages');
    // }

    const length = primaryGroupLimit + 2 * secondaryGroupLimit + 2;
    const lastIndex = length - 1;
    const mid = Math.ceil(length / 2);
    const midIndex = mid - 1;

    if (totalPages <= length) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | null> = Array.from({ length });

    for (let i = 0; i < secondaryGroupLimit; i++) {
        pages[i] = i + 1; // fill first elements
        pages[lastIndex - i] = totalPages - i; // fill end elements
    }

    pages[midIndex] = currentPage;

    pages[lastIndex - secondaryGroupLimit] = null;
    pages[secondaryGroupLimit] = null;

    const mid2 = Math.ceil(primaryGroupLimit / 2);

    if (currentPage <= mid) {
        for (let i = 0; i < mid + secondaryGroupLimit; i++) {
            pages[i] = i + 1;
        }
    } else if (currentPage >= totalPages - midIndex) {
        for (let i = 0; i < mid + secondaryGroupLimit; i++) {
            pages[i + midIndex - secondaryGroupLimit] =
                i + totalPages - secondaryGroupLimit - midIndex;
        }
    } else {
        pages[midIndex] = currentPage;

        for (let i = 1; i < mid2; i++) {
            pages[midIndex - i] = currentPage - i;
            pages[midIndex + i] = currentPage + i;
        }
    }

    return pages;
}
