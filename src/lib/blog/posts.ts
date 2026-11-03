import 'server-only';

import { unstable_cache } from 'next/cache';

import { categories, categoryBySlug } from '@/content/blog';

import { plainText, readingMinutes } from './richText';
import { readPosts } from './store';
import type { Category, Post, PostCard, StoredPost } from './types';

/** Cache tag for every public blog read; saving in the dashboard refreshes it. */
export const BLOG_TAG = 'blog';

/*
 * Public reads only ever see published articles. They are cached and refreshed
 * the moment the owner saves in the dashboard (or hourly as a safety net). If
 * storage can't be reached the site still renders, just without articles.
 */
const publishedPosts = unstable_cache(
	async (): Promise<StoredPost[]> => {
		try {
			const posts = await readPosts();
			return posts
				.filter((p) => p.status === 'published')
				.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
		} catch (error) {
			console.error('[blog] could not read articles', error instanceof Error ? error.message : error);
			return [];
		}
	},
	['blog-published-posts'],
	{ tags: [BLOG_TAG], revalidate: 3600 },
);

export function toCard(p: StoredPost): PostCard {
	return {
		id: p.id,
		title: p.title,
		slug: p.slug,
		excerpt: p.excerpt,
		publishedAt: p.publishedAt,
		updatedAt: p.updatedAt,
		featured: p.featured,
		mainImage: p.mainImage,
		category: categoryBySlug(p.category),
		author: p.author,
		readingMinutes: readingMinutes(p.body),
	};
}

export function toPost(p: StoredPost, all: StoredPost[]): Post {
	const related = all
		.filter((o) => o.id !== p.id && o.category === p.category && o.status === 'published')
		.slice(0, 3)
		.map(toCard);
	return {
		...toCard(p),
		body: p.body,
		tags: p.tags,
		reviewedBy: p.reviewedBy,
		reviewedAt: p.reviewedAt,
		savedAt: p.savedAt,
		faqs: p.faqs,
		sources: p.sources,
		seo: p.seo,
		related,
	};
}

export async function getLatestPosts(limit: number) {
	return (await publishedPosts()).slice(0, limit).map(toCard);
}

export async function getPostsByCategory(category: string, limit: number) {
	return (await publishedPosts())
		.filter((p) => p.category === category)
		.slice(0, limit)
		.map(toCard);
}

/** The newest featured article, or simply the newest. */
export async function getFeaturedPost() {
	const posts = await publishedPosts();
	const featured = posts.find((p) => p.featured) ?? posts[0];
	return featured ? toCard(featured) : null;
}

/** Categories that have at least one published article. */
export async function getCategoriesInUse(): Promise<Category[]> {
	const used = new Set((await publishedPosts()).map((p) => p.category));
	return categories.filter((c) => used.has(c.slug));
}

export async function listPosts({
	category,
	q,
	exclude,
	start,
	end,
}: {
	category: string;
	q: string;
	exclude: string;
	start: number;
	end: number;
}) {
	const words = q.toLowerCase().split(/\s+/).filter(Boolean);
	const matches = (await publishedPosts()).filter((p) => {
		if (p.id === exclude) return false;
		if (category && p.category !== category) return false;
		if (!words.length) return true;
		const haystack = `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${plainText(p.body)}`.toLowerCase();
		return words.every((w) => haystack.includes(w));
	});
	return { posts: matches.slice(start, end).map(toCard), total: matches.length };
}

/** A published article by its slug, or by one of its earlier slugs (`movedTo` is then set). */
export async function getPostBySlug(slug: string): Promise<{ post: Post | null; movedTo?: string }> {
	const all = await publishedPosts();
	const post = all.find((p) => p.slug === slug);
	if (post) return { post: toPost(post, all) };
	const moved = all.find((p) => p.oldSlugs.includes(slug));
	return { post: null, movedTo: moved?.slug };
}

/** Published, indexable articles for the sitemap and static generation. */
export async function getIndexablePosts() {
	return (await publishedPosts())
		.filter((p) => !p.seo.noIndex)
		.map((p) => ({ slug: p.slug, publishedAt: p.publishedAt, updatedAt: p.updatedAt, savedAt: p.savedAt }));
}
