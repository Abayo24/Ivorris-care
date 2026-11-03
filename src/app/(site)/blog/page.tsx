import type { Metadata } from 'next';
import { HomeCareIllustration, SignpostIllustration } from '@/components/illustrations/Illustrations';
import Link from 'next/link';

import { FeaturedPost, PostList } from '@/components/blog/PostCard';
import { LogoMark } from '@/components/brand/Logo';
import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { CtaSection } from '@/components/sections/CtaSection';
import { ArrowRight, Search } from '@/components/ui/Icons';
import { getCategoriesInUse, getFeaturedPost, listPosts } from '@/lib/blog/posts';
import { pageMetadata } from '@/lib/seo';

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
	const categories = await getCategoriesInUse();
	const current = categories.find((c) => c.slug === category);
	const base = current
		? {
				title: `${current.title} — articles`,
				description:
					current.description ||
					`Plain-language articles from Ivorris Care about ${current.title.toLowerCase()}.`,
			}
		: {
				title: 'Home Care Guides for Families in Kenya',
				description:
					'Plain-language guides on home-based care in Kenya: caring for elderly parents at home, home nursing, care after hospital discharge and finding the right support.',
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
		getCategoriesInUse(),
		showFeatured ? getFeaturedPost() : null,
	]);

	const start = (page - 1) * PAGE_SIZE;
	const { posts, total } = await listPosts({
		category,
		q,
		exclude: isFiltered ? '' : (featured?.id ?? ''),
		start,
		end: start + PAGE_SIZE,
	});
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const currentCategory = categories.find((c) => c.slug === category);
	const nothingPublished = !featured && posts.length === 0 && !isFiltered;

	return (
		<>
			<div className='mx-auto w-full max-w-[1000px] px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20'>
				<Breadcrumbs items={[{ name: 'Resources', href: '/blog' }]} />

				{/* Masthead */}
				<header className='mt-8 border-b border-line pb-8 text-center'>
					<span className='mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-olive text-cream'>
						<LogoMark className='h-9 w-auto' />
					</span>
					<h1 className='mx-auto mt-5 max-w-2xl text-4xl sm:text-5xl'>Understand your situation. Ask better questions.</h1>
					<p className='mx-auto mt-3 max-w-xl text-lg text-ink-muted'>
						Plain-language guides for families from Ivorris Care. They&apos;re general information — for advice about
						your situation,{' '}
						<Link href='/contact' className='text-olive-deep underline underline-offset-4'>
							talk to us
						</Link>
						.
					</p>
				</header>

				{nothingPublished ? (
					<div className='py-16 text-center'>
						<HomeCareIllustration className='mx-auto mb-6 h-40 w-auto text-olive' />
						<h2 className='text-3xl'>Articles are on their way</h2>
						<p className='mx-auto mt-3 max-w-lg text-ink-muted'>
							We&apos;re preparing helpful guides for families. In the meantime, you&apos;re welcome to ask us your
							question directly.
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
						{/* Topics and search */}
						<div className='flex flex-col gap-3 border-b border-line lg:flex-row lg:items-center lg:justify-between lg:gap-8'>
							<nav aria-label='Article categories' className='-mx-4 overflow-x-auto overflow-y-hidden px-4 sm:mx-0 sm:px-0'>
								<ul className='flex gap-6 whitespace-nowrap'>
									{[{ title: 'All', slug: '' }, ...categories].map((c) => {
										const active = c.slug === (currentCategory ? category : '');
										return (
											<li key={c.slug || 'all'}>
												<Link
													href={blogHref({ category: c.slug, q })}
													aria-current={active ? 'page' : undefined}
													className={`inline-flex min-h-12 items-center border-b-2 text-sm ${
														active
															? 'border-ink font-medium text-ink'
															: 'border-transparent text-ink-muted hover:text-ink'
													}`}
												>
													{c.title}
												</Link>
											</li>
										);
									})}
								</ul>
							</nav>
							<form role='search' action='/blog' className='relative mb-3 w-full shrink-0 lg:mb-0 lg:w-56'>
								{currentCategory && <input type='hidden' name='category' value={category} />}
								<label htmlFor='blog-search' className='sr-only'>
									Search articles
								</label>
								<input
									id='blog-search'
									name='q'
									type='search'
									defaultValue={q}
									placeholder='Search'
									className='block min-h-10 w-full rounded-lg bg-cream-soft py-1.5 pr-10 pl-3 text-base focus:ring-2 focus:ring-olive/30 focus:outline-none lg:text-sm'
								/>
								<button
									type='submit'
									className='absolute top-0 right-0 grid h-10 w-10 place-items-center text-ink-muted hover:text-ink'
								>
									<Search className='h-4 w-4' />
									<span className='sr-only'>Search</span>
								</button>
							</form>
						</div>

						{featured && (
							<div className='border-b border-line py-10'>
								<FeaturedPost post={featured} />
							</div>
						)}

						<div className='mx-auto max-w-[760px]'>
							<h2 className='sr-only'>{currentCategory ? currentCategory.title : 'Latest articles'}</h2>
							{(q || currentCategory?.description) && (
								<p className='pt-8 text-ink-muted' aria-live='polite'>
									{q ? (
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
									) : (
										currentCategory?.description
									)}
								</p>
							)}

							{posts.length > 0 ? (
								<PostList posts={posts} />
							) : (
								!featured && (
									<div className='py-14 text-center'>
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
								)
							)}

							{totalPages > 1 && (
								<nav aria-label='Pagination' className='mt-8 flex items-center justify-center gap-2'>
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
						</div>
					</>
				)}
			</div>

			<CtaSection />
		</>
	);
}
