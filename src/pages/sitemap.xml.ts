import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { address } from '../address';

// The list of pages for search engines: every page of site/, except those marked `noindex: true`.
export const GET: APIRoute = async ({ site }) => {
	const pages = await getCollection('pages', (page) => !page.data.noindex);
	const urls = pages
		.map((page) => new URL(address(page.id), site).href)
		.sort()
		.map((url) => `\t<url><loc>${url}</loc></url>`);
	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls,
		'</urlset>',
		'',
	].join('\n');
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
