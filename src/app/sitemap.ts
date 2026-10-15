import type { MetadataRoute } from 'next';

import { services } from '@/content/services';
import { absoluteUrl } from '@/lib/seo';
import { sanityFetch } from '@/sanity/fetch';
import { postSlugsQuery } from '@/sanity/queries';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{ url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
		{ url: absoluteUrl('/services'), changeFrequency: 'monthly', priority: 0.9 },
		...services.map((s) => ({
			url: absoluteUrl(`/services/${s.slug}`),
			changeFrequency: 'monthly' as const,
			priority: 0.9,
		})),
		{ url: absoluteUrl('/connect-and-coordinate'), changeFrequency: 'monthly', priority: 0.8 },
		{ url: absoluteUrl('/equipment'), changeFrequency: 'monthly', priority: 0.6 },
		{ url: absoluteUrl('/about'), changeFrequency: 'yearly', priority: 0.6 },
		{ url: absoluteUrl('/contact'), changeFrequency: 'yearly', priority: 0.8 },
		{ url: absoluteUrl('/blog'), changeFrequency: 'weekly', priority: 0.8 },
		{ url: absoluteUrl('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
	];

	// Published, indexable articles only (drafts are never returned).
	const posts = await sanityFetch<{ slug: string; publishedAt: string; updatedAt?: string; _updatedAt: string }[]>({
		query: postSlugsQuery,
		fallback: [],
	});

	return [
		...staticPages,
		...posts.map((p) => ({
			url: absoluteUrl(`/blog/${p.slug}`),
			lastModified: new Date(p.updatedAt || p._updatedAt || p.publishedAt),
			changeFrequency: 'monthly' as const,
			priority: 0.7,
		})),
	];
}
