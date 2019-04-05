import * as path from 'path';

import globby from 'globby';
import chalk from 'chalk';
import { parseFragment, serialize } from 'parse5';
import { partition } from 'lodash';
import fs from 'fs-extra';

import {
    PageTypes,
    AllContent,
    PostContents,
    TSFileContents,
    MDFileContents,
    RenderArgs
} from '../typings/common';
import { readFile } from './utils/readFile';
import { processCSS } from './utils/processCSS';
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
    private files: Record<string, string> = {};
    private posts: PostContents[] = [];
    private pages: Array<TSFileContents | MDFileContents> = [];
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

    private processAssets(html: string) {
        const htmlAST = parseFragment(html);

        const newAST = walkParse5(htmlAST as any, node => {
            // if (node.tagName in parse5Visitors) {
            //     return node;
            // }
            return node;
        });

        return serialize(newAST);
    }

    private processContent = async (file: AllContent) => {
        console.log(chalk.yellow(`Processing: ${file.rawPath}`));
        switch (file.type) {
            case PageTypes.PAGE_MD:
            case PageTypes.POST:
                let mdbody = file.content;
                this.files[file.url] = this.processAssets(mdbody);
                break;
            case PageTypes.PAGE_TS:
                await this.processTSFile(file);
                break;
        }
    };

    private processTSFile = async (file: TSFileContents, skipAddToFiles: boolean = false) => {
        const styles = file.styles();
        const css = await processCSS(styles, file.rawPath);
        this.addGlobalCSS(css!.css);

        let pageBody = await file.render({
            ...file,
            styles: css!.exports,
            posts: this.posts,
            assets: this.assest
        });

        if (skipAddToFiles) return pageBody;

        if (typeof pageBody === 'string') {
            this.files[file.url] = pageBody;
        } else if (Array.isArray(pageBody)) {
            pageBody.forEach(page => {
                this.files[page.url] = page.cotent;
            });
        } else {
            this.files[pageBody.url] = pageBody.cotent;
        }

        return pageBody;
    };

    public async build() {
        let filePaths = await globby(this.options.srcGlob);

        const mainCSS = await processCSS(
            fs.readFileSync(path.join(process.cwd(), 'styles/main.scss'), 'utf8'),
            'main'
        );

        this.addGlobalCSS(mainCSS!.css);

        const files = await Promise.all(filePaths.map(readFile));

        const [posts, pages] = partition(files, file => file.type === PageTypes.POST);

        this.posts = (posts as PostContents[]).filter(
            post => post.attributes && !post.attributes.isDraft
        );
        this.pages = pages as Array<TSFileContents | MDFileContents>;

        await Promise.all(files.map(this.processContent));

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

        for (const page of this.pages) {
            console.log(chalk.cyan(`Rendering: ${page.url}`));
            const html = await mainTemplate.render({
                ...mainTemplate,
                styles: {},
                posts: this.posts,
                content: this.files[page.url],
                assets: this.assest
            });

            const writePath = path.join(this.options.outputPath, page.url, 'index.html');
            console.log(chalk.magenta(`Writing: ${writePath}`));
            fs.outputFileSync(writePath, html, 'utf8');
        }

        for (const post of this.posts) {
            console.log(chalk.cyan(`Rendering: ${post.url}`));
            const postContent = await blogPageTemplate.render({
                ...blogPageTemplate,
                styles: {},
                posts: this.posts,
                content: this.files[post.url],
                assets: this.assest
            });

            const html = await mainTemplate.render({
                ...mainTemplate,
                styles: {},
                posts: this.posts,
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
