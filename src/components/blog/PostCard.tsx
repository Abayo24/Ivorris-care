import Image from 'next/image';
import Link from 'next/link';

import type { PostCard as PostCardType } from '@/lib/blog/types';
import { formatDate } from '@/lib/format';

function PostMeta({ post, tone = 'dark' }: { post: PostCardType; tone?: 'dark' | 'light' }) {
	const color = tone === 'light' ? 'text-cream/90' : 'text-ink-muted';
	return (
		<p className={`flex flex-wrap items-center gap-x-2 text-xs ${color}`}>
			{post.category && <span className='font-medium'>{post.category.title}</span>}
			{post.category && <span aria-hidden='true'>•</span>}
			<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
			{post.readingMinutes ? (
				<>
					<span aria-hidden='true'>•</span>
					<span>{Math.max(1, post.readingMinutes)} min read</span>
				</>
			) : null}
		</p>
	);
}

/** Editorial article card: image, meta line, title. */
export function PostCard({ post, headingLevel = 3 }: { post: PostCardType; headingLevel?: 2 | 3 }) {
	const src = post.mainImage?.src;
	const Heading = headingLevel === 2 ? 'h2' : 'h3';
	return (
		<article className='reveal group relative flex flex-col'>
			<div className='relative aspect-[10/7] overflow-hidden rounded-card bg-cream'>
				{src ? (
					<Image
						src={src}
						alt={post.mainImage?.alt ?? ''}
						fill
						sizes='(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
						className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
					/>
				) : null}
			</div>
			<div className='mt-4'>
				<PostMeta post={post} />
				<Heading className='mt-2 text-[1.45rem] leading-snug'>
					<Link href={`/blog/${post.slug}`} className='after:absolute after:inset-0 hover:text-olive-deep'>
						{post.title}
					</Link>
				</Heading>
				<p className='mt-2 line-clamp-2 text-[0.95rem] text-ink-muted'>{post.excerpt}</p>
			</div>
		</article>
	);
}

function Byline({ post }: { post: PostCardType }) {
	return (
		<p className='mt-3 flex flex-wrap items-center gap-x-1.5 text-[0.8rem] tracking-wide text-ink-muted'>
			{post.author && (
				<>
					<span className='font-medium text-ink'>{post.author.name}</span>
					<span aria-hidden='true'>·</span>
				</>
			)}
			<time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
			<span aria-hidden='true'>·</span>
			<span>{post.readingMinutes} min read</span>
		</p>
	);
}

/** Newsletter-style lead story: large image beside the headline. */
export function FeaturedPost({ post }: { post: PostCardType }) {
	return (
		<article className='group relative grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10'>
			<div className='relative aspect-[16/10] overflow-hidden rounded-lg bg-cream'>
				{post.mainImage && (
					<Image
						src={post.mainImage.src}
						alt={post.mainImage.alt}
						fill
						preload
						fetchPriority='high'
						loading='eager'
						sizes='(min-width: 768px) 560px, 100vw'
						className='object-cover'
					/>
				)}
			</div>
			<div>
				{post.category && <p className='text-sm font-medium text-olive-deep'>{post.category.title}</p>}
				<h2 className='mt-2 text-3xl leading-[1.12] sm:text-[2.5rem]'>
					<Link href={`/blog/${post.slug}`} className='after:absolute after:inset-0 group-hover:text-olive-deep'>
						{post.title}
					</Link>
				</h2>
				<p className='mt-3 text-lg text-ink-muted'>{post.excerpt}</p>
				<Byline post={post} />
			</div>
		</article>
	);
}

/** Newsletter-style list: headline and summary on the left, thumbnail on the right. */
export function PostList({ posts, headingLevel = 3 }: { posts: PostCardType[]; headingLevel?: 2 | 3 }) {
	const Heading = headingLevel === 2 ? 'h2' : 'h3';
	return (
		<ul className='divide-y divide-line'>
			{posts.map((post) => (
				<li key={post.id}>
					<article className='group relative flex items-start justify-between gap-5 py-7 sm:gap-8'>
						<div className='min-w-0 flex-1'>
							<Heading className='text-[1.6rem] leading-[1.18] sm:text-[1.85rem]'>
								<Link href={`/blog/${post.slug}`} className='after:absolute after:inset-0 group-hover:text-olive-deep'>
									{post.title}
								</Link>
							</Heading>
							<p className='mt-2 line-clamp-2 text-ink-muted'>{post.excerpt}</p>
							<Byline post={post} />
						</div>
						{post.mainImage && (
							<div className='relative mt-1 aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-cream sm:w-44'>
								<Image src={post.mainImage.src} alt='' fill sizes='(min-width: 640px) 176px, 96px' className='object-cover' />
							</div>
						)}
					</article>
				</li>
			))}
		</ul>
	);
}

export function PostGrid({ posts, headingLevel = 3 }: { posts: PostCardType[]; headingLevel?: 2 | 3 }) {
	return (
		<ul className='grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
			{posts.map((p) => (
				<li key={p.id}>
					<PostCard post={p} headingLevel={headingLevel} />
				</li>
			))}
		</ul>
	);
}
