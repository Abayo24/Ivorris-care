import type { RichTextNode } from './types';

/*
 * The article body is a ProseMirror document from the editor. Before it is
 * saved, it is rebuilt from an allow-list of node types, marks and attributes,
 * so nothing unexpected (scripts, styles, unknown embeds) can reach the site.
 */

export const emptyDoc: RichTextNode = { type: 'doc', content: [{ type: 'paragraph' }] };

const BLOCKS = new Set([
	'paragraph',
	'heading',
	'bulletList',
	'orderedList',
	'listItem',
	'blockquote',
	'horizontalRule',
	'image',
	'hardBreak',
	'text',
]);
const MARKS = new Set(['bold', 'italic', 'link']);

/** Images must come from the site's own uploads. */
export function isAllowedImageSrc(src: unknown): src is string {
	if (typeof src !== 'string') return false;
	if (/^\/uploads\/[\w.-]+$/.test(src)) return true;
	try {
		const url = new URL(src);
		return url.protocol === 'https:' && url.hostname.endsWith('.public.blob.vercel-storage.com');
	} catch {
		return false;
	}
}

/** Links may go to pages on this site, web pages, email or phone. */
export function safeHref(href: unknown): string | null {
	if (typeof href !== 'string') return null;
	const value = href.trim();
	if (/^\/(?!\/)/.test(value) || /^#[\w-]+$/.test(value)) return value;
	if (/^(https?:\/\/|mailto:|tel:)/i.test(value) && !/\s/.test(value)) return value;
	return null;
}

const text = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : '');

function cleanNode(node: unknown, depth: number): RichTextNode | null {
	if (!node || typeof node !== 'object' || depth > 12) return null;
	const n = node as RichTextNode;
	if (!BLOCKS.has(n.type)) return null;

	if (n.type === 'text') {
		const value = text(n.text, 20000);
		if (!value) return null;
		const marks = (Array.isArray(n.marks) ? n.marks : []).flatMap((m) => {
			if (!m || !MARKS.has(m.type)) return [];
			if (m.type !== 'link') return [{ type: m.type }];
			const href = safeHref(m.attrs?.href);
			return href ? [{ type: 'link', attrs: { href } }] : [];
		});
		return marks.length ? { type: 'text', text: value, marks } : { type: 'text', text: value };
	}

	if (n.type === 'image') {
		if (!isAllowedImageSrc(n.attrs?.src)) return null;
		return {
			type: 'image',
			attrs: {
				src: n.attrs.src,
				alt: text(n.attrs?.alt, 300),
				title: text(n.attrs?.title, 300) || null,
			},
		};
	}

	const result: RichTextNode = { type: n.type };
	if (n.type === 'heading') {
		const level = Number(n.attrs?.level);
		result.attrs = { level: level === 3 || level === 4 ? level : 2 };
	}
	if (n.type === 'orderedList') {
		const start = Number(n.attrs?.start);
		result.attrs = { start: Number.isInteger(start) && start > 0 && start < 10000 ? start : 1 };
	}
	if (Array.isArray(n.content)) {
		const children = n.content.map((c) => cleanNode(c, depth + 1)).filter((c): c is RichTextNode => c !== null);
		if (children.length) result.content = children;
	}
	return result;
}

export function sanitizeDoc(doc: unknown): RichTextNode {
	if (!doc || typeof doc !== 'object' || (doc as RichTextNode).type !== 'doc') return emptyDoc;
	const content = ((doc as RichTextNode).content ?? [])
		.map((c) => cleanNode(c, 1))
		.filter((c): c is RichTextNode => c !== null);
	return { type: 'doc', content: content.length ? content : emptyDoc.content };
}

export function plainText(node: RichTextNode | undefined): string {
	if (!node) return '';
	if (node.type === 'text') return node.text ?? '';
	const inner = (node.content ?? []).map(plainText).join(node.type === 'doc' ? '\n' : ' ');
	return inner;
}

/** About 200 words a minute. */
export function readingMinutes(node: RichTextNode | undefined) {
	const words = plainText(node).split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(words / 200));
}
