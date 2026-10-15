import Link from 'next/link';

import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, type Crumb } from '@/lib/seo';

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, tone = 'dark' }: { items: Crumb[]; tone?: 'dark' | 'light' }) {
	const all = [{ name: 'Home', href: '/' }, ...items];
	const muted = tone === 'light' ? 'text-cream/80' : 'text-ink-muted';
	const current = tone === 'light' ? 'text-white' : 'text-ink';
	return (
		<>
			<nav aria-label='Breadcrumb' className='text-sm'>
				<ol className='flex flex-wrap items-center gap-x-2 gap-y-1'>
					{all.map((c, i) => {
						const last = i === all.length - 1;
						return (
							<li key={c.href} className='flex items-center gap-2'>
								{last ? (
									<span aria-current='page' className={`${current} line-clamp-1`}>
										{c.name}
									</span>
								) : (
									<>
										<Link href={c.href} className={`${muted} hover:underline`}>
											{c.name}
										</Link>
										<span className={muted} aria-hidden='true'>
											/
										</span>
									</>
								)}
							</li>
						);
					})}
				</ol>
			</nav>
			<JsonLd data={breadcrumbJsonLd(all)} />
		</>
	);
}
