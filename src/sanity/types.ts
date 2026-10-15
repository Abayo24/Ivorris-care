import type { PortableTextBlock } from '@portabletext/react';

export type SanityImage = {
	_type?: 'image';
	asset?: { _ref: string; _type?: 'reference' };
	alt?: string;
	caption?: string;
	hotspot?: { x: number; y: number; height: number; width: number };
	crop?: { top: number; bottom: number; left: number; right: number };
	lqip?: string;
};

export type CategoryRef = { title: string; slug: string; description?: string };

export type AuthorRef = {
	name: string;
	slug?: string;
	role?: string;
	/** Only populated when the credentials have been marked verified in the CMS. */
	credentials?: string;
	bio?: string;
	image?: SanityImage;
};

export type PostCard = {
	_id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	updatedAt?: string;
	featured?: boolean;
	isPlaceholder?: boolean;
	mainImage?: SanityImage;
	category?: CategoryRef;
	author?: AuthorRef;
	readingMinutes?: number;
};

export type Post = PostCard & {
	_updatedAt: string;
	body: PortableTextBlock[];
	tags?: string[];
	faqs?: { _key: string; question: string; answer: string }[];
	reviewedBy?: AuthorRef;
	reviewedAt?: string;
	sources?: { _key: string; title: string; url?: string }[];
	seo?: { title?: string; description?: string; ogImage?: SanityImage; noIndex?: boolean };
	related: PostCard[];
};
