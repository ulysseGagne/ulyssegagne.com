// Obsidian's Markdown extras, so that a page written in Obsidian renders the same on the site:
// callouts (> [!note] Title), folds (> [!note]- Title, or + to start open) and highlights (==text==).
// Links as in Documents: [[tuteur]] is the page named tuteur.md anywhere in site/, shown with its title;
// [[tuteur|text]] shows the text; ![[photo.jpg]] is an image found the same way.
// A note for the editor, <!-- like this -->, stays out of the page, as in Obsidian's reading view.
// A comment, as in CriticMarkup: {==the words==}{>>what is said about them<<} highlights the words and puts
// the comment beside them, in the margin on a wide screen (the tutor's demo: site/tuteur.md).

import fs from 'node:fs';
import path from 'node:path';
import { typeset } from './remark-french.mjs';

const CALLOUT = /^\[!([\w-]+)\]([+-]?)[ \t]*/;
const HIGHLIGHT = /==([^=\n]+)==/g;
const COMMENT = /^\s*<!--[\s\S]*?-->\s*$/;
const WIKILINK = /(!?)\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;
const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg)$/i;
const CRITIC = /\{==([\s\S]+?)==\}\{>>([\s\S]+?)<<\}/g;

export default function remarkObsidian() {
	return (tree, file) => visit(tree, { ...siteFiles(), from: file.path, comments: 0 });
}

function visit(node, site) {
	if (!node.children) return;
	node.children = mergeText(node.children)
		.filter((child) => !(child.type === 'html' && COMMENT.test(child.value)))
		.flatMap((child) => splitComments(child, site))
		.flatMap((child) => splitWikilinks(child, site))
		.flatMap(splitHighlights);
	for (const child of node.children) visit(child, site);
	if (node.type === 'blockquote') toCallout(node);
}

// Every page and image in site/, by its path and by its file name alone, as Obsidian finds them.
function siteFiles() {
	const root = path.resolve('site');
	const pages = new Map();
	const images = new Map();
	for (const rel of fs.readdirSync(root, { recursive: true })) {
		const posix = rel.split(path.sep).join('/');
		const file = path.join(root, rel);
		if (posix.endsWith('.md')) {
			const id = posix.slice(0, -3);
			const page = { href: '/' + id.replace(/(^|\/)index$/, ''), title: titleOf(file) ?? path.basename(id) };
			for (const key of [id, path.basename(id)]) pages.set(key.toLowerCase(), page);
		} else if (IMAGE.test(posix)) {
			for (const key of [posix, path.basename(posix)]) images.set(key.toLowerCase(), file);
		}
	}
	return { pages, images };
}

function titleOf(file) {
	const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(fs.readFileSync(file, 'utf8'));
	const title = front && /^title:\s*(.+?)\s*$/m.exec(front[1]);
	return title ? typeset(title[1].replace(/^(['"])(.*)\1$/, '$2')) : null;
}

function splitWikilinks(node, site) {
	if (node.type !== 'text' || !node.value.includes('[[')) return [node];
	const parts = [];
	let last = 0;
	for (const match of node.value.matchAll(WIKILINK)) {
		const [whole, embed, target, text] = match;
		const name = target.split('#')[0].trim().replace(/\.md$/, '').toLowerCase();
		if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
		const image = embed && site.images.get(name);
		const page = !embed && site.pages.get(name);
		if (image) {
			const url = path.relative(path.dirname(site.from), image).split(path.sep).join('/');
			// In Obsidian, ![[photo.jpg|300]] sets a width: not an alt text.
			const alt = text && !/^\d+(x\d+)?$/.test(text) ? text : '';
			parts.push({ type: 'image', url: url.startsWith('.') ? url : './' + url, alt });
		} else if (page) {
			parts.push({ type: 'link', url: page.href, children: [{ type: 'text', value: text || page.title }] });
		} else {
			console.warn(`[obsidian] ${whole} in ${path.relative(process.cwd(), site.from)}: no such file in site/`);
			parts.push({ type: 'text', value: text || target });
		}
		last = match.index + whole.length;
	}
	if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
	return parts;
}

// Text the parser left in pieces (around an escaped character) is one text again, so a comment is found whole.
function mergeText(children) {
	const out = [];
	for (const child of children) {
		const last = out[out.length - 1];
		if (child.type === 'text' && last?.type === 'text') last.value += child.value;
		else out.push(child.type === 'text' ? { ...child } : child);
	}
	return out;
}

function splitComments(node, site) {
	if (node.type !== 'text' || !node.value.includes('{==')) return [node];
	const parts = [];
	let last = 0;
	for (const match of node.value.matchAll(CRITIC)) {
		const id = String(++site.comments);
		if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
		parts.push({
			type: 'commentAnchor',
			data: { hName: 'mark', hProperties: { className: ['c-anchor'], dataC: id, tabIndex: 0 } },
			children: [{ type: 'text', value: match[1] }],
		});
		parts.push({
			type: 'commentNote',
			data: { hName: 'span', hProperties: { className: ['c-note'], dataC: id, role: 'note' } },
			children: [{ type: 'text', value: match[2] }],
		});
		last = match.index + match[0].length;
	}
	if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
	return parts;
}

function splitHighlights(node) {
	if (node.type !== 'text' || !node.value.includes('==')) return [node];
	const parts = [];
	let last = 0;
	for (const match of node.value.matchAll(HIGHLIGHT)) {
		if (match.index > last) parts.push({ type: 'text', value: node.value.slice(last, match.index) });
		parts.push({ type: 'highlight', data: { hName: 'mark' }, children: [{ type: 'text', value: match[1] }] });
		last = match.index + match[0].length;
	}
	if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) });
	return parts;
}

function toCallout(quote) {
	const first = quote.children[0];
	const head = first?.type === 'paragraph' ? first.children[0] : null;
	const match = head?.type === 'text' ? CALLOUT.exec(head.value) : null;
	if (!match) return;
	const [marker, type, fold] = match;
	head.value = head.value.slice(marker.length);

	// The title is the first line; the rest of the paragraph is the callout's text.
	const title = [];
	const rest = [];
	let inTitle = true;
	for (const node of first.children) {
		if (!inTitle) {
			rest.push(node);
		} else if (node.type === 'text' && node.value.includes('\n')) {
			const cut = node.value.indexOf('\n');
			if (cut > 0) title.push({ type: 'text', value: node.value.slice(0, cut) });
			rest.push({ type: 'text', value: node.value.slice(cut + 1) });
			inTitle = false;
		} else if (node.type === 'break') {
			inTitle = false;
		} else {
			title.push(node);
		}
	}
	if (!title.some((node) => node.type !== 'text' || node.value.trim())) {
		title.splice(0, title.length, { type: 'text', value: type[0].toUpperCase() + type.slice(1) });
	}

	const isFold = fold !== '';
	const heading = {
		type: 'paragraph',
		children: title,
		data: isFold ? { hName: 'summary' } : { hProperties: { className: ['callout-title'] } },
	};
	const text = rest.length ? [{ type: 'paragraph', children: rest }] : [];
	quote.children = [heading, ...text, ...quote.children.slice(1)];
	quote.data = isFold
		? { hName: 'details', hProperties: { className: ['fold'], open: fold === '+' } }
		: { hName: 'aside', hProperties: { className: ['callout'], dataCallout: type.toLowerCase() } };
}
