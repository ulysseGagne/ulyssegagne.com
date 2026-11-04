// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://ulyssegagne.com',
	markdown: {
		// Black and white: code blocks stay plain, without syntax colors.
		syntaxHighlight: false,
		// The remark pipeline, so that Obsidian's extras (callouts, folds, highlights) render too.
		processor: unified({
			remarkPlugins: [remarkObsidian],
			remarkRehype: { footnoteLabel: 'Notes', footnoteBackLabel: 'Retour au texte' },
		}),
	},
});
