'use client';

import { useEffect } from 'react';

import { Container } from '@/components/ui/primitives';
import { site } from '@/content/site';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Container className='pt-40 pb-24 text-center sm:pt-48 sm:pb-32'>
			<h1 className='text-4xl sm:text-5xl'>Something went wrong</h1>
			<p className='mx-auto mt-4 max-w-lg text-lg text-ink-muted'>
				Sorry — this page didn&apos;t load properly. Please try again. If you need to talk to us, call{' '}
				<a href={site.contact.phoneHref} className='font-medium text-ink underline underline-offset-4'>
					{site.contact.phoneDisplay}
				</a>
				.
			</p>
			<button
				type='button'
				onClick={reset}
				className='mt-8 inline-flex min-h-12 items-center rounded-pill bg-olive px-8 font-medium text-white hover:bg-olive-deep'
			>
				Try again
			</button>
		</Container>
	);
}
