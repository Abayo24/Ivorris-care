import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaSection } from '@/components/sections/CtaSection';
import { PageHero } from '@/components/sections/PageHero';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { ServiceCard, SituationCard } from '@/components/sections/cards';
import { ButtonLink, Container, SectionHeading, TextLink } from '@/components/ui/primitives';
import { situations } from '@/content/home';
import { services } from '@/content/services';
import { primaryCta } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
	title: 'Home Care Services in Nairobi',
	description:
		'Nurse-led home care services in Nairobi: care needs assessments, home nursing, care after hospital discharge and guidance for family caregivers.',
	path: '/services',
});

export default function ServicesPage() {
	return (
		<>
			<PageHero
				crumbs={[{ name: 'How we help', href: '/services' }]}
				eyebrow='How we help'
				title='Nurse-led support, starting with your situation'
				intro={
					<p>
						Ivorris is a nurse-led healthcare navigation and care coordination service. Some support we provide
						directly through our nurses. Where you need someone else, we help you find and connect with them.
					</p>
				}
			>
				<ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
			</PageHero>

			<section aria-labelledby='direct-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='direct-heading'
						eyebrow='Provided directly by Ivorris'
						title='Our four nurse-led services'
						intro='Each service is delivered by Ivorris within professional scope, competence and applicable requirements.'
					/>
					<ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
						{services.map((s, i) => (
							<li key={s.slug}>
								<ServiceCard service={s} index={i} />
							</li>
						))}
					</ul>
				</Container>
			</section>

			<section aria-labelledby='beyond-heading' className='bg-cream py-20 sm:py-24'>
				<Container className='grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center'>
					<div>
						<SectionHeading
							id='beyond-heading'
							eyebrow='Beyond our direct services'
							title='Connecting you with other professionals and resources'
							intro='Specialists, therapists, caregivers, equipment, diagnostics and more — we help you identify what may be appropriate and connect with it. These services are delivered by others, not by Ivorris.'
						/>
						<div className='mt-8'>
							<TextLink href='/connect-and-coordinate'>Explore Connect &amp; Coordinate</TextLink>
						</div>
					</div>
					<div className='rounded-card bg-white p-6 sm:p-8'>
						<h3 className='font-sans text-base font-semibold'>A quick guide</h3>
						<dl className='mt-5 space-y-5 text-[0.95rem]'>
							<div>
								<dt className='font-semibold text-olive-deep'>We provide directly</dt>
								<dd className='mt-1 text-ink-muted'>
									Care needs assessment, post-discharge nursing assessment, nurse-led home nursing and family
									care guidance.
								</dd>
							</div>
							<div>
								<dt className='font-semibold text-olive-deep'>We help you connect with</dt>
								<dd className='mt-1 text-ink-muted'>
									Doctors and specialists, therapists, nutrition professionals, caregivers, medical equipment,
									diagnostics, pharmacies and other services — subject to availability and suitability.
								</dd>
							</div>
							<div>
								<dt className='font-semibold text-olive-deep'>We help you understand</dt>
								<dd className='mt-1 text-ink-muted'>
									Your options, through conversation and our{' '}
									<Link href='/blog' className='underline underline-offset-4'>
										resources for families
									</Link>
									.
								</dd>
							</div>
						</dl>
					</div>
				</Container>
			</section>

			<section aria-labelledby='situations-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='situations-heading'
						eyebrow='Not sure which applies?'
						title='Start with the situation, not the service'
					/>
					<ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{situations.map((s) => (
							<li key={s.href}>
								<SituationCard situation={s} />
							</li>
						))}
					</ul>
				</Container>
			</section>

			<section aria-labelledby='process-heading' className='pb-4'>
				<Container>
					<SectionHeading id='process-heading' eyebrow='Our approach' title='How Ivorris works' />
					<div className='mt-10'>
						<ProcessSteps />
					</div>
				</Container>
			</section>

			<CtaSection />
		</>
	);
}
