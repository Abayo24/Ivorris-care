import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { NextResponse } from 'next/server';

import { client, readToken } from '@/sanity/fetch';

/*
 * Called by the Studio's Preview tool. The Studio generates a short-lived
 * secret that is validated against Sanity with the server-side token, so only
 * signed-in editors can switch on draft previews.
 */
const handler = readToken
	? defineEnableDraftMode({ client: client.withConfig({ token: readToken, useCdn: false }) }).GET
	: async () =>
			NextResponse.json(
				{ error: 'Previews are not configured. Set SANITY_API_READ_TOKEN on the server.' },
				{ status: 503 },
			);

export const GET = handler;
