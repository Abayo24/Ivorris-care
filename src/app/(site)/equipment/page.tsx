import type { Metadata } from 'next';
import Link from 'next/link';

import { CtaSection } from '@/components/sections/CtaSection';
import { PageHero } from '@/components/sections/PageHero';
import { Chat, Check } from '@/components/ui/Icons';
import { Container, SectionHeading } from '@/components/ui/primitives';
import { equipmentCategories, leaseSteps, leaseTerms, rentToOwn } from '@/content/equipment';
import { whatsappLink } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
	title: 'Medical equipment for home — leasing and rent to own',
	description:
		'Hospital beds, mobility aids, oxygen and monitoring equipment for recovery and care at home in Nairobi — lease short or long term, or rent to own selected items.',
	path: '/equipment',
});

const enquiry = "Hello Ivorris, I'd like to enquire about equipment leasing.";

export default function EquipmentPage() {
	return (
		<>
			<PageHero
				crumbs={[
					{ name: 'Connect & Coordinate', href: '/connect-and-coordinate' },
					{ name: 'Medical equipment', href: '/equipment' },
				]}
				eyebrow='Medical equipment'
				title='Equipment that makes home safer for recovery and care'
				intro={
					<p>
						Lease medical equipment for home instead of buying it. Not sure what you need? Equipment is often
						best chosen alongside a{' '}
						<Link href='/services/care-needs-assessment' className='text-olive-deep underline underline-offset-4'>
							care needs assessment
						</Link>
						, so it fits the person and the home.
					</p>
				}
			>
				<a
					href={whatsappLink(enquiry)}
					target='_blank'
					rel='noopener noreferrer'
					className='inline-flex min-h-12 items-center gap-2 rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep'
				>
					<Chat className='h-4 w-4' /> Request a quote on WhatsApp
					<span className='sr-only'>(opens in a new tab)</span>
				</a>
			</PageHero>

			<section aria-labelledby='range-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='range-heading'
						eyebrow='Equipment range'
						title='What you can lease'
						intro='Availability can change — contact us to confirm current stock and pricing.'
					/>
					<ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{equipmentCategories.map((cat) => (
							<li key={cat.name} className='rounded-card border border-line p-6'>
								<h3 className='text-2xl'>{cat.name}</h3>
								<ul className='mt-4 space-y-2 text-[0.95rem] text-ink-muted'>
									{cat.items.map((item) => (
										<li key={item} className='flex gap-2.5'>
											<span className='mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-olive' aria-hidden='true' />
											{item}
										</li>
									))}
								</ul>
							</li>
						))}
					</ul>
				</Container>
			</section>

			<section aria-labelledby='terms-heading' className='bg-cream py-20 sm:py-24'>
				<Container>
					<SectionHeading id='terms-heading' eyebrow='Flexible terms' title='Lease periods' />
					<ul className='mt-10 grid gap-4 md:grid-cols-3'>
						{leaseTerms.map((t) => (
							<li key={t.label} className='rounded-card bg-white p-6'>
								<p className='text-sm font-semibold text-olive-deep'>{t.label}</p>
								<p className='mt-1 font-display text-3xl'>{t.period}</p>
								<p className='mt-2 text-[0.95rem] text-ink-muted'>{t.desc}</p>
							</li>
						))}
					</ul>
					<h3 className='mt-16 text-2xl sm:text-3xl'>How leasing works</h3>
					<ol className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
						{leaseSteps.map((s, i) => (
							<li key={s.title} className='rounded-card bg-white p-6'>
								<span className='font-display text-3xl text-olive' aria-hidden='true'>
									{String(i + 1).padStart(2, '0')}
								</span>
								<h4 className='mt-4'>
									<span className='sr-only'>Step {i + 1}: </span>
									{s.title}
								</h4>
								<p className='mt-1.5 text-[0.95rem] text-ink-muted'>{s.body}</p>
							</li>
						))}
					</ol>
				</Container>
			</section>

			<section aria-labelledby='own-heading' className='py-20 sm:py-24'>
				<Container className='grid gap-10 lg:grid-cols-2 lg:gap-16'>
					<div>
						<SectionHeading
							id='own-heading'
							eyebrow='Rent to own'
							title='Lease it today, own it over time'
							intro='For selected everyday mobility and recovery aids, your monthly lease payments can count towards full ownership.'
						/>
						<ul className='mt-8 flex flex-wrap gap-2'>
							{rentToOwn.items.map((i) => (
								<li key={i} className='rounded-pill bg-cream px-4 py-1.5 text-sm'>
									{i}
								</li>
							))}
						</ul>
					</div>
					<div className='rounded-card border border-line p-6 sm:p-8'>
						<h3 className='font-sans text-base font-semibold'>Rent-to-own terms</h3>
						<ul className='mt-5 space-y-3'>
							{rentToOwn.terms.map((t) => (
								<li key={t} className='flex gap-3 text-[0.95rem]'>
									<Check className='mt-1 h-4 w-4 shrink-0 text-olive' />
									{t}
								</li>
							))}
						</ul>
						<a
							href={whatsappLink('Hello Ivorris, I am interested in the rent-to-own option for equipment.')}
							target='_blank'
							rel='noopener noreferrer'
							className='mt-8 inline-flex min-h-12 items-center gap-2 rounded-pill border border-ink/20 px-6 font-medium hover:border-olive hover:text-olive-deep'
						>
							<Chat className='h-4 w-4' /> Ask about rent to own
							<span className='sr-only'>(opens in a new tab)</span>
						</a>
					</div>
				</Container>
			</section>

			<CtaSection heading='Not sure which equipment is right?' whatsappMessage={enquiry} />
		</>
	);
}
