import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor, type SavedIntent } from '@/components/admin/PostEditor';
import { requireAdminPage } from '@/lib/admin/auth';
import { readPosts } from '@/lib/blog/store';

export const metadata: Metadata = { title: 'Edit article' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

const intents: SavedIntent[] = ['save', 'publish', 'unpublish'];

export default async function EditPostPage({ params, searchParams }: Props) {
	await requireAdminPage();
	const { id } = await params;
	const saved = (await searchParams).saved;
	const post = (await readPosts()).find((p) => p.id === id);
	if (!post) notFound();
	return <PostEditor post={post} justSaved={intents.find((i) => i === saved)} />;
}
