// French typography, so that a page typed with ordinary spaces still reads well: a line never breaks
// before : ; ! ? » % $, after «, or inside a number (7 300). Astro already curls the page's apostrophes;
// typeset() does both for the text that comes from a file's properties (its title, its facts).

const RULES = [
	[/ ([:;!?»%$])/g, ' $1'],
	[/« /g, '« '],
	[/(\d) (?=\d{3}(?!\d))/g, '$1 '],
];

export function frenchSpaces(text) {
	return RULES.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);
}

export function typeset(text) {
	return frenchSpaces(text.replace(/'/g, '’'));
}

export default function remarkFrench() {
	return (tree) => visit(tree);
}

function visit(node) {
	if (node.type === 'text') node.value = frenchSpaces(node.value);
	node.children?.forEach(visit);
}
