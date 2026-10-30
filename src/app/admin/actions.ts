'use server';

import { randomUUID } from 'node:crypto';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { categoryBySlug } from '@/content/blog';
import {
	checkPassword,
	clearFailures,
	endSession,
	isAdminConfigured,
	isLockedOut,
	recordFailure,
	requireAdmin,
	startSession,
} from '@/lib/admin/auth';
import { BLOG_TAG } from '@/lib/blog/posts';
import { isAllowedImageSrc, plainText, safeHref, sanitizeDoc } from '@/lib/blog/richText';
import { saveImage, updatePosts } from '@/lib/blog/store';
import type { Person, StoredPost } from '@/lib/blog/types';
import { slugify } from '@/lib/admin/slug';

// ── Sign in / out ─────────────────────────────────────────────────────────────

export type LoginState = { error?: string };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
	if (!isAdminConfigured()) return { error: 'The dashboard password has not been set up yet.' };
	if (await isLockedOut()) return { error: 'Too many attempts. Please wait 15 minutes and try again.' };

	const attempt = String(formData.get('password') ?? '');
	if (!checkPassword(attempt)) {
		await recordFailure();
		await new Promise((r) => setTimeout(r, 600));
		return { error: 'That password is not right. Please try again.' };
	}

	await clearFailures();
	await startSession();
	redirect('/admin');
}

export async function logout() {
	await endSession();
	redirect('/admin/login');
}

// ── Articles ──────────────────────────────────────────────────────────────────

export type PostInput = Omit<StoredPost, 'id' | 'status' | 'oldSlugs' | 'createdAt' | 'savedAt'> & {
	id?: string;
};

export type SaveResult =
	| { ok: true; post: StoredPost }
	| { ok: false; error: string; fields?: Partial<Record<string, string>> };

const str = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function cleanPerson(value: unknown): Person | undefined {
	const p = (value ?? {}) as Partial<Person>;
	const name = str(p.name, 120);
	if (!name) return undefined;
	const role = str(p.role, 120);
	const credentials = str(p.credentials, 120);
	return { name, ...(role ? { role } : {}), ...(credentials ? { credentials } : {}) };
}

/** A YYYY-MM-DD date (or ISO date) as an ISO timestamp at 9am Nairobi time. */
function cleanDate(value: unknown) {
	const v = str(value, 40);
	const day = v.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
	if (!day) return '';
	const d = new Date(`${day}T09:00:00+03:00`);
	return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

function clean(input: PostInput) {
	const image = input.mainImage;
	return {
		title: str(input.title, 140),
		slug: slugify(str(input.slug, 120) || str(input.title, 140)),
		excerpt: str(input.excerpt, 300),
		body: sanitizeDoc(input.body),
		mainImage:
			image && isAllowedImageSrc(image.src) ? { src: image.src, alt: str(image.alt, 300) } : undefined,
		category: categoryBySlug(str(input.category, 80)) ? str(input.category, 80) : '',
		tags: [...new Set((Array.isArray(input.tags) ? input.tags : []).map((t) => str(t, 40)).filter(Boolean))].slice(
			0,
			12,
		),
		author: cleanPerson(input.author),
		reviewedBy: cleanPerson(input.reviewedBy),
		reviewedAt: cleanDate(input.reviewedAt) || undefined,
		publishedAt: cleanDate(input.publishedAt),
		updatedAt: cleanDate(input.updatedAt) || undefined,
		featured: input.featured === true,
		faqs: (Array.isArray(input.faqs) ? input.faqs : [])
			.map((f) => ({ question: str(f?.question, 300), answer: str(f?.answer, 3000) }))
			.filter((f) => f.question && f.answer)
			.slice(0, 20),
		sources: (Array.isArray(input.sources) ? input.sources : [])
			.map((s) => {
				const url = safeHref(s?.url);
				return { title: str(s?.title, 300), ...(url && /^https?:/i.test(url) ? { url } : {}) };
			})
			.filter((s) => s.title)
			.slice(0, 30),
		seo: {
			title: str(input.seo?.title, 120) || undefined,
			description: str(input.seo?.description, 320) || undefined,
			noIndex: input.seo?.noIndex === true || undefined,
		},
	};
}

/** What must be filled in before an article can go live. */
function publishProblems(p: ReturnType<typeof clean>) {
	const fields: Record<string, string> = {};
	if (p.title.length < 5) fields.title = 'Add a title (at least 5 characters).';
	if (!p.slug) fields.slug = 'Add a web address.';
	if (p.excerpt.length < 20) fields.excerpt = 'Add a short summary (at least 20 characters).';
	if (!p.category) fields.category = 'Choose a category.';
	if (plainText(p.body).trim().length < 50) fields.body = 'Write the article before publishing.';
	if (p.mainImage && !p.mainImage.alt) fields.mainImage = 'Describe the featured image for people who cannot see it.';
	return fields;
}

export async function savePost(input: PostInput, intent: 'save' | 'publish' | 'unpublish'): Promise<SaveResult> {
	await requireAdmin();
	const data = clean(input);

	if (!data.title) return { ok: false, error: 'Add a title first.', fields: { title: 'Add a title.' } };
	if (!data.slug) return { ok: false, error: 'Add a web address.', fields: { slug: 'Add a web address.' } };

	try {
		const result = await updatePosts((posts): SaveResult => {
			const existing = input.id ? posts.find((p) => p.id === input.id) : undefined;
			if (input.id && !existing) return { ok: false, error: 'This article no longer exists.' };

			if (posts.some((p) => p.id !== existing?.id && p.slug === data.slug)) {
				const message = 'Another article already uses this web address.';
				return { ok: false, error: message, fields: { slug: message } };
			}

			const status =
				intent === 'publish' ? 'published' : intent === 'unpublish' ? 'draft' : (existing?.status ?? 'draft');
			if (status === 'published') {
				const fields = publishProblems(data);
				if (Object.keys(fields).length) {
					return { ok: false, error: 'A few things are needed before this can be published.', fields };
				}
			}

			const now = new Date().toISOString();
			// Keep a published article's old address working after its slug changes.
			const oldSlugs = new Set(existing?.oldSlugs ?? []);
			if (existing && existing.status === 'published' && existing.slug !== data.slug) oldSlugs.add(existing.slug);
			oldSlugs.delete(data.slug);
			for (const p of posts) p.oldSlugs = p.oldSlugs.filter((s) => s !== data.slug);

			const post: StoredPost = {
				...data,
				id: existing?.id ?? randomUUID(),
				status,
				oldSlugs: [...oldSlugs],
				publishedAt: data.publishedAt || (status === 'published' ? now : existing?.publishedAt || now),
				createdAt: existing?.createdAt ?? now,
				savedAt: now,
			};
			if (existing) posts[posts.indexOf(existing)] = post;
			else posts.push(post);
			return { ok: true, post };
		});

		if (result.ok) updateTag(BLOG_TAG);
		return result;
	} catch (error) {
		console.error('[admin] save failed', error instanceof Error ? error.message : error);
		return { ok: false, error: 'The article could not be saved. Please try again.' };
	}
}

export async function deletePost(id: string) {
	await requireAdmin();
	await updatePosts((posts) => {
		const i = posts.findIndex((p) => p.id === id);
		if (i >= 0) posts.splice(i, 1);
	});
	updateTag(BLOG_TAG);
	redirect('/admin');
}

// ── Images ────────────────────────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function imageType(bytes: Buffer) {
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { type: 'image/jpeg', ext: 'jpg' };
	if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
		return { type: 'image/png', ext: 'png' };
	if (bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP')
		return { type: 'image/webp', ext: 'webp' };
	return null;
}

export async function uploadImage(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
	await requireAdmin();
	const file = formData.get('file');
	if (!(file instanceof File) || file.size === 0) return { ok: false, error: 'Choose an image to upload.' };
	if (file.size > MAX_IMAGE_BYTES) return { ok: false, error: 'That image is too large (4 MB maximum).' };

	const bytes = Buffer.from(await file.arrayBuffer());
	// Check the file itself, not just its name, so only real photos are stored.
	const kind = imageType(bytes);
	if (!kind) return { ok: false, error: 'Please upload a JPG, PNG or WebP image.' };

	try {
		return { ok: true, url: await saveImage(bytes, kind.type, kind.ext) };
	} catch (error) {
		console.error('[admin] upload failed', error instanceof Error ? error.message : error);
		return { ok: false, error: 'The image could not be uploaded. Please try again.' };
	}
}
