import { PortableText, type PortableTextBlock, type PortableTextComponents } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';

import { urlForImage } from '@/sanity/image';
import type { SanityImage } from '@/sanity/types';

/*
 * Renders CMS rich text as React elements. Portable Text is structured data,
 * not HTML, so editors cannot inject scripts or markup.
 */
const components: PortableTextComponents = {
	types: {
		image: ({ value }: { value: SanityImage }) => {
			const src = urlForImage(value, 1400);
			if (!src) return null;
			return (
				<figure>
					<Image
						src={src}
						alt={value.alt ?? ''}
						width={1400}
						height={900}
						sizes='(min-width: 768px) 720px, 100vw'
						className='h-auto w-full'
						placeholder={value.lqip ? 'blur' : 'empty'}
						blurDataURL={value.lqip}
					/>
					{value.caption && <figcaption>{value.caption}</figcaption>}
				</figure>
			);
		},
	},
	marks: {
		link: ({ value, children }) => {
			const href: string = value?.href ?? '';
			if (href.startsWith('/')) return <Link href={href}>{children}</Link>;
			if (!/^(https?:|mailto:|tel:)/i.test(href)) return <>{children}</>;
			const external = href.startsWith('http');
			return (
				<a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
					{children}
					{external && <span className='sr-only'> (opens in a new tab)</span>}
				</a>
			);
		},
	},
};

export function PortableBody({ value }: { value: PortableTextBlock[] }) {
	return (
		<div className='prose-ivorris'>
			<PortableText value={value} components={components} />
		</div>
	);
}
