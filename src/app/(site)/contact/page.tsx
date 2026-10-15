import type { Metadata } from 'next';
import { ChatIllustration } from '@/components/illustrations/Illustrations';

import { ContactForm } from '@/components/forms/ContactForm';
import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { Chat, Mail, MapPin, Phone } from '@/components/ui/Icons';
import { Container, Eyebrow } from '@/components/ui/primitives';
import { enquiryTopics } from '@/lib/contact';
import { primaryCta, site, whatsappLink } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
	title: 'Talk to Ivorris',
	description:
		"Not sure where to start? Tell Ivorris what's going on and we'll help you understand what kind of support may be appropriate and what your next step could be.",
	path: '/contact',
});

type Props = { searchParams: Promise<{ topic?: string }> };

export default async function ContactPage({ searchParams }: Props) {
	const { topic } = await searchParams;
	const defaultTopic = enquiryTopics.some((t) => t.value === topic) ? topic : undefined;

	return (
		<section className='bg-cream-soft'>
			<Container className='pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pt-34 lg:pb-16'>
				<Breadcrumbs items={[{ name: 'Contact', href: '/contact' }]} />
				<div className='mt-8 grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16'>
					<div>
						<Eyebrow>Talk to Ivorris</Eyebrow>
						<h1 className='mt-4 text-4xl leading-[1.08] sm:text-5xl'>{primaryCta.heading}</h1>
						<p className='mt-5 text-lg text-ink-muted'>{primaryCta.body}</p>
						<p className='mt-4 text-ink-muted'>
							Starting with &ldquo;I&apos;m not sure what to do&rdquo; is perfectly fine.
						</p>

						<ChatIllustration className='mt-8 h-36 w-auto text-olive' />
						<h2 className='mt-6 font-sans text-base font-semibold'>Prefer to talk now?</h2>
						<ul className='mt-4 space-y-3'>
							<li>
								<a
									href={site.contact.phoneHref}
									className='flex items-center gap-4 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md'
								>
									<span className='grid h-11 w-11 place-items-center rounded-full bg-olive-tint text-olive-deep'>
										<Phone className='h-5 w-5' />
									</span>
									<span>
										<span className='block text-sm text-ink-muted'>Call us</span>
										<span className='font-medium'>{site.contact.phoneDisplay}</span>
									</span>
								</a>
							</li>
							<li>
								<a
									href={whatsappLink()}
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center gap-4 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md'
								>
									<span className='grid h-11 w-11 place-items-center rounded-full bg-olive-tint text-olive-deep'>
										<Chat className='h-5 w-5' />
									</span>
									<span>
										<span className='block text-sm text-ink-muted'>WhatsApp</span>
										<span className='font-medium'>Message us on WhatsApp</span>
										<span className='sr-only'> (opens in a new tab)</span>
									</span>
								</a>
							</li>
							<li>
								<a
									href={`mailto:${site.contact.email}`}
									className='flex items-center gap-4 rounded-2xl bg-white p-4 transition-shadow hover:shadow-md'
								>
									<span className='grid h-11 w-11 place-items-center rounded-full bg-olive-tint text-olive-deep'>
										<Mail className='h-5 w-5' />
									</span>
									<span className='min-w-0'>
										<span className='block text-sm text-ink-muted'>Email</span>
										<span className='block truncate font-medium'>{site.contact.email}</span>
									</span>
								</a>
							</li>
							<li className='flex items-center gap-4 p-4'>
								<span className='grid h-11 w-11 place-items-center rounded-full bg-olive-tint text-olive-deep'>
									<MapPin className='h-5 w-5' />
								</span>
								<span>
									<span className='block text-sm text-ink-muted'>Based in</span>
									<span className='font-medium'>
										{site.contact.city}, {site.contact.country}
									</span>
								</span>
							</li>
						</ul>

						<p className='mt-8 rounded-2xl border border-line bg-white p-4 text-sm text-ink-muted'>
							<strong className='text-ink'>In an emergency</strong>, don&apos;t use this form. Contact your local
							emergency services or go to the nearest hospital emergency department.
						</p>
					</div>

					<div className='rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-36px_rgba(35,37,31,0.45)] sm:p-10'>
						<h2 className='text-3xl'>Message us on WhatsApp</h2>
						<p className='mt-2 mb-6 text-ink-muted'>A few quick details, then send it from your own WhatsApp.</p>
						<ContactForm defaultTopic={defaultTopic} />
					</div>
				</div>
			</Container>
		</section>
	);
}
