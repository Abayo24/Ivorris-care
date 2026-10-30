import type { Metadata } from 'next';

import { PostEditor } from '@/components/admin/PostEditor';
import { requireAdminPage } from '@/lib/admin/auth';
import { readPosts } from '@/lib/blog/store';

export const metadata: Metadata = { title: 'New article' };

export default async function NewPostPage() {
	await requireAdminPage();
	// Start with the author of the most recent article, to save retyping.
	const latest = (await readPosts().catch(() => [])).sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0];
	return <PostEditor post={null} defaultAuthor={latest?.author} />;
}
