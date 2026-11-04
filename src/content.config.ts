import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The whole site is one folder, `site/`: each .md file is a page, at the address of its path.
// Any other property at the top of a file becomes one of the page's facts, under its title.
const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './site' }),
	schema: z.looseObject({
		title: z.string(),
		description: z.string().optional(),
		noindex: z.boolean().optional(),
	}),
});

export const collections = { pages };
