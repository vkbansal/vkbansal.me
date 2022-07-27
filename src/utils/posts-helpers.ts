import { isBefore, isAfter, parseISO } from 'date-fns';
import type { MyPostInstance } from './types';

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

export function sortPostsByRecency(posts: MyPostInstance[]): MyPostInstance[] {
	const copy = posts.slice(0);

	return copy.sort((a, b) => {
		const aDate = parseDate(a.frontmatter.date);
		const bDate = parseDate(b.frontmatter.date);

		if (isBefore(aDate, bDate)) {
			return 1;
		}

		if (isAfter(aDate, bDate)) {
			return -1;
		}

		return 0;
	});
}

export function getPrevAndNextPosts(
	allPosts: MyPostInstance[],
	currentPostUrl: string,
): [previousPost: MyPostInstance | null, nextPost: MyPostInstance | null] {
	const sortedPosts = sortPostsByRecency(allPosts);
	const postIndex = sortedPosts.findIndex((post) => post.url === currentPostUrl);

	if (postIndex === -1) {
		return [null, null];
	}

	if (postIndex === 0) {
		return [sortedPosts[postIndex + 1], null];
	}

	if (postIndex === sortedPosts.length - 1) {
		return [null, sortedPosts[postIndex - 1]];
	}

	return [sortedPosts[postIndex + 1], sortedPosts[postIndex - 1]];
}
