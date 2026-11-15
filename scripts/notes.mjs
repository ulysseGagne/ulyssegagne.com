#!/usr/bin/env node
// Claude's side of the private view (public/notes.js): reads Ulysse's notes from the private side's server
// (worker/index.js), and writes Claude's. From the repository:
//
//   node scripts/notes.mjs export [--page /tuteur] [--all]   what's open, as Markdown, to digest
//   node scripts/notes.mjs json [--page /tuteur] [--all]     every note, raw (--all: the deleted ones too)
//   node scripts/notes.mjs put <notes.json>                  Claude's notes, one object or a list, created or updated
//   node scripts/notes.mjs reply <id> <text>                 Claude's answer under a note
//   node scripts/notes.mjs done <id>…                        notes dealt with: they fade on the page
//   node scripts/notes.mjs open <id>…                        and back to open
//
// The key is Claude's, in ~/.config/ulyssegagne-notes/key on Ulysse's Mac (or NOTES_KEY); the server is the real
// one unless NOTES_API says otherwise (a local test server: http://localhost:8787).
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const API = process.env.NOTES_API || 'https://ulyssegagne-notes.ulyssegagne.workers.dev';
const KEY = process.env.NOTES_KEY || readKey();
const [command, ...args] = process.argv.slice(2);

function readKey() {
	try {
		return readFileSync(join(homedir(), '.config', 'ulyssegagne-notes', 'key'), 'utf8').trim();
	} catch {
		fail('No key: ~/.config/ulyssegagne-notes/key is missing. The README, « The private view », says how to make a new one.');
	}
}

function fail(message) {
	console.error(message);
	process.exit(1);
}

async function call(path, options = {}) {
	const response = await fetch(API + path, {
		...options,
		headers: { Authorization: `Bearer ${KEY}`, ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
	});
	const data = await response.json().catch(() => ({}));
	if (!response.ok) fail(`${options.method ?? 'GET'} ${path}: ${response.status} ${data.error ?? ''}`);
	return data;
}

const flag = (name) => args.includes(name);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);

async function notes() {
	const query = new URLSearchParams();
	if (option('--page')) query.set('page', option('--page'));
	if (flag('--all')) query.set('all', '1');
	return (await call(`/notes?${query}`)).notes;
}

function newId() {
	return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

const when = (iso) => iso.replace('T', ' ').slice(0, 16) + ' UTC';
const quoted = (text) => text.split('\n').map((line) => `> ${line}`).join('\n');
const title = (body) => {
	const first = String(body ?? '').trim().split('\n')[0];
	return /^\*\*.+\*\*$/.test(first) ? first.slice(2, -2) : first.slice(0, 90);
};

// What's waiting for Claude: every thread with something of Ulysse's in it that isn't dealt with yet, a pick
// included; each with its words on the page and its whole thread, so it reads without the page.
async function exportOpen() {
	const all = await notes();
	const byId = new Map(all.map((note) => [note.id, note]));
	const children = (id) => all.filter((note) => note.parent === id).sort((a, b) => a.created.localeCompare(b.created));
	const waiting = (note) =>
		(note.author === 'ulysse' && note.status === 'open' && note.body.trim()) ||
		(note.author === 'claude' && note.status === 'open' && note.pick) ||
		children(note.id).some(waiting);
	const roots = all.filter((note) => !note.parent && waiting(note));
	const pages = [...new Set(roots.map((note) => note.page))];
	const out = [`# Notes from the private view, exported ${when(new Date().toISOString())}`, ''];
	if (!roots.length) out.push('Nothing open.');
	for (const page of pages) {
		out.push(`## ${page} (https://ulyssegagne.com${page === '/' ? '' : page})`, '');
		for (const note of roots.filter((root) => root.page === page)) {
			if (note.author === 'ulysse') {
				out.push(`### Ulysse · ${note.id} · ${when(note.created)}${note.status === 'done' ? ' · done' : ''}`);
				out.push(note.quote ? `On « ${note.quote} », in: …${note.pre ?? ''}[${note.quote}]${note.post ?? ''}…` : 'On the whole page.');
				out.push('', quoted(note.body), '');
			} else {
				out.push(`### Claude's note · ${note.id} · « ${title(note.body)} »${note.status === 'done' ? ' · done' : ''}`);
				if (note.quote) out.push(`On « ${note.quote} ».`);
				if (note.choices?.length) {
					const picked = note.choices.find((choice) => choice.v === note.pick);
					out.push(`Ulysse's pick: ${picked ? `« ${picked.label} » (${picked.v})` : 'none yet'}`);
				}
				out.push('');
			}
			for (const reply of children(note.id)) {
				const who = reply.author === 'ulysse' ? 'Ulysse' : 'Claude';
				out.push(`- ${who} · ${reply.id} · ${when(reply.created)}${reply.status === 'done' ? ' · done' : ''}:`, quoted(reply.body).replace(/^/gm, '  '), '');
			}
		}
	}
	const ids = all.filter((note) => note.status === 'open' && (note.author === 'ulysse' ? note.body.trim() : note.pick)).map((note) => note.id);
	if (ids.length) out.push('Once each is filed and acted on:', '', '```', `node scripts/notes.mjs done ${ids.join(' ')}`, '```');
	console.log(out.join('\n'));
}

async function setStatus(ids, status) {
	if (!ids.length) fail('Which notes? Give their ids.');
	for (const id of ids) await call(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ status }) });
	console.log(`${ids.length} note${ids.length > 1 ? 's' : ''} ${status}.`);
}

switch (command) {
	case 'export':
		await exportOpen();
		break;
	case 'json':
		console.log(JSON.stringify(await notes(), null, 2));
		break;
	case 'put': {
		if (!args[0]) fail('Which file?');
		const input = JSON.parse(readFileSync(args[0], 'utf8'));
		for (const note of Array.isArray(input) ? input : [input]) {
			const { id = newId(), ...fields } = note;
			await call(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(fields) });
			console.log(`put ${id}`);
		}
		break;
	}
	case 'reply': {
		const [parent, ...words] = args;
		const all = await notes();
		const note = all.find((other) => other.id === parent);
		if (!note) fail(`No note ${parent}.`);
		const id = newId();
		await call(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ page: note.page, parent, body: words.join(' ') }) });
		console.log(`put ${id}`);
		break;
	}
	case 'done':
		await setStatus(args, 'done');
		break;
	case 'open':
		await setStatus(args, 'open');
		break;
	default:
		fail('Usage: node scripts/notes.mjs export | json | put <file> | reply <id> <text> | done <id>… | open <id>…  (the top of this file says more)');
}
