import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AssistantLauncher } from '@/components/assistant/AssistantLauncher';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<a
				href='#main'
				className='sr-only z-50 rounded-pill bg-olive px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
			>
				Skip to main content
			</a>
			<Header />
			<main id='main' tabIndex={-1} className='outline-none'>
				{children}
			</main>
			<Footer />
			<AssistantLauncher />
			<JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
		</>
	);
}
