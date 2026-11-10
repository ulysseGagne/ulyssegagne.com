// The tutor's demo (site/tuteur.md): each comment beside the words it is about, as in Google Docs.
// On a wide screen, a comment sits in the margin at the height of its words, pushed down only when the one above
// takes the room; on a narrow one, it follows its message. Hovering the words or the comment lights both.
(() => {
	const root = document.querySelector('.conversation');
	if (!root) return;
	const anchors = new Map([...root.querySelectorAll('mark.c-anchor')].map((a) => [a.dataset.c, a]));
	const notes = [...root.querySelectorAll('.c-note')];
	const column = document.createElement('div');
	column.className = 'c-column';
	root.append(column);
	const wide = matchMedia('(min-width: 1120px)');

	// A comment's message: the outermost callout around its words.
	function messageOf(anchor) {
		let message = anchor.closest('aside.callout');
		while (message?.parentElement?.closest('aside.callout')) message = message.parentElement.closest('aside.callout');
		return message ?? anchor.closest('p, li') ?? root;
	}

	function place() {
		root.classList.toggle('wide', wide.matches);
		if (wide.matches) {
			for (const note of notes) column.append(note);
			const base = root.getBoundingClientRect().top;
			let floor = 0;
			for (const note of notes) {
				const want = anchors.get(note.dataset.c).getBoundingClientRect().top - base - 6;
				const top = Math.max(want, floor);
				note.style.top = `${top}px`;
				floor = top + note.offsetHeight + 8;
			}
			column.style.height = `${floor}px`;
			return;
		}
		column.style.height = '';
		for (const note of notes) {
			note.style.top = '';
			const message = messageOf(anchors.get(note.dataset.c));
			let list = message.querySelector(':scope > .c-notes');
			if (!list) {
				list = document.createElement('div');
				list.className = 'c-notes';
				message.append(list);
			}
			list.append(note);
		}
	}

	function light(id, on) {
		anchors.get(id)?.classList.toggle('on', on);
		for (const note of notes) if (note.dataset.c === id) note.classList.toggle('on', on);
	}
	for (const [id, anchor] of anchors) {
		anchor.addEventListener('mouseenter', () => light(id, true));
		anchor.addEventListener('mouseleave', () => light(id, false));
		anchor.addEventListener('focus', () => light(id, true));
		anchor.addEventListener('blur', () => light(id, false));
	}
	for (const note of notes) {
		note.addEventListener('mouseenter', () => light(note.dataset.c, true));
		note.addEventListener('mouseleave', () => light(note.dataset.c, false));
	}

	let frame = 0;
	const again = () => {
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(place);
	};
	place();
	wide.addEventListener('change', again);
	addEventListener('resize', again);
	addEventListener('load', again);
	document.fonts?.ready.then(again);
})();
