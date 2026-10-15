import Image from 'next/image';
import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/sections/Breadcrumbs';
import { Container, Eyebrow } from '@/components/ui/primitives';
import type { Crumb } from '@/lib/seo';

/** Header band for inner pages: breadcrumbs, eyebrow, H1, intro and optional photo. */
export function PageHero({
	crumbs,
	eyebrow,
	title,
	intro,
	image,
	children,
}: {
	crumbs: Crumb[];
	eyebrow?: string;
	title: ReactNode;
	intro?: ReactNode;
	image?: { src: string; alt: string };
	children?: ReactNode;
}) {
	return (
		<section className='bg-cream-soft'>
			<Container className='pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pt-34 lg:pb-16'>
				<Breadcrumbs items={crumbs} />
				<div
					className={`mt-8 grid gap-10 ${image ? 'lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14' : ''}`}
				>
					<div className='max-w-3xl'>
						{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
						<h1 className={`text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem] ${eyebrow ? 'mt-4' : ''}`}>
							{title}
						</h1>
						{intro && <div className='mt-5 text-lg text-ink-muted'>{intro}</div>}
						{children && <div className='mt-8'>{children}</div>}
					</div>
					{image && (
						<div className='relative aspect-[4/3] overflow-hidden rounded-[1.75rem]'>
							<Image
								src={image.src}
								alt={image.alt}
								fill
								preload
								fetchPriority='high'
								loading='eager'
								sizes='(min-width: 1024px) 42vw, 100vw'
								className='object-cover object-[50%_30%]'
							/>
						</div>
					)}
				</div>
			</Container>
		</section>
	);
}
