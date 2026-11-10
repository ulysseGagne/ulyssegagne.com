// Turns a private Markdown page into a locked page of this site, first for /never-enough/behind-the-scenes (Nov 10, 2026).
// The repository is public, so a locked page's text may reach it only encrypted: its source stays outside the repository,
// and this script writes the page with the text as ciphertext (AES-GCM, its key made from the password by PBKDF2-SHA-256),
// which the visitor's browser decrypts once the password is typed. The script asks for the password when it runs
// (or reads LOCK_PASSWORD) and writes it nowhere. The answer counts without case, spaces, accents or emoji.
//
//   node scripts/lock-page.mjs <source.md> <page.html>
//
// The source: Markdown with properties on top (title, description, path, lead, hint), and Obsidian callouts for
// a conversation, as on /tuteur: > [!ulysse] Ulysse, > [!claude] Claude, > [!scene] a date. Comments <!-- … --> stay out.

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { webcrypto as crypto } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

const ITERATIONS = 600000;
const [source, page] = process.argv.slice(2);
if (!source || !page) {
	console.error('Usage: node scripts/lock-page.mjs <source.md> <page.html>');
	process.exit(1);
}

// The same rule as the page's: only letters and digits count, in lowercase.
const normalize = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const raw = fs.readFileSync(source, 'utf8');
const front = raw.match(/^---\n([\s\S]*?)\n---\n/);
const props = {};
if (front)
	for (const line of front[1].split('\n')) {
		const i = line.indexOf(':');
		if (i > 0) props[line.slice(0, i).trim()] = line.slice(i + 1).trim();
	}
for (const key of ['title', 'path', 'hint'])
	if (!props[key]) {
		console.error(`The source needs a « ${key}: » property.`);
		process.exit(1);
	}
const body = front ? raw.slice(front[0].length) : raw;

// > [!type] Title, then its text  →  <aside class="callout" data-callout="type"><p class="callout-title">Title</p><p>…</p></aside>
function callouts() {
	return (tree) => {
		const walk = (node) => {
			if (!node.children) return;
			node.children.forEach(walk);
			if (node.type !== 'blockquote') return;
			const first = node.children[0];
			const text = first?.type === 'paragraph' ? first.children[0] : null;
			const m = text?.type === 'text' ? text.value.match(/^\[!([\w-]+)\][ \t]*([^\n]*)\n?/) : null;
			if (!m) return;
			text.value = text.value.slice(m[0].length);
			const rest = first.children.filter((c) => !(c === text && !c.value));
			node.children = [
				{ type: 'paragraph', data: { hProperties: { className: ['callout-title'] } }, children: [{ type: 'text', value: m[2] }] },
				...(rest.length ? [{ type: 'paragraph', children: rest }] : []),
				...node.children.slice(1),
			];
			node.data = { hName: 'aside', hProperties: { className: ['callout'], dataCallout: m[1].toLowerCase() } };
		};
		walk(tree);
	};
}
const toHtml = async (markdown, plugins = []) => {
	let html = String(await unified().use(remarkParse).use(plugins).use(remarkRehype).use(rehypeStringify).process(markdown));
	return html.replace(/<a href="(https?:)/g, '<a class="out" target="_blank" rel="noopener" href="$1');
};
const content = await toHtml(body, [callouts]);
const lead = props.lead ? (await toHtml(props.lead)).trim().replace(/^<p>|<\/p>$/g, '') : '';

async function askPassword() {
	if (process.env.LOCK_PASSWORD) return process.env.LOCK_PASSWORD;
	const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
	let quiet = false;
	rl._writeToOutput = (s) => {
		if (!quiet) rl.output.write(s);
	};
	return new Promise((resolve) => {
		rl.question('Password: ', (answer) => {
			rl.close();
			process.stdout.write('\n');
			resolve(answer);
		});
		quiet = true;
	});
}
const password = normalize(await askPassword());
if (password.length < 4) {
	console.error('The password needs at least 4 letters or digits.');
	process.exit(1);
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(content)));
const b64 = (bytes) => Buffer.from(bytes).toString('base64');
const payload = { v: 1, iterations: ITERATIONS, salt: b64(salt), iv: b64(iv), data: b64(sealed) };

const parts = props.path.split('/').filter(Boolean);
const crumbs =
	'<a href="/">ulyssegagne.com</a>' +
	parts
		.map((part, i) =>
			i < parts.length - 1
				? `<span class="sep">/</span><a href="/${parts.slice(0, i + 1).join('/')}">${escape(part)}</a>`
				: `<span class="sep">/</span><span class="here">${escape(part)}</span>`,
		)
		.join('');

const template = fs.readFileSync(new URL('./locked-page.html', import.meta.url), 'utf8');
const fill = { TITLE: escape(props.title), DESCRIPTION: escape(props.description || props.title), CRUMBS: crumbs, LEAD: lead, HINT: escape(props.hint), PAYLOAD: JSON.stringify(payload), PATH: JSON.stringify(props.path) };
const html = template.replace(/\{\{(\w+)\}\}/g, (all, name) => (name in fill ? fill[name] : all));
fs.mkdirSync(path.dirname(page), { recursive: true });
fs.writeFileSync(page, html);
console.log(`Locked ${props.path}: ${page} (${Math.round(html.length / 1024)} KB).`);
