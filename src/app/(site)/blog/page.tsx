import type { Metadata } from 'next';
import { HomeCareIllustration, SignpostIllustration } from '@/components/illustrations/Illustrations';
import Link from 'next/link';

import { FeaturedPost, PostGrid } from '@/components/blog/PostCard';
import { CtaSection } from '@/components/sections/CtaSection';
import { PageHero } from '@/components/sections/PageHero';
import { ArrowRight, Search } from '@/components/ui/Icons';
import { Container } from '@/components/ui/primitives';
import { pageMetadata } from '@/lib/seo';
import { sanityFetch } from '@/sanity/fetch';
import { categoriesQuery, featuredPostQuery, postCountQuery, postListQuery } from '@/sanity/queries';
import type { CategoryRef, PostCard } from '@/sanity/types';

const PAGE_SIZE = 9;

type SearchParams = { category?: string; q?: string; page?: string };
type Props = { searchParams: Promise<SearchParams> };

function clean(params: SearchParams) {
	const category = (params.category ?? '').replace(/[^a-z0-9-]/gi, '').slice(0, 64);
	const q = (params.q ?? '').trim().slice(0, 80);
	const page = Math.max(1, Math.min(500, Number.parseInt(params.page ?? '1', 10) || 1));
	return { category, q, page };
}

function blogHref({ category, q, page }: { category?: string; q?: string; page?: number }) {
	const sp = new URLSearchParams();
	if (category) sp.set('category', category);
	if (q) sp.set('q', q);
	if (page && page > 1) sp.set('page', String(page));
	const s = sp.toString();
	return s ? `/blog?${s}` : '/blog';
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
	const { category, q, page } = clean(await searchParams);
	const categories = await sanityFetch<CategoryRef[]>({ query: categoriesQuery, fallback: [] });
	const current = categories.find((c) => c.slug === category);
	const base = current
		? {
				title: `${current.title} — articles`,
				description:
					current.description ||
					`Plain-language articles from Ivorris Care about ${current.title.toLowerCase()}.`,
			}
		: {
				title: 'Resources and articles for families',
				description:
					'Plain-language guides from Ivorris Care to help individuals and families understand care needs, home nursing, hospital discharge and finding the right support.',
			};
	return pageMetadata({
		...base,
		title: page > 1 ? `${base.title} — page ${page}` : base.title,
		path: blogHref({ category: current ? category : undefined, page }),
		// Search result pages shouldn't be indexed.
		noIndex: Boolean(q),
	});
}

export default async function BlogPage({ searchParams }: Props) {
	const { category, q, page } = clean(await searchParams);
	const isFiltered = Boolean(category || q);
	const showFeatured = !isFiltered && page === 1;

	const [categories, featured] = await Promise.all([
		sanityFetch<CategoryRef[]>({ query: categoriesQuery, fallback: [] }),
		showFeatured ? sanityFetch<PostCard | null>({ query: featuredPostQuery, fallback: null }) : null,
	]);

	const exclude = isFiltered ? '' : (featured?._id ?? '');
	const listParams = { category, q: q ? `${q}*` : '', exclude };
	const start = (page - 1) * PAGE_SIZE;
	const [posts, total] = await Promise.all([
		sanityFetch<PostCard[]>({
			query: postListQuery,
			params: { ...listParams, start, end: start + PAGE_SIZE },
			fallback: [],
		}),
		sanityFetch<number>({ query: postCountQuery, params: listParams, fallback: 0 }),
	]);
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const currentCategory = categories.find((c) => c.slug === category);
	const nothingPublished = !featured && posts.length === 0 && !isFiltered;

	return (
		<>
			<PageHero
				crumbs={[{ name: 'Resources', href: '/blog' }]}
				eyebrow='Resources for families'
				title='Understand your situation. Ask better questions.'
				intro={
					<p>
						Plain-language guides about care needs, home nursing, coming home from hospital and finding the
						right support. They&apos;re general information — for advice about your situation,{' '}
						<Link href='/contact' className='text-olive-deep underline underline-offset-4'>
							talk to us
						</Link>
						.
					</p>
				}
			/>

			<Container className='py-14 sm:py-16'>
				{nothingPublished ? (
					<div className='rounded-card border border-dashed border-line bg-cream-soft px-6 py-16 text-center'>
						<HomeCareIllustration className='mx-auto mb-6 h-40 w-auto text-olive' />
						<h2 className='text-3xl'>Articles are on their way</h2>
						<p className='mx-auto mt-3 max-w-lg text-ink-muted'>
							We&apos;re preparing helpful guides for families. In the meantime, you&apos;re welcome to ask us
							your question directly.
						</p>
						<Link
							href='/contact'
							className='mt-6 inline-flex items-center gap-2 font-medium text-olive-deep underline underline-offset-4'
						>
							Talk to Ivorris <ArrowRight className='h-4 w-4' />
						</Link>
					</div>
				) : (
					<>
						{featured && <FeaturedPost post={featured} />}

						{/* Filters */}
						<div
							className={`${featured ? 'mt-14' : ''} flex flex-col gap-5 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between`}
						>
							<nav aria-label='Article categories' className='-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0'>
								<ul className='flex gap-2 whitespace-nowrap'>
									{[{ title: 'All', slug: '' }, ...categories].map((c) => {
										const active = c.slug === (currentCategory ? category : '');
										return (
											<li key={c.slug || 'all'}>
												<Link
													href={blogHref({ category: c.slug, q })}
													aria-current={active ? 'page' : undefined}
													className={`inline-flex min-h-10 items-center rounded-pill border px-4 text-sm transition-colors ${
														active
															? 'border-olive bg-olive text-white'
															: 'border-line bg-white text-ink hover:border-olive'
													}`}
												>
													{c.title}
												</Link>
											</li>
										);
									})}
								</ul>
							</nav>
							<form role='search' action='/blog' className='relative w-full lg:max-w-xs'>
								{currentCategory && <input type='hidden' name='category' value={category} />}
								<label htmlFor='blog-search' className='sr-only'>
									Search articles
								</label>
								<input
									id='blog-search'
									name='q'
									type='search'
									defaultValue={q}
									placeholder='Search articles'
									className='block min-h-11 w-full rounded-pill border border-line bg-white py-2 pr-12 pl-5 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none'
								/>
								<button
									type='submit'
									className='absolute top-1 right-1 grid h-9 w-9 place-items-center rounded-full bg-olive text-white hover:bg-olive-deep'
								>
									<Search className='h-4 w-4' />
									<span className='sr-only'>Search</span>
								</button>
							</form>
						</div>

						<div className='mt-10'>
							<h2 className='sr-only'>
								{currentCategory ? currentCategory.title : 'Latest articles'}
							</h2>
							{(isFiltered || currentCategory?.description) && (
								<p className='mb-8 text-ink-muted' aria-live='polite'>
									{q && (
										<>
											{total} {total === 1 ? 'result' : 'results'} for &ldquo;{q}&rdquo;
											{currentCategory ? ` in ${currentCategory.title}` : ''}.{' '}
											<Link
												href={blogHref({ category: currentCategory ? category : undefined })}
												className='text-olive-deep underline underline-offset-4'
											>
												Clear search
											</Link>
										</>
									)}
									{!q && currentCategory?.description}
								</p>
							)}

							{posts.length > 0 ? (
								<PostGrid posts={posts} />
							) : (
								<div className='rounded-card bg-cream-soft px-6 py-14 text-center'>
									<SignpostIllustration className='mx-auto mb-4 h-32 w-auto text-olive' />
									<p className='font-display text-2xl'>No articles found</p>
									<p className='mt-2 text-ink-muted'>
										Try a different search or{' '}
										<Link href='/blog' className='text-olive-deep underline underline-offset-4'>
											view all articles
										</Link>
										.
									</p>
								</div>
							)}
						</div>

						{totalPages > 1 && (
							<nav aria-label='Pagination' className='mt-14 flex items-center justify-center gap-2'>
								{page > 1 && (
									<Link
										href={blogHref({ category, q, page: page - 1 })}
										rel='prev'
										className='inline-flex min-h-10 items-center rounded-pill border border-line px-4 text-sm hover:border-olive'
									>
										Previous
									</Link>
								)}
								<ul className='flex gap-1'>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
										<li key={n}>
											<Link
												href={blogHref({ category, q, page: n })}
												aria-current={n === page ? 'page' : undefined}
												aria-label={`Page ${n}`}
												className={`grid h-10 w-10 place-items-center rounded-full text-sm ${
													n === page ? 'bg-olive text-white' : 'hover:bg-cream'
												}`}
											>
												{n}
											</Link>
										</li>
									))}
								</ul>
								{page < totalPages && (
									<Link
										href={blogHref({ category, q, page: page + 1 })}
										rel='next'
										className='inline-flex min-h-10 items-center rounded-pill border border-line px-4 text-sm hover:border-olive'
									>
										Next
									</Link>
								)}
							</nav>
						)}
					</>
				)}
			</Container>

			<CtaSection />
		</>
	);
}
