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
		<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6'>
			<div className='flex flex-wrap items-end justify-between gap-4'>
				<div>
					<h1 className='text-4xl'>Articles</h1>
					<p className='mt-1 text-ink-muted'>Write guides for families. Only published articles appear on the website.</p>
				</div>
				<Link
					href='/admin/posts/new'
					className='inline-flex min-h-12 items-center gap-2 rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep'
				>
					<Plus className='h-4 w-4' /> New article
				</Link>
			</div>

			<nav aria-label='Filter articles' className='mt-8'>
				<ul className='flex gap-2'>
					{filters.map((f) => (
						<li key={f.value}>
							<Link
								href={f.value === 'all' ? '/admin' : `/admin?show=${f.value}`}
								aria-current={filter === f.value ? 'page' : undefined}
								className={`inline-flex min-h-10 items-center gap-2 rounded-pill border px-4 text-sm ${
									filter === f.value ? 'border-olive bg-olive text-white' : 'border-line bg-white hover:border-olive'
								}`}
							>
								{f.label}
								<span className={filter === f.value ? 'text-white/80' : 'text-ink-muted'}>{count(f.value)}</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>

			{error && (
				<p role='alert' className='mt-6 rounded-2xl bg-sun/20 p-4 text-sm'>
					Articles couldn&apos;t be loaded just now. Please refresh the page in a moment.
				</p>
			)}

			{visible.length === 0 && !error ? (
				<div className='mt-8 rounded-card border border-dashed border-line bg-white px-6 py-16 text-center'>
					<p className='font-display text-3xl'>{posts.length ? 'Nothing here yet' : 'Write your first article'}</p>
					<p className='mx-auto mt-2 max-w-md text-ink-muted'>
						Plain-language guides help families understand their situation, and help Ivorris appear in Google
						and AI answers. See docs/SEO-PLAN.md for topic ideas.
					</p>
					<Link
						href='/admin/posts/new'
						className='mt-6 inline-flex min-h-12 items-center gap-2 rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep'
					>
						<Plus className='h-4 w-4' /> New article
					</Link>
				</div>
			) : (
				<ul className='mt-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-white'>
					{visible.map((p) => (
						<li key={p.id} className='relative flex items-center gap-4 p-4 hover:bg-cream-soft sm:p-5'>
							<div className='relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-cream sm:block'>
								{p.mainImage && (
									<Image src={p.mainImage.src} alt='' fill sizes='96px' className='object-cover' />
								)}
							</div>
							<div className='min-w-0 flex-1'>
								<p className='flex flex-wrap items-center gap-2 text-xs text-ink-muted'>
									<span
										className={`rounded-pill px-2 py-0.5 font-semibold ${
											p.status === 'published' ? 'bg-olive-tint text-olive-deep' : 'bg-sun/30 text-ink'
										}`}
									>
										{p.status === 'published' ? 'Published' : 'Draft'}
									</span>
									{p.featured && <span className='font-medium'>Featured</span>}
									{categoryBySlug(p.category) && <span>{categoryBySlug(p.category)?.title}</span>}
								</p>
								<h2 className='mt-1 truncate font-sans text-base font-semibold'>
									<Link href={`/admin/posts/${p.id}`} className='after:absolute after:inset-0 hover:text-olive-deep'>
										{p.title}
									</Link>
								</h2>
								<p className='text-xs text-ink-muted'>
									{p.status === 'published' ? `Published ${formatDate(p.publishedAt)} · ` : ''}
									Last saved {formatDate(p.savedAt)}
								</p>
							</div>
							<span aria-hidden='true' className='text-sm font-medium text-olive-deep'>
								Edit
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
