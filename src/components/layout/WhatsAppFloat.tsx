import { whatsappLink } from '@/content/site';

/** Speech bubble with a phone handset, in WhatsApp's green. */
function WhatsAppGlyph({ className = '' }: { className?: string }) {
	return (
		<svg viewBox='0 0 32 32' className={className} aria-hidden='true' focusable='false'>
			<path
				fill='currentColor'
				d='M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 6.9L3.3 29l6.5-1.7c1.9 1 4 1.6 6.2 1.6 7.2 0 13-5.7 13-12.8S23.2 3 16 3Zm0 23.5c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.8 1 1-3.7-.3-.4a10.4 10.4 0 0 1-1.6-5.6C5.3 10 10.1 5.3 16 5.3S26.7 10 26.7 15.8 21.9 26.5 16 26.5Z'
			/>
			<path
				fill='currentColor'
				d='M21.9 18.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4Z'
			/>
		</svg>
	);
}

/** Floating "Chat on WhatsApp" button, bottom-right on every page. */
export function WhatsAppFloat() {
	return (
		<a
			href={whatsappLink()}
			target='_blank'
			rel='noopener noreferrer'
			className='group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex h-14 w-14 items-center justify-center gap-2 rounded-pill bg-whatsapp text-white ring-2 ring-white sm:w-auto sm:pr-4 sm:pl-3 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5 hover:bg-whatsapp-deep sm:right-6 sm:bottom-6'
		>
			<WhatsAppGlyph className='h-8 w-8' />
			<span className='hidden text-sm font-semibold sm:inline'>Chat on WhatsApp</span>
			<span className='sr-only sm:hidden'>Chat on WhatsApp</span>
			<span className='sr-only'> with Ivorris (opens in a new tab)</span>
		</a>
	);
}

export { WhatsAppGlyph };
