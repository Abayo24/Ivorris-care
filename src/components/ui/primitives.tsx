import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { ArrowUpRight } from './Icons';

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
	return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

/** Small pill label above section headings. */
export function Eyebrow({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'light' }) {
	const styles =
		tone === 'light' ? 'border-cream/30 text-cream' : 'border-line bg-surface text-ink-muted';
	return (
		<span
			className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-xs font-medium ${styles}`}
		>
			<span className='h-1.5 w-1.5 rounded-full bg-sun' aria-hidden='true' />
			{children}
		</span>
	);
}

export function SectionHeading({
	eyebrow,
	title,
	intro,
	align = 'left',
	id,
	as: Tag = 'h2',
}: {
	eyebrow?: string;
	title: ReactNode;
	intro?: ReactNode;
	align?: 'left' | 'center';
	id?: string;
	as?: 'h1' | 'h2';
}) {
	const center = align === 'center';
	return (
		<div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
			{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
			<Tag id={id} className={`text-3xl sm:text-4xl lg:text-[2.75rem] ${eyebrow ? 'mt-4' : ''}`}>
				{title}
			</Tag>
			{intro && <p className='mt-4 text-base text-ink-muted sm:text-lg'>{intro}</p>}
		</div>
	);
}

type Variant = 'primary' | 'secondary' | 'light' | 'ghost';

const variantStyles: Record<Variant, string> = {
	primary: 'bg-olive text-white hover:bg-olive-deep',
	secondary: 'border border-ink/20 bg-surface text-ink hover:border-olive hover:text-olive-deep',
	light: 'bg-cream text-ink hover:bg-white',
	ghost: 'border border-cream/40 text-cream hover:bg-cream/10',
};

type ButtonLinkProps = ComponentProps<typeof Link> & {
	variant?: Variant;
	icon?: boolean;
};

/** Pill button styled link — the arrow badge echoes the reference design. */
export function ButtonLink({ variant = 'primary', icon = true, className = '', children, ...props }: ButtonLinkProps) {
	const badge =
		variant === 'primary'
			? 'bg-sun text-ink'
			: variant === 'ghost'
				? 'bg-cream text-ink'
				: 'bg-olive text-white';
	return (
		<Link
			className={`group inline-flex min-h-12 items-center justify-center gap-3 rounded-pill py-2 pr-2 pl-6 text-[0.95rem] font-medium transition-colors duration-200 ${icon ? '' : 'pr-6'} ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
			{icon && (
				<span
					className={`grid h-8 w-8 place-items-center rounded-full transition-transform duration-200 group-hover:rotate-45 ${badge}`}
					aria-hidden='true'
				>
					<ArrowUpRight className='h-4 w-4' />
				</span>
			)}
		</Link>
	);
}

/** Underlined text link with arrow, for "Learn more" style actions. */
export function TextLink({ className = '', children, ...props }: ComponentProps<typeof Link>) {
	return (
		<Link
			className={`group inline-flex items-center gap-1.5 font-medium text-olive-deep underline decoration-olive/30 underline-offset-4 transition-colors hover:decoration-olive ${className}`}
			{...props}
		>
			{children}
			<ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
		</Link>
	);
}
