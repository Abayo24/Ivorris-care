import { NextResponse, type NextRequest } from 'next/server';

import {
	contactMethods,
	enquiryTopics,
	labelFor,
	normaliseContact,
	validateContact,
	type ContactInput,
} from '@/lib/contact';
import { site } from '@/content/site';

/*
 * Contact enquiries are emailed to the Ivorris team through Resend
 * (https://resend.com). Nothing is stored in a database.
 *
 * Required server environment variables:
 *   RESEND_API_KEY      — API key from Resend
 *   CONTACT_TO_EMAIL    — inbox that receives enquiries
 *   CONTACT_FROM_EMAIL  — verified sender, e.g. "Ivorris Website <website@yourdomain>"
 *
 * If they are missing the route answers 503 and the form tells the visitor to
 * call or WhatsApp instead — it never pretends the message was sent.
 */

const MIN_FILL_MS = 3000;
const MAX_BODY_BYTES = 8 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Best-effort, per-instance rate limit. Serverless instances don't share
// memory, so this slows down abuse rather than guaranteeing a hard limit.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
	const now = Date.now();
	const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 5000) hits.clear();
	return recent.length > RATE_MAX;
}

const escapeHtml = (s: string) =>
	s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function buildEmail(input: ContactInput) {
	const rows: [string, string][] = [
		['Name', input.name],
		['Preferred contact', labelFor(contactMethods, input.method)],
		['Phone', input.phone || '—'],
		['Email', input.email || '—'],
		['Enquiry', labelFor(enquiryTopics, input.topic)],
		['Message', input.message || '—'],
	];
	const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
	const html = `<h2 style="font-family:sans-serif">New website enquiry</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows
		.map(
			([k, v]) =>
				`<tr><th align="left" style="padding:6px 12px 6px 0;vertical-align:top">${k}</th><td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
		)
		.join('')}</table><p style="font-family:sans-serif;color:#666;font-size:12px">The sender consented to being contacted about this enquiry.</p>`;
	return { text, html };
}

export async function POST(request: NextRequest) {
	const fail = (status: number, message: string, extra: Record<string, unknown> = {}) =>
		NextResponse.json({ ok: false, message, ...extra }, { status });

	if (!request.headers.get('content-type')?.includes('application/json')) {
		return fail(415, 'Unsupported request.');
	}

	// Only accept submissions sent from this site's own pages.
	const origin = request.headers.get('origin');
	if (origin && origin !== request.nextUrl.origin && origin !== new URL(site.url).origin) {
		return fail(403, 'This form can only be submitted from the Ivorris Care website.');
	}

	let raw: Record<string, unknown>;
	try {
		const text = await request.text();
		if (text.length > MAX_BODY_BYTES) return fail(413, 'Your message is too long.');
		const parsed: unknown = JSON.parse(text);
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('bad body');
		raw = parsed as Record<string, unknown>;
	} catch {
		return fail(400, 'We could not read your message. Please try again.');
	}

	// Spam protection: a hidden "website" field that people never fill in, and
	// a minimum time between the form loading and being submitted.
	const startedAt = Number(raw.startedAt);
	if (typeof raw.website === 'string' && raw.website.trim() !== '') {
		return NextResponse.json({ ok: true }); // silently drop bots
	}
	if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
		return fail(400, 'That was a little quick — please check your details and send again.');
	}

	const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
	if (rateLimited(ip)) {
		return fail(429, 'You have sent several messages in a short time. Please wait a few minutes, or call us instead.');
	}

	const input = normaliseContact(raw);
	const errors = validateContact(input);
	if (Object.keys(errors).length > 0) {
		return fail(422, 'Please check the highlighted fields.', { errors });
	}

	const apiKey = process.env.RESEND_API_KEY?.trim();
	const to = process.env.CONTACT_TO_EMAIL?.trim();
	const from = process.env.CONTACT_FROM_EMAIL?.trim();
	if (!apiKey || !to || !from) {
		console.error('[contact] email delivery is not configured');
		return fail(
			503,
			`Our online form isn't available right now. Please call or WhatsApp us on ${site.contact.phoneDisplay}, or email ${site.contact.email}.`,
		);
	}

	const { text, html } = buildEmail(input);
	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from,
				to: to.split(',').map((s) => s.trim()),
				subject: `Website enquiry: ${labelFor(enquiryTopics, input.topic)}`,
				text,
				html,
				...(input.email ? { reply_to: input.email } : {}),
			}),
			signal: AbortSignal.timeout(10000),
		});
		if (!res.ok) {
			console.error('[contact] Resend responded', res.status, await res.text().catch(() => ''));
			throw new Error('send failed');
		}
	} catch {
		return fail(
			502,
			`Sorry — your message didn't go through. Please try again, or call or WhatsApp us on ${site.contact.phoneDisplay}.`,
		);
	}

	return NextResponse.json({ ok: true });
}
