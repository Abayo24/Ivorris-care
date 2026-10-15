import { VisualEditing } from 'next-sanity/visual-editing';
import { draftMode } from 'next/headers';
import Link from 'next/link';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
	const isDraft = (await draftMode()).isEnabled;
	return (
		<>
			<a
				href='#main'
				className='sr-only z-50 rounded-pill bg-olive px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
			>
				Skip to main content
			</a>
			{isDraft && (
				<div role='status' className='fixed inset-x-0 bottom-0 z-50 bg-sun px-4 py-2 text-center text-sm font-medium text-ink'>
					Preview mode — you are seeing unpublished drafts.{' '}
					<Link href='/api/draft-mode/disable' prefetch={false} className='underline'>
						Exit preview
					</Link>
				</div>
			)}
			<Header />
			<main id='main' tabIndex={-1} className='outline-none'>
				{children}
			</main>
			<Footer />
			<WhatsAppFloat />
			<AssistantLauncher />
			<JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
			{isDraft && <VisualEditing />}
		</>
	);
}
