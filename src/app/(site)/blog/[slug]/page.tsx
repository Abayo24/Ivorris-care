import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import { ArticleView } from '@/components/blog/ArticleView';
import { JsonLd } from '@/components/seo/JsonLd';
import { site } from '@/content/site';
import { getIndexablePosts, getPostBySlug } from '@/lib/blog/posts';
import type { Person } from '@/lib/blog/types';
import { absoluteUrl, faqJsonLd, organizationId, pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	return (await getIndexablePosts()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { post } = await getPostBySlug((await params).slug);
	if (!post) return { title: 'Article not found', robots: { index: false } };
	return pageMetadata({
		title: post.seo.title || post.title,
		description: post.seo.description || post.excerpt,
		path: `/blog/${post.slug}`,
		type: 'article',
		publishedTime: post.publishedAt,
		modifiedTime: post.updatedAt || post.savedAt,
		image: post.mainImage ? { url: post.mainImage.src, alt: post.mainImage.alt } : undefined,
		noIndex: post.seo.noIndex,
	});
}

function personJsonLd(person?: Person) {
	if (!person) return undefined;
	return {
		'@type': 'Person',
		name: person.name,
		...(person.role ? { jobTitle: person.role } : {}),
	};
}

export default async function ArticlePage({ params }: Props) {
	const { post, movedTo } = await getPostBySlug((await params).slug);
	if (movedTo) permanentRedirect(`/blog/${movedTo}`);
	if (!post) notFound();

	const path = `/blog/${post.slug}`;

	return (
		<>
			<ArticleView post={post} />
			<JsonLd
				data={[
					{
						'@context': 'https://schema.org',
						'@type': 'BlogPosting',
						headline: post.title,
						description: post.seo.description || post.excerpt,
						url: absoluteUrl(path),
						mainEntityOfPage: absoluteUrl(path),
						datePublished: post.publishedAt,
						dateModified: post.updatedAt || post.savedAt,
						...(post.mainImage ? { image: [absoluteUrl(post.mainImage.src)] } : {}),
						...(post.author
							? { author: personJsonLd(post.author) }
							: { author: { '@type': 'Organization', name: site.name, url: site.url } }),
						...(post.reviewedBy ? { reviewedBy: personJsonLd(post.reviewedBy) } : {}),
						publisher: { '@id': organizationId },
						...(post.category ? { articleSection: post.category.title } : {}),
						...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
					},
					...(post.faqs.length ? [faqJsonLd(post.faqs)] : []),
				]}
			/>
		</>
	);
}
