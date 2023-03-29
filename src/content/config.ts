import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
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
