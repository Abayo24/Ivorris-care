import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArticleView } from '@/components/blog/ArticleView';
import { requireAdminPage } from '@/lib/admin/auth';
import { toPost } from '@/lib/blog/posts';
import { readPosts } from '@/lib/blog/store';

export const metadata: Metadata = { title: 'Preview' };

type Props = { params: Promise<{ id: string }> };

/** The article as it will look on the website, drafts included. Only visible when signed in. */
export default async function PreviewPage({ params }: Props) {
	await requireAdminPage();
	const { id } = await params;
	const all = await readPosts();
	const post = all.find((p) => p.id === id);
	if (!post) notFound();

	return (
		<div className='bg-white'>
			<div role='status' className='sticky top-16 z-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-sun px-4 py-2 text-sm text-ink'>
				<span>
					Preview of the last saved version{post.status === 'draft' ? ' — this draft is not on the website yet' : ''}.
				</span>
				<Link href={`/admin/posts/${post.id}`} className='font-medium underline underline-offset-4'>
					Back to editing
				</Link>
			</div>
			<div className='[&_article>header>div]:pt-10'>
				<ArticleView post={toPost(post, all)} />
			</div>
		</div>
	);
}
