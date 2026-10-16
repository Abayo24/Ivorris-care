import { connectCategories } from '@/content/connect';
import { equipmentCategories, leaseTerms } from '@/content/equipment';
import { homeFaqs, processSteps } from '@/content/home';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { absoluteUrl } from '@/lib/seo';

/*
 * /llms.txt — a plain summary of Ivorris Care for AI assistants and answer
 * engines (the llms.txt convention). Built from the same content files as the
 * website, so it always matches the pages.
 */
export const dynamic = 'force-static';

export function GET() {
	const lines = [
		`# ${site.name}`,
		'',
		`> ${site.description}`,
		'',
		`${site.name} is a nurse-led home-based care, healthcare navigation and care coordination service in ${site.contact.city}, ${site.contact.country}. People can contact Ivorris without knowing what service they need — they can start by describing what is going on. Ivorris is not an emergency service and is not primarily a caregiver agency.`,
		'',
		'## Contact',
		`- WhatsApp or phone: ${site.contact.phoneDisplay}`,
		`- Email: ${site.contact.email}`,
		`- Location: ${site.contact.city}, ${site.contact.country}`,
		`- Contact page: ${absoluteUrl('/contact')}`,
		'',
		'## Nurse-led services provided directly by Ivorris',
		...services.map((s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.forSituation} ${s.definition.answer}`),
		'',
		'## Connect & Coordinate (support provided by others, which Ivorris helps people find)',
		`- [Connect & Coordinate](${absoluteUrl('/connect-and-coordinate')}): ${connectCategories.map((c) => c.title.toLowerCase()).join('; ')}. Subject to availability and suitability.`,
		'',
		'## Medical equipment for hire in Nairobi',
		`- [Equipment hire](${absoluteUrl('/equipment')}): ${equipmentCategories.map((c) => `${c.name.toLowerCase()} (${c.items.join(', ')})`).join('; ')}.`,
		`- Lease periods: ${leaseTerms.map((t) => `${t.label.toLowerCase()} (${t.period})`).join(', ')}. Stock and prices are confirmed by the Ivorris team.`,
		'',
		'## How Ivorris works',
		...processSteps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`),
		'',
		'## Frequently asked questions',
		...homeFaqs.flatMap((f) => [`### ${f.question}`, f.answer, '']),
		'## Key pages',
		`- [Home](${absoluteUrl('/')})`,
		`- [Home care services](${absoluteUrl('/services')})`,
		`- [About Ivorris](${absoluteUrl('/about')})`,
		`- [Guides for families](${absoluteUrl('/blog')})`,
		'',
	];
	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600, s-maxage=86400',
		},
	});
}
