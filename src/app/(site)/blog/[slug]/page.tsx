import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PortableBody } from '@/components/blog/PortableBody';
import { PostGrid } from '@/components/blog/PostCard';
import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { CtaSection } from '@/components/sections/CtaSection';
import { FaqList } from '@/components/sections/FaqList';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowUpRight, Chat } from '@/components/ui/Icons';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { services } from '@/content/services';
import { primaryCta, site } from '@/content/site';
import { formatDate } from '@/lib/format';
import { absoluteUrl, faqJsonLd, organizationId, pageMetadata } from '@/lib/seo';
import { sanityFetch } from '@/sanity/fetch';
import { urlForImage } from '@/sanity/image';
import { postBySlugQuery, postSlugsQuery } from '@/sanity/queries';
import type { AuthorRef, Post } from '@/sanity/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	const slugs = await sanityFetch<{ slug: string }[]>({ query: postSlugsQuery, fallback: [] });
	return slugs.map(({ slug }) => ({ slug }));
}

async function getPost(slug: string) {
	return sanityFetch<Post | null>({ query: postBySlugQuery, params: { slug }, fallback: null });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const post = await getPost((await params).slug);
	if (!post) return { title: 'Article not found', robots: { index: false } };
	const og = urlForImage(post.seo?.ogImage?.asset ? post.seo.ogImage : post.mainImage, 1200, 630);
	return pageMetadata({
		title: post.seo?.title || post.title,
		description: post.seo?.description || post.excerpt,
		path: `/blog/${post.slug}`,
		type: 'article',
		publishedTime: post.publishedAt,
		modifiedTime: post.updatedAt || post._updatedAt,
		image: og ? { url: og, width: 1200, height: 630, alt: post.mainImage?.alt } : undefined,
		noIndex: post.seo?.noIndex || post.isPlaceholder,
	});
}

function personJsonLd(person?: AuthorRef) {
	if (!person) return undefined;
	return {
		'@type': 'Person',
		name: person.name,
		...(person.role ? { jobTitle: person.role } : {}),
	};
}

function PersonLine({ label, person }: { label: string; person: AuthorRef }) {
	const src = urlForImage(person.image, 96, 96);
	return (
		<div className='flex items-center gap-3'>
			{src ? (
				<Image src={src} alt='' width={44} height={44} className='h-11 w-11 rounded-full object-cover' />
			) : (
				<span className='grid h-11 w-11 place-items-center rounded-full bg-olive-tint font-display text-lg text-olive-deep'>
					{person.name.charAt(0)}
				</span>
			)}
			<div className='text-sm'>
				<p className='text-ink-muted'>{label}</p>
				<p className='font-medium text-ink'>
					{person.name}
					{person.credentials ? `, ${person.credentials}` : ''}
				</p>
				{person.role && <p className='text-ink-muted'>{person.role}</p>}
			</div>
		</div>
	);
}

export default async function ArticlePage({ params }: Props) {
	const post = await getPost((await params).slug);
	if (!post) notFound();

	const path = `/blog/${post.slug}`;
	const hero = urlForImage(post.mainImage, 1600, 900);
	const relatedService = services.find((s) => s.relatedCategory === post.category?.slug);
	const related = (post.related ?? []).filter((r, i, all) => all.findIndex((x) => x._id === r._id) === i).slice(0, 3);
	const modified = post.updatedAt || post._updatedAt;
	const shareText = `${post.title} — ${absoluteUrl(path)}`;

	const crumbs = [
		{ name: 'Resources', href: '/blog' },
		...(post.category ? [{ name: post.category.title, href: `/blog?category=${post.category.slug}` }] : []),
		{ name: post.title, href: path },
	];

	return (
		<>
			<article>
				<header className='bg-cream-soft'>
					<Container className='pt-28 pb-12 sm:pt-32'>
						<Breadcrumbs items={crumbs} />
						<div className='mx-auto mt-10 max-w-3xl text-center'>
							{post.category && (
								<Link
									href={`/blog?category=${post.category.slug}`}
									className='inline-flex rounded-pill border border-line bg-white px-3 py-1 text-xs font-medium text-ink-muted hover:border-olive'
								>
									{post.category.title}
								</Link>
							)}
							<h1 className='mt-5 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.4rem]'>{post.title}</h1>
							<p className='mt-5 text-lg text-ink-muted'>{post.excerpt}</p>
							<p className='mt-6 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm text-ink-muted'>
								<span>
									Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
								</span>
								{post.updatedAt && (
									<>
										<span aria-hidden='true'>•</span>
										<span>
											Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
										</span>
									</>
								)}
								{post.readingMinutes ? (
									<>
										<span aria-hidden='true'>•</span>
										<span>{Math.max(1, post.readingMinutes)} min read</span>
									</>
								) : null}
							</p>
						</div>
					</Container>
				</header>

				{hero && (
					<Container className='-mt-2'>
						<div className='relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-[1.75rem] bg-cream'>
							<Image
								src={hero}
								alt={post.mainImage?.alt ?? ''}
								fill
								preload
								fetchPriority='high'
								loading='eager'
								sizes='(min-width: 1024px) 1024px, 100vw'
								placeholder={post.mainImage?.lqip ? 'blur' : 'empty'}
								blurDataURL={post.mainImage?.lqip}
								className='object-cover'
							/>
						</div>
					</Container>
				)}

				<Container className='py-12 sm:py-16'>
					<div className='mx-auto max-w-[720px]'>
						{post.isPlaceholder && (
							<p role='note' className='mb-10 rounded-2xl border border-sun bg-sun/15 p-4 text-sm text-ink'>
								<strong>Sample article.</strong> This is demonstration content awaiting professional review. It
								is not yet verified and should not be relied on.
							</p>
						)}

						{(post.author || post.reviewedBy) && (
							<div className='mb-10 flex flex-col gap-5 border-b border-line pb-8 sm:flex-row sm:gap-10'>
								{post.author && <PersonLine label='Written by' person={post.author} />}
								{post.reviewedBy && (
									<PersonLine
										label={`Reviewed${post.reviewedAt ? ` ${formatDate(post.reviewedAt)}` : ''} by`}
										person={post.reviewedBy}
									/>
								)}
							</div>
						)}

						<PortableBody value={post.body} />

						{post.faqs && post.faqs.length > 0 && (
							<section aria-labelledby='article-faq' className='mt-14'>
								<h2 id='article-faq' className='mb-6 text-3xl'>
									Frequently asked questions
								</h2>
								<FaqList faqs={post.faqs} />
							</section>
						)}

						{post.sources && post.sources.length > 0 && (
							<section aria-labelledby='sources' className='mt-14 border-t border-line pt-8'>
								<h2 id='sources' className='font-sans text-base font-semibold'>
									Sources
								</h2>
								<ol className='mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted'>
									{post.sources.map((s) => (
										<li key={s._key}>
											{s.url ? (
												<a
													href={s.url}
													target='_blank'
													rel='noopener noreferrer'
													className='underline underline-offset-4 hover:text-olive-deep'
												>
													{s.title}
													<span className='sr-only'> (opens in a new tab)</span>
												</a>
											) : (
												s.title
											)}
										</li>
									))}
								</ol>
							</section>
						)}

						<p className='mt-10 rounded-2xl bg-cream-soft p-5 text-sm text-ink-muted'>
							This article is general information to help you understand your options. It isn&apos;t medical
							advice for your situation. If you&apos;re worried about someone&apos;s health, speak to a healthcare
							professional — or{' '}
							<Link href='/contact' className='text-olive-deep underline underline-offset-4'>
								talk to Ivorris
							</Link>{' '}
							about what support may be appropriate.
						</p>

						<div className='mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8'>
							{post.tags && post.tags.length > 0 ? (
								<ul className='flex flex-wrap gap-2' aria-label='Tags'>
									{post.tags.map((t) => (
										<li key={t} className='rounded-pill bg-cream px-3 py-1 text-xs'>
											{t}
										</li>
									))}
								</ul>
							) : (
								<span />
							)}
							<a
								href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-2 text-sm font-medium text-olive-deep'
							>
								<Chat className='h-4 w-4' /> Share on WhatsApp
								<span className='sr-only'>(opens in a new tab)</span>
							</a>
						</div>

						{relatedService && (
							<aside className='mt-12 rounded-card bg-olive-deep p-6 text-cream sm:p-8'>
								<p className='text-sm font-semibold text-sun'>Related nurse-led service</p>
								<p className='mt-2 font-display text-2xl text-white'>{relatedService.name}</p>
								<p className='mt-2 text-cream/90'>{relatedService.forSituation}</p>
								<div className='mt-5 flex flex-wrap gap-3'>
									<ButtonLink href={`/services/${relatedService.slug}`} variant='light'>
										Learn about {relatedService.name}
									</ButtonLink>
									<Link
										href={primaryCta.href}
										className='inline-flex min-h-12 items-center gap-1.5 px-2 font-medium text-white underline underline-offset-4'
									>
										{primaryCta.label} <ArrowUpRight className='h-4 w-4' />
									</Link>
								</div>
							</aside>
						)}
					</div>
				</Container>
			</article>

			{related.length > 0 && (
				<section aria-labelledby='related-heading' className='bg-cream-soft py-16 sm:py-20'>
					<Container>
						<h2 id='related-heading' className='text-3xl sm:text-4xl'>
							Related articles
						</h2>
						<div className='mt-10'>
							<PostGrid posts={related} />
						</div>
					</Container>
				</section>
			)}

			<CtaSection />

			<JsonLd
				data={[
					{
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.title,
						description: post.seo?.description || post.excerpt,
						url: absoluteUrl(path),
						mainEntityOfPage: absoluteUrl(path),
						datePublished: post.publishedAt,
						dateModified: modified,
						...(hero ? { image: [urlForImage(post.mainImage, 1200, 630)] } : {}),
						...(post.author
							? { author: personJsonLd(post.author) }
							: { author: { '@type': 'Organization', name: site.name, url: site.url } }),
						publisher: { '@id': organizationId },
						...(post.category ? { articleSection: post.category.title } : {}),
						...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
					},
					...(post.faqs?.length ? [faqJsonLd(post.faqs)] : []),
				]}
			/>
		</>
	);
}
