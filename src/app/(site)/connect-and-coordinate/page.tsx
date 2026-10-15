import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaSection } from '@/components/sections/CtaSection';
import { FaqList } from '@/components/sections/FaqList';
import { PageHero } from '@/components/sections/PageHero';
import { IconBadge } from '@/components/sections/cards';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArrowUpRight } from '@/components/ui/Icons';
import { ButtonLink, Container, SectionHeading } from '@/components/ui/primitives';
import { connectCategories } from '@/content/connect';
import { photos } from '@/content/photos';
import type { Faq } from '@/content/services';
import { primaryCta } from '@/content/site';
import { faqJsonLd, pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
	title: 'Connect & Coordinate — finding the right care',
	description:
		'When needs go beyond our nurse-led services, Ivorris helps you identify and connect with appropriate doctors, therapists, caregivers, equipment and other support.',
	path: '/connect-and-coordinate',
});

const faqs: Faq[] = [
	{
		question: 'Are these services provided by Ivorris?',
		answer:
			'No. The services on this page are provided by other professionals and organisations. Ivorris helps you identify what may be appropriate and connect with it. Our directly provided services are our four nurse-led services.',
	},
	{
		question: 'Can you guarantee access to a particular professional or service?',
		answer:
			'No. Connections depend on availability and on whether a service is suitable for your situation. We will be honest about what we can and cannot help arrange.',
	},
	{
		question: 'Who decides which provider to use?',
		answer:
			'You do. We help you understand the options and what to ask, so you can make an informed choice about your care.',
	},
	{
		question: 'What does care coordination involve?',
		answer:
			'Where several forms of support are involved, we help make the pathway easier to navigate — helping you understand how the pieces fit together, what comes next, and whether further support may be needed.',
	},
];

export default function ConnectPage() {
	return (
		<>
			<PageHero
				crumbs={[{ name: 'Connect & Coordinate', href: '/connect-and-coordinate' }]}
				eyebrow='Connect & Coordinate'
				title='The right people and resources — brought together'
				intro={
					<p>
						Not every need requires a service provided directly by Ivorris. Where someone needs another
						professional, service or resource, we help them identify and connect with appropriate support — and
						help make the pathway easier to navigate when several are involved.
					</p>
				}
				image={photos.connect}
			>
				<ButtonLink href={primaryCta.href}>Tell us what you need</ButtonLink>
			</PageHero>

			<section aria-labelledby='distinction-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='distinction-heading'
						eyebrow='An important distinction'
						title='What we provide, and what we help you find'
						align='center'
					/>
					<div className='mt-12 grid gap-5 md:grid-cols-2'>
						<div className='rounded-card bg-olive-deep p-7 text-cream sm:p-10'>
							<p className='text-sm font-semibold tracking-[0.12em] text-sun uppercase'>Provided by Ivorris</p>
							<h3 className='mt-3 text-3xl text-white'>Nurse-led services</h3>
							<p className='mt-3 text-cream/90'>
								Delivered directly by our nurses, within professional scope, competence and applicable
								requirements.
							</p>
							<ul className='mt-6 space-y-2'>
								{[
									['Care Needs Assessment', 'care-needs-assessment'],
									['Post-Discharge Nursing Assessment', 'post-discharge-nursing-assessment'],
									['Nurse-Led Home Nursing', 'home-nursing'],
									['Family Care Guidance', 'family-care-guidance'],
								].map(([name, slug]) => (
									<li key={slug}>
										<Link
											href={`/services/${slug}`}
											className='inline-flex items-center gap-1.5 text-white underline decoration-cream/40 underline-offset-4 hover:decoration-white'
										>
											{name} <ArrowUpRight className='h-4 w-4' />
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div className='rounded-card border-2 border-dashed border-olive/40 p-7 sm:p-10'>
							<p className='text-sm font-semibold tracking-[0.12em] text-olive-deep uppercase'>
								We help you connect with
							</p>
							<h3 className='mt-3 text-3xl'>Other professionals &amp; resources</h3>
							<p className='mt-3 text-ink-muted'>
								Provided by others. We help you work out what may be appropriate, find options and bring the
								pieces together. Connections are subject to availability and suitability, and do not imply a
								partnership or endorsement.
							</p>
						</div>
					</div>
				</Container>
			</section>

			<section aria-labelledby='categories-heading' className='bg-cream py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='categories-heading'
						eyebrow='Where appropriate'
						title='Support we can help you connect with'
						intro='Depending on the situation, this may include:'
					/>
					<ul className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
						{connectCategories.map((c) => {
							const inner = (
								<>
									<IconBadge name={c.icon} />
									<div>
										<h3 className='font-sans text-base font-semibold'>{c.title}</h3>
										<p className='mt-1 text-[0.95rem] text-ink-muted'>{c.body}</p>
										{c.href && (
											<span className='mt-2 inline-flex items-center gap-1 text-sm font-semibold text-olive-deep'>
												Learn more <ArrowUpRight className='h-3.5 w-3.5' />
											</span>
										)}
									</div>
								</>
							);
							return (
								<li key={c.title}>
									{c.href ? (
										<Link
											href={c.href}
											className='flex h-full gap-4 rounded-card bg-white p-5 transition-shadow hover:shadow-md sm:p-6'
										>
											{inner}
										</Link>
									) : (
										<div className='flex h-full gap-4 rounded-card bg-white p-5 sm:p-6'>{inner}</div>
									)}
								</li>
							);
						})}
					</ul>
				</Container>
			</section>

			<section aria-labelledby='how-heading' className='py-20 sm:py-24'>
				<Container className='grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16'>
					<SectionHeading id='how-heading' eyebrow='Questions' title='How connecting and coordinating works' />
					<FaqList faqs={faqs} />
				</Container>
			</section>

			<CtaSection
				heading='Need a specialist, service or equipment?'
				whatsappMessage="Hello Ivorris, I'm looking for help finding a specialist, service or equipment."
			/>
			<JsonLd data={faqJsonLd(faqs)} />
		</>
	);
}
