import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/sections/PageHero';
import { Container } from '@/components/ui/primitives';
import { site } from '@/content/site';
import { pageMetadata } from '@/lib/seo';

/*
 * OWNER ACTION: this notice describes how the website itself handles data.
 * Have it reviewed against your obligations under Kenya's Data Protection Act,
 * 2019 (including any ODPC registration) before relying on it.
 */

export const metadata: Metadata = pageMetadata({
	title: 'Privacy notice',
	description: 'How the Ivorris Care website collects and uses the information you send us.',
	path: '/privacy',
});

export default function PrivacyPage() {
	return (
		<>
			<PageHero crumbs={[{ name: 'Privacy notice', href: '/privacy' }]} title='Privacy notice' />
			<Container className='py-16'>
				<div className='prose-ivorris max-w-3xl'>
					<p>
						This notice explains how {site.name} handles information you share through this website. We collect
						as little as we need to respond to you.
					</p>
					<h2>What we collect</h2>
					<p>When you use our contact form we receive:</p>
					<ul>
						<li>your name;</li>
						<li>how you would like to be contacted, and your phone number and/or email address;</li>
						<li>the general topic of your enquiry; and</li>
						<li>any short message you choose to include.</li>
					</ul>
					<p>
						Please don&apos;t send medical records or detailed health information through the form. We&apos;ll
						discuss your situation with you directly.
					</p>
					<h2>How we use it</h2>
					<p>
						We use these details only to respond to your enquiry. We do not sell your information or use it for
						marketing without your permission.
					</p>
					<h2>How it is handled</h2>
					<p>
						Form submissions are sent to our team by email through a secure email delivery provider. The website
						does not store them in a database. Basic technical logs (such as error logs) may be kept by our hosting
						provider for security and troubleshooting.
					</p>
					<p>
						If you contact us by phone, WhatsApp or email, those services&apos; own privacy terms also apply to the
						messages you send.
					</p>
					<h2>Your choices</h2>
					<p>
						You can ask us what information we hold about you, or ask us to correct or delete it, by emailing{' '}
						<a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or calling{' '}
						<a href={site.contact.phoneHref}>{site.contact.phoneDisplay}</a>.
					</p>
					<h2>Questions</h2>
					<p>
						If you have any questions about this notice, please <Link href='/contact'>get in touch</Link>.
					</p>
				</div>
			</Container>
		</>
	);
}
