import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const securityHeaders = [
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'X-Frame-Options', value: 'SAMEORIGIN' },
	{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(self), geolocation=(), payment=(), usb=(), interest-cohort=()',
	},
	{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/*
 * Content-Security-Policy for the public site. Pages are statically rendered
 * (fast, cacheable), so inline Next.js bootstrap scripts are allowed with
 * 'unsafe-inline' rather than per-request nonces, which would force every page
 * to render dynamically. Everything else is locked to this site, Sanity's
 * image CDN/API (images and draft previews), the intro video (YouTube's
 * privacy-enhanced player) and Vercel's preview toolbar.
 * Not applied in development, where hot reloading needs eval and websockets.
 */
const siteCsp = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' https://vercel.live",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https://cdn.sanity.io https://i.ytimg.com",
	"font-src 'self'",
	"connect-src 'self' https://*.sanity.io wss://*.sanity.io https://vercel.live",
	"frame-src 'self' https://www.youtube-nocookie.com https://vercel.live",
	"frame-ancestors 'self'",
	"form-action 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	'upgrade-insecure-requests',
].join('; ');

// The Studio loads its own assets and talks to Sanity's APIs; keep it framed only by this site.
const studioCsp = ["frame-ancestors 'self'", "base-uri 'self'", "object-src 'none'"].join('; ');

const nextConfig: NextConfig = {
	poweredByHeader: false,
	turbopack: { root: process.cwd() },
	// The whole stylesheet is ~11 KB, so inlining it avoids a render-blocking request.
	experimental: { inlineCss: true },
	images: {
		formats: ['image/avif', 'image/webp'],
		remotePatterns: [
			{ protocol: 'https', hostname: 'cdn.sanity.io' },
			// Intro video thumbnail.
			{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
		],
		// Optimised images are keyed by source, size and quality; cache them for 31 days.
		minimumCacheTTL: 2678400,
	},
	async headers() {
		return [
			{ source: '/:path*', headers: securityHeaders },
			...(isProd
				? [
						{ source: '/((?!studio).*)', headers: [{ key: 'Content-Security-Policy', value: siteCsp }] },
						{ source: '/studio/:path*', headers: [{ key: 'Content-Security-Policy', value: studioCsp }] },
					]
				: []),
			{
				source: '/photos/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
			},
			{
				// The Studio and preview endpoints must never be indexed.
				source: '/studio/:path*',
				headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
			},
			{ source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
		];
	},
	async redirects() {
		// The previous site was a single page; these catch likely old or guessed URLs.
		return [
			{ source: '/home', destination: '/', permanent: true },
			{ source: '/packages', destination: '/services', permanent: true },
			{ source: '/services/nursing', destination: '/services/home-nursing', permanent: true },
			{ source: '/lease-equipment', destination: '/equipment', permanent: true },
			{ source: '/equipment-leasing', destination: '/equipment', permanent: true },
			{ source: '/articles/:slug*', destination: '/blog/:slug*', permanent: true },
			{ source: '/resources', destination: '/blog', permanent: true },
		];
	},
};

export default nextConfig;
