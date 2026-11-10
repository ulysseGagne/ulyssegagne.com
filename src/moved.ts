// Pages that moved, so their old address still works, and short addresses: the 404 page sends each one on to its page.
// A key is written in lowercase and with its accents; the 404 page matches it in any case, typed with or without its accents' encoding.
// On Nov 5, 2026, À propos left the home page for /a-propos, and the pages it links to moved under it.
export const moved: Record<string, string> = {
	'/course': '/a-propos/course',
	'/projets/hide-and-stalk': '/a-propos/hide-and-stalk',
	// On Nov 10, 2026, the tutor's demo became the tutor's page itself.
	'/tuteur/demo': '/tuteur',
	// On Nov 10, 2026, two friends' first names, to their pages (Ulysse); « felix » too, for whoever types it without its accent.
	'/félix': '/never-enough',
	'/felix': '/never-enough',
	'/nora': '/study-system',
};
