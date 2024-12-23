import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const postsCollection = defineCollection({
	loader: glob({ base: './src/posts', pattern: '**/*.md' }),
	schema: z.object({
		draft: z.boolean().optional(),
		title: z.string(),
		date: z.date(),
		description: z.string(),
		tags: z.array(z.string()).min(1),
	}),
});

export const collections = {
	posts: postsCollection,
};
