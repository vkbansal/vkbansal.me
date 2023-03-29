import type { CollectionEntry } from 'astro:content';
import dayjs from 'dayjs';

export function times<T = unknown>(n: number, callback: (n: number) => T): T[] {
	const result: T[] = [];

	for (let i = 0; i < n; i++) {
		result.push(callback(i));
	}

	return result;
}

export function postSlugToURL(slug: string): string {
	const finalSlug = slug
		.split('/')
		.slice(1)
		.join('/')
		.replace(/\.mdx?$/, '');

	return `/blog/${finalSlug}`;
}

export function filterPostsCollection(post: CollectionEntry<'posts'>): boolean {
	const isDraft = !!post.data.draft;
	const date = dayjs(post.data.date);
	const today = new Date();

	if (isDraft) {
		return false;
	}

	return date.isBefore(today) || date.isSame(today);
}

export function sortPostsCollection(posts: CollectionEntry<'posts'>[]): void {
	posts.sort((a, b) => {
		if (dayjs(a.data.date).isBefore(b.data.date)) {
			return 1;
		}

		if (dayjs(a.data.date).isAfter(b.data.date)) {
			return -1;
		}

		return 0;
	});
}
