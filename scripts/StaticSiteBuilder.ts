import * as path from 'path';

import globby from 'globby';
import chalk from 'chalk';
import { parseFragment, serialize } from 'parse5';
import fs from 'fs-extra';
import { isBefore } from 'date-fns';
import { partition } from 'lodash';
import chokidar from 'chokidar';

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

export class StaticSiteBuilder {
    private css: string = '';
    private posts: Map<string, PostContents> = new Map();
    private pages: Map<string, PageContents> = new Map();
    private assest: RenderArgs['assets'] = {
        css: [],
        js: []
    };
    private mainTemplate!: TSFileContents;
    private blogPageTemplate!: TSFileContents;

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
                        rawPath: file.rawPath,
                        writtenToDisk: false
                    });
                } else {
                    this.pages.set(file.url, {
                        type: PageType.PAGE,
                        content,
                        attributes: file.attributes!,
                        url: file.url,
                        rawPath: file.rawPath,
                        writtenToDisk: false
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
                rawPath: file.rawPath,
                writtenToDisk: false
            });
        } else if (Array.isArray(pageBody)) {
            pageBody.forEach(page => {
                this.pages.set(page.url, {
                    content: this.processAssets(page.content, file.rawPath),
                    type: PageType.PAGE,
                    attributes: file.attributes,
                    url: page.url,
                    rawPath: file.rawPath,
                    writtenToDisk: false
                });
            });
        } else {
            this.pages.set(pageBody.url, {
                url: pageBody.url,
                content: this.processAssets(pageBody.content, file.rawPath),
                type: PageType.PAGE,
                attributes: file.attributes,
                rawPath: file.rawPath,
                writtenToDisk: false
            });
        }
    };

    private buildCSS = async () => {
        /**
         * Read and build main CSS
         */
        const mainCSS = await processCSS(
            fs.readFileSync(path.join(process.cwd(), 'styles/main.scss'), 'utf8')
        );

        this.addCSS(mainCSS!.css);

        useStyles.stylesMap.forEach(this.addCSS);

        /**
         * Write CSS file
         */
        const cssFileHash = isPROD() ? `.${stringHash(this.css, 'sha1', 'hex').slice(0, 6)}` : '';
        const cssFilePath = path.join(options.outPath, 'styles', `styles${cssFileHash}.css`);
        console.log(chalk.magenta(`Writing: ${cssFilePath}`));
        fs.outputFileSync(cssFilePath, this.css, 'utf8');
        this.assest.css.push(`/styles/styles${cssFileHash}.css`);
    };

    private renderAndWritePages = async () => {
        const writeFilePromises: Array<Promise<any>> = [];
        const isProduction = isPROD();

        /**
         * Render and Write Pages
         */
        for (const [url, page] of this.pages) {
            if (page.writtenToDisk) continue;

            console.log(chalk.cyan(`Rendering: ${url}`));
            const html =
                '<!DOCTYPE html>' +
                (await this.mainTemplate.render({
                    posts: [],
                    content: page.content,
                    assets: this.assest,
                    url,
                    attributes: page.attributes,
                    rawPath: page.rawPath,
                    isProduction,
                    isPost: false
                }));

            const writePath = path.join(options.outPath, page.url, 'index.html');
            console.log(chalk.magenta(`Writing: ${writePath}`));
            writeFilePromises.push(fs.outputFile(writePath, html, 'utf8'));
            page.writtenToDisk = true;
        }

        await Promise.all(writeFilePromises);
    };

    private renderAndWritePosts = async () => {
        const writeFilePromises: Array<Promise<any>> = [];
        const isProduction = isPROD();
        /**
         * Render and Write Posts
         */
        for (const [url, post] of this.posts) {
            if (post.writtenToDisk) continue;

            console.log(chalk.cyan(`Rendering: ${url}`));
            const postContent = await this.blogPageTemplate.render({
                attributes: post.attributes,
                posts: [...this.posts.values()],
                content: post.content,
                assets: this.assest,
                url,
                rawPath: post.rawPath,
                isProduction,
                isPost: true
            });

            const html =
                '<!DOCTYPE html>' +
                (await this.mainTemplate.render({
                    attributes: post.attributes,
                    posts: [],
                    content: postContent.toString(),
                    assets: this.assest,
                    url,
                    rawPath: post.rawPath,
                    isProduction,
                    isPost: true
                }));

            const writePath = path.join(options.outPath, post.url, 'index.html');

            console.log(chalk.magenta(`Writing: ${writePath}`));
            writeFilePromises.push(fs.outputFile(writePath, html, 'utf8'));
            post.writtenToDisk = true;
        }

        await Promise.all(writeFilePromises);
    };

    private handleChange = async (path: string) => {
        console.log(chalk.yellow.bold(`${path} changed`));
        if (path.startsWith('pages')) {
            const content = await readFile(path);
            await this.processContent(content);
            await this.buildCSS();

            if ((content as MDFileContents).isPost) {
                await this.renderAndWritePosts();
            } else {
                await this.renderAndWritePages();
            }
        } else if (path.startsWith('templates')) {
            await this.build();
        } else if (path.startsWith('styles')) {
            await this.buildCSS();
        }
    };

    public async watch() {
        if (isPROD()) {
            console.log(chalk.red('--watch can be run only in development mode!'));
            return;
        }

        // await this.build();
        const watcher = chokidar.watch([
            'pages/**/*.{md,tsx,json}',
            'styles/**/*.scss',
            'templates/**/*.{tsx,json}'
        ]);

        console.log(chalk.yellow.bold('My watch has started'));
        watcher.on('change', this.handleChange);
    }

    public async build() {
        const isProduction = isPROD();
        const filePaths = await globby(path.join(options.srcPath, options.srcGlob));
        this.mainTemplate = (await readFile(options.mainTemplatePath)) as TSFileContents;
        this.blogPageTemplate = (await readFile(options.blogPageTemplatePath)) as TSFileContents;

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
        await Promise.all(posts.map(this.processContent));

        // Then process pages
        await Promise.all(pages.map(this.processContent));

        // render template with no content to extract CSS
        await this.mainTemplate.render({
            posts: [],
            content: '',
            assets: this.assest,
            isProduction,
            isPost: false,
            attributes: {} as any,
            url: '',
            rawPath: ''
        });

        // render template with no content to extract CSS
        await this.blogPageTemplate.render({
            posts: [],
            content: '',
            assets: this.assest,
            isProduction,
            isPost: true,
            attributes: {} as any,
            url: '',
            rawPath: ''
        });

        await this.buildCSS();
        await this.renderAndWritePages();
        await this.renderAndWritePosts();

        const includesPath = path.join(process.cwd(), options.includesPath);

        fs.readdirSync(includesPath).map(file => {
            const src = path.join(includesPath, file);
            const dest = path.join(process.cwd(), options.outPath, file);
            console.log(chalk.magenta(`Copying ${file}`));
            fs.copyFileSync(src, dest);
        });
    }
}
