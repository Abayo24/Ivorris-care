import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

import { site } from '@/content/site';
import './globals.css';

// Same type pairing as the existing Ivorris site: Cormorant Garamond for
// headings, DM Sans for everything else.
const display = Cormorant_Garamond({
	variable: '--font-cormorant',
	subsets: ['latin'],
	weight: ['500', '600'],
	display: 'swap',
});

const sans = DM_Sans({
	variable: '--font-dm-sans',
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	display: 'swap',
});

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: `${site.name} — Nurse-led healthcare navigation in Nairobi`,
		template: `%s | ${site.name}`,
	},
	description: site.description,
	applicationName: site.name,
	openGraph: { siteName: site.name, locale: site.locale, type: 'website' },
	twitter: { card: 'summary_large_image' },
	formatDetection: { telephone: false },
	category: 'health',
	// Ownership verification for Google Search Console and Bing Webmaster Tools.
	// Paste only the code (content="…" value) into these environment variables.
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
		other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim()
			? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION.trim() }
			: undefined,
	},
};

export const viewport: Viewport = {
	themeColor: '#596042',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en-KE' className={`${display.variable} ${sans.variable}`}>
			<body>{children}</body>
		</html>
	);
}
