// The private side of ulyssegagne.com: Ulysse's notes on the site's pages, and Claude's answers, in a small
// database (Cloudflare D1). The site's private view (public/notes.js) reads and writes them on any device;
// Claude reads them from the Mac with scripts/notes.mjs. Two keys open it, each kept here only as its SHA-256
// hash: Ulysse's, made in the browser from the password, and Claude's, in a file on Ulysse's Mac.

const ORIGINS = new Set(['https://ulyssegagne.com', 'http://localhost:4321', 'http://127.0.0.1:4321']);
const ID = /^[a-z0-9-]{4,80}$/;
const STATUS = new Set(['open', 'done', 'deleted']);

export default {
	async fetch(request, env) {
		const origin = request.headers.get('Origin');
		const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin' };
		if (origin && ORIGINS.has(origin)) {
			headers['Access-Control-Allow-Origin'] = origin;
			headers['Access-Control-Allow-Methods'] = 'GET, PUT, OPTIONS';
			headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
			headers['Access-Control-Max-Age'] = '86400';
		}
		const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
		if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });

		const role = await who(request, env);
		if (!role) return reply({ error: 'locked' }, 401);

		const url = new URL(request.url);
		const [first, id, ...rest] = url.pathname.split('/').filter(Boolean);
		try {
			if (request.method === 'GET' && first === 'check' && !id) return reply({ ok: true, role });
			if (request.method === 'GET' && first === 'notes' && !id) return reply({ notes: await list(env, url.searchParams) });
			if (request.method === 'PUT' && first === 'notes' && id && !rest.length) {
				if (!ID.test(id)) return reply({ error: 'bad id' }, 400);
				const note = await save(env, role, id, await request.json());
				return note.error ? reply(note, 400) : reply({ note });
			}
			return reply({ error: 'not found' }, 404);
		} catch (error) {
			return reply({ error: String(error?.message ?? error) }, 500);
		}
	},
};

// Who is asking: Ulysse, Claude, or nobody.
async function who(request, env) {
	const match = /^Bearer ([A-Za-z0-9]{32,128})$/.exec(request.headers.get('Authorization') ?? '');
	if (!match) return null;
	const hash = await sha256(match[1]);
	if (same(hash, env.ULYSSE_HASH)) return 'ulysse';
	if (same(hash, env.CLAUDE_HASH)) return 'claude';
	return null;
}

async function sha256(text) {
	const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
	return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Compares two hashes in the same time whatever they hold.
function same(a, b) {
	if (typeof b !== 'string' || a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

// A page's notes, or every page's; the deleted ones only when asked (?all=1).
async function list(env, params) {
	const where = [];
	const binds = [];
	if (params.get('page')) {
		where.push('page = ?');
		binds.push(params.get('page'));
	}
	if (params.get('all') !== '1') where.push("status != 'deleted'");
	const sql = `SELECT * FROM notes ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY page, ord IS NULL, ord, created`;
	const { results } = await env.DB.prepare(sql).bind(...binds).all();
	return results.map(out);
}

function out(row) {
	return row && { ...row, choices: row.choices ? JSON.parse(row.choices) : null };
}

const text = (value, max) => (value == null ? null : String(value).slice(0, max));

// Writes one note. Ulysse's key writes Ulysse's notes and picks among Claude's options; Claude's key writes
// Claude's notes and marks one of Ulysse's as dealt with, without ever changing its words.
async function save(env, role, id, input) {
	const now = new Date().toISOString();
	const old = await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first();
	if (role === 'ulysse') {
		if (old?.author === 'claude') {
			await env.DB.prepare('UPDATE notes SET pick = ?, updated = ? WHERE id = ?').bind(text(input.pick, 80), now, id).run();
		} else if (old) {
			const body = text(input.body ?? old.body, 50000);
			let status = input.status === 'deleted' || input.status === 'open' ? input.status : old.status;
			// Words changed after Claude dealt with them: open again.
			if (old.status === 'done' && body !== old.body) status = 'open';
			await env.DB.prepare('UPDATE notes SET body = ?, status = ?, updated = ? WHERE id = ?').bind(body, status, now, id).run();
		} else {
			if (typeof input.page !== 'string' || !input.page.startsWith('/')) return { error: 'bad page' };
			await env.DB.prepare(
				'INSERT INTO notes (id, page, author, parent, quote, pre, post, body, status, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			)
				.bind(id, text(input.page, 300), 'ulysse', text(input.parent, 80), text(input.quote, 2000), text(input.pre, 200), text(input.post, 200), text(input.body, 50000) ?? '', 'open', now, now)
				.run();
		}
	} else if (old?.author === 'ulysse') {
		// On Ulysse's notes, Claude marks them dealt with, or moves them with their words when a page moves or splits.
		const status = STATUS.has(input.status) ? input.status : old.status;
		const page = typeof input.page === 'string' && input.page.startsWith('/') ? text(input.page, 300) : old.page;
		await env.DB.prepare('UPDATE notes SET status = ?, page = ?, updated = ? WHERE id = ?').bind(status, page, now, id).run();
	} else {
		const page = text(input.page ?? old?.page, 300);
		if (!page?.startsWith('/')) return { error: 'bad page' };
		const choices = input.choices !== undefined ? (input.choices ? JSON.stringify(input.choices) : null) : (old?.choices ?? null);
		await env.DB.prepare(
			`INSERT INTO notes (id, page, author, parent, quote, pre, post, body, choices, pick, status, ord, created, updated)
			VALUES (?, ?, 'claude', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			ON CONFLICT(id) DO UPDATE SET page = excluded.page, parent = excluded.parent, quote = excluded.quote,
				pre = excluded.pre, post = excluded.post, body = excluded.body, choices = excluded.choices, pick = excluded.pick,
				status = excluded.status, ord = excluded.ord, updated = excluded.updated`,
		)
			.bind(
				id,
				page,
				text(input.parent ?? old?.parent, 80),
				text(input.quote ?? old?.quote, 2000),
				text(input.pre ?? old?.pre, 200),
				text(input.post ?? old?.post, 200),
				text(input.body ?? old?.body ?? '', 50000),
				choices,
				input.pick !== undefined ? text(input.pick, 80) : (old?.pick ?? null),
				STATUS.has(input.status) ? input.status : (old?.status ?? 'open'),
				input.ord !== undefined ? Number(input.ord) : (old?.ord ?? null),
				old?.created ?? now,
				now,
			)
			.run();
	}
	return out(await env.DB.prepare('SELECT * FROM notes WHERE id = ?').bind(id).first());
}
