import Link from 'next/link';

import { ButtonLink, Container } from '@/components/ui/primitives';
import { primaryCta } from '@/content/site';

export default function NotFound() {
	return (
		<Container className='pt-40 pb-24 text-center sm:pt-48 sm:pb-32'>
			<p className='font-display text-7xl text-olive'>404</p>
			<h1 className='mt-4 text-4xl sm:text-5xl'>We couldn&apos;t find that page</h1>
			<p className='mx-auto mt-4 max-w-lg text-lg text-ink-muted'>
				It may have moved, or the link may be out of date. If you were looking for help, you&apos;re in the right
				place — just ask us.
			</p>
			<div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
				<ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
				<ButtonLink href='/' variant='secondary' icon={false}>
					Go to the home page
				</ButtonLink>
			</div>
			<p className='mt-10 text-sm text-ink-muted'>
				Or explore{' '}
				<Link href='/services' className='underline underline-offset-4'>
					how we help
				</Link>{' '}
				and{' '}
				<Link href='/blog' className='underline underline-offset-4'>
					our articles
				</Link>
				.
			</p>
		</Container>
	);
}
