export enum PageTypes {
    PAGE_MD = 'PAGE_MD',
    PAGE_TS = 'PAGE_TS',
    POST = 'POST'
}

export interface Page {
    url: string;
    cotent: string;
}

export interface BaseFileContents {
    type: PageTypes;
    attributes?: any;
    url: string;
    rawPath: string;
}

export interface MDFileContents extends BaseFileContents {
    type: PageTypes.PAGE_MD;
    content: string;
}

export interface RenderArgs extends BaseFileContents {
    styles: Record<string, string>;
    posts: PostContents[];
    content?: string;
    assets: Record<'css' | 'js', string[]>;
}

export type RenderedContent = string | Page | Page[];

export interface TSFileContents extends BaseFileContents {
    type: PageTypes.PAGE_TS;
    render(args: RenderArgs): RenderedContent | Promise<RenderedContent>;
    styles(): string;
}

export interface PostContents extends BaseFileContents {
    type: PageTypes.POST;
    content: string;
    date: string;
}

export type AllContent = TSFileContents | PostContents | MDFileContents;
