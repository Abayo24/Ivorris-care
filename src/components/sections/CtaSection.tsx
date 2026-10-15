import { Chat, Phone } from '@/components/ui/Icons';
import { ButtonLink, Container } from '@/components/ui/primitives';
import { primaryCta, site, whatsappLink } from '@/content/site';

/** The site-wide conversation CTA. `heading`/`body` can be tailored per page. */
export function CtaSection({
	heading = primaryCta.heading,
	body = primaryCta.body,
	whatsappMessage,
}: {
	heading?: string;
	body?: string;
	whatsappMessage?: string;
}) {
	return (
		<section aria-labelledby='cta-heading' className='py-16 sm:py-20'>
			<Container>
				<div className='relative overflow-hidden rounded-[1.75rem] bg-olive px-6 py-12 text-cream sm:px-12 sm:py-16'>
					<div
						className='pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full border-[28px] border-sun/15'
						aria-hidden='true'
					/>
					<div className='relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end'>
						<div>
							<h2 id='cta-heading' className='text-3xl text-white sm:text-4xl lg:text-5xl'>
								{heading}
							</h2>
							<p className='mt-5 max-w-xl text-base text-cream/90 sm:text-lg'>{body}</p>
						</div>
						<div className='flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-stretch'>
							<ButtonLink href={primaryCta.href} variant='light'>
								{primaryCta.label}
							</ButtonLink>
							<div className='flex gap-3'>
								<a
									href={site.contact.phoneHref}
									className='inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-pill border border-cream/40 px-5 text-sm font-medium text-cream hover:bg-cream/10'
								>
									<Phone className='h-4 w-4' /> Call us
								</a>
								<a
									href={whatsappLink(whatsappMessage)}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-pill border border-cream/40 px-5 text-sm font-medium text-cream hover:bg-cream/10'
								>
									<Chat className='h-4 w-4' /> WhatsApp
									<span className='sr-only'>(opens in a new tab)</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
