import Image from 'next/image';
import Link from 'next/link';

import { urlForImage } from '@/sanity/image';
import type { PostCard as PostCardType } from '@/sanity/types';
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
	const src = urlForImage(post.mainImage, 800, 560);
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
						placeholder={post.mainImage?.lqip ? 'blur' : 'empty'}
						blurDataURL={post.mainImage?.lqip}
						className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
					/>
				) : null}
				{post.isPlaceholder && (
					<span className='absolute top-3 left-3 rounded-pill bg-sun px-2.5 py-0.5 text-xs font-semibold text-ink'>
						Sample article
					</span>
				)}
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

/** Large featured article with image and overlaid title, after the reference layout. */
export function FeaturedPost({ post }: { post: PostCardType }) {
	const src = urlForImage(post.mainImage, 1600, 900);
	return (
		<article className='group relative overflow-hidden rounded-[1.75rem] bg-olive-deep'>
			<div className='relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]'>
				{src && (
					<Image
						src={src}
						alt={post.mainImage?.alt ?? ''}
						fill
						preload
						fetchPriority='high'
						loading='eager'
						sizes='(min-width: 1280px) 1200px, 100vw'
						placeholder={post.mainImage?.lqip ? 'blur' : 'empty'}
						blurDataURL={post.mainImage?.lqip}
						className='object-cover transition-transform duration-700 group-hover:scale-[1.02]'
					/>
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent' />
			</div>
			<div className='absolute inset-x-0 bottom-0 p-6 sm:p-10'>
				<span className='inline-flex rounded-pill bg-sun px-3 py-1 text-xs font-semibold text-ink'>
					{post.isPlaceholder ? 'Featured · Sample article' : 'Featured'}
				</span>
				<div className='mt-4'>
					<PostMeta post={post} tone='light' />
				</div>
				<h2 className='mt-2 max-w-3xl text-3xl text-white sm:text-4xl'>
					<Link href={`/blog/${post.slug}`} className='after:absolute after:inset-0'>
						{post.title}
					</Link>
				</h2>
				<p className='mt-3 hidden max-w-2xl text-cream/90 sm:block'>{post.excerpt}</p>
			</div>
		</article>
	);
}

export function PostGrid({ posts, headingLevel = 3 }: { posts: PostCardType[]; headingLevel?: 2 | 3 }) {
	return (
		<ul className='grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3'>
			{posts.map((p) => (
				<li key={p._id}>
					<PostCard post={p} headingLevel={headingLevel} />
				</li>
			))}
		</ul>
	);
}
