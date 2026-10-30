import Image from 'next/image';
import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

import { isAllowedImageSrc, safeHref } from '@/lib/blog/richText';
import type { RichTextNode } from '@/lib/blog/types';

/*
 * Renders an article body as React elements. The body is structured data, not
 * HTML, and only known node types are drawn, so an article can't inject
 * scripts or markup into the page.
 */

function LinkMark({ href, children }: { href: string; children: ReactNode }) {
	if (href.startsWith('/') || href.startsWith('#')) return <Link href={href}>{children}</Link>;
	const external = href.startsWith('http');
	return (
		<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
			{children}
			{external && <span className='sr-only'> (opens in a new tab)</span>}
		</a>
	);
}

function renderText(node: RichTextNode, key: number) {
	let out: ReactNode = node.text ?? '';
	for (const mark of node.marks ?? []) {
		if (mark.type === 'bold') out = <strong>{out}</strong>;
		else if (mark.type === 'italic') out = <em>{out}</em>;
		else if (mark.type === 'link') {
			const href = safeHref(mark.attrs?.href);
			if (href) out = <LinkMark href={href}>{out}</LinkMark>;
		}
	}
	return <Fragment key={key}>{out}</Fragment>;
}

function renderChildren(node: RichTextNode) {
	return (node.content ?? []).map(renderNode);
}

function renderNode(node: RichTextNode, key: number): ReactNode {
	switch (node.type) {
		case 'text':
			return renderText(node, key);
		case 'paragraph':
			return node.content?.length ? <p key={key}>{renderChildren(node)}</p> : null;
		case 'heading': {
			const level = node.attrs?.level;
			const Tag = level === 3 ? 'h3' : level === 4 ? 'h4' : 'h2';
			return <Tag key={key}>{renderChildren(node)}</Tag>;
		}
		case 'bulletList':
			return <ul key={key}>{renderChildren(node)}</ul>;
		case 'orderedList': {
			const start = Number(node.attrs?.start) || 1;
			return (
				<ol key={key} start={start > 1 ? start : undefined}>
					{renderChildren(node)}
				</ol>
			);
		}
		case 'listItem':
			return <li key={key}>{renderChildren(node)}</li>;
		case 'blockquote':
			return <blockquote key={key}>{renderChildren(node)}</blockquote>;
		case 'hardBreak':
			return <br key={key} />;
		case 'horizontalRule':
			return <hr key={key} />;
		case 'image': {
			const src = node.attrs?.src;
			if (!isAllowedImageSrc(src)) return null;
			const caption = typeof node.attrs?.title === 'string' ? node.attrs.title : '';
			return (
				<figure key={key}>
					<Image
						src={src}
						alt={typeof node.attrs?.alt === 'string' ? node.attrs.alt : ''}
						width={1400}
						height={900}
						sizes='(min-width: 768px) 720px, 100vw'
						className='h-auto w-full'
					/>
					{caption && <figcaption>{caption}</figcaption>}
				</figure>
			);
		}
		default:
			return null;
	}
}

export function RichText({ value }: { value: RichTextNode }) {
	return <div className='prose-ivorris'>{renderChildren(value)}</div>;
}
