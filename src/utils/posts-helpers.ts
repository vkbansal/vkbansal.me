import path from 'node:path';

import type { MarkdownInstance } from 'astro';
import { isBefore, isAfter, parseISO } from 'date-fns';
import type { MyPostInstance, PostFrontMatter } from './types';

export function parseDate(date: unknown): Date {
	if (typeof date === 'string') {
		return parseISO(date);
	}

	if (typeof date === 'number') {
		return new Date(date);
	}

	if (date instanceof Date) {
		return date;
	}

	throw new Error(`Encountered unspported type for date: ${typeof date}`);
}

export function processPosts(posts:MarkdownInstance<PostFrontMatter>[]): MyPostInstance[] {
	const copy = posts.slice(0);

	const processed = copy.sort((a, b) => {
		const aDate = parseDate(a.frontmatter.date);
		const bDate = parseDate(b.frontmatter.date);

		if (isBefore(aDate, bDate)) {
			return 1;
		}

		if (isAfter(aDate, bDate)) {
			return -1;
		}

		return 0;
	}).map(post => {
		const slug = path.basename(post.file, '.md');

		return {
			...post,
			url: `/blog/${slug}/`,
			slug
		};
	});

	return processed;
}
