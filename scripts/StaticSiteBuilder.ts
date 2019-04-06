import * as path from 'path';

import globby from 'globby';
import chalk from 'chalk';
import { parseFragment, serialize } from 'parse5';
import fs from 'fs-extra';
import { isBefore } from 'date-fns';
import { partition } from 'lodash';

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
import { walkParse5, stringHash, isProduction } from './utils/miscUtils';

export interface StaticSiteBuilderOptions {
    srcGlob: string;
    outputPath: string;
    mainTemplatePath: string;
    blogPageTemplatePath: string;
}

export class StaticSiteBuilder {
    private readonly options: StaticSiteBuilderOptions;
    private globalCSS: string = '';
    private posts: Map<string, PostContents> = new Map();
    private pages: Map<string, PageContents> = new Map();
    private assest: RenderArgs['assets'] = {
        css: [],
        js: []
    };

    constructor(options: StaticSiteBuilderOptions) {
        this.options = options;
    }

    private addGlobalCSS(css: string) {
        this.globalCSS = this.globalCSS + `\n${css}`;
    }

    private processAssets(html: string, rawPath: string) {
        const htmlAST = parseFragment(html);

        const newAST = walkParse5(htmlAST as any, node => {
            if (node.tagName === 'img') {
                const src = node.attrs.find(attr => attr.name === 'src');

                if (!src) return node;
                const srcPath = src.value;

                const newPath = fileLoader(srcPath, rawPath, this.options.outputPath);

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
        const styles = file.styles();
        const css = await processCSS(styles, file.rawPath);

        this.addGlobalCSS(css!.css);

        let pageBody = await file.render({
            styles: css!.exports,
            posts: [...this.posts.values()],
            assets: this.assest,
            content: '',
            attributes: file.attributes,
            url: file.url,
            rawPath: file.rawPath
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
        const filePaths = await globby(this.options.srcGlob);
        // const templates = await globby(path.join(process.cwd(), 'templates'));
        // const

        /**
         * Read and build main CSS
         */
        const mainCSS = await processCSS(
            fs.readFileSync(path.join(process.cwd(), 'styles/main.scss'), 'utf8'),
            'main'
        );

        this.addGlobalCSS(mainCSS!.css);

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

        /**
         * Write CSS file
         */
        const cssFileHash = isProduction()
            ? `.${stringHash(this.globalCSS, 'sha1', 'hex').slice(0, 6)}`
            : '';
        const cssFilePath = path.join(
            this.options.outputPath,
            'styles',
            `styles${cssFileHash}.css`
        );
        console.log(chalk.magenta(`Writing: ${cssFilePath}`));
        fs.outputFileSync(cssFilePath, this.globalCSS, 'utf8');
        this.assest.css.push(`/styles/styles${cssFileHash}.css`);

        const mainTemplate = (await readFile(this.options.mainTemplatePath)) as TSFileContents;
        const blogPageTemplate = (await readFile(
            this.options.blogPageTemplatePath
        )) as TSFileContents;
        const allPosts = [...this.posts.values()];

        for (const [url, page] of this.pages) {
            console.log(chalk.cyan(`Rendering: ${url}`));
            const html = await mainTemplate.render({
                ...mainTemplate,
                styles: {},
                posts: [],
                content: page.content,
                assets: this.assest
            });

            const writePath = path.join(this.options.outputPath, page.url, 'index.html');
            console.log(chalk.magenta(`Writing: ${writePath}`));
            fs.outputFileSync(writePath, html, 'utf8');
        }

        for (const [url, post] of this.posts) {
            console.log(chalk.cyan(`Rendering: ${url}`));
            const postContent = await blogPageTemplate.render({
                ...blogPageTemplate,
                styles: {},
                posts: allPosts,
                content: post.content,
                assets: this.assest
            });

            const html = await mainTemplate.render({
                ...mainTemplate,
                styles: {},
                posts: [],
                content: postContent.toString(),
                assets: this.assest
            });

            const writePath = path.join(this.options.outputPath, post.url, 'index.html');

            console.log(chalk.magenta(`Writing: ${writePath}`));
            fs.outputFileSync(writePath, html, 'utf8');

            const includesPath = path.join(process.cwd(), '_includes');

            fs.readdirSync(includesPath).map(file => {
                fs.copyFileSync(
                    path.join(includesPath, file),
                    path.join(this.options.outputPath, file)
                );
            });
        }
    }
}
