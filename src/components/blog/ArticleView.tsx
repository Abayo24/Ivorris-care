import Image from 'next/image';
import Link from 'next/link';

import { PostList } from '@/components/blog/PostCard';
import { RichText } from '@/components/blog/RichText';
import { ShareBar } from '@/components/blog/ShareBar';
import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { FaqList } from '@/components/sections/FaqList';
import { ButtonLink } from '@/components/ui/primitives';
import { services } from '@/content/services';
import { primaryCta } from '@/content/site';
import type { Person, Post } from '@/lib/blog/types';
import { formatDate } from '@/lib/format';
import { absoluteUrl } from '@/lib/seo';

function personName(person: Person) {
	return person.credentials ? `${person.name}, ${person.credentials}` : person.name;
}

function Avatar({ person }: { person: Person }) {
	return (
		<span
			aria-hidden='true'
			className='grid h-11 w-11 shrink-0 place-items-center rounded-full bg-olive-tint font-display text-lg text-olive-deep'
		>
			{person.name.charAt(0)}
		</span>
	);
}

/** A full article in a single reading column. Used by the public page and the dashboard preview. */
export function ArticleView({ post }: { post: Post }) {
	const path = `/blog/${post.slug}`;
	const url = absoluteUrl(path);
	const relatedService = services.find((s) => s.relatedCategory === post.category?.slug);

	const crumbs = [
		{ name: 'Resources', href: '/blog' },
		...(post.category ? [{ name: post.category.title, href: `/blog?category=${post.category.slug}` }] : []),
		{ name: post.title, href: path },
	];

	return (
		<>
			<article className='mx-auto w-full max-w-[728px] px-4 pt-24 pb-16 sm:px-6 sm:pt-28'>
				<Breadcrumbs items={crumbs} />

				<header className='mt-8'>
					<h1 className='text-[2.6rem] leading-[1.08] sm:text-[3.25rem]'>{post.title}</h1>
					<p className='mt-3 text-xl leading-snug text-ink-muted sm:text-[1.4rem]'>{post.excerpt}</p>

					<div className='mt-6 flex items-center gap-3'>
						{post.author && <Avatar person={post.author} />}
						<div className='text-sm'>
							{post.author && <p className='font-medium text-ink'>{personName(post.author)}</p>}
							<p className='text-ink-muted'>
								<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} min read
								{post.updatedAt && (
									<>
										{' '}
										· Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
									</>
								)}
							</p>
							{post.reviewedBy && (
								<p className='text-ink-muted'>
									Reviewed{post.reviewedAt ? ` ${formatDate(post.reviewedAt)}` : ''} by {personName(post.reviewedBy)}
									{post.reviewedBy.role ? ` (${post.reviewedBy.role})` : ''}
								</p>
							)}
						</div>
					</div>

					<div className='mt-5'>
						<ShareBar title={post.title} url={url} />
					</div>
				</header>

				{post.mainImage && (
					<div className='relative mt-8 aspect-[16/9] overflow-hidden rounded-lg bg-cream'>
						<Image
							src={post.mainImage.src}
							alt={post.mainImage.alt}
							fill
							preload
							fetchPriority='high'
							loading='eager'
							sizes='(min-width: 768px) 680px, 100vw'
							className='object-cover'
						/>
					</div>
				)}

				<div className='mt-8'>
					<RichText value={post.body} />
				</div>

				{post.faqs.length > 0 && (
					<section aria-labelledby='article-faq' className='mt-14'>
						<h2 id='article-faq' className='mb-6 text-3xl'>
							Frequently asked questions
						</h2>
						<FaqList faqs={post.faqs} />
					</section>
				)}

				{/* Closing call to action, where a newsletter would ask readers to subscribe. */}
				<aside className='mt-14 rounded-lg bg-cream-soft px-6 py-9 text-center'>
					<p className='font-display text-3xl'>{relatedService ? relatedService.name : primaryCta.heading}</p>
					<p className='mx-auto mt-2 max-w-md text-ink-muted'>{relatedService ? relatedService.forSituation : primaryCta.body}</p>
					<div className='mt-5 flex flex-wrap justify-center gap-3'>
						<ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
						{relatedService && (
							<ButtonLink href={`/services/${relatedService.slug}`} variant='secondary' icon={false}>
								About this service
							</ButtonLink>
						)}
					</div>
				</aside>

				<div className='mt-10'>
					<ShareBar title={post.title} url={url} />
				</div>

				{post.tags.length > 0 && (
					<ul className='mt-5 flex flex-wrap gap-2' aria-label='Tags'>
						{post.tags.map((t) => (
							<li key={t} className='rounded-pill bg-cream-soft px-3 py-1 text-xs text-ink-muted'>
								{t}
							</li>
						))}
					</ul>
				)}

				{post.sources.length > 0 && (
					<section aria-labelledby='sources' className='mt-10'>
						<h2 id='sources' className='font-sans text-base font-semibold'>
							Sources
						</h2>
						<ol className='mt-3 list-decimal space-y-1.5 pl-5 text-sm text-ink-muted'>
							{post.sources.map((s, i) => (
								<li key={i}>
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

				<p className='mt-10 text-sm text-ink-muted'>
					This article is general information to help you understand your options. It isn&apos;t medical advice for
					your situation. If you&apos;re worried about someone&apos;s health, speak to a healthcare professional — or{' '}
					<Link href='/contact' className='text-olive-deep underline underline-offset-4'>
						talk to Ivorris
					</Link>{' '}
					about what support may be appropriate.
				</p>

				{post.related.length > 0 && (
					<section aria-labelledby='related-heading' className='mt-14 border-t border-line pt-10'>
						<h2 id='related-heading' className='text-3xl'>
							Keep reading
						</h2>
						<div className='mt-2'>
							<PostList posts={post.related} />
						</div>
					</section>
				)}
			</article>
		</>
	);
}
