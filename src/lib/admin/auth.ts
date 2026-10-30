import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

/*
 * The dashboard has one sign-in: the password in ADMIN_PASSWORD (set it in
 * Vercel's environment variables, never in code). A signed, HTTP-only cookie
 * keeps the owner signed in for SESSION_DAYS. Changing the password signs
 * everyone out.
 */

const MIN_PASSWORD_LENGTH = 12;
const SESSION_DAYS = 7;
const isProd = process.env.NODE_ENV === 'production';
// "__Host-" cookies are locked to this exact site over HTTPS.
const COOKIE = isProd ? '__Host-ivorris_admin' : 'ivorris_admin';

function password() {
	return process.env.ADMIN_PASSWORD?.trim() || '';
}

/** True once a strong enough ADMIN_PASSWORD is set. */
export function isAdminConfigured() {
	return password().length >= MIN_PASSWORD_LENGTH;
}

const sha256 = (value: string) => createHash('sha256').update(value).digest();

function signingKey() {
	const secret = process.env.ADMIN_SESSION_SECRET?.trim();
	return sha256(`ivorris-admin-session:${secret || password()}`);
}

function sign(value: string) {
	return createHmac('sha256', signingKey()).update(value).digest('base64url');
}

function safeEqual(a: Buffer, b: Buffer) {
	return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPassword(attempt: string) {
	if (!isAdminConfigured()) return false;
	return safeEqual(sha256(attempt), sha256(password()));
}

export async function startSession() {
	const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
	const value = `${expires}.${sign(String(expires))}`;
	(await cookies()).set(COOKIE, value, {
		httpOnly: true,
		secure: isProd,
		sameSite: 'strict',
		path: '/',
		expires: new Date(expires),
	});
}

export async function endSession() {
	(await cookies()).delete(COOKIE);
}

export async function isSignedIn() {
	if (!isAdminConfigured()) return false;
	const value = (await cookies()).get(COOKIE)?.value ?? '';
	const [expires, signature] = value.split('.');
	if (!expires || !signature || Number(expires) < Date.now()) return false;
	return safeEqual(Buffer.from(signature), Buffer.from(sign(expires)));
}

/** For dashboard pages: send anyone not signed in to the sign-in page. */
export async function requireAdminPage() {
	if (!(await isSignedIn())) redirect('/admin/login');
}

/** For dashboard actions: refuse anyone not signed in. */
export async function requireAdmin() {
	if (!(await isSignedIn())) throw new Error('Please sign in again.');
}

/*
 * Slow down password guessing: after MAX_ATTEMPTS failures from one address,
 * sign-in is paused for LOCK_MINUTES. Kept in memory, so it is per server
 * instance; the long password is the main protection.
 */
const MAX_ATTEMPTS = 5;
const LOCK_MINUTES = 15;
const attempts = new Map<string, { count: number; until: number }>();

async function clientKey() {
	const h = await headers();
	return (h.get('x-forwarded-for')?.split(',')[0] ?? h.get('x-real-ip') ?? 'unknown').trim();
}

export async function isLockedOut() {
	const entry = attempts.get(await clientKey());
	return Boolean(entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now());
}

export async function recordFailure() {
	const key = await clientKey();
	const now = Date.now();
	const entry = attempts.get(key);
	const fresh = !entry || entry.until < now;
	attempts.set(key, { count: fresh ? 1 : entry.count + 1, until: now + LOCK_MINUTES * 60 * 1000 });
	if (attempts.size > 5000) attempts.clear();
}

export async function clearFailures() {
	attempts.delete(await clientKey());
}
