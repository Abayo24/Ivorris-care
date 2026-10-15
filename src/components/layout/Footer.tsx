import Link from 'next/link';

import { Logo } from '@/components/brand/Logo';
import { Chat, Mail, MapPin, Phone } from '@/components/ui/Icons';
import { Container } from '@/components/ui/primitives';
import { services } from '@/content/services';
import { site, whatsappLink } from '@/content/site';

const explore = [
	{ label: 'How we help', href: '/services' },
	{ label: 'Connect & Coordinate', href: '/connect-and-coordinate' },
	{ label: 'Medical equipment', href: '/equipment' },
	{ label: 'Resources & articles', href: '/blog' },
	{ label: 'About Ivorris', href: '/about' },
	{ label: 'Contact', href: '/contact' },
];

export function Footer() {
	const year = new Date().getFullYear();
	return (
		<footer className='bg-olive-deep text-cream'>
			<Container className='py-16'>
				<div className='grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]'>
					<div>
						<Logo tone='light' />
						<p className='mt-5 max-w-xs text-sm leading-relaxed text-cream/85'>{site.tagline}</p>
						<p className='mt-4 max-w-xs text-sm leading-relaxed text-cream/70'>
							A nurse-led healthcare navigation and care coordination service.
						</p>
					</div>

					<nav aria-labelledby='footer-services'>
						<h2 id='footer-services' className='font-sans text-sm font-semibold text-white'>
							Nurse-led services
						</h2>
						<ul className='mt-4 space-y-2.5 text-sm'>
							{services.map((s) => (
								<li key={s.slug}>
									<Link href={`/services/${s.slug}`} className='text-cream/80 hover:text-white hover:underline'>
										{s.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-labelledby='footer-explore'>
						<h2 id='footer-explore' className='font-sans text-sm font-semibold text-white'>
							Explore
						</h2>
						<ul className='mt-4 space-y-2.5 text-sm'>
							{explore.map((l) => (
								<li key={l.href}>
									<Link href={l.href} className='text-cream/80 hover:text-white hover:underline'>
										{l.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<h2 className='font-sans text-sm font-semibold text-white'>Talk to us</h2>
						<ul className='mt-4 space-y-3 text-sm'>
							<li>
								<a href={site.contact.phoneHref} className='inline-flex items-center gap-2.5 text-cream/85 hover:text-white'>
									<Phone className='h-4 w-4 text-sun' /> {site.contact.phoneDisplay}
								</a>
							</li>
							<li>
								<a
									href={whatsappLink()}
									target='_blank'
									rel='noopener noreferrer'
									className='inline-flex items-center gap-2.5 text-cream/85 hover:text-white'
								>
									<Chat className='h-4 w-4 text-sun' /> WhatsApp us
									<span className='sr-only'>(opens in a new tab)</span>
								</a>
							</li>
							<li>
								<a
									href={`mailto:${site.contact.email}`}
									className='inline-flex items-center gap-2.5 break-all text-cream/85 hover:text-white'
								>
									<Mail className='h-4 w-4 shrink-0 text-sun' /> {site.contact.email}
								</a>
							</li>
							<li className='inline-flex items-center gap-2.5 text-cream/85'>
								<MapPin className='h-4 w-4 text-sun' /> {site.contact.city}, {site.contact.country}
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-14 rounded-card border border-cream/15 p-5 text-sm text-cream/80'>
					<strong className='font-semibold text-white'>In an emergency</strong> — if someone is seriously unwell,
					injured or in danger, contact your local emergency services or go to the nearest hospital emergency
					department. Ivorris is not an emergency service.
				</div>

				<div className='mt-10 flex flex-col gap-4 border-t border-cream/15 pt-6 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between'>
					<p>© {year} Ivorris Care. All rights reserved.</p>
					<ul className='flex gap-5'>
						<li>
							<Link href='/privacy' className='hover:text-white hover:underline'>
								Privacy notice
							</Link>
						</li>
						<li>
							<Link href='/contact' className='hover:text-white hover:underline'>
								Contact
							</Link>
						</li>
					</ul>
				</div>
			</Container>
		</footer>
	);
}
