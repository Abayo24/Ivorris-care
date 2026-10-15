/**
 * Business details used across the site, metadata and structured data.
 *
 * Phone, WhatsApp, email and city are taken from the previous version of the
 * website. Each can be overridden with an environment variable, so the owner
 * can change them without touching code. Keep them consistent everywhere.
 */

// NEXT_PUBLIC_* values must be read with static property access so Next.js can
// inline them into client bundles.
const env = (value: string | undefined, fallback: string) => value?.trim() || fallback;

const phoneE164 = env(process.env.NEXT_PUBLIC_CONTACT_PHONE, '+254705819115');
const whatsappNumber = env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, '254705819115');

export const site = {
	name: 'Ivorris Care',
	url: env(process.env.NEXT_PUBLIC_SITE_URL, 'https://ivorris-care.vercel.app').replace(/\/$/, ''),
	tagline: 'Connecting you to the right care, people and resources.',
	description:
		'Ivorris Care is a nurse-led healthcare navigation and care coordination service in Nairobi, Kenya. We help individuals and families make sense of their healthcare and care needs, understand their options, and connect with the right support.',
	locale: 'en_KE',
	contact: {
		phoneDisplay: env(process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY, '+254 705 819 115'),
		phoneHref: `tel:${phoneE164}`,
		phoneE164,
		email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'carewithivorris@gmail.com'),
		whatsappNumber,
		city: 'Nairobi',
		country: 'Kenya',
		countryCode: 'KE',
	},
} as const;

/**
 * Intro video shown on the home hero. Set NEXT_PUBLIC_INTRO_VIDEO_URL (with
 * NEXT_PUBLIC_INTRO_VIDEO_TITLE) to use Ivorris's own YouTube video. Until
 * then, a short public explainer on care navigation is shown, credited to its
 * creator so it isn't mistaken for an Ivorris video.
 */
const ownVideoUrl = env(process.env.NEXT_PUBLIC_INTRO_VIDEO_URL, '');

export const introVideo = ownVideoUrl
	? {
			youtubeId: parseYouTubeId(ownVideoUrl),
			title: env(process.env.NEXT_PUBLIC_INTRO_VIDEO_TITLE, 'Ivorris Care in a minute'),
			credit: '',
		}
	: {
			youtubeId: 'n3BWkLLNqa0',
			title: 'What is a care navigator? (1 min)',
			credit: 'Video: Integrated Care Northamptonshire (NHS)',
		};

function parseYouTubeId(value: string) {
	if (/^[\w-]{11}$/.test(value)) return value;
	const match = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
	return match?.[1] ?? '';
}

export function whatsappLink(message = "Hello Ivorris, I'd like to talk about some care support.") {
	return `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const primaryCta = {
	heading: 'Not sure where to start? Talk to Ivorris.',
	body: "Tell us what's going on. We'll help you understand what kind of support may be appropriate and what your next step could be.",
	label: 'Talk to Ivorris',
	href: '/contact',
} as const;

export type NavItem = { label: string; href: string };

export const mainNav: NavItem[] = [
	{ label: 'How we help', href: '/services' },
	{ label: 'Connect & Coordinate', href: '/connect-and-coordinate' },
	{ label: 'How it works', href: '/#how-it-works' },
	{ label: 'Resources', href: '/blog' },
	{ label: 'About', href: '/about' },
];
