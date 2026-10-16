import type { Metadata } from 'next';

import { site } from '@/content/site';
import type { Faq } from '@/content/services';

export const absoluteUrl = (path = '/') => `${site.url}${path.startsWith('/') ? path : `/${path}`}`;

type PageMetaInput = {
	title: string;
	description: string;
	path: string;
	image?: { url: string; width?: number; height?: number; alt?: string };
	type?: 'website' | 'article';
	publishedTime?: string;
	modifiedTime?: string;
	noIndex?: boolean;
};

/** Consistent metadata (title, description, canonical, Open Graph, Twitter) for a page. */
export function pageMetadata({
	title,
	description,
	path,
	image,
	type = 'website',
	publishedTime,
	modifiedTime,
	noIndex,
}: PageMetaInput): Metadata {
	const url = absoluteUrl(path);
	const images = image ? [{ ...image, alt: image.alt ?? title }] : undefined;
	return {
		title,
		description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description,
			url,
			siteName: site.name,
			locale: site.locale,
			type,
			...(images ? { images } : {}),
			...(type === 'article' ? { publishedTime, modifiedTime } : {}),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			...(images ? { images: images.map((i) => i.url) } : {}),
		},
		...(noIndex ? { robots: { index: false, follow: true } } : {}),
	};
}

/* ── JSON-LD builders. Only accurate, visible information is included. ─────── */

export const organizationId = `${site.url}/#organization`;

export function organizationJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': organizationId,
		name: site.name,
		url: site.url,
		logo: absoluteUrl('/logo-mark.png'),
		description: site.description,
		slogan: site.tagline,
		email: site.contact.email,
		telephone: site.contact.phoneE164,
		address: {
			'@type': 'PostalAddress',
			addressLocality: site.contact.city,
			addressCountry: site.contact.countryCode,
		},
		areaServed: [
			{ '@type': 'City', name: site.contact.city },
			{ '@type': 'Country', name: site.contact.country },
		],
		knowsAbout: [
			'Home-based care',
			'Home nursing',
			'Care needs assessment',
			'Elderly care at home',
			'Care after hospital discharge',
			'Post-operative care at home',
			'Family caregiver guidance',
			'Healthcare navigation',
			'Care coordination',
			'Medical equipment hire',
		],
		contactPoint: {
			'@type': 'ContactPoint',
			contactType: 'customer support',
			telephone: site.contact.phoneE164,
			email: site.contact.email,
			url: absoluteUrl('/contact'),
			areaServed: site.contact.countryCode,
			availableLanguage: ['en'],
		},
	};
}

export function websiteJsonLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': `${site.url}/#website`,
		name: site.name,
		url: site.url,
		publisher: { '@id': organizationId },
		description: site.description,
		inLanguage: 'en-KE',
	};
}

export type Crumb = { name: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: absoluteUrl(c.href),
		})),
	};
}

export function faqJsonLd(faqs: Faq[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.question,
			acceptedAnswer: { '@type': 'Answer', text: f.answer },
		})),
	};
}

export function serviceJsonLd(s: { name: string; description: string; path: string; serviceType?: string }) {
	return {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: s.name,
		serviceType: s.serviceType ?? s.name,
		description: s.description,
		url: absoluteUrl(s.path),
		provider: { '@id': organizationId },
		areaServed: { '@type': 'City', name: site.contact.city },
		audience: { '@type': 'Audience', audienceType: 'Individuals and families arranging care at home' },
		// Delivered where the person lives.
		providerMobility: 'dynamic',
	};
}

/** Equipment available to hire, without prices (those are confirmed by the team). */
export function equipmentCatalogJsonLd(categories: { name: string; items: string[] }[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'OfferCatalog',
		name: `Medical equipment for hire in ${site.contact.city}`,
		url: absoluteUrl('/equipment'),
		itemListElement: categories.map((c) => ({
			'@type': 'OfferCatalog',
			name: c.name,
			itemListElement: c.items.map((item) => ({
				'@type': 'Offer',
				businessFunction: 'http://purl.org/goodrelations/v1#LeaseOut',
				areaServed: { '@type': 'City', name: site.contact.city },
				seller: { '@id': organizationId },
				itemOffered: { '@type': 'Product', name: item },
			})),
		})),
	};
}
