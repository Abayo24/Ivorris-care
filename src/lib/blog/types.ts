/** Rich text as saved by the article editor (a ProseMirror / Tiptap document). */
export type RichTextNode = {
	type: string;
	attrs?: Record<string, unknown>;
	content?: RichTextNode[];
	marks?: { type: string; attrs?: Record<string, unknown> }[];
	text?: string;
};

export type BlogImage = { src: string; alt: string };

export type Person = {
	name: string;
	role?: string;
	/** Qualifications, e.g. "RN, BScN". Only enter credentials the person actually holds. */
	credentials?: string;
};

export type PostStatus = 'draft' | 'published';

/** An article exactly as stored. */
export type StoredPost = {
	id: string;
	status: PostStatus;
	title: string;
	slug: string;
	/** Earlier slugs of this article, redirected to the current one. */
	oldSlugs: string[];
	excerpt: string;
	body: RichTextNode;
	mainImage?: BlogImage;
	category: string;
	tags: string[];
	author?: Person;
	reviewedBy?: Person;
	reviewedAt?: string;
	publishedAt: string;
	/** Set by the editor when the article is meaningfully revised. */
	updatedAt?: string;
	featured: boolean;
	faqs: { question: string; answer: string }[];
	sources: { title: string; url?: string }[];
	seo: { title?: string; description?: string; noIndex?: boolean };
	createdAt: string;
	/** Last time the article was saved. */
	savedAt: string;
};

export type Category = { title: string; slug: string; description: string };

/** What article cards need. */
export type PostCard = {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	publishedAt: string;
	updatedAt?: string;
	featured: boolean;
	mainImage?: BlogImage;
	category?: Category;
	readingMinutes: number;
};

export type Post = PostCard & {
	body: RichTextNode;
	tags: string[];
	author?: Person;
	reviewedBy?: Person;
	reviewedAt?: string;
	savedAt: string;
	faqs: { question: string; answer: string }[];
	sources: { title: string; url?: string }[];
	seo: StoredPost['seo'];
	related: PostCard[];
};
