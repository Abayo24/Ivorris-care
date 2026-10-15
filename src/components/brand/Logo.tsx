import Link from 'next/link';

import { LOGO_MARK_PATH } from './logoPath';

export function LogoMark({ className = '' }: { className?: string }) {
	return (
		<svg viewBox='0 0 435 341' className={className} aria-hidden='true' focusable='false'>
			<path fillRule='evenodd' clipRule='evenodd' d={LOGO_MARK_PATH} fill='currentColor' />
		</svg>
	);
}

/** Mark + wordmark, linking home. `tone="light"` is for dark backgrounds. */
export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
	const color = tone === 'light' ? 'text-cream' : 'text-olive';
	return (
		<Link href='/' className={`inline-flex shrink-0 items-center gap-2.5 ${color}`} aria-label='Ivorris Care — home'>
			<LogoMark className='h-8 w-auto' />
			<span className='font-display text-[1.6rem] font-semibold leading-none tracking-[0.01em] whitespace-nowrap'>
				Ivorris Care
			</span>
		</Link>
	);
}
