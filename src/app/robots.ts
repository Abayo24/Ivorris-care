import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo';

// Search and AI-answer crawlers are explicitly welcome, so Ivorris can appear in
// search results and AI assistant answers. Private routes stay off-limits.
const AI_CRAWLERS = [
	'GPTBot',
	'OAI-SearchBot',
	'ChatGPT-User',
	'ClaudeBot',
	'Claude-SearchBot',
	'PerplexityBot',
	'Google-Extended',
	'Applebot-Extended',
	'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
	const disallow = ['/studio', '/api/'];
	return {
		rules: [{ userAgent: '*', allow: '/', disallow }, ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: '/', disallow }))],
		sitemap: absoluteUrl('/sitemap.xml'),
		host: absoluteUrl('/'),
	};
}
