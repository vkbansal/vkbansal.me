import * as path from 'path';

import globby from 'globby';
import chalk from 'chalk';
import { parseFragment, serialize } from 'parse5';
import fs from 'fs-extra';
import { isBefore } from 'date-fns';
import { partition } from 'lodash';
import { minify as minifyHTML, Options as MinifyHTMLOptions } from 'html-minifier';

import {
    PageType,
    AllFileContent,
    PostContents,
    PageContents,
    TSFileContents,
    MDFileContents,
    RenderArgs,
    FileType
} from '../typings/common';
import { readFile } from './utils/readFile';
import { processCSS } from './utils/processCSS';
import { fileLoader } from './utils/fileLoader';
import {
    walkParse5,
    stringHash,
    isProduction as isPROD,
    validatePostAttributes
} from './utils/miscUtils';
import { useStyles } from './useStyles';
import options from './options.json';

const minifyHTMLOptions: MinifyHTMLOptions = {
    collapseWhitespace: true,
    removeComments: true
};

export class StaticSiteBuilder {
    private css: string = '';
    private posts: Map<string, PostContents> = new Map();
    private pages: Map<string, PageContents> = new Map();
    private assest: RenderArgs['assets'] = {
        css: [],
        js: []
    };

    private addCSS = (css: string) => {
        this.css = this.css + `\n${css}`;
    };

    private processAssets(html: string, rawPath: string) {
        const htmlAST = parseFragment(html);

        const newAST = walkParse5(htmlAST as any, node => {
            if (node.tagName === 'img') {
                const src = node.attrs.find(attr => attr.name === 'src');

                if (!src) return node;
                const srcPath = src.value;

                const newPath = fileLoader(srcPath, rawPath);

                src.value = newPath;

                return node;
            }
            return node;
        });

        return serialize(newAST);
    }

    private processContent = async (file: AllFileContent) => {
        console.log(chalk.yellow(`Processing: ${file.rawPath}`));
        switch (file.type) {
            case FileType.MD:
                const content = this.processAssets(file.content, file.rawPath);
                if (file.isPost) {
                    const test = validatePostAttributes(file.attributes!);

                    if (typeof test === 'string') {
                        console.log(chalk.red.bold(test));
                        console.log(chalk.yellow.bold(file.rawPath));
                        process.exit(1);
                    }

                    this.posts.set(file.url, {
                        type: PageType.POST,
                        content,
                        attributes: file.attributes!,
                        url: file.url,
                        rawPath: file.rawPath
                    });
                } else {
                    this.pages.set(file.url, {
                        type: PageType.PAGE,
                        content,
                        attributes: file.attributes!,
                        url: file.url,
                        rawPath: file.rawPath
                    });
                }
                break;
            case FileType.TS:
                await this.processTSFile(file);
                break;
        }
    };

    private processTSFile = async (file: TSFileContents) => {
        let pageBody = await file.render({
            posts: [...this.posts.values()],
            assets: this.assest,
            content: '',
            attributes: file.attributes,
            url: file.url,
            rawPath: file.rawPath,
            isPost: false,
            isProduction: isPROD()
        });

        if (typeof pageBody === 'string') {
            this.pages.set(file.url, {
                content: this.processAssets(pageBody, file.rawPath),
                type: PageType.PAGE,
                attributes: file.attributes,
                url: file.url,
                rawPath: file.rawPath
            });
        } else if (Array.isArray(pageBody)) {
            pageBody.forEach(page => {
                this.pages.set(page.url, {
                    content: this.processAssets(page.content, file.rawPath),
                    type: PageType.PAGE,
                    attributes: file.attributes,
                    url: page.url,
                    rawPath: file.rawPath
                });
            });
        } else {
            this.pages.set(pageBody.url, {
                url: pageBody.url,
                content: this.processAssets(pageBody.content, file.rawPath),
                type: PageType.PAGE,
                attributes: file.attributes,
                rawPath: file.rawPath
            });
        }

        return pageBody;
    };

    public async build() {
        const isProduction = isPROD();
        const filePaths = await globby(path.join(options.srcPath, options.srcGlob));
        // const templates = await globby(path.join(process.cwd(), 'templates'));
        // const

        /**
         * Read and build main CSS
         */
        const mainCSS = await processCSS(
            fs.readFileSync(path.join(process.cwd(), 'styles/main.scss'), 'utf8'),
            'main'
        );

        this.addCSS(mainCSS!.css);

        /**
         * Process All files
         */
        const files = await Promise.all(filePaths.map(readFile));

        let [posts, pages] = partition(files, file => (file as MDFileContents).isPost);

        posts = (posts as MDFileContents[])
            .filter(post => !post.attributes!.isDraft)
            .sort((a, b) => (isBefore(a.attributes!.date, b.attributes!.date) ? 1 : -1));
        // this.pages = pages as Array<TSFileContents | MDFileContents>;

        // First process posts
        for (const post of posts) {
            await this.processContent(post);
        }

        // Then process pages
        for (const page of pages) {
            await this.processContent(page);
        }

        useStyles.stylesMap.forEach(this.addCSS);

        /**
         * Write CSS file
         */
        const cssFileHash = isProduction
            ? `.${stringHash(this.css, 'sha1', 'hex').slice(0, 6)}`
            : '';
        const cssFilePath = path.join(options.outPath, 'styles', `styles${cssFileHash}.css`);
        console.log(chalk.magenta(`Writing: ${cssFilePath}`));
        fs.outputFileSync(cssFilePath, this.css, 'utf8');
        this.assest.css.push(`/styles/styles${cssFileHash}.css`);

        const mainTemplate = (await readFile(options.mainTemplatePath)) as TSFileContents;
        const blogPageTemplate = (await readFile(options.blogPageTemplatePath)) as TSFileContents;
        const allPosts = [...this.posts.values()];

        /**
         * Render and Write Pages
         */
        for (const [url, page] of this.pages) {
            console.log(chalk.cyan(`Rendering: ${url}`));
            const html = (await mainTemplate.render({
                posts: [],
                content: page.content,
                assets: this.assest,
                url,
                attributes: page.attributes,
                rawPath: page.rawPath,
                isProduction,
                isPost: false
            })) as string;

            const writePath = path.join(options.outPath, page.url, 'index.html');
            console.log(chalk.magenta(`Writing: ${writePath}`));
            fs.outputFileSync(writePath, minifyHTML(html, minifyHTMLOptions), 'utf8');
        }

        /**
         * Render and Write Posts
         */
        for (const [url, post] of this.posts) {
            console.log(chalk.cyan(`Rendering: ${url}`));
            const postContent = await blogPageTemplate.render({
                attributes: post.attributes,
                posts: allPosts,
                content: post.content,
                assets: this.assest,
                url,
                rawPath: post.rawPath,
                isProduction,
                isPost: true
            });

            const html = (await mainTemplate.render({
                attributes: post.attributes,
                posts: [],
                content: postContent.toString(),
                assets: this.assest,
                url,
                rawPath: post.rawPath,
                isProduction,
                isPost: true
            })) as string;

            const writePath = path.join(options.outPath, post.url, 'index.html');

            console.log(chalk.magenta(`Writing: ${writePath}`));
            fs.outputFileSync(writePath, minifyHTML(html, minifyHTMLOptions), 'utf8');

            const includesPath = path.join(process.cwd(), options.includesPath);

            fs.readdirSync(includesPath).map(file => {
                fs.copyFileSync(path.join(includesPath, file), path.join(options.outPath, file));
            });
        }
    }
}
