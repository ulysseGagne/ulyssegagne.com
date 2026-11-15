-- One row per note: Ulysse's, on a few words of a page or on the page as a whole, and Claude's, with its
-- answers and the options it offers. Nothing is ever erased: a deleted note stays, hidden.
CREATE TABLE IF NOT EXISTS notes (
	id TEXT PRIMARY KEY,
	page TEXT NOT NULL,                   -- the page's path, like /tuteur
	author TEXT NOT NULL,                 -- ulysse or claude
	parent TEXT,                          -- the note this one answers
	quote TEXT,                           -- the words it's on; empty for a note on the whole page
	pre TEXT,                             -- the text just before those words, to find the right ones
	post TEXT,                            -- and just after
	body TEXT NOT NULL DEFAULT '',
	choices TEXT,                         -- Claude's options to pick from, as JSON
	pick TEXT,                            -- Ulysse's pick
	status TEXT NOT NULL DEFAULT 'open',  -- open; done, once Claude has dealt with it; deleted, kept but hidden
	ord REAL,                             -- the order of Claude's notes on a page
	created TEXT NOT NULL,
	updated TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS notes_by_page ON notes (page, status);
