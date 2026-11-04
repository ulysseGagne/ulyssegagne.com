// A link to another site opens in a new tab, so a visitor never leaves this one. This plugin does it for every link in
// a page's Markdown; a layout that writes a link itself adds NEW_TAB to its <a> when isOutside(href, Astro.site).
// Links to the site's own pages, to a place in a page (#) and mailto: links stay as they are.

export const NEW_TAB = { target: '_blank', rel: 'noopener noreferrer' };

// A web address, whole (https://…) or without its scheme (//…), that isn't the site's own.
export function isOutside(href, site) {
	try {
		const url = new URL(href, site);
		return /^https?:$/.test(url.protocol) && url.host.replace(/^www\./, '') !== new URL(site).host;
	} catch {
		return false;
	}
}

export default function rehypeExternalLinks({ site }) {
	return (tree) => visit(tree, site);
}

function visit(node, site) {
	if (node.type === 'element' && node.tagName === 'a' && isOutside(node.properties?.href, site)) {
		Object.assign(node.properties, { target: NEW_TAB.target, rel: NEW_TAB.rel.split(' ') });
	}
	node.children?.forEach((child) => visit(child, site));
}
