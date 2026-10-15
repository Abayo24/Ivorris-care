import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import {
	Activity,
	Apple,
	ArrowUpRight,
	ClipboardHeart,
	Compass,
	Ear,
	HandHelping,
	HomeHeart,
	Hospital,
	Microscope,
	Network,
	Pill,
	ShieldCheck,
	Stethoscope,
	Users,
	Wheelchair,
} from '@/components/ui/Icons';
import type { Service } from '@/content/services';
import type { Situation } from '@/content/home';

const icons = {
	compass: Compass,
	hospital: Hospital,
	home: HomeHeart,
	network: Network,
	users: Users,
	stethoscope: Stethoscope,
	activity: Activity,
	hand: HandHelping,
	apple: Apple,
	wheelchair: Wheelchair,
	microscope: Microscope,
	pill: Pill,
	shield: ShieldCheck,
	ear: Ear,
	clipboard: ClipboardHeart,
} as const;

export type IconName = keyof typeof icons;

export function IconBadge({ name, tone = 'olive' }: { name: IconName; tone?: 'olive' | 'cream' }) {
	const Icon = icons[name];
	const styles = tone === 'olive' ? 'bg-olive-tint text-olive-deep' : 'bg-cream text-olive-deep';
	return (
		<span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${styles}`}>
			<Icon className='h-6 w-6' />
		</span>
	);
}

/** Situation-based entry card — the visitor recognises their circumstance. */
export function SituationCard({ situation }: { situation: Situation }) {
	return (
		<Link
			href={situation.href}
			className='group flex h-full flex-col rounded-card border border-line bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-olive hover:shadow-[0_12px_32px_-16px_rgba(35,37,31,0.25)] sm:p-7'
		>
			<IconBadge name={situation.icon} />
			<p className='mt-6 font-display text-[1.55rem] leading-snug text-ink'>“{situation.quote}”</p>
			<p className='mt-3 text-[0.95rem] text-ink-muted'>{situation.body}</p>
			<span className='mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-olive-deep'>
				{situation.linkLabel}
				<ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
			</span>
		</Link>
	);
}

/** Nurse-led service card with image. */
export function ServiceCard({ service, index }: { service: Service; index: number }) {
	return (
		<Link
			href={`/services/${service.slug}`}
			className='group flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface transition-shadow duration-200 hover:shadow-[0_16px_40px_-20px_rgba(35,37,31,0.35)]'
		>
			<div className='relative aspect-[4/3] overflow-hidden bg-cream'>
				<Image
					src={service.image.src}
					alt=''
					fill
					sizes='(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'
					className='object-cover transition-transform duration-500 group-hover:scale-[1.03]'
				/>
				<span className='absolute top-4 left-4 rounded-pill bg-white/95 px-3 py-1 text-xs font-semibold text-ink'>
					{String(index + 1).padStart(2, '0')} · Nurse-led
				</span>
			</div>
			<div className='flex flex-1 flex-col p-6'>
				<h3 className='text-2xl'>{service.name}</h3>
				<p className='mt-2 text-[0.95rem] text-ink-muted'>{service.forSituation}</p>
				<span className='mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-olive-deep'>
					Learn more<span className='sr-only'> about {service.name}</span>
					<ArrowUpRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' />
				</span>
			</div>
		</Link>
	);
}

export function FeatureItem({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
	return (
		<div className='flex gap-4'>
			<IconBadge name={icon} tone='cream' />
			<div>
				<h3 className='font-sans text-base font-semibold'>{title}</h3>
				<p className='mt-1.5 text-[0.95rem] text-ink-muted'>{children}</p>
			</div>
		</div>
	);
}
