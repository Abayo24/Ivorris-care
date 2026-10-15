'use client';

import Link from 'next/link';
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';

import { Chat, Close } from '@/components/ui/Icons';
import { answerFor, GREETING, STARTER_TOPICS, topicById, UNKNOWN_ANSWER } from '@/content/assistant';
import { whatsappLink } from '@/content/site';

type Message = { role: 'user' | 'assistant'; content: string; next?: string[] };

const MAX_MESSAGES = 40;
const MAX_CHARS = 500;
const DEFAULT_NEXT = ['about', 'not-sure', 'contact'];

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

/** The AI assistant chat window. */
export function AssistantPanel({ onClose }: { onClose: () => void }) {
	const titleId = useId();
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const logRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState('');
	const [pending, setPending] = useState(false);

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

	/** Answers from the Ivorris knowledge base, entirely in the browser — nothing is sent anywhere. */
	function send(text: string, topicId?: string) {
		const content = text.trim().slice(0, MAX_CHARS);
		if (!content || pending || atLimit) return;
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
		}, 450);
	}

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		send(input);
	}

	return (
		<div
			role='dialog'
			aria-modal='false'
			aria-labelledby={titleId}
			className='fixed inset-0 z-50 flex flex-col bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(620px,calc(100vh-3rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-[1.5rem] sm:border sm:border-line sm:shadow-[0_24px_60px_-20px_rgba(35,37,31,0.45)]'
		>
			{/* Header */}
			<div className='flex items-center justify-between gap-3 bg-olive-deep px-5 py-4 text-white'>
				<div>
					<h2 id={titleId} className='font-sans text-base font-semibold text-white'>
						Ask Ivorris
					</h2>
					<p className='text-xs text-cream/80'>Instant answers about Ivorris</p>
				</div>
				<button
					type='button'
					onClick={onClose}
					className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20'
				>
					<Close className='h-5 w-5' />
					<span className='sr-only'>Close assistant</span>
				</button>
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
						placeholder={atLimit ? 'Continue on WhatsApp' : 'Type your question…'}
						className='max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-line px-4 py-2.5 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none disabled:bg-cream-soft'
					/>
					<button
						type='submit'
						disabled={pending || atLimit || !input.trim()}
						className='inline-flex h-11 shrink-0 items-center rounded-pill bg-olive px-4 text-sm font-semibold text-white hover:bg-olive-deep disabled:opacity-50'
					>
						Send
					</button>
				</form>
				<p className='mt-2 text-[0.7rem] leading-snug text-ink-muted'>
					Automated answers about Ivorris only — not medical advice. In an emergency, contact emergency services.
					What you type stays on your device —{' '}
					<Link href='/privacy' onClick={onClose} className='underline'>
						privacy
					</Link>
					.
				</p>
			</div>
		</div>
	);
}
