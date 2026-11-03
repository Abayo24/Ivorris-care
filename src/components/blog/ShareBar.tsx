'use client';

import { useState } from 'react';

import { Chat } from '@/components/ui/Icons';

/** Share actions shown above and below an article. */
export function ShareBar({ title, url }: { title: string; url: string }) {
	const [copied, setCopied] = useState(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2500);
		} catch {
			window.prompt('Copy this link:', url);
		}
	}

	const buttonClass =
		'inline-flex min-h-10 items-center gap-2 rounded-pill px-3 text-sm text-ink-muted transition-colors hover:bg-cream-soft hover:text-ink';

	return (
		<div className='flex flex-wrap items-center gap-1 border-y border-line py-1.5'>
			<a
				href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
				target='_blank'
				rel='noopener noreferrer'
				className={buttonClass}
			>
				<Chat className='h-4 w-4' /> Share on WhatsApp
				<span className='sr-only'>(opens in a new tab)</span>
			</a>
			<button type='button' onClick={copy} className={buttonClass}>
				<svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
					<path d='M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7' />
				</svg>
				<span aria-live='polite'>{copied ? 'Link copied' : 'Copy link'}</span>
			</button>
		</div>
	);
}
