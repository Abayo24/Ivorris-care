import type { Metadata } from 'next';
import { HomeCareIllustration } from '@/components/illustrations/Illustrations';
import Image from 'next/image';

import { CtaSection } from '@/components/sections/CtaSection';
import { PageHero } from '@/components/sections/PageHero';
import { ProcessSteps } from '@/components/sections/ProcessSteps';
import { Container, Eyebrow, SectionHeading } from '@/components/ui/primitives';
import { photos } from '@/content/photos';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
	title: 'About us — nurse-led care navigation',
	description:
		'Ivorris Care is a nurse-led healthcare navigation and care coordination service in Nairobi, helping people move from confusion to understanding and the right support.',
	path: '/about',
});

const journey = ['Confusion', 'Understanding', 'Trust', 'Conversation', 'Appropriate support'];
const personality = ['Warm', 'Knowledgeable', 'Reassuring', 'Human', 'Curious', 'Professional', 'Approachable', 'Thoughtful'];

export default function AboutPage() {
	return (
		<>
			<PageHero
				crumbs={[{ name: 'About', href: '/about' }]}
				eyebrow='About Ivorris'
				title={site.tagline}
				intro={
					<p>
						We help individuals and families make sense of their healthcare and care needs, understand their
						options, and connect with the right support.
					</p>
				}
			/>

			<section className='py-20 sm:py-24'>
				<Container className='grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-20'>
					<div className='relative aspect-square overflow-hidden rounded-[1.75rem]'>
						<Image
							src={photos.about.src}
							alt={photos.about.alt}
							fill
							sizes='(min-width: 1024px) 40vw, 100vw'
							className='object-cover'
						/>
					</div>
					<div>
						<Eyebrow>Who we are</Eyebrow>
						<h2 className='mt-4 text-3xl sm:text-4xl'>
							Between you and a sometimes complicated healthcare system
						</h2>
						<div className='mt-6 space-y-4 text-ink-muted sm:text-lg'>
							<p>
								Ivorris Care is a nurse-led healthcare navigation and care coordination service based in{' '}
								{site.contact.city}, {site.contact.country}.
							</p>
							<p>
								We combine nursing knowledge, practical care experience and a growing network of healthcare and
								support providers to help people navigate situations that may otherwise feel confusing or
								overwhelming.
							</p>
							<p>
								You can come to us with a situation or a question — even when you don&apos;t know what service you
								need. Our role is to help you understand your situation, discover options you may not have known
								existed, and know what your next step could be.
							</p>
						</div>
					</div>
				</Container>
			</section>

			<section aria-labelledby='journey-heading' className='bg-olive-deep py-20 text-cream sm:py-24'>
				<Container>
					<Eyebrow tone='light'>What we hope you feel</Eyebrow>
					<h2 id='journey-heading' className='mt-4 max-w-3xl text-3xl text-white sm:text-4xl'>
						“I don&apos;t have to know exactly what I need before I reach out.”
					</h2>
					<ol className='mt-12 flex flex-col gap-3 md:flex-row md:items-stretch'>
						{journey.map((stage, i) => (
							<li
								key={stage}
								className={`flex flex-1 items-center gap-3 rounded-2xl px-5 py-4 ${
									i === journey.length - 1 ? 'bg-sun text-ink' : 'bg-white/8 text-cream'
								}`}
							>
								<span className='font-display text-2xl opacity-70' aria-hidden='true'>
									{i + 1}
								</span>
								<span className='font-medium'>{stage}</span>
							</li>
						))}
					</ol>
					<p className='mt-8 max-w-3xl text-cream/85'>
						We want to help people move from “I know something is wrong, but I don&apos;t know what to do” towards
						“I understand my situation better and I know what my next step could be.”
					</p>
				</Container>
			</section>

			<section aria-labelledby='approach-heading' className='py-20 sm:py-24'>
				<Container>
					<SectionHeading
						id='approach-heading'
						eyebrow='Our approach'
						title='How Ivorris works'
						intro='Understanding first — then helping the right care come together.'
					/>
					<div className='mt-12'>
						<ProcessSteps />
					</div>
				</Container>
			</section>

			<section aria-labelledby='personality-heading' className='bg-cream py-20 sm:py-24'>
				<Container className='grid gap-10 lg:grid-cols-2 lg:items-center'>
					<SectionHeading
						id='personality-heading'
						eyebrow='How we show up'
						title='A knowledgeable friend in healthcare'
						intro='Someone who understands healthcare, but will also take the time to understand you — explaining things clearly, the way a nurse would explain them to a family member.'
					/>
					<div>
						<HomeCareIllustration className='mb-6 h-40 w-auto text-olive' />
						<ul className='flex flex-wrap gap-2.5'>
							{personality.map((p) => (
								<li key={p} className='rounded-pill bg-white px-5 py-2.5 font-medium'>
									{p}
								</li>
							))}
						</ul>
					</div>
				</Container>
			</section>

			<CtaSection />
		</>
	);
}
