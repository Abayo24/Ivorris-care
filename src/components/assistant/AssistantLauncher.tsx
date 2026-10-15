'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useSyncExternalStore } from 'react';

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

function MicIcon({ className = '' }: { className?: string }) {
	return (
		<svg
			viewBox='0 0 24 24'
			className={className}
			fill='none'
			stroke='currentColor'
			strokeWidth={1.8}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
		>
			<rect x='9' y='3' width='6' height='11' rx='3' />
			<path d='M5 11a7 7 0 0 0 14 0M12 18v3' />
		</svg>
	);
}

// Whether this browser can speak replies aloud (read once, on the client only).
const noop = () => () => {};
const canSpeakNow = () => 'speechSynthesis' in window;
const canSpeakOnServer = () => false;

const floating =
	'fixed right-4 z-40 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-pill text-white ring-2 ring-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 sm:right-6 sm:w-auto sm:pr-4 sm:pl-3.5';

/**
 * Floating assistant buttons, stacked above the WhatsApp button:
 * the voice (microphone) button on top, the "Ask Ivorris" chat below it.
 */
export function AssistantLauncher() {
	const [open, setOpen] = useState<false | 'chat' | 'voice'>(false);
	const [loaded, setLoaded] = useState(false);
	const chatRef = useRef<HTMLButtonElement>(null);
	const voiceRef = useRef<HTMLButtonElement>(null);
	const lastOpened = useRef<'chat' | 'voice'>('chat');
	const voiceAvailable = useSyncExternalStore(noop, canSpeakNow, canSpeakOnServer);

	const openAs = (mode: 'chat' | 'voice') => {
		lastOpened.current = mode;
		setLoaded(true);
		setOpen(mode);
	};

	const close = () => {
		setOpen(false);
		// Return focus to the button that opened the assistant.
		requestAnimationFrame(() => (lastOpened.current === 'voice' ? voiceRef : chatRef).current?.focus());
	};

	return (
		<>
			{!open && voiceAvailable && (
				<button
					ref={voiceRef}
					type='button'
					onClick={() => openAs('voice')}
					aria-haspopup='dialog'
					className={`${floating} bottom-[calc(max(1rem,env(safe-area-inset-bottom))+8.5rem)] bg-sun text-ink hover:bg-[#f2b400] sm:bottom-[10rem]`}
				>
					<MicIcon className='h-6 w-6' />
					<span className='hidden text-sm font-semibold sm:inline'>Ask by voice</span>
					<span className='sr-only sm:hidden'>Ask by voice</span>
					<span className='sr-only'> — speak to the Ivorris assistant</span>
				</button>
			)}
			{!open && (
				<button
					ref={chatRef}
					type='button'
					onClick={() => openAs('chat')}
					aria-haspopup='dialog'
					className={`${floating} bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] bg-olive-deep hover:bg-ink sm:bottom-[5.75rem]`}
				>
					<SparkleChat className='h-7 w-7 text-sun' />
					<span className='hidden text-sm font-semibold sm:inline'>Ask Ivorris</span>
					<span className='sr-only sm:hidden'>Ask Ivorris</span>
					<span className='sr-only'> — instant answers about Ivorris</span>
				</button>
			)}
			{loaded && open && <AssistantPanel onClose={close} startWithVoice={open === 'voice'} />}
		</>
	);
}
