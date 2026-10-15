'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Chat } from '@/components/ui/Icons';
import { whatsappLink } from '@/content/site';
import {
	buildWhatsAppMessage,
	enquiryTopics,
	MESSAGE_MAX,
	normaliseContact,
	validateContact,
	type ContactErrors,
} from '@/lib/contact';

const fieldBase =
	'mt-2 block w-full rounded-xl border bg-white px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/30';

function FieldError({ id, message }: { id: string; message?: string }) {
	if (!message) return null;
	return (
		<p id={id} className='mt-2 text-sm font-medium text-[#9b2c1f]'>
			{message}
		</p>
	);
}

/**
 * Short enquiry form that opens WhatsApp with the message ready to send.
 * Nothing is submitted to or stored by the website.
 */
export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
	const statusRef = useRef<HTMLDivElement>(null);
	const [errors, setErrors] = useState<ContactErrors>({});
	const [sentLink, setSentLink] = useState<string | null>(null);
	const [messageLength, setMessageLength] = useState(0);

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const input = normaliseContact(Object.fromEntries(new FormData(form).entries()));
		const found = validateContact(input);
		setErrors(found);
		if (Object.keys(found).length > 0) {
			form.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
			return;
		}
		const link = whatsappLink(buildWhatsAppMessage(input));
		window.open(link, '_blank', 'noopener,noreferrer');
		setSentLink(link);
	}

	useEffect(() => {
		if (sentLink) statusRef.current?.focus();
	}, [sentLink]);

	if (sentLink) {
		return (
			<div
				ref={statusRef}
				tabIndex={-1}
				role='status'
				className='rounded-card border border-olive/30 bg-olive-tint p-8 outline-none'
			>
				<span className='grid h-12 w-12 place-items-center rounded-full bg-whatsapp text-white'>
					<Chat className='h-6 w-6' />
				</span>
				<h2 className='mt-5 text-3xl'>Almost done — press send in WhatsApp</h2>
				<p className='mt-3 text-ink-muted'>
					Your message is written for you. Send it in WhatsApp and we&apos;ll reply there.
				</p>
				<div className='mt-6 flex flex-wrap items-center gap-x-6 gap-y-3'>
					<a
						href={sentLink}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex min-h-12 items-center gap-2 rounded-pill bg-whatsapp px-6 font-medium text-white hover:bg-whatsapp-deep'
					>
						<Chat className='h-5 w-5' /> Open WhatsApp
						<span className='sr-only'> (opens in a new tab)</span>
					</a>
					<button
						type='button'
						onClick={() => setSentLink(null)}
						className='font-medium text-ink-muted underline underline-offset-4'
					>
						Edit message
					</button>
				</div>
			</div>
		);
	}

	const describedBy = (field: keyof ContactErrors, hint?: string) =>
		[errors[field] ? `${field}-error` : null, hint].filter(Boolean).join(' ') || undefined;
	const border = (field: keyof ContactErrors) => (errors[field] ? 'border-[#9b2c1f]' : 'border-line');

	return (
		<form method='post' onSubmit={onSubmit} noValidate className='space-y-6'>
			<div>
				<label htmlFor='name' className='font-medium'>
					Your name
				</label>
				<input
					id='name'
					name='name'
					type='text'
					autoComplete='name'
					maxLength={100}
					aria-invalid={!!errors.name}
					aria-describedby={describedBy('name')}
					className={`${fieldBase} ${border('name')}`}
				/>
				<FieldError id='name-error' message={errors.name} />
			</div>

			<div>
				<label htmlFor='topic' className='font-medium'>
					What is it about?
				</label>
				<select
					id='topic'
					name='topic'
					defaultValue={defaultTopic ?? ''}
					aria-invalid={!!errors.topic}
					aria-describedby={describedBy('topic')}
					className={`${fieldBase} ${border('topic')} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2323251f' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
				>
					<option value='' disabled>
						Choose the closest option
					</option>
					{enquiryTopics.map((t) => (
						<option key={t.value} value={t.value}>
							{t.label}
						</option>
					))}
				</select>
				<FieldError id='topic-error' message={errors.topic} />
			</div>

			<div>
				<label htmlFor='message' className='font-medium'>
					Anything else? <span className='font-normal text-ink-muted'>(optional)</span>
				</label>
				<p id='message-hint' className='mt-1 text-sm text-ink-muted'>
					A sentence is plenty — no medical records needed.
				</p>
				<textarea
					id='message'
					name='message'
					rows={4}
					maxLength={MESSAGE_MAX}
					onChange={(e) => setMessageLength(e.target.value.length)}
					aria-invalid={!!errors.message}
					aria-describedby={describedBy('message', 'message-hint message-count')}
					className={`${fieldBase} ${border('message')} resize-y`}
				/>
				<p id='message-count' className='mt-1 text-right text-xs text-ink-muted' aria-live='polite'>
					{messageLength}/{MESSAGE_MAX}
				</p>
				<FieldError id='message-error' message={errors.message} />
			</div>

			<div>
				<button
					type='submit'
					className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-whatsapp px-8 font-medium text-white transition-colors hover:bg-whatsapp-deep sm:w-auto'
				>
					<Chat className='h-5 w-5' />
					Continue in WhatsApp
					<span className='sr-only'>(opens WhatsApp in a new tab)</span>
				</button>
				<p className='mt-3 text-sm text-ink-muted'>
					Opens WhatsApp with your message ready to send to Ivorris. Nothing is stored on this website.
				</p>
			</div>
		</form>
	);
}
