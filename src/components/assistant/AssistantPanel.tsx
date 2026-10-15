'use client';

import Link from 'next/link';
import {
	Fragment,
	useCallback,
	useEffect,
	useEffectEvent,
	useId,
	useRef,
	useState,
	type FormEvent,
	type ReactNode,
} from 'react';

import { Chat, Close } from '@/components/ui/Icons';
import { answerFor, GREETING, STARTER_TOPICS, topicById, UNKNOWN_ANSWER } from '@/content/assistant';
import { whatsappLink } from '@/content/site';
import { NurseAvatar } from './NurseAvatar';
import { createRecognition, pickVoice, speak, type Recognition } from './voice';

type Message = { role: 'user' | 'assistant'; content: string; next?: string[] };

const MAX_MESSAGES = 40;
const MAX_CHARS = 500;
const DEFAULT_NEXT = ['about', 'not-sure', 'contact'];
const VOICE_PREF_KEY = 'ivorris-assistant-voice';

// Site paths the assistant may mention; these become links.
const PATH_RE = /(\/(?:services(?:\/[a-z-]+)?|connect-and-coordinate|equipment|about|blog|contact|privacy))(?![\w/-])/g;

function renderText(text: string, onNavigate: () => void): ReactNode {
	return text.split('\n').map((line, i) => (
		<Fragment key={i}>
			{i > 0 && <br />}
			{line.split(PATH_RE).map((part, j) =>
				j % 2 === 1 ? (
					<Link key={j} href={part} onClick={onNavigate} className='font-medium underline underline-offset-2'>
						{part}
					</Link>
				) : (
					part
				),
			)}
		</Fragment>
	));
}

function whatsappSummary(messages: Message[]) {
	const asked = messages
		.filter((m) => m.role === 'user')
		.slice(-2)
		.map((m) => m.content.slice(0, 300));
	return [
		'Hello Ivorris, I was chatting with the assistant on your website.',
		asked.length ? `What I asked about: ${asked.join(' / ')}` : '',
	]
		.filter(Boolean)
		.join('\n\n');
}

function SpeakerIcon({ on, className = 'h-5 w-5' }: { on: boolean; className?: string }) {
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
			<path d='M4 9v6h4l5 4V5L8 9H4Z' />
			{on ? <path d='M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12' /> : <path d='m17 9 5 6M22 9l-5 6' />}
		</svg>
	);
}

function MicIcon() {
	return (
		<svg
			viewBox='0 0 24 24'
			className='h-5 w-5'
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

function readVoicePreference() {
	try {
		return localStorage.getItem(VOICE_PREF_KEY) === 'on';
	} catch {
		return false;
	}
}

/** The "Ask Ivorris" assistant: instant answers from the knowledge base, with optional voice. */
export function AssistantPanel({ onClose, startWithVoice = false }: { onClose: () => void; startWithVoice?: boolean }) {
	const titleId = useId();
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const logRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [pending, setPending] = useState(false);

	// Voice uses the device's own speech features: free, no outside service.
	const [canSpeak] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
	const [canListen] = useState(() => createRecognition() !== null);
	// Opened from the microphone button: spoken replies start switched on.
	const [voiceOn, setVoiceOn] = useState(() => startWithVoice || readVoicePreference());
	const [speaking, setSpeaking] = useState(false);
	const [listening, setListening] = useState(false);
	const [voiceNote, setVoiceNote] = useState('');
	const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
	const recognitionRef = useRef<Recognition | null>(null);

	const atLimit = messages.length >= MAX_MESSAGES - 1;

	useEffect(() => {
		inputRef.current?.focus();
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [onClose]);

	useEffect(() => {
		logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
	}, [messages, pending]);

	// Pick the voice once the device has loaded its list; stop talking on close.
	useEffect(() => {
		if (!canSpeak) return;
		const synth = window.speechSynthesis;
		const load = () => {
			voiceRef.current = pickVoice(synth.getVoices());
		};
		load();
		synth.addEventListener('voiceschanged', load);
		return () => {
			synth.removeEventListener('voiceschanged', load);
			synth.cancel();
			recognitionRef.current?.abort();
		};
	}, [canSpeak]);

	const say = useCallback(
		(text: string) => {
			if (!canSpeak) return;
			speak(
				text,
				voiceRef.current,
				() => setSpeaking(true),
				() => setSpeaking(false),
			);
		},
		[canSpeak],
	);

	function stopSpeaking() {
		if (canSpeak) window.speechSynthesis.cancel();
		setSpeaking(false);
	}

	function setVoice(on: boolean) {
		setVoiceOn(on);
		try {
			localStorage.setItem(VOICE_PREF_KEY, on ? 'on' : 'off');
		} catch {
			/* Storage unavailable: the choice lasts for this visit. */
		}
		if (on) say([...messages].reverse().find((m) => m.role === 'assistant')?.content ?? GREETING);
		else stopSpeaking();
	}

	/** Answers from the Ivorris knowledge base, entirely in the browser — nothing is sent anywhere. */
	function send(text: string, topicId?: string, spoken = false) {
		const content = text.trim().slice(0, MAX_CHARS);
		if (!content || pending || atLimit) return;
		stopSpeaking();
		const next: Message[] = [...messages, { role: 'user', content }];
		setMessages(next);
		setInput('');
		setPending(true);
		const topic = topicId ? topicById(topicId) : answerFor(content);
		const reply: Message = topic
			? { role: 'assistant', content: topic.answer, next: topic.next }
			: { role: 'assistant', content: UNKNOWN_ANSWER, next: DEFAULT_NEXT };
		// A short pause so the reply reads as a response rather than a flash.
		window.setTimeout(() => {
			setMessages([...next, reply]);
			setPending(false);
			inputRef.current?.focus();
			// Read aloud if voice is on — or if the visitor asked by speaking.
			if (voiceOn || spoken) say(reply.content);
		}, 450);
	}

	function toggleListening() {
		if (listening) {
			recognitionRef.current?.stop();
			return;
		}
		const rec = createRecognition();
		if (!rec) return;
		stopSpeaking();
		rec.lang = 'en-KE';
		rec.interimResults = false;
		rec.maxAlternatives = 1;
		rec.onresult = (e) => {
			const transcript = e.results[0]?.[0]?.transcript ?? '';
			if (transcript) send(transcript, undefined, true);
		};
		rec.onerror = (e) =>
			setVoiceNote(
				e.error === 'not-allowed' || e.error === 'service-not-allowed'
					? 'Microphone access is blocked. You can type your question instead.'
					: "Sorry, I didn't catch that. Please try again or type your question.",
			);
		rec.onend = () => setListening(false);
		recognitionRef.current = rec;
		setVoiceNote('');
		setListening(true);
		rec.start();
	}

	// Opened from the microphone button: remember the choice and start listening.
	const startVoice = useEffectEvent(() => {
		try {
			localStorage.setItem(VOICE_PREF_KEY, 'on');
		} catch {
			/* Storage unavailable: the choice lasts for this visit. */
		}
		if (canListen) toggleListening();
	});
	useEffect(() => {
		if (!startWithVoice) return;
		// Start just after the panel has rendered.
		const timer = window.setTimeout(startVoice, 0);
		return () => window.clearTimeout(timer);
	}, [startWithVoice]);

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		send(input);
	}

	const status = speaking ? 'Speaking…' : listening ? 'Listening…' : 'Instant answers about Ivorris';

	return (
		<div
			role='dialog'
			aria-modal='false'
			aria-labelledby={titleId}
			className='fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(640px,calc(100vh-3rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-[1.5rem] sm:border sm:border-line sm:shadow-[0_24px_60px_-20px_rgba(35,37,31,0.45)]'
		>
			{/* Header */}
			<div className='flex items-center justify-between gap-3 bg-olive-deep px-4 py-3.5 text-white'>
				<div className='flex items-center gap-3'>
					<NurseAvatar speaking={speaking} className='h-11 w-11' />
					<div>
						<h2 id={titleId} className='font-sans text-base font-semibold text-white'>
							Ask Ivorris
						</h2>
						<p className='text-xs text-cream/80' aria-live='polite'>
							{status}
						</p>
					</div>
				</div>
				<div className='flex items-center gap-1.5'>
					{canSpeak && (
						<button
							type='button'
							onClick={() => setVoice(!voiceOn)}
							aria-pressed={voiceOn}
							className={`inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold ${
								voiceOn ? 'bg-sun text-ink' : 'bg-white/10 text-white hover:bg-white/20'
							}`}
						>
							<SpeakerIcon on={voiceOn} />
							Voice
							<span className='sr-only'>{voiceOn ? '(on: answers are read aloud)' : '(off)'}</span>
						</button>
					)}
					<button
						type='button'
						onClick={onClose}
						className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20'
					>
						<Close className='h-5 w-5' />
						<span className='sr-only'>Close assistant</span>
					</button>
				</div>
			</div>

			{/* Conversation */}
			<div ref={logRef} role='log' aria-live='polite' className='flex-1 space-y-3 overflow-y-auto bg-cream-soft px-4 py-5'>
				<div className='max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[0.95rem] shadow-sm'>{GREETING}</div>

				{messages.map((m, i) =>
					m.role === 'user' ? (
						<div key={i} className='ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-olive px-4 py-3 text-[0.95rem] text-white'>
							<span className='sr-only'>You: </span>
							{m.content}
						</div>
					) : (
						<div key={i} className='max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[0.95rem] shadow-sm'>
							<span className='sr-only'>Assistant: </span>
							{renderText(m.content, onClose)}
							{canSpeak && (
								<button
									type='button'
									onClick={() => say(m.content)}
									className='mt-2 flex items-center gap-1 text-xs font-semibold text-olive-deep hover:underline'
								>
									<SpeakerIcon on className='h-4 w-4' /> Listen
									<span className='sr-only'> to this answer</span>
								</button>
							)}
						</div>
					),
				)}

				{!pending && !atLimit && (
					<ul className='flex flex-wrap gap-2 pt-1' aria-label='Suggested questions'>
						{(messages.length === 0 ? STARTER_TOPICS : (messages[messages.length - 1].next ?? DEFAULT_NEXT))
							.map((id) => topicById(id))
							.filter((t) => t !== undefined)
							.map((t) => (
								<li key={t.id}>
									<button
										type='button'
										onClick={() => send(t.label, t.id)}
										className='rounded-pill border border-olive/30 bg-white px-3 py-1.5 text-left text-sm text-olive-deep hover:border-olive'
									>
										{t.label}
									</button>
								</li>
							))}
					</ul>
				)}

				{pending && (
					<div className='inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm' role='status'>
						<span className='sr-only'>Assistant is typing</span>
						{[0, 1, 2].map((d) => (
							<span
								key={d}
								className='h-2 w-2 animate-bounce rounded-full bg-olive/60'
								style={{ animationDelay: `${d * 150}ms` }}
								aria-hidden='true'
							/>
						))}
					</div>
				)}

				{atLimit && (
					<p className='rounded-xl bg-white px-4 py-3 text-sm text-ink-muted'>
						Let&apos;s continue this with the Ivorris team on WhatsApp.
					</p>
				)}
			</div>

			{/* Hand-off + input */}
			<div className='border-t border-line bg-white px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
				<a
					href={whatsappLink(whatsappSummary(messages))}
					target='_blank'
					rel='noopener noreferrer'
					className='mb-3 flex min-h-11 items-center justify-center gap-2 rounded-pill bg-whatsapp px-4 text-sm font-semibold text-white hover:bg-whatsapp-deep'
				>
					<Chat className='h-4 w-4' /> Continue on WhatsApp
					<span className='sr-only'>(opens in a new tab)</span>
				</a>
				<form onSubmit={onSubmit} className='flex items-end gap-2'>
					<label htmlFor='assistant-input' className='sr-only'>
						Your message
					</label>
					<textarea
						id='assistant-input'
						ref={inputRef}
						rows={1}
						value={input}
						maxLength={MAX_CHARS}
						disabled={atLimit}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault();
								send(input);
							}
						}}
						placeholder={atLimit ? 'Continue on WhatsApp' : listening ? 'Listening…' : 'Ask a question…'}
						className='max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line px-4 py-2.5 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none disabled:bg-cream-soft'
					/>
					{canListen && (
						<button
							type='button'
							onClick={toggleListening}
							disabled={pending || atLimit}
							aria-pressed={listening}
							className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border disabled:opacity-50 ${
								listening ? 'border-sun bg-sun text-ink' : 'border-line text-olive-deep hover:border-olive'
							}`}
						>
							<MicIcon />
							<span className='sr-only'>{listening ? 'Stop listening' : 'Ask by voice'}</span>
						</button>
					)}
					<button
						type='submit'
						disabled={pending || atLimit || !input.trim()}
						className='inline-flex h-11 shrink-0 items-center rounded-pill bg-olive px-4 text-sm font-semibold text-white hover:bg-olive-deep disabled:opacity-50'
					>
						Send
					</button>
				</form>
				{voiceNote && (
					<p role='alert' className='mt-2 text-xs text-[#7a2318]'>
						{voiceNote}
					</p>
				)}
				<p className='mt-2 text-[0.7rem] leading-snug text-ink-muted'>
					Automated answers about Ivorris only — not medical advice. In an emergency, contact emergency services.
					Typed questions stay on your device; voice uses your device&apos;s speech features —{' '}
					<Link href='/privacy' onClick={onClose} className='underline'>
						privacy
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
