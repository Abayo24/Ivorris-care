import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { del, list, put } from '@vercel/blob';

import type { StoredPost } from './types';

/*
 * Where articles and their images live.
 *
 * - On the live site: Vercel Blob (connect a Blob store to the project, which
 *   sets BLOB_READ_WRITE_TOKEN). All articles are kept in one JSON file. Every
 *   save writes a new copy under an unguessable name and the newest copy wins,
 *   so drafts can't be read by guessing a URL and the last few saves are kept
 *   as backups.
 * - In local development without a token: files in .data/ and public/uploads/.
 */

const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim() || '';
const isBlob = Boolean(blobToken);
const isProd = process.env.NODE_ENV === 'production';

/** True when articles can be saved: Blob in production, the local disk in development. */
export const isStorageConfigured = isBlob || !isProd;

const DATA_PREFIX = 'blog/data/posts-';
const KEEP_BACKUPS = 10;

const localDir = path.join(process.cwd(), '.data', 'blog');
const localFile = path.join(localDir, 'posts.json');
const localUploads = path.join(process.cwd(), 'public', 'uploads');

async function latestBlob() {
	const blobs = [];
	let cursor: string | undefined;
	do {
		const page = await list({ prefix: DATA_PREFIX, cursor, token: blobToken });
		blobs.push(...page.blobs);
		cursor = page.hasMore ? page.cursor : undefined;
	} while (cursor);
	blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
	return blobs;
}

/** Every article, drafts included. */
export async function readPosts(): Promise<StoredPost[]> {
	if (isBlob) {
		const [latest] = await latestBlob();
		if (!latest) return [];
		// Each copy has a unique name and is never changed, so the CDN copy is always current.
		const res = await fetch(latest.url, { cache: 'no-store' });
		if (!res.ok) throw new Error(`Could not read articles (${res.status}).`);
		return (await res.json()) as StoredPost[];
	}
	if (isProd) return [];
	try {
		return JSON.parse(await readFile(localFile, 'utf8')) as StoredPost[];
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
		throw error;
	}
}

async function writePosts(posts: StoredPost[]) {
	const json = JSON.stringify(posts);
	if (isBlob) {
		await put(`${DATA_PREFIX}${Date.now()}.json`, json, {
			access: 'public',
			addRandomSuffix: true,
			contentType: 'application/json',
			token: blobToken,
		});
		const old = (await latestBlob()).slice(KEEP_BACKUPS);
		if (old.length) await del(old.map((b) => b.url), { token: blobToken });
		return;
	}
	if (isProd) throw new Error('Article storage is not connected.');
	await mkdir(localDir, { recursive: true });
	const tmp = `${localFile}.${randomUUID()}.tmp`;
	await writeFile(tmp, json, 'utf8');
	await rename(tmp, localFile);
}

// One owner edits at a time; queueing writes in this process stops two quick
// saves from overwriting each other.
let queue: Promise<unknown> = Promise.resolve();

/** Read every article, change the list, save it. Returns whatever `change` returns. */
export function updatePosts<T>(change: (posts: StoredPost[]) => T): Promise<T> {
	const run = queue.then(async () => {
		const posts = await readPosts();
		const before = JSON.stringify(posts);
		const result = change(posts);
		if (JSON.stringify(posts) !== before) await writePosts(posts);
		return result;
	});
	queue = run.catch(() => undefined);
	return run;
}

/** Save an uploaded image and return its public URL. */
export async function saveImage(data: Buffer, contentType: string, ext: string) {
	const name = `${randomUUID()}.${ext}`;
	if (isBlob) {
		const blob = await put(`blog/images/${name}`, data, {
			access: 'public',
			addRandomSuffix: true,
			contentType,
			cacheControlMaxAge: 31536000,
			token: blobToken,
		});
		return blob.url;
	}
	if (isProd) throw new Error('Image storage is not connected.');
	await mkdir(localUploads, { recursive: true });
	await writeFile(path.join(localUploads, name), data);
	return `/uploads/${name}`;
}
