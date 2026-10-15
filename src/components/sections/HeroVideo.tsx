'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

import { Close } from '@/components/ui/Icons';

/**
 * Floating video thumbnail for the hero, after the reference design. The
 * YouTube player only loads when someone presses play, so it costs nothing
 * on page load, and it uses youtube-nocookie.com for privacy.
 */
export function HeroVideo({ youtubeId, title, credit }: { youtubeId: string; title: string; credit?: string }) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [playing, setPlaying] = useState(false);

	const open = () => {
		setPlaying(true);
		dialogRef.current?.showModal();
	};
	const close = () => dialogRef.current?.close();

	return (
		<>
			<button
				type='button'
				onClick={open}
				aria-haspopup='dialog'
				className='group flex w-full items-center gap-4 rounded-2xl border border-white/20 bg-black/45 p-2.5 pr-5 text-left text-white backdrop-blur-md transition-colors hover:bg-black/60 sm:w-[22rem]'
			>
				<span className='relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-black'>
					<Image
						src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
						alt=''
						fill
						sizes='128px'
						className='object-cover opacity-90 transition-transform duration-500 group-hover:scale-105'
					/>
					<span className='absolute inset-0 grid place-items-center' aria-hidden='true'>
						<span className='grid h-10 w-10 place-items-center rounded-full bg-white/95 text-olive-deep shadow-lg transition-transform group-hover:scale-110'>
							<svg viewBox='0 0 24 24' className='ml-0.5 h-4 w-4' fill='currentColor'>
								<path d='M8 5.5v13l11-6.5-11-6.5Z' />
							</svg>
						</span>
					</span>
				</span>
				<span>
					<span className='block text-xs font-semibold tracking-[0.12em] text-sun uppercase'>Watch</span>
					<span className='mt-1 block text-sm leading-snug font-medium'>{title}</span>
					{credit && <span className='mt-0.5 block text-xs text-white/75'>{credit}</span>}
				</span>
			</button>

			<dialog
				ref={dialogRef}
				aria-label={title}
				onClose={() => setPlaying(false)}
				onClick={(e) => e.target === e.currentTarget && close()}
				className='m-auto w-[min(960px,calc(100vw-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-black/80 backdrop:backdrop-blur-sm'
			>
				<div className='relative'>
					<button
						type='button'
						onClick={close}
						className='absolute -top-12 right-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink'
					>
						<Close className='h-5 w-5' />
						<span className='sr-only'>Close video</span>
					</button>
					<div className='aspect-video overflow-hidden rounded-2xl bg-black'>
						{playing && (
							<iframe
								src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
								title={title}
								allow='autoplay; encrypted-media; picture-in-picture; fullscreen'
								allowFullScreen
								className='h-full w-full'
							/>
						)}
					</div>
				</div>
			</dialog>
		</>
	);
}
