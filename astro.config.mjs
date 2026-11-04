// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';
import remarkFrench from './src/plugins/remark-french.mjs';
import rehypeExternalLinks from './src/plugins/rehype-external-links.mjs';

const site = 'https://ulyssegagne.com';

// https://astro.build/config
export default defineConfig({
	site,
	// Each page is one HTML file, so its address is its path, as the top of the page shows it:
	// ulyssegagne.com/projets/hide-and-stalk, no slash at the end, served by GitHub Pages without a redirect.
	build: {
		format: 'file',
		// The styles sit inside each page: one request per page.
		inlineStylesheets: 'always',
	},
	trailingSlash: 'never',
	// The next page loads as soon as the mouse is over its link.
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	markdown: {
		// Black and white: code blocks stay plain, without syntax colors.
		syntaxHighlight: false,
		// The remark pipeline, so that Obsidian's extras (callouts, folds, highlights) render too,
		// with French spacing (src/plugins/remark-french.mjs).
		processor: unified({
			remarkPlugins: [remarkObsidian, remarkFrench],
			// A link to another site opens in a new tab (src/plugins/rehype-external-links.mjs).
			rehypePlugins: [[rehypeExternalLinks, { site }]],
			remarkRehype: { footnoteLabel: 'Notes', footnoteBackLabel: 'Retour au texte' },
		}),
	},
});
