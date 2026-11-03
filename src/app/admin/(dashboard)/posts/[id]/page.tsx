import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PostEditor } from '@/components/admin/PostEditor';
import { requireAdminPage } from '@/lib/admin/auth';
import { readPosts } from '@/lib/blog/store';

export const metadata: Metadata = { title: 'Edit article' };

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
	await requireAdminPage();
	const { id } = await params;
	const post = (await readPosts()).find((p) => p.id === id);
	if (!post) notFound();
	return <PostEditor post={post} />;
}
