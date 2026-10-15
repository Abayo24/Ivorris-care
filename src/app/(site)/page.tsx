import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { PostGrid } from '@/components/blog/PostCard';
import { CtaSection } from '@/components/sections/CtaSection';
import { FaqList } from '@/components/sections/FaqList';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { IconBadge, ServiceCard, SituationCard } from '@/components/sections/cards';
import { JsonLd } from '@/components/seo/JsonLd';
import { Chat, Check, Phone } from '@/components/ui/Icons';
import { ButtonLink, Container, Eyebrow, SectionHeading, TextLink } from '@/components/ui/primitives';
import { connectCategories } from '@/content/connect';
import { homeFaqs, reasons, situations } from '@/content/home';
import { photos } from '@/content/photos';
import { services } from '@/content/services';
import { primaryCta, site, whatsappLink } from '@/content/site';
import { faqJsonLd, pageMetadata } from '@/lib/seo';
import { sanityFetch } from '@/sanity/fetch';
import { latestPostsQuery } from '@/sanity/queries';
import type { PostCard } from '@/sanity/types';

export const metadata: Metadata = {
	...pageMetadata({
		title: 'Nurse-led healthcare navigation and care coordination in Nairobi',
		description:
			'Not sure what care a loved one needs? Ivorris is a nurse-led service in Nairobi helping families understand their options and connect with the right support.',
		path: '/',
	}),
	title: { absolute: 'Ivorris Care — Nurse-led healthcare navigation in Nairobi' },
};

export default async function HomePage() {
	const posts = await sanityFetch<PostCard[]>({ query: latestPostsQuery, params: { limit: 3 }, fallback: [] });

	return (
		<>
			{/* ── Hero: full photographic panel, after the reference design ── */}
			<section>
				<div>
					<div className='relative isolate flex flex-col overflow-hidden bg-olive-deep pt-18 lg:min-h-[800px] lg:pt-0'>
						{/* Small screens: photo on top, fading into the olive panel below.
						    Desktop: photo fills the right two-thirds and fades into olive
						    behind the text. */}
						<div className='relative -z-20 aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[70%]'>
							<Image
								src={photos.hero.src}
								alt={photos.hero.alt}
								fill
								preload
								fetchPriority='high'
								loading='eager'
								sizes='(min-width: 1024px) 70vw, 100vw'
								className='object-cover object-[55%_25%] lg:object-center'
							/>
							<div
								className='absolute inset-0 bg-gradient-to-t from-olive-deep via-olive-deep/10 via-35% to-transparent lg:hidden'
								aria-hidden='true'
							/>
						</div>
						<div
							className='absolute inset-0 -z-10 hidden bg-gradient-to-r from-olive-deep from-30% via-olive-deep/55 via-48% to-transparent to-70% lg:block'
							aria-hidden='true'
						/>
						{/* Top shade keeps the transparent header's white links readable over the photo. */}
						<div
							className='absolute inset-x-0 top-0 -z-10 hidden h-40 bg-gradient-to-b from-black/55 to-transparent lg:block'
							aria-hidden='true'
						/>

						{/* Text lines up with the header's logo via the same container width. */}
						<div className='mx-auto -mt-10 flex w-full max-w-7xl flex-1 flex-col px-4 pb-8 sm:-mt-16 sm:px-6 sm:pb-10 lg:mt-0 lg:justify-center lg:px-10 lg:pt-32'>
							<div className='max-w-2xl'>
								<Eyebrow tone='light'>Nurse-led healthcare navigation · {site.contact.city}</Eyebrow>
								<h1 className='mt-5 text-[2.5rem] leading-[1.05] text-white sm:text-6xl lg:text-[4.4rem]'>
									Finding the right care starts with{' '}
									<span className='relative whitespace-nowrap'>
										understanding.
										<span
											className='absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-sun'
											aria-hidden='true'
										/>
									</span>
								</h1>
								<p className='mt-6 max-w-xl text-base text-white/90 sm:text-lg'>
									When healthcare or caring for someone at home feels confusing, knowing where to begin
									isn&apos;t always easy. Ivorris helps you understand your situation, explore your options,
									and connect with the right care and support.
								</p>
								<div className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center'>
									<ButtonLink href={primaryCta.href} variant='light'>
										{primaryCta.label}
									</ButtonLink>
									<ButtonLink href='#situations' variant='ghost'>
										Explore how we help
									</ButtonLink>
								</div>
							</div>
						</div>

						{/* Bottom bar: contact links (left) and inset card (right), as in the reference. */}
						<div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-6 sm:px-6 sm:pb-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:pb-12'>
							<div className='text-sm text-white/90'>
								<p className='font-semibold text-white'>Prefer to talk now?</p>
								<ul className='mt-2 flex flex-wrap gap-x-5 gap-y-2'>
									<li>
										<a href={site.contact.phoneHref} className='inline-flex items-center gap-1.5 hover:text-white hover:underline'>
											<Phone className='h-4 w-4 text-sun' /> {site.contact.phoneDisplay}
										</a>
									</li>
									<li>
										<a
											href={whatsappLink()}
											target='_blank'
											rel='noopener noreferrer'
											className='inline-flex items-center gap-1.5 hover:text-white hover:underline'
										>
											<Chat className='h-4 w-4 text-sun' /> WhatsApp
											<span className='sr-only'>(opens in a new tab)</span>
										</a>
									</li>
								</ul>
							</div>

							<Link
								href='#how-it-works'
								className='group hidden w-[22rem] items-center gap-4 rounded-2xl border border-white/20 bg-black/45 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/60 lg:flex'
							>
								<span className='relative h-20 w-28 shrink-0 overflow-hidden rounded-xl'>
									<Image
										src={photos.heroInset.src}
										alt=''
										fill
										sizes='112px'
										className='object-cover transition-transform duration-500 group-hover:scale-105'
									/>
								</span>
								<span>
									<span className='block text-xs font-semibold tracking-[0.12em] text-sun uppercase'>
										How we help
									</span>
									<span className='mt-1 block text-sm leading-snug'>
										Assess · Connect · Coordinate · Follow up
									</span>
								</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ── Situations ─────────────────────────────────────────────── */}
			<section id='situations' aria-labelledby='situations-heading' className='scroll-mt-24 py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='situations-heading'
						eyebrow='Where would you like to start?'
						title="You don't need to know exactly what you need."
						intro="Start with what's happening. Choose the situation that sounds closest to yours — or simply tell us what's going on."
					/>
					<ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{situations.map((s) => (
							<li key={s.href}>
								<SituationCard situation={s} />
							</li>
						))}
						<li>
							<div className='flex h-full flex-col justify-between rounded-card bg-olive p-6 text-cream sm:p-7'>
								<div>
									<p className='font-display text-[1.55rem] leading-snug text-white'>
										“I&apos;m not sure what to do.”
									</p>
									<p className='mt-3 text-[0.95rem] text-cream/90'>
										That&apos;s a perfectly good place to start. Tell us what&apos;s going on and we&apos;ll help
										you work out the next step.
									</p>
								</div>
								<div className='pt-6'>
									<ButtonLink href={primaryCta.href} variant='light'>
										{primaryCta.label}
									</ButtonLink>
								</div>
							</div>
						</li>
					</ul>
				</Container>
			</section>

			{/* ── Nurse-led services ─────────────────────────────────────── */}
			<section aria-labelledby='services-heading' className='bg-cream py-20 sm:py-24'>
				<Container>
					<div className='flex flex-col justify-between gap-6 lg:flex-row lg:items-end'>
						<SectionHeading
							id='services-heading'
							eyebrow='Provided directly by Ivorris'
							title='Nurse-led services'
							intro='Four services our nurses provide directly, each focused on helping you understand a situation and what could come next.'
						/>
						<TextLink href='/services'>See all nurse-led services</TextLink>
					</div>
					<ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
						{services.map((s, i) => (
							<li key={s.slug}>
								<ServiceCard service={s} index={i} />
							</li>
						))}
					</ul>
				</Container>
			</section>

			{/* ── How it works ───────────────────────────────────────────── */}
			<section id='how-it-works' aria-labelledby='process-heading' className='scroll-mt-24 py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='process-heading'
						eyebrow='How Ivorris works'
						title='Four steps from uncertainty to the right support'
						intro='Every situation is different, but our approach stays the same: understand first, then help bring the right care together.'
						align='center'
					/>
					<div className='mt-12'>
						<ProcessSteps />
					</div>
				</Container>
			</section>

			{/* ── Connect & coordinate ──────────────────────────────────── */}
			<section aria-labelledby='connect-heading' className='pb-20 sm:pb-24'>
				<Container>
					<div className='grid gap-10 rounded-[1.75rem] border border-line bg-cream-soft p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14'>
						<div>
							<Eyebrow>Connect &amp; Coordinate</Eyebrow>
							<h2 id='connect-heading' className='mt-4 text-3xl sm:text-4xl'>
								When you need more than we provide directly
							</h2>
							<p className='mt-4 text-ink-muted sm:text-lg'>
								Not every need requires a service from Ivorris. Where someone needs another professional, service
								or resource, we help them identify and connect with appropriate support — and, where several are
								involved, help bring the pieces together.
							</p>
							<div className='mt-8 grid gap-4 sm:grid-cols-2'>
								<div className='rounded-2xl bg-white p-5'>
									<p className='text-sm font-semibold text-olive-deep'>Provided by Ivorris</p>
									<p className='mt-1 text-sm text-ink-muted'>
										Our four nurse-led services, delivered by our nurses within professional scope.
									</p>
								</div>
								<div className='rounded-2xl border border-dashed border-olive/40 p-5'>
									<p className='text-sm font-semibold text-olive-deep'>We help you connect with</p>
									<p className='mt-1 text-sm text-ink-muted'>
										Other professionals and resources, subject to availability and suitability.
									</p>
								</div>
							</div>
							<div className='mt-8'>
								<TextLink href='/connect-and-coordinate'>How Connect &amp; Coordinate works</TextLink>
							</div>
						</div>
						<ul className='grid content-start gap-3 sm:grid-cols-2'>
							{connectCategories.slice(0, 8).map((c) => (
								<li key={c.title} className='flex items-center gap-3 rounded-2xl bg-white p-3 pr-4'>
									<IconBadge name={c.icon} />
									<span className='text-[0.95rem] font-medium'>{c.title}</span>
								</li>
							))}
						</ul>
					</div>
				</Container>
			</section>

			{/* ── Why families choose Ivorris ────────────────────────────── */}
			<section aria-labelledby='why-heading' className='bg-olive-deep py-20 text-cream sm:py-24'>
				<Container className='grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16'>
					<div className='relative aspect-[4/5] overflow-hidden rounded-[1.75rem] max-lg:max-h-[520px] max-lg:w-full'>
						<Image
							src={photos.whyFamilies.src}
							alt={photos.whyFamilies.alt}
							fill
							sizes='(min-width: 1024px) 40vw, 100vw'
							className='object-cover object-top'
						/>
					</div>
					<div>
						<Eyebrow tone='light'>Why families choose Ivorris</Eyebrow>
						<h2 id='why-heading' className='mt-4 text-3xl text-white sm:text-4xl lg:text-5xl'>
							Someone who understands healthcare — and takes time to understand you.
						</h2>
						<ul className='mt-10 grid gap-7 sm:grid-cols-2'>
							{reasons.map((r) => (
								<li key={r.title} className='flex gap-3'>
									<span className='mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sun text-ink'>
										<Check className='h-3.5 w-3.5' />
									</span>
									<div>
										<h3 className='font-sans text-base font-semibold text-white'>{r.title}</h3>
										<p className='mt-1.5 text-[0.95rem] text-cream/85'>{r.body}</p>
									</div>
								</li>
							))}
						</ul>
					</div>
				</Container>
			</section>

			{/* ── Articles ──────────────────────────────────────────────── */}
			{posts.length > 0 && (
				<section aria-labelledby='articles-heading' className='py-20 sm:py-24'>
					<Container>
						<div className='flex flex-col justify-between gap-6 sm:flex-row sm:items-end'>
							<SectionHeading
								id='articles-heading'
								eyebrow='Resources'
								title='Helpful guides for families'
								intro='Plain-language articles to help you understand care situations and ask better questions.'
							/>
							<TextLink href='/blog'>Browse all articles</TextLink>
						</div>
						<div className='mt-12'>
							<PostGrid posts={posts} />
						</div>
					</Container>
				</section>
			)}

			{/* ── FAQ ───────────────────────────────────────────────────── */}
			<section aria-labelledby='faq-heading' className={`py-20 sm:py-24 ${posts.length ? 'bg-cream-soft' : ''}`}>
				<Container className='grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16'>
					<div>
						<SectionHeading
							id='faq-heading'
							eyebrow='Questions'
							title='Frequently asked questions'
							intro={
								<>
									Can&apos;t find what you&apos;re looking for?{' '}
									<Link href='/contact' className='font-medium text-olive-deep underline underline-offset-4'>
										Ask us directly
									</Link>
									.
								</>
							}
						/>
					</div>
					<FaqList faqs={homeFaqs} />
				</Container>
			</section>

			<CtaSection />
			<JsonLd data={faqJsonLd(homeFaqs)} />
		</>
	);
}
