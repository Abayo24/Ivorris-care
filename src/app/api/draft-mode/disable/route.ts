import { draftMode } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
	(await draftMode()).disable();
	const target = request.nextUrl.searchParams.get('redirect') || '/blog';
	// Only allow same-site relative redirects.
	const safe = target.startsWith('/') && !target.startsWith('//') ? target : '/blog';
	return NextResponse.redirect(new URL(safe, request.url));
}
