// Obsidian's Markdown extras, so that a page written in Obsidian renders the same on the site:
// callouts (> [!note] Title), folds (> [!note]- Title, or + to start open) and highlights (==text==).
// A note for the editor, <!-- like this -->, stays out of the page, as in Obsidian's reading view.

const CALLOUT = /^\[!([\w-]+)\]([+-]?)[ \t]*/;
const HIGHLIGHT = /==([^=\n]+)==/g;
const COMMENT = /^\s*<!--[\s\S]*?-->\s*$/;

export default function remarkObsidian() {
	return (tree) => visit(tree);
}

function visit(node) {
	if (!node.children) return;
	node.children = node.children
		.filter((child) => !(child.type === 'html' && COMMENT.test(child.value)))
		.flatMap(splitHighlights);
	for (const child of node.children) visit(child);
	if (node.type === 'blockquote') toCallout(node);
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
		: { hName: 'aside', hProperties: { className: ['callout'] } };
}
