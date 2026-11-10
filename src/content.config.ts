import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The whole site is one folder, `site/`: each .md file is a page, at the address of its path.
// Any other property at the top of a file becomes one of the page's facts, under its title.
// `photo` is an image beside the page (./images/…), shown above the title.
const pages = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './site' }),
	schema: ({ image }) =>
		z.looseObject({
			title: z.string(),
			description: z.string().optional(),
			noindex: z.boolean().optional(),
			// A conversation: callouts as messages, comments in the margin (site/tuteur/demo.md).
			conversation: z.boolean().optional(),
			photo: image().optional(),
		}),
});

export const collections = { pages };
