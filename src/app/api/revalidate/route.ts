import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

/*
 * Sanity webhook target. When an article, category or author is published,
 * changed, unpublished or deleted, Sanity calls this endpoint and the cached
 * blog pages are refreshed immediately — no redeploy needed.
 *
 * The request is rejected unless its signature matches SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
	if (!secret) {
		return NextResponse.json({ message: 'Revalidation is not configured.' }, { status: 503 });
	}

	try {
		const { isValidSignature, body } = await parseBody<{ _type?: string }>(request, secret, true);
		if (!isValidSignature) {
			return NextResponse.json({ message: 'Invalid signature.' }, { status: 401 });
		}
		if (!body?._type) {
			return NextResponse.json({ message: 'Missing document type.' }, { status: 400 });
		}

		revalidateTag('sanity', { expire: 0 });
		return NextResponse.json({ revalidated: true, type: body._type });
	} catch (error) {
		console.error('[revalidate] failed', error instanceof Error ? error.message : error);
		return NextResponse.json({ message: 'Could not revalidate.' }, { status: 500 });
	}
}
