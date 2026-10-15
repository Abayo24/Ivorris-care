'use client';

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

// The chat window's code only downloads when someone opens it.
const AssistantPanel = dynamic(() => import('./AssistantPanel').then((m) => m.AssistantPanel), {
	ssr: false,
});

function SparkleChat({ className = '' }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' className={className} fill='none' stroke='currentColor' strokeWidth={1.75} aria-hidden='true'>
			<path d='M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z' strokeLinejoin='round' />
			<path d='M12 7.5v2M12 13.5v2M8.5 11.5h2M13.5 11.5h2' strokeLinecap='round' />
		</svg>
	);
}

/** Floating "Ask Ivorris" button that opens the AI assistant, stacked above the WhatsApp button. */
export function AssistantLauncher() {
	const [open, setOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);

	const close = () => {
		setOpen(false);
		buttonRef.current?.focus();
	};

	return (
		<>
			{!open && (
				<button
					ref={buttonRef}
					type='button'
					onClick={() => {
						setLoaded(true);
						setOpen(true);
					}}
					aria-haspopup='dialog'
					className='fixed right-4 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] z-40 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-pill bg-olive-deep text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-ink sm:right-6 sm:bottom-[5.75rem] sm:w-auto sm:pr-4 sm:pl-3.5'
				>
					<SparkleChat className='h-7 w-7 text-sun' />
					<span className='hidden text-sm font-semibold sm:inline'>Ask Ivorris</span>
					<span className='sr-only sm:hidden'>Ask Ivorris</span>
					<span className='sr-only'> — instant answers about Ivorris</span>
				</button>
			)}
			{loaded && open && <AssistantPanel onClose={close} />}
		</>
	);
}
