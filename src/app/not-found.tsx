import type { Metadata } from 'next';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import NotFoundContent from './(site)/not-found';

export const metadata: Metadata = {
	title: 'Page not found',
	robots: { index: false },
};

/** Handles URLs that don't match any route, with the full site chrome. */
export default function RootNotFound() {
	return (
		<>
			<Header />
			<main id='main'>
				<NotFoundContent />
			</main>
			<Footer />
		</>
	);
}
