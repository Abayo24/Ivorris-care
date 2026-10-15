'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { Check } from '@/components/ui/Icons';
import {
	contactMethods,
	enquiryTopics,
	MESSAGE_MAX,
	normaliseContact,
	validateContact,
	type ContactErrors,
	type ContactMethod,
} from '@/lib/contact';

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string };

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

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
	const formRef = useRef<HTMLFormElement>(null);
	const statusRef = useRef<HTMLDivElement>(null);
	const [startedAt] = useState(() => Date.now());
	const [method, setMethod] = useState<ContactMethod>('phone');
	const [errors, setErrors] = useState<ContactErrors>({});
	const [status, setStatus] = useState<Status>({ kind: 'idle' });
	const [messageLength, setMessageLength] = useState(0);

	async function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;
		const data = Object.fromEntries(new FormData(form).entries());
		const input = normaliseContact(data);
		const clientErrors = validateContact(input);
		setErrors(clientErrors);

		if (Object.keys(clientErrors).length > 0) {
			const first = Object.keys(clientErrors)[0];
			form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
			return;
		}

		setStatus({ kind: 'sending' });
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...input, website: data.website ?? '', startedAt }),
			});
			const json = (await res.json().catch(() => ({}))) as {
				ok?: boolean;
				message?: string;
				errors?: ContactErrors;
			};
			if (res.ok && json.ok) {
				setStatus({ kind: 'sent' });
				form.reset();
				setMessageLength(0);
			} else {
				if (json.errors) setErrors(json.errors);
				setStatus({ kind: 'error', message: json.message || 'Something went wrong. Please try again.' });
			}
		} catch {
			setStatus({
				kind: 'error',
				message: 'We could not reach our server. Please check your connection and try again, or call us.',
			});
		}
	}

	// Move focus to the outcome so screen-reader and keyboard users hear it.
	useEffect(() => {
		if (status.kind === 'sent' || status.kind === 'error') statusRef.current?.focus();
	}, [status]);

	if (status.kind === 'sent') {
		return (
			<div
				ref={statusRef}
				tabIndex={-1}
				role='status'
				className='rounded-card border border-olive/30 bg-olive-tint p-8 outline-none'
			>
				<span className='grid h-12 w-12 place-items-center rounded-full bg-olive text-white'>
					<Check className='h-6 w-6' />
				</span>
				<h2 className='mt-5 text-3xl'>Thank you — we&apos;ve received your message.</h2>
				<p className='mt-3 text-ink-muted'>
					Someone from Ivorris will contact you using the details you gave us. If things change or feel urgent,
					please call us directly.
				</p>
				<button
					type='button'
					onClick={() => setStatus({ kind: 'idle' })}
					className='mt-6 font-medium text-olive-deep underline underline-offset-4'
				>
					Send another message
				</button>
			</div>
		);
	}

	const describedBy = (field: keyof ContactErrors, hint?: string) =>
		[errors[field] ? `${field}-error` : null, hint].filter(Boolean).join(' ') || undefined;
	const border = (field: keyof ContactErrors) => (errors[field] ? 'border-[#9b2c1f]' : 'border-line');

	return (
		// method='post' keeps personal details out of the URL if the form is
		// submitted before JavaScript has loaded.
		<form
			ref={formRef}
			method='post'
			onSubmit={onSubmit}
			noValidate
			className='space-y-6'
			aria-describedby='form-intro'
		>
			<p id='form-intro' className='text-sm text-ink-muted'>
				All fields are required unless marked optional.
			</p>

			{status.kind === 'error' && (
				<div
					ref={statusRef}
					tabIndex={-1}
					role='alert'
					className='rounded-xl border border-[#9b2c1f]/30 bg-[#fdf0ee] p-4 text-sm text-[#7a2318] outline-none'
				>
					{status.message}
				</div>
			)}

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

			<fieldset>
				<legend className='font-medium'>How would you like us to contact you?</legend>
				<div className='mt-3 flex flex-wrap gap-2'>
					{contactMethods.map((m) => (
						<label
							key={m.value}
							className='relative inline-flex cursor-pointer items-center rounded-pill border border-line px-4 py-2.5 text-sm has-[:checked]:border-olive has-[:checked]:bg-olive has-[:checked]:text-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-olive/40'
						>
							<input
								type='radio'
								name='method'
								value={m.value}
								checked={method === m.value}
								onChange={() => setMethod(m.value)}
								className='sr-only'
							/>
							{m.label}
						</label>
					))}
				</div>
				<FieldError id='method-error' message={errors.method} />
			</fieldset>

			<div className='grid gap-6 sm:grid-cols-2'>
				<div>
					<label htmlFor='phone' className='font-medium'>
						Phone number {method === 'email' && <span className='font-normal text-ink-muted'>(optional)</span>}
					</label>
					<input
						id='phone'
						name='phone'
						type='tel'
						autoComplete='tel'
						inputMode='tel'
						placeholder='+254 7…'
						maxLength={30}
						aria-invalid={!!errors.phone}
						aria-describedby={describedBy('phone')}
						className={`${fieldBase} ${border('phone')}`}
					/>
					<FieldError id='phone-error' message={errors.phone} />
				</div>
				<div>
					<label htmlFor='email' className='font-medium'>
						Email {method !== 'email' && <span className='font-normal text-ink-muted'>(optional)</span>}
					</label>
					<input
						id='email'
						name='email'
						type='email'
						autoComplete='email'
						maxLength={200}
						aria-invalid={!!errors.email}
						aria-describedby={describedBy('email')}
						className={`${fieldBase} ${border('email')}`}
					/>
					<FieldError id='email-error' message={errors.email} />
				</div>
			</div>

			<div>
				<label htmlFor='topic' className='font-medium'>
					What is your enquiry about?
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
					Tell us briefly what&apos;s going on <span className='font-normal text-ink-muted'>(optional)</span>
				</label>
				<p id='message-hint' className='mt-1 text-sm text-ink-muted'>
					A sentence or two is plenty. Please don&apos;t include medical records or detailed health information —
					we&apos;ll talk through the details with you directly.
				</p>
				<textarea
					id='message'
					name='message'
					rows={5}
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

			{/* Honeypot — hidden from people, often filled in by spam bots. */}
			<div className='absolute -left-[10000px] h-px w-px overflow-hidden' aria-hidden='true'>
				<label htmlFor='website'>Website</label>
				<input id='website' name='website' type='text' tabIndex={-1} autoComplete='off' />
			</div>

			<div>
				<label className='flex gap-3 text-[0.95rem]'>
					<input
						type='checkbox'
						name='consent'
						aria-invalid={!!errors.consent}
						aria-describedby={describedBy('consent')}
						className='mt-1 h-5 w-5 shrink-0 rounded accent-olive'
					/>
					<span>
						I&apos;m happy for Ivorris Care to use these details to contact me about my enquiry. See our{' '}
						<Link href='/privacy' className='text-olive-deep underline underline-offset-4'>
							privacy notice
						</Link>
						.
					</span>
				</label>
				<FieldError id='consent-error' message={errors.consent} />
			</div>

			<button
				type='submit'
				disabled={status.kind === 'sending'}
				className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-pill bg-olive px-8 font-medium text-white transition-colors hover:bg-olive-deep disabled:cursor-wait disabled:opacity-70 sm:w-auto'
			>
				{status.kind === 'sending' ? (
					<>
						<span
							className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white'
							aria-hidden='true'
						/>
						Sending…
					</>
				) : (
					'Send message'
				)}
			</button>
		</form>
	);
}
