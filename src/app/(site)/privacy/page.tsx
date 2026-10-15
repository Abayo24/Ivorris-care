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
					<h2>What the website collects</h2>
					<p>
						Very little. The contact form doesn&apos;t send anything to us or store anything: it prepares a
						WhatsApp message with your name, the topic you choose and any short note you add, and opens it in
						your own WhatsApp so you can review it and decide whether to send it.
					</p>
					<p>
						Please don&apos;t include medical records or detailed health information. We&apos;ll discuss your
						situation with you directly.
					</p>
					<h2>The &ldquo;Ask Ivorris&rdquo; assistant</h2>
					<p>
						The chat assistant gives automated answers about Ivorris. It runs entirely in your browser: what you
						type is not sent to us or to any other service, and it isn&apos;t stored. It can&apos;t give
						medical advice. If you choose &ldquo;Continue on WhatsApp&rdquo;, a short summary of what you asked
						is prepared in WhatsApp for you to review and send.
					</p>
					<h2>When you message or call us</h2>
					<p>
						Messages you send on WhatsApp, and calls or emails, reach our team directly. We use them only to
						respond to you and to help with your enquiry, and we do not sell your information. WhatsApp (Meta)
						and your phone or email provider also handle these messages under their own privacy terms.
					</p>
					<h2>Technical information</h2>
					<p>
						Our hosting provider may keep basic technical logs (such as error logs) for security and
						troubleshooting. If you play the video on our home page, it is loaded from YouTube&apos;s
						privacy-enhanced player, and YouTube&apos;s privacy terms apply.
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
