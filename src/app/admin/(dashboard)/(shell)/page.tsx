import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Plus } from '@/components/ui/Icons';
import { categoryBySlug } from '@/content/blog';
import { requireAdminPage } from '@/lib/admin/auth';
import { readPosts } from '@/lib/blog/store';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = { title: 'Articles' };

type Props = { searchParams: Promise<{ show?: string }> };

const filters = [
	{ value: 'all', label: 'All' },
	{ value: 'published', label: 'Published' },
	{ value: 'draft', label: 'Drafts' },
] as const;

export default async function ArticlesPage({ searchParams }: Props) {
	await requireAdminPage();
	const show = (await searchParams).show;
	const filter = show === 'published' || show === 'draft' ? show : 'all';

	const loaded = await readPosts().then(
		(posts) => ({ posts, error: false }),
		() => ({ posts: [], error: true }),
	);
	const { posts, error } = loaded;
	posts.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
	const visible = filter === 'all' ? posts : posts.filter((p) => p.status === filter);
	const count = (status: string) => (status === 'all' ? posts.length : posts.filter((p) => p.status === status).length);

	return (
		<div className='mx-auto max-w-5xl px-4 py-10 sm:px-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<h1 className='text-4xl'>Articles</h1>
				<Link
					href='/admin/posts/new'
					className='inline-flex min-h-11 items-center gap-2 rounded-pill bg-olive px-5 font-medium text-white hover:bg-olive-deep'
				>
					<Plus className='h-4 w-4' /> New article
				</Link>
			</div>

			<nav aria-label='Filter articles' className='mt-6 border-b border-line'>
				<ul className='flex gap-6'>
					{filters.map((f) => (
						<li key={f.value}>
							<Link
								href={f.value === 'all' ? '/admin' : `/admin?show=${f.value}`}
								aria-current={filter === f.value ? 'page' : undefined}
								className={`-mb-px inline-flex min-h-11 items-center gap-1.5 border-b-2 text-sm ${
									filter === f.value ? 'border-ink font-medium text-ink' : 'border-transparent text-ink-muted hover:text-ink'
								}`}
							>
								{f.label}
								<span className='text-ink-muted'>{count(f.value)}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{error && (
				<p role='alert' className='mt-6 rounded-lg bg-sun/20 p-4 text-sm'>
					Articles couldn&apos;t be loaded just now. Please refresh the page in a moment.
				</p>
			)}

			{visible.length === 0 && !error ? (
				<div className='py-20 text-center'>
					<p className='font-display text-3xl'>{posts.length ? 'Nothing here yet' : 'Write your first article'}</p>
					<p className='mx-auto mt-2 max-w-md text-ink-muted'>
						Plain-language guides help families understand their situation, and help Ivorris appear in Google and AI
						answers. See docs/SEO-PLAN.md for topic ideas.
					</p>
					<Link
						href='/admin/posts/new'
						className='mt-6 inline-flex min-h-11 items-center gap-2 rounded-pill bg-olive px-5 font-medium text-white hover:bg-olive-deep'
					>
						<Plus className='h-4 w-4' /> New article
					</Link>
				</div>
			) : (
				<ul className='divide-y divide-line'>
					{visible.map((p) => (
						<li key={p.id} className='group relative flex items-center gap-5 py-5'>
							<div className='min-w-0 flex-1'>
								<h2 className='truncate text-2xl'>
									<Link href={`/admin/posts/${p.id}`} className='after:absolute after:inset-0 group-hover:text-olive-deep'>
										{p.title}
									</Link>
								</h2>
								{p.excerpt && <p className='mt-0.5 truncate text-sm text-ink-muted'>{p.excerpt}</p>}
								<p className='mt-1.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted'>
									<span
										className={`rounded-pill px-2 py-0.5 font-semibold ${
											p.status === 'published' ? 'bg-olive-tint text-olive-deep' : 'bg-sun/30 text-ink'
										}`}
									>
										{p.status === 'published' ? 'Published' : 'Draft'}
									</span>
									{p.status === 'published' && <span>{formatDate(p.publishedAt)}</span>}
									{p.status === 'draft' && <span>Last saved {formatDate(p.savedAt)}</span>}
									{categoryBySlug(p.category) && <span>· {categoryBySlug(p.category)?.title}</span>}
									{p.featured && <span>· Featured</span>}
								</p>
							</div>
							{p.mainImage && (
								<div className='relative hidden aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-cream sm:block'>
									<Image src={p.mainImage.src} alt='' fill sizes='96px' className='object-cover' />
								</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
