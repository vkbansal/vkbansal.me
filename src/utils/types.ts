import type { MarkdownInstance } from 'astro';

export interface PostFrontMatter {
	title: string;
	date: string;
	description: string;
	tags: string[];
	draft?: boolean;
}

export type MyPostInstance = MarkdownInstance<PostFrontMatter>;
