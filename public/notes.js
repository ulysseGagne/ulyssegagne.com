// The site's private view, for Ulysse. A small padlock at the top of every page asks for the password, once per
// device; after that it switches the page between what visitors see (« Public ») and the private view (« Privé »).
// In the private view, select any words to comment on them, or write a note on the whole page; Claude's notes and
// options sit beside the words they're about, or at the top. Everything saves by itself as it's typed, to the
// private side's server (worker/index.js); written offline, it waits on the device and leaves once the connection
// is back. Claude reads it all from the Mac: scripts/notes.mjs, and the README, « The private view ».
(() => {
	const main = document.querySelector('main');
	const path = document.querySelector('nav.path');
	if (!main || !path) return;

	const store = {
		get(name) {
			try {
				return localStorage.getItem(name);
			} catch {
				return null;
			}
		},
		set(name, value) {
			try {
				if (value == null) localStorage.removeItem(name);
				else localStorage.setItem(name, value);
			} catch {}
		},
	};
	// A local test server can stand in for the real one: localStorage['notes.api'] = 'http://localhost:8787'.
	const API = store.get('notes.api') || 'https://ulyssegagne-notes.ulyssegagne.workers.dev';
	const page = (() => {
		let here = location.pathname;
		try {
			here = decodeURI(here);
		} catch {}
		return here.replace(/\.html$/, '').replace(/\/index$/, '').replace(/(.)\/$/, '$1') || '/';
	})();

	let key = store.get('notes.key');
	let open = Boolean(key) && store.get('notes.mode') === 'private';
	let notes = [];
	let loadedAt = 0;
	let pending = readPending();
	let panel = null;

	const el = (tag, className, attrs = {}) => {
		const node = document.createElement(tag);
		if (className) node.className = className;
		for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, value);
		return node;
	};
	const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

	document.head.append(Object.assign(el('style'), { textContent: STYLES() }));

	// ---------- the padlock at the top, and the password ----------

	const SHUT = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 7V5.3a3 3 0 0 1 6 0V7" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/></svg>';
	const OPEN = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 7V5.3a3 3 0 0 1 5.9-.9" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="3" y="7" width="10" height="7.5" rx="1.6" fill="currentColor"/></svg>';
	const toggle = el('button', 'pv-switch', { type: 'button' });
	path.append(toggle);

	const lock = el('form', 'pv-lock pv-ui');
	lock.hidden = true;
	lock.innerHTML =
		'<label for="pv-password">Mot de passe de la vue privée</label>' +
		'<div class="pv-row"><input id="pv-password" type="password" autocomplete="current-password" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" required><button type="submit">Ouvrir</button></div>' +
		'<p class="pv-msg" role="status"></p>';
	path.after(lock);
	const lockMessage = lock.querySelector('.pv-msg');

	function paint() {
		toggle.innerHTML = key ? `${OPEN}<span>${open ? 'Privé' : 'Public'}</span>` : SHUT;
		toggle.classList.toggle('on', open);
		toggle.title = !key ? 'Vue privée' : open ? 'Revenir à la page publique' : 'Passer à la vue privée';
		toggle.setAttribute('aria-label', toggle.title);
	}

	toggle.addEventListener('click', () => {
		if (!key) {
			lock.hidden = !lock.hidden;
			if (!lock.hidden) lock.querySelector('input').focus();
			return;
		}
		setOpen(!open);
	});

	lock.addEventListener('submit', async (event) => {
		event.preventDefault();
		const input = lock.querySelector('input');
		const button = lock.querySelector('button');
		button.disabled = true;
		lockMessage.textContent = 'Vérification…';
		try {
			const candidate = await derive(input.value);
			const response = await fetch(`${API}/check`, { headers: { Authorization: `Bearer ${candidate}` } });
			if (response.status === 401) {
				lockMessage.textContent = "Ce n'est pas le bon mot de passe.";
				input.select();
				return;
			}
			if (!response.ok) throw new Error(String(response.status));
			key = candidate;
			store.set('notes.key', key);
			input.value = '';
			lockMessage.textContent = '';
			lock.hidden = true;
			setOpen(true);
		} catch {
			lockMessage.textContent = 'Pas de connexion. Réessaie dans un moment.';
		} finally {
			button.disabled = false;
		}
	});

	// The key the server knows, made from the password on this device; the password itself goes nowhere.
	async function derive(password) {
		const text = new TextEncoder();
		const base = await crypto.subtle.importKey('raw', text.encode(password.trim()), 'PBKDF2', false, ['deriveBits']);
		const bits = await crypto.subtle.deriveBits(
			{ name: 'PBKDF2', salt: text.encode('ulyssegagne.com/notes'), iterations: 310000, hash: 'SHA-256' },
			base,
			256,
		);
		return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	// The key stopped working (a new password): back to the padlock; what this device wrote waits for it.
	function forget(message) {
		key = null;
		store.set('notes.key', null);
		setOpen(false);
		lock.hidden = false;
		lockMessage.textContent = message;
	}

	function setOpen(value) {
		open = value;
		store.set('notes.mode', open ? 'private' : null);
		paint();
		if (open) start();
		else stop();
	}

	// ---------- the private view ----------

	function start() {
		document.documentElement.classList.add('pv-on');
		if (!panel) {
			panel = el('section', 'pv-panel pv-ui', { 'aria-label': 'Vue privée' });
			panel.innerHTML =
				'<div class="pv-bar"><strong>Vue privée</strong><span class="pv-state" role="status"></span>' +
				'<span class="pv-actions"><button type="button" class="pv-link" data-act="public">Page publique</button>' +
				'<button type="button" class="pv-link" data-act="lock">Verrouiller cet appareil</button></span></div>' +
				"<p class=\"pv-help\">Sélectionne des mots pour les commenter, ou écris une note sur toute la page. Tout s'enregistre tout seul, sur n'importe quel appareil.</p>" +
				'<div class="pv-list"></div>' +
				'<div class="pv-lost" hidden><p class="pv-sub">Ces passages ont changé depuis</p></div>';
			panel.querySelector('[data-act="public"]').addEventListener('click', () => setOpen(false));
			panel.querySelector('[data-act="lock"]').addEventListener('click', async () => {
				await flush();
				key = null;
				store.set('notes.key', null);
				setOpen(false);
			});
		}
		main.prepend(panel);
		load();
	}

	function stop() {
		document.documentElement.classList.remove('pv-on');
		clear();
		panel?.remove();
		button.hidden = true;
	}

	async function load() {
		state('Chargement…');
		let reached = true;
		try {
			const response = await fetch(`${API}/notes?page=${encodeURIComponent(page)}`, { headers: { Authorization: `Bearer ${key}` } });
			if (response.status === 401) return forget('Le mot de passe a changé : entre le nouveau.');
			if (!response.ok) throw new Error(String(response.status));
			notes = (await response.json()).notes.map((note) => ({ ...note, saved: true }));
			loadedAt = Date.now();
		} catch {
			reached = false;
		}
		// What this device wrote and hasn't sent yet.
		for (const [id, payload] of Object.entries(pending)) {
			const local = notes.find((note) => note.id === id);
			if (local?.author === 'claude') local.pick = payload.pick;
			else if (local) Object.assign(local, { body: payload.body, status: payload.status });
			else if (payload.page === page) notes.push({ ...newNote(payload), id });
		}
		if (!open) return;
		render();
		if (Object.keys(pending).length) flush();
		else state(reached ? 'Enregistré' : 'Hors ligne : ce que tu écris reste sur cet appareil');
	}

	function render() {
		clear();
		const list = panel.querySelector('.pv-list');
		const lost = panel.querySelector('.pv-lost');
		const tops = notes.filter((note) => !note.parent && note.status !== 'deleted').sort(order);
		for (const note of tops) {
			if (note.quote && placeOnPage(note)) continue;
			(note.quote ? lost : list).append(card(note, true));
		}
		lost.hidden = !lost.querySelector('.pv-card');
		list.append(freshPageNote(list));
		for (const comment of document.querySelectorAll('.conversation .c-note')) comment.append(replyToComment(comment));
		relayout();
	}

	function clear() {
		for (const mark of main.querySelectorAll('mark.pv-mark')) {
			const parent = mark.parentNode;
			mark.replaceWith(...mark.childNodes);
			parent.normalize();
		}
		for (const node of document.querySelectorAll('.pv-group, .pv-cmt-reply')) node.remove();
		panel?.querySelector('.pv-list')?.replaceChildren();
		for (const node of panel?.querySelectorAll('.pv-lost .pv-card') ?? []) node.remove();
	}

	// Claude's notes first, in Claude's order; then Ulysse's, oldest first.
	function order(a, b) {
		const who = (note) => (note.author === 'claude' ? 0 : 1);
		return who(a) - who(b) || (a.ord ?? 0) - (b.ord ?? 0) || String(a.created).localeCompare(String(b.created));
	}

	// ---------- finding a note's words on the page ----------

	// The page's text, as one string, with where each piece of it lives.
	function textIndex() {
		const nodes = [];
		let text = '';
		const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
			acceptNode: (node) =>
				node.parentElement?.closest('.pv-ui, script, style, textarea') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
		});
		for (let node = walker.nextNode(); node; node = walker.nextNode()) {
			nodes.push({ node, start: text.length });
			text += node.data;
		}
		return { nodes, text };
	}

	// The same text with every run of spaces as one, so a change of line breaks doesn't lose a note.
	function flatten(text) {
		let flat = '';
		const map = [];
		for (let i = 0; i < text.length; i++) {
			if (/\s/.test(text[i])) {
				if (!flat || flat.endsWith(' ')) continue;
				flat += ' ';
			} else flat += text[i];
			map.push(i);
		}
		return { flat, map };
	}

	const squash = (s) => String(s ?? '').replace(/\s+/g, ' ');

	// Where a note's words are: of every place they appear, the one whose surroundings match best.
	function find(index, note) {
		const quote = squash(note.quote).trim();
		if (!quote) return null;
		const { flat, map } = flatten(index.text);
		const pre = squash(note.pre);
		const post = squash(note.post);
		let best = -1;
		let bestScore = -1;
		for (let at = flat.indexOf(quote), n = 0; at !== -1 && n < 500; at = flat.indexOf(quote, at + 1), n++) {
			const before = flat.slice(Math.max(0, at - pre.length), at);
			const after = flat.slice(at + quote.length, at + quote.length + post.length);
			let score = 0;
			while (score < before.length && score < pre.length && before[before.length - 1 - score] === pre[pre.length - 1 - score]) score++;
			for (let k = 0; k < after.length && k < post.length && after[k] === post[k]; k++) score++;
			if (score > bestScore) [best, bestScore] = [at, score];
		}
		return best < 0 ? null : [map[best], map[best + quote.length - 1] + 1];
	}

	function wrap(index, start, end, id) {
		const marks = [];
		for (const { node, start: from } of index.nodes) {
			const to = from + node.data.length;
			if (to <= start || from >= end) continue;
			let piece = node;
			const a = Math.max(start, from) - from;
			const b = Math.min(end, to) - from;
			if (a > 0) piece = piece.splitText(a);
			if (b - a < piece.data.length) piece.splitText(b - a);
			if (!piece.data.trim()) continue;
			const mark = el('mark', 'pv-mark');
			mark.dataset.n = id;
			piece.before(mark);
			mark.append(piece);
			marks.push(mark);
		}
		return marks;
	}

	function unwrap(id) {
		for (const mark of main.querySelectorAll(`mark.pv-mark[data-n="${id}"]`)) {
			const parent = mark.parentNode;
			mark.replaceWith(...mark.childNodes);
			parent.normalize();
		}
	}

	const BLOCK = '.c-note, li, td, th, p, h1, h2, h3, h4, h5, h6, pre, figure, dd, dt, blockquote, summary';

	// A note's card goes under the paragraph, list item or title its words end in, or inside the comment.
	function placeOnPage(note) {
		const index = textIndex();
		const span = find(index, note);
		if (!span) return false;
		const marks = wrap(index, span[0], span[1], note.id);
		let block = marks.at(-1)?.closest(BLOCK);
		if (block?.matches('td, th')) block = block.closest('table');
		if (!block || !main.contains(block)) {
			unwrap(note.id);
			return false;
		}
		const inside = block.matches('li, .c-note');
		let group = inside
			? block.querySelector(':scope > .pv-group')
			: block.nextElementSibling?.classList.contains('pv-group')
				? block.nextElementSibling
				: null;
		if (!group) {
			group = el('div', 'pv-group pv-ui');
			const reply = block.querySelector(':scope > .pv-cmt-reply');
			if (inside && reply) reply.before(group);
			else if (inside) block.append(group);
			else block.after(group);
		}
		group.append(card(note, false));
		for (const mark of marks) {
			mark.addEventListener('click', () => {
				const target = group.querySelector(`.pv-card[data-n="${note.id}"]`);
				target?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				flash(note.id);
			});
		}
		return true;
	}

	function flash(id) {
		for (const node of document.querySelectorAll(`mark.pv-mark[data-n="${id}"], .pv-card[data-n="${id}"]`)) {
			node.classList.add('on');
			setTimeout(() => node.classList.remove('on'), 1200);
		}
	}

	// ---------- commenting on selected words ----------

	const button = el('button', 'pv-comment pv-ui', { type: 'button' });
	button.textContent = 'Commenter';
	button.hidden = true;
	document.body.append(button);
	let picked = null;
	let hideTimer = 0;
	let readTimer = 0;

	document.addEventListener('selectionchange', () => {
		if (!open) return;
		clearTimeout(readTimer);
		readTimer = setTimeout(readSelection, 120);
	});

	const within = (node, selector) => (node.nodeType === 1 ? node : node.parentElement)?.closest(selector);

	function readSelection() {
		const selection = getSelection();
		const range = selection?.rangeCount && !selection.isCollapsed ? selection.getRangeAt(0) : null;
		const ok = range && main.contains(range.commonAncestorContainer) && !within(range.startContainer, '.pv-ui') && !within(range.endContainer, '.pv-ui');
		const index = ok && textIndex();
		let a = ok ? offsetOf(index, range.startContainer, range.startOffset) : 0;
		let b = ok ? offsetOf(index, range.endContainer, range.endOffset) : 0;
		while (ok && a < b && /\s/.test(index.text[a])) a++;
		while (ok && b > a && /\s/.test(index.text[b - 1])) b--;
		if (!ok || b <= a) {
			// Tapping the button can clear the selection first: the button waits a moment before leaving.
			clearTimeout(hideTimer);
			hideTimer = setTimeout(() => {
				button.hidden = true;
				picked = null;
			}, 700);
			return;
		}
		clearTimeout(hideTimer);
		picked = { quote: index.text.slice(a, Math.min(b, a + 2000)), pre: index.text.slice(Math.max(0, a - 80), a), post: index.text.slice(b, b + 80) };
		button.hidden = false;
	}

	// A selection's edge, as a position in the page's text.
	function offsetOf(index, container, offset) {
		if (container.nodeType === Node.TEXT_NODE) {
			const hit = index.nodes.find((entry) => entry.node === container);
			if (hit) return hit.start + Math.min(offset, container.data.length);
		}
		const edge = document.createRange();
		edge.setStart(container, offset);
		for (const entry of index.nodes) if (edge.comparePoint(entry.node, 0) >= 0) return entry.start;
		return index.text.length;
	}

	button.addEventListener('pointerdown', (event) => event.preventDefault());
	button.addEventListener('mousedown', (event) => event.preventDefault());
	button.addEventListener('click', () => {
		if (!picked || !open) return;
		const note = newNote(picked);
		picked = null;
		button.hidden = true;
		getSelection()?.removeAllRanges();
		addAndFocus(note);
	});

	// « Répondre » under each of the demo's own comments: a note on its first words.
	function replyToComment(comment) {
		const reply = el('button', 'pv-link pv-cmt-reply pv-ui', { type: 'button' });
		reply.textContent = 'Répondre';
		reply.addEventListener('click', () => {
			const index = textIndex();
			const inside = index.nodes.filter((entry) => comment.contains(entry.node));
			if (!inside.length) return;
			const from = inside[0].start;
			const to = inside.at(-1).start + inside.at(-1).node.data.length;
			const head = (comment.querySelector('strong')?.textContent ?? index.text.slice(from, to)).trim();
			let at = index.text.indexOf(head, from);
			if (at < 0 || at >= to) at = from;
			const end = Math.min(at + head.length, to);
			addAndFocus(newNote({ quote: index.text.slice(at, end), pre: index.text.slice(Math.max(0, at - 80), at), post: index.text.slice(end, end + 80) }));
		});
		return reply;
	}

	function addAndFocus(note) {
		notes.push(note);
		if (!placeOnPage(note)) panel.querySelector('.pv-list').prepend(card(note, true));
		const area = document.querySelector(`.pv-card[data-n="${note.id}"] textarea`);
		area?.focus({ preventScroll: true });
		area?.scrollIntoView({ block: 'center', behavior: 'smooth' });
		relayout();
	}

	function newNote(fields) {
		return {
			id: `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
			page,
			author: 'ulysse',
			parent: null,
			quote: null,
			pre: null,
			post: null,
			body: '',
			status: 'open',
			created: new Date().toISOString(),
			...fields,
		};
	}

	// ---------- cards ----------

	function card(note, inPanel) {
		return note.author === 'claude' ? claudeCard(note, inPanel) : ulysseCard(note, inPanel);
	}

	function ulysseCard(note, inPanel) {
		const box = el('div', `pv-card pv-ulysse${note.status === 'done' ? ' pv-done' : ''}`);
		box.dataset.n = note.id;
		box.append(head('Toi', note));
		if (inPanel && note.quote) box.append(Object.assign(el('p', 'pv-quote'), { textContent: `« ${note.quote} »` }));
		box.append(writer(note, 'Ton commentaire…'));
		box.append(thread(note));
		return box;
	}

	function claudeCard(note, inPanel) {
		const box = el(inPanel ? 'details' : 'div', `pv-card pv-claude${note.status === 'done' ? ' pv-done' : ''}`);
		box.dataset.n = note.id;
		const lines = String(note.body ?? '').trim().split('\n');
		const titled = inPanel && /^\*\*.+\*\*$/.test(lines[0].trim());
		if (inPanel) {
			const summary = el('summary', 'pv-summary');
			const title = titled ? lines[0].trim().slice(2, -2) : `${lines[0].slice(0, 90)}${lines[0].length > 90 ? '…' : ''}`;
			summary.innerHTML = `<span class="pv-who">Claude</span> <span>${inline(title)}</span>`;
			if (note.choices?.length) summary.append(chip(note));
			box.append(summary);
			box.open = note.ord === 0;
		} else box.append(head('Claude', note));
		const body = el('div', 'pv-body');
		body.innerHTML = rich(titled ? lines.slice(1).join('\n') : note.body);
		box.append(body);
		if (note.choices?.length) box.append(choices(note, box));
		box.append(thread(note));
		return box;
	}

	function chip(note) {
		const tag = el('span', 'pv-chip pv-todo');
		tag.textContent = 'à répondre';
		tag.hidden = Boolean(note.pick);
		return tag;
	}

	function head(who, note) {
		const line = el('div', 'pv-head');
		line.innerHTML = `<span class="pv-who">${who}</span><span>${when(note.created)}</span>${note.status === 'done' ? '<span class="pv-chip">traité</span>' : ''}`;
		if (note.author === 'ulysse') {
			const remove = el('button', 'pv-link pv-del', { type: 'button' });
			remove.textContent = 'Supprimer';
			remove.addEventListener('click', () => {
				note.status = 'deleted';
				if (note.saved || pending[note.id]) queue(note.id, payloadOf(note));
				drop(note);
			});
			line.append(remove);
		}
		return line;
	}

	function when(iso) {
		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) return '';
		return `${date.toLocaleDateString('fr-CA', { day: 'numeric', month: 'short' })}, ${date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' })}`;
	}

	// Ulysse's own words, editable, saved as they're typed.
	function writer(note, placeholder) {
		const area = el('textarea', 'pv-text', { rows: '2', placeholder, 'aria-label': placeholder });
		area.value = note.body ?? '';
		area.addEventListener('input', () => {
			grow(area);
			note.body = area.value;
			if (note.body.trim() || note.saved || pending[note.id]) queue(note.id, payloadOf(note));
			relayoutSoon();
		});
		area.addEventListener('blur', () => {
			if (!String(note.body).trim() && !note.saved && !pending[note.id]) drop(note);
		});
		requestAnimationFrame(() => grow(area));
		return area;
	}

	// An empty box that becomes a note once something is written in it.
	function fresh(make, placeholder, settle) {
		let note = null;
		const area = el('textarea', 'pv-text pv-fresh', { rows: '1', placeholder, 'aria-label': placeholder });
		area.addEventListener('input', () => {
			grow(area);
			if (!note) {
				if (!area.value.trim()) return;
				note = make();
				notes.push(note);
			}
			note.body = area.value;
			queue(note.id, payloadOf(note));
			relayoutSoon();
		});
		area.addEventListener('blur', () => {
			if (note && note.body.trim()) settle(note, area);
		});
		return area;
	}

	function freshPageNote(list) {
		return fresh(
			() => newNote({}),
			'Une note sur cette page…',
			(note, area) => {
				area.replaceWith(card(note, true));
				list.append(freshPageNote(list));
			},
		);
	}

	function thread(note) {
		const box = el('div', 'pv-thread');
		const replies = notes.filter((other) => other.parent === note.id && other.status !== 'deleted').sort((a, b) => String(a.created).localeCompare(String(b.created)));
		for (const reply of replies) box.append(replyItem(reply));
		// Under Claude's notes, always a box to answer; under Ulysse's, once Claude has answered.
		if (note.author === 'claude' || replies.some((reply) => reply.author === 'claude')) box.append(freshReply(note, box));
		return box;
	}

	function freshReply(parent, box) {
		return fresh(
			() => newNote({ parent: parent.id }),
			'Répondre…',
			(note, area) => {
				area.replaceWith(replyItem(note));
				box.append(freshReply(parent, box));
			},
		);
	}

	function replyItem(note) {
		const item = el('div', `pv-reply pv-${note.author}`);
		item.dataset.n = note.id;
		item.append(head(note.author === 'claude' ? 'Claude' : 'Toi', note));
		if (note.author === 'claude') {
			const body = el('div', 'pv-body');
			body.innerHTML = rich(note.body);
			item.append(body);
			if (note.choices?.length) item.append(choices(note, item));
		} else item.append(writer(note, 'Ta réponse…'));
		return item;
	}

	function choices(note, box) {
		const row = el('div', 'pv-choices', { role: 'group' });
		for (const option of note.choices) {
			const pick = el('button', 'pv-choice', { type: 'button', 'aria-pressed': String(note.pick === option.v) });
			pick.innerHTML =
				`<span class="pv-choice-label">${esc(option.label)}${option.rec ? ' <span class="pv-chip">Choix de Claude</span>' : ''}</span>` +
				(option.why ? `<span>${inline(option.why)}</span>` : '') +
				(option.cost ? `<span class="pv-choice-cost">${inline(option.cost)}</span>` : '');
			pick.addEventListener('click', () => {
				note.pick = note.pick === option.v ? null : option.v;
				for (const other of row.children) other.setAttribute('aria-pressed', String(other === pick && note.pick === option.v));
				const todo = box.querySelector(':scope > summary .pv-todo');
				if (todo) todo.hidden = Boolean(note.pick);
				queue(note.id, { pick: note.pick });
			});
			row.append(pick);
		}
		return row;
	}

	// A note left empty, or deleted: off the page.
	function drop(note) {
		notes = notes.filter((other) => other !== note);
		for (const node of document.querySelectorAll(`.pv-card[data-n="${note.id}"], .pv-reply[data-n="${note.id}"]`)) node.remove();
		unwrap(note.id);
		for (const group of document.querySelectorAll('.pv-group')) if (!group.children.length) group.remove();
		relayout();
	}

	function grow(area) {
		area.style.height = 'auto';
		area.style.height = `${area.scrollHeight + 2}px`;
	}

	// The demo's comments sit in the margin at the height of their words: they move when a card pushes the text.
	function relayout() {
		dispatchEvent(new Event('resize'));
	}
	let relayoutTimer = 0;
	function relayoutSoon() {
		clearTimeout(relayoutTimer);
		relayoutTimer = setTimeout(relayout, 250);
	}

	// Claude's notes: paragraphs, lists, **bold**, *italics*, `code` and links.
	function inline(s) {
		return esc(s)
			.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
			.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
			.replace(/(^|[\s(«])\*(\S(?:.*?\S)?)\*(?=[\s).,;:!?»]|$)/g, '$1<em>$2</em>')
			.replace(/`([^`]+)`/g, '<code>$1</code>');
	}

	function rich(text) {
		return String(text ?? '')
			.trim()
			.split(/\n\s*\n/)
			.filter(Boolean)
			.map((block) => {
				const lines = block.split('\n');
				if (lines.every((line) => /^\s*[-•]\s+/.test(line))) return `<ul>${lines.map((line) => `<li>${inline(line.replace(/^\s*[-•]\s+/, ''))}</li>`).join('')}</ul>`;
				if (lines.every((line) => /^\s*\d+[.)]\s+/.test(line))) return `<ol>${lines.map((line) => `<li>${inline(line.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`;
				return `<p>${lines.map(inline).join('<br>')}</p>`;
			})
			.join('');
	}

	// ---------- saving ----------

	function payloadOf(note) {
		return { page: note.page, parent: note.parent ?? null, quote: note.quote ?? null, pre: note.pre ?? null, post: note.post ?? null, body: note.body ?? '', status: note.status };
	}

	function readPending() {
		try {
			return JSON.parse(store.get('notes.pending') || '{}') || {};
		} catch {
			return {};
		}
	}

	function keepPending() {
		store.set('notes.pending', Object.keys(pending).length ? JSON.stringify(pending) : null);
	}

	let saveTimer = 0;
	function queue(id, payload) {
		pending[id] = payload;
		keepPending();
		state('Enregistrement…');
		clearTimeout(saveTimer);
		saveTimer = setTimeout(flush, 600);
	}

	let busy = false;
	async function flush(leaving = false) {
		if (busy || !key) return;
		busy = true;
		clearTimeout(saveTimer);
		let failed = false;
		try {
			for (const id of Object.keys(pending)) {
				const payload = pending[id];
				const response = await fetch(`${API}/notes/${id}`, {
					method: 'PUT',
					headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
					keepalive: leaving,
				});
				if (response.status === 401) {
					busy = false;
					return forget('Le mot de passe a changé : entre le nouveau. Ce que tu as écrit est gardé sur cet appareil.');
				}
				if (!response.ok && response.status !== 400) {
					failed = true;
					continue;
				}
				// A 400 would fail again forever: it's dropped (it can't happen from this page).
				const saved = response.ok ? (await response.json()).note : null;
				if (pending[id] === payload) delete pending[id];
				keepPending();
				const local = notes.find((note) => note.id === id);
				if (local && saved) Object.assign(local, { saved: true, created: saved.created, updated: saved.updated });
			}
		} catch {
			failed = true;
		}
		busy = false;
		if (failed) {
			state('Hors ligne : gardé sur cet appareil, envoyé dès que possible');
			saveTimer = setTimeout(flush, 15000);
		} else if (Object.keys(pending).length) saveTimer = setTimeout(flush, 300);
		else state('Enregistré');
	}

	function state(text) {
		const line = panel?.querySelector('.pv-state');
		if (line) line.textContent = text;
	}

	addEventListener('online', () => flush());
	addEventListener('pagehide', () => flush(true));
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') return flush(true);
		// Back on the page after a while: what was written elsewhere since, unless something is being typed here.
		const typing = document.activeElement?.matches?.('.pv-text');
		if (open && !typing && !Object.keys(pending).length && Date.now() - loadedAt > 60000) load();
	});

	paint();
	if (open) start();
	else if (key && Object.keys(pending).length) flush();

	function STYLES() {
		return `
[class*="pv-"][hidden]{display:none!important}
.path{position:relative;padding-right:4.5rem}
.pv-switch{position:absolute;top:calc(1.25rem - 9px);right:.5rem;display:inline-flex;align-items:center;gap:5px;min-height:34px;padding:6px 9px;border:0;border-radius:999px;background:none;color:var(--muted);font:inherit;font-size:13px;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}
.pv-switch svg{width:14px;height:14px;flex:none}
.pv-switch:hover{color:var(--accent)}
.pv-switch.on{background:var(--accent);color:#fff}
.pv-lock{max-width:var(--measure);margin:.75rem auto 0;padding:0 1rem;font-size:14px}
.pv-lock label{display:block;margin-bottom:6px;color:var(--accent)}
.pv-row{display:flex;gap:8px}
.pv-lock input{flex:1;min-width:0;padding:9px 11px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:16px}
.pv-lock button,.pv-comment{border:0;border-radius:8px;background:var(--accent);color:#fff;font:inherit;font-size:16px;font-weight:600;padding:9px 16px;cursor:pointer}
.pv-msg{min-height:1.3em;margin:6px 0 0;color:var(--muted)}
/* Everything private is blue, Claude's notes and Ulysse's alike: the panel, the cards, the marks, the buttons. The
   public page keeps its black, white and yellow, so what visitors see and what they don't never look alike. */
:root{--pv-blue:#0066cc;--pv-ink:#123a66;--pv-muted:#4c6c93;--pv-line:#c4d8f1;--pv-wash:#eaf2fc;--pv-panel:#f5f9fe}
.pv-panel{margin:0 0 2.5rem;padding:14px 16px;border:1px solid var(--pv-line);border-left:3px solid var(--pv-blue);border-radius:8px;background:var(--pv-panel);color:var(--pv-ink);font-size:14.5px;line-height:1.5}
.pv-bar{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px}
.pv-bar>strong{color:var(--pv-blue)}
.pv-state{color:var(--pv-muted);font-size:13px}
.pv-actions{display:flex;gap:14px;margin-left:auto}
.pv-link{padding:4px 0;border:0;background:none;color:var(--pv-blue);font:inherit;font-size:13px;cursor:pointer}
.pv-help{margin:6px 0 12px;color:var(--pv-muted);font-size:13.5px}
.pv-list{display:grid;gap:10px}
.pv-sub{margin:16px 0 6px;color:var(--pv-muted);font-size:13px;font-weight:600}
.pv-group{display:block;margin:8px 0 16px}
.pv-card{display:block;margin:8px 0;padding:10px 12px;border:1px solid var(--pv-line);border-left:3px solid var(--pv-blue);border-radius:8px;background:var(--pv-wash);color:var(--pv-ink);font-size:14.5px;font-weight:400;line-height:1.5;text-align:left;transition:box-shadow .15s}
.pv-panel .pv-card{margin:0}
.pv-card.pv-done{opacity:.6}
.pv-card.on{box-shadow:0 0 0 3px rgba(0,102,204,.25)}
.c-note .pv-card,.c-note .pv-group{font-size:13.5px}
.pv-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;margin-bottom:2px;color:var(--pv-muted);font-size:12.5px}
.pv-who{color:var(--pv-blue);font-weight:700}
.pv-del{margin-left:auto;font-size:12.5px}
.pv-chip{display:inline-block;padding:0 7px;border-radius:999px;background:#d6e6f9;color:var(--pv-blue);font-size:11.5px;font-weight:600;line-height:1.6}
.pv-todo{background:var(--pv-blue);color:#fff}
.pv-summary{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;cursor:pointer;font-weight:600;list-style:none}
.pv-summary::-webkit-details-marker{display:none}
.pv-summary::before{content:'▸';color:var(--pv-blue);font-size:12px}
details[open]>.pv-summary::before{content:'▾'}
.pv-body p,.pv-body ul,.pv-body ol{margin:.45em 0}
.pv-body ul,.pv-body ol{padding-left:1.3em}
.pv-body a{color:var(--pv-blue)}
.pv-text{display:block;width:100%;min-height:40px;margin:6px 0 0;padding:8px 10px;border:1px solid var(--pv-line);border-radius:6px;background:#fff;color:var(--pv-ink);font:inherit;font-size:16px;line-height:1.45;resize:none;overflow:hidden}
.pv-text::placeholder{color:#7d97b8}
.pv-text:focus{outline:none;border-color:var(--pv-blue);box-shadow:0 0 0 2px rgba(0,102,204,.15)}
.pv-thread{margin-top:4px}
.pv-reply{margin-top:8px;padding-top:6px;border-top:1px solid var(--pv-line)}
.pv-quote{margin:2px 0;color:var(--pv-muted);font-size:13px}
.pv-choices{display:grid;gap:6px;margin:8px 0}
.pv-choice{display:grid;gap:3px;padding:8px 10px;border:1px solid var(--pv-line);border-radius:8px;background:#fff;color:var(--pv-ink);font:inherit;font-size:14px;line-height:1.45;text-align:left;cursor:pointer}
.pv-choice[aria-pressed="true"]{border-color:var(--pv-blue);background:#dcebfb;box-shadow:inset 0 0 0 1px var(--pv-blue)}
.pv-choice-label{font-weight:600}
.pv-choice-cost{color:var(--pv-muted)}
mark.pv-mark{background:rgba(0,102,204,.13);box-shadow:0 1.5px 0 rgba(0,102,204,.6);color:inherit;border-radius:2px;cursor:pointer}
mark.pv-mark.on{background:rgba(0,102,204,.3)}
.pv-comment{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:1000;padding:12px 22px;border-radius:999px;box-shadow:0 2px 12px rgba(0,0,0,.22);-webkit-user-select:none;user-select:none}
.pv-cmt-reply{display:block;margin-top:4px}
@media print{.pv-switch,.pv-lock,.pv-comment{display:none!important}}
`;
	}
})();
