// A page's address on the site: its path in `site/`, without `.md`; a folder's `index.md` is the folder's own page.
// site/index.md is `/`, site/tuteur.md is `/tuteur`, site/projets/hide-and-stalk.md is `/projets/hide-and-stalk`.
export function address(id: string) {
	return '/' + id.replace(/(^|\/)index$/, '');
}
