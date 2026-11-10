// Pages that moved, so their old address still works: the 404 page sends each one on to its new address.
// On Nov 5, 2026, À propos left the home page for /a-propos, and the pages it links to moved under it.
export const moved: Record<string, string> = {
	'/course': '/a-propos/course',
	'/projets/hide-and-stalk': '/a-propos/hide-and-stalk',
	// On Nov 10, 2026, the tutor's demo became the tutor's page itself.
	'/tuteur/demo': '/tuteur',
};
