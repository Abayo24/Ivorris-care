import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PostGrid } from '@/components/blog/PostCard';
import { CtaSection } from '@/components/sections/CtaSection';
import { FaqList } from '@/components/sections/FaqList';
import { PageHero } from '@/components/sections/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { Check } from '@/components/ui/Icons';
import { ButtonLink, Container, Eyebrow, SectionHeading, TextLink } from '@/components/ui/primitives';
import { getService, services } from '@/content/services';
import { primaryCta } from '@/content/site';
import { faqJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo';
import { sanityFetch } from '@/sanity/fetch';
import { postsByCategoryQuery } from '@/sanity/queries';
import type { PostCard } from '@/sanity/types';

type Props = { params: Promise<{ slug: string }> };

// Unknown slugs fall through to notFound() below. (`dynamicParams = false`
// is avoided: in Next 16 it makes on-demand revalidation of these pages fail.)
export function generateStaticParams() {
	return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const service = getService((await params).slug);
	if (!service) return {};
	return pageMetadata({
		title: service.seo.title,
		description: service.seo.description,
		path: `/services/${service.slug}`,
	});
}

export default async function ServicePage({ params }: Props) {
	const service = getService((await params).slug);
	if (!service) notFound();

	const related = await sanityFetch<PostCard[]>({
		query: postsByCategoryQuery,
		params: { category: service.relatedCategory, limit: 3 },
		fallback: [],
	});
	const others = services.filter((s) => s.slug !== service.slug);
	const path = `/services/${service.slug}`;

	return (
		<>
			<PageHero
				crumbs={[
					{ name: 'How we help', href: '/services' },
					{ name: service.name, href: path },
				]}
				eyebrow={`${service.name} · Nurse-led`}
				title={service.headline}
				intro={<p>{service.intro}</p>}
				image={service.image}
			>
				<ButtonLink href={primaryCta.href}>Talk to Ivorris about this</ButtonLink>
			</PageHero>

			{/* Situation + definition */}
			<section className='py-20 sm:py-24'>
				<Container className='grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20'>
					<div>
						<Eyebrow>The situation</Eyebrow>
						<blockquote className='mt-6 border-l-4 border-sun pl-6 font-display text-3xl leading-snug text-ink sm:text-4xl'>
							“{service.situationQuote}”
						</blockquote>
						<p className='mt-6 text-ink-muted'>{service.forSituation}</p>
					</div>
					<div>
						<h2 className='text-3xl sm:text-4xl'>{service.definition.question}</h2>
						<p className='mt-5 text-lg text-ink'>{service.definition.answer}</p>
					</div>
				</Container>
			</section>

			{/* Who it's for + what it involves */}
			<section className='bg-cream py-20 sm:py-24'>
				<Container className='grid gap-6 lg:grid-cols-2'>
					<div className='rounded-card bg-white p-6 sm:p-10'>
						<h2 className='text-3xl'>Who this service is for</h2>
						<ul className='mt-6 space-y-4'>
							{service.whoFor.map((item) => (
								<li key={item} className='flex gap-3'>
									<span className='mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-olive-tint text-olive-deep'>
										<Check className='h-3.5 w-3.5' />
									</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>
					<div className='rounded-card bg-white p-6 sm:p-10'>
						<h2 className='text-3xl'>What the service involves</h2>
						<p className='mt-4 text-ink-muted'>{service.involvesIntro}</p>
						<ul className='mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2'>
							{service.involves.map((item) => (
								<li key={item} className='flex gap-2.5 text-[0.95rem]'>
									<span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olive' aria-hidden='true' />
									{item}
								</li>
							))}
						</ul>
					</div>
				</Container>
			</section>

			{/* What to expect */}
			<section aria-labelledby='expect-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='expect-heading'
						eyebrow='What to expect'
						title='What happens when you get in touch'
						intro='Every situation is different. This is the general shape of the process.'
					/>
					<ol className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{service.expect.map((step, i) => (
							<li key={step.title} className='rounded-card border border-line p-6'>
								<span className='font-display text-4xl text-olive' aria-hidden='true'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<h3 className='mt-6 font-sans text-base font-semibold'>
									<span className='sr-only'>Step {i + 1}: </span>
									{step.title}
								</h3>
								<p className='mt-2 text-[0.95rem] text-ink-muted'>{step.body}</p>
							</li>
						))}
					</ol>
					<p className='mt-8 max-w-3xl rounded-2xl bg-cream-soft p-5 text-sm text-ink-muted'>
						If you or your loved one needs support that sits outside Ivorris&apos; professional scope, we&apos;ll
						say so clearly — and help you find appropriate support through{' '}
						<Link href='/connect-and-coordinate' className='font-medium text-olive-deep underline underline-offset-4'>
							Connect &amp; Coordinate
						</Link>
						.
					</p>
				</Container>
			</section>

			{/* FAQs */}
			<section aria-labelledby='faq-heading' className='bg-cream-soft py-20 sm:py-24'>
				<Container className='grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16'>
					<SectionHeading
						id='faq-heading'
						eyebrow='Questions'
						title={`${service.name}: common questions`}
					/>
					<FaqList faqs={service.faqs} />
				</Container>
			</section>

			{/* Related articles */}
			{related.length > 0 && (
				<section aria-labelledby='related-heading' className='py-20 sm:py-24'>
					<Container>
						<div className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
							<SectionHeading id='related-heading' eyebrow='Resources' title='Related articles' />
							<TextLink href={`/blog?category=${service.relatedCategory}`}>More on this topic</TextLink>
						</div>
						<div className='mt-12'>
							<PostGrid posts={related} />
						</div>
					</Container>
				</section>
			)}

			{/* Other services */}
			<section aria-labelledby='other-heading' className={related.length ? 'pb-4' : 'pt-20 pb-4 sm:pt-24'}>
				<Container>
					<h2 id='other-heading' className='text-2xl sm:text-3xl'>
						Other nurse-led services
					</h2>
					<ul className='mt-6 grid gap-3 sm:grid-cols-3'>
						{others.map((s) => (
							<li key={s.slug}>
								<Link
									href={`/services/${s.slug}`}
									className='flex h-full flex-col rounded-card border border-line p-5 transition-colors hover:border-olive'
								>
									<span className='font-display text-xl'>{s.name}</span>
									<span className='mt-1 text-sm text-ink-muted'>{s.summary}</span>
								</Link>
							</li>
						))}
					</ul>
				</Container>
			</section>

			<CtaSection
				heading={`Wondering if ${service.name.toLowerCase()} is right for you?`}
				body={`Tell us what's going on. We'll help you understand what kind of support may be appropriate and what your next step could be.`}
				whatsappMessage={`Hello Ivorris, I'd like to ask about ${service.name}.`}
			/>

			<JsonLd
				data={[
					serviceJsonLd({ name: service.name, description: service.definition.answer, path }),
					faqJsonLd(service.faqs),
				]}
			/>
		</>
	);
}
