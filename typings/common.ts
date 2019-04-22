export enum FileType {
    MD = 'MD',
    TS = 'TS'
}

export enum PageType {
    POST = 'POST',
    PAGE = 'PAGE'
}

export interface MDFileAttributes {
    title: string;
    date: Date;
    description: string;
    tag: string[];
    author: {
        name: string;
        site: string;
    };
    isDraft?: boolean;
    math?: boolean;
}

export interface BaseFileContents<T = any> {
    attributes: T;
    url: string;
    rawPath: string;
}

export interface PostContents extends BaseFileContents<MDFileAttributes> {
    type: PageType.POST;
    content: string;
    writtenToDisk: boolean;
}

export interface PageContents extends BaseFileContents {
    type: PageType.PAGE;
    content: string;
    writtenToDisk: boolean;
}

export interface MDFileContents extends BaseFileContents<MDFileAttributes | undefined> {
    type: FileType.MD;
    content: string;
    isPost: boolean;
}

export interface RenderArgs extends BaseFileContents<MDFileAttributes | undefined> {
    posts: PostContents[];
    assets: Record<'css' | 'js', string[]>;
    content: string;
    isProduction: boolean;
    isPost: boolean;
}

export interface Page {
    url: string;
    content: string;
}

export type RenderedContent = string | Page | Page[];

export interface TSFileContents extends BaseFileContents {
    type: FileType.TS;
    render(args: RenderArgs): RenderedContent | Promise<RenderedContent>;
    styles(): string;
}

export type AllFileContent = TSFileContents | MDFileContents;
export type AllContent = PageContents | PostContents;
