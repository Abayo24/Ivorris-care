import 'server-only';

import { createClient, type QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';

import { apiVersion, dataset, isSanityConfigured, projectId } from './env';

/** How often published content is re-checked even without the webhook (seconds). */
export const REVALIDATE_SECONDS = 60;

/** Server-only token with read access to drafts — used for authenticated previews. */
export const readToken = process.env.SANITY_API_READ_TOKEN?.trim() || '';

export const client = createClient({
	projectId: projectId || 'missing',
	dataset,
	apiVersion,
	useCdn: true,
	perspective: 'published',
});

/** Draft mode only exists during a request; build-time calls (e.g. generateStaticParams) read published content. */
async function isDraftModeEnabled() {
	try {
		return (await draftMode()).isEnabled;
	} catch {
		return false;
	}
}

/**
 * Fetch CMS content for a page.
 *
 * - Public visitors get published content only, cached and refreshed by the
 *   revalidation webhook (tag "sanity") or every REVALIDATE_SECONDS.
 * - When an editor opens a preview from the Studio, Next.js draft mode is on
 *   and drafts are read with the server-side token, uncached.
 * - If the CMS isn't configured or the request fails, `fallback` is returned so
 *   the rest of the page still renders.
 */
export async function sanityFetch<T>({
	query,
	params = {},
	fallback,
}: {
	query: string;
	params?: QueryParams;
	fallback: T;
}): Promise<T> {
	if (!isSanityConfigured) return fallback;

	const isDraft = await isDraftModeEnabled();

	try {
		if (isDraft && readToken) {
			const result = await client
				.withConfig({ token: readToken, useCdn: false, perspective: 'drafts' })
				.fetch<T>(query, params, { cache: 'no-store' });
			return result ?? fallback;
		}

		const result = await client.fetch<T>(query, params, {
			next: { revalidate: REVALIDATE_SECONDS, tags: ['sanity'] },
		});
		return result ?? fallback;
	} catch (error) {
		console.error('[sanity] query failed', error instanceof Error ? error.message : error);
		return fallback;
	}
}
