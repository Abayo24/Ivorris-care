'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { WhatsAppGlyph } from '@/components/layout/WhatsAppFloat';
import { whatsappLink } from '@/content/site';

// The chat window's code only downloads when someone opens it.
const AssistantPanel = dynamic(() => import('./AssistantPanel').then((m) => m.AssistantPanel), {
	ssr: false,
});

function ChatIcon({ className = '' }: { className?: string }) {
	return (
		<svg viewBox='0 0 24 24' className={className} fill='none' stroke='currentColor' strokeWidth={1.75} aria-hidden='true'>
			<path d='M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z' strokeLinejoin='round' />
			<path d='M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01' strokeLinecap='round' strokeWidth={2.5} />
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
			strokeWidth={1.75}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
		>
			<rect x='9' y='3' width='6' height='11' rx='3' />
			<path d='M5 11a7 7 0 0 0 14 0M12 18v3' />
		</svg>
	);
}

// Whether this browser can speak replies aloud (read on the client only).
const noop = () => () => {};
const canSpeakNow = () => 'speechSynthesis' in window;
const canSpeakOnServer = () => false;

const itemClass =
	'group relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-200 focus-visible:outline-offset-2';

/** Label that appears beside a dock button on hover or keyboard focus. */
function Tip({ children }: { children: ReactNode }) {
	return (
		<span
			className='pointer-events-none absolute top-1/2 right-full mr-3 -translate-y-1/2 rounded-md bg-ink px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100'
			aria-hidden='true'
		>
			{children}
		</span>
	);
}

/**
 * Floating dock, bottom-right on every page: ask by voice, ask the assistant,
 * and chat on WhatsApp.
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
			{!open && (
				<nav
					aria-label='Quick help'
					className='fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-1 rounded-full border border-line bg-white/95 p-1.5 shadow-[0_10px_30px_-12px_rgba(35,37,31,0.35)] backdrop-blur sm:right-5 sm:bottom-5'
				>
					{voiceAvailable && (
						<button
							ref={voiceRef}
							type='button'
							onClick={() => openAs('voice')}
							aria-haspopup='dialog'
							className={`${itemClass} text-olive-deep hover:bg-cream`}
						>
							<MicIcon className='h-5 w-5' />
							<span className='sr-only'>Ask by voice</span>
							<Tip>Ask by voice</Tip>
						</button>
					)}
					<button
						ref={chatRef}
						type='button'
						onClick={() => openAs('chat')}
						aria-haspopup='dialog'
						className={`${itemClass} bg-olive text-white hover:bg-olive-deep`}
					>
						<ChatIcon className='h-5 w-5' />
						<span className='sr-only'>Ask Ivorris — instant answers</span>
						<Tip>Ask Ivorris</Tip>
					</button>
					<a
						href={whatsappLink()}
						target='_blank'
						rel='noopener noreferrer'
						className={`${itemClass} text-whatsapp hover:bg-cream`}
					>
						<WhatsAppGlyph className='h-[22px] w-[22px]' />
						<span className='sr-only'>Chat with Ivorris on WhatsApp (opens in a new tab)</span>
						<Tip>Chat on WhatsApp</Tip>
					</a>
				</nav>
			)}
			{loaded && open && <AssistantPanel onClose={close} startWithVoice={open === 'voice'} />}
		</>
	);
}
