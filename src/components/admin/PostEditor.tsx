'use client';

import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useState, useTransition, type ReactNode } from 'react';

import { deletePost, savePost, type PostInput } from '@/app/admin/actions';
import { categories } from '@/content/blog';
import { site } from '@/content/site';
import { slugify } from '@/lib/admin/slug';
import { emptyDoc } from '@/lib/blog/richText';
import type { Person, StoredPost } from '@/lib/blog/types';

import { uploadPhoto } from './imageUpload';
import { RichTextEditor } from './RichTextEditor';

/** ISO timestamp → YYYY-MM-DD in Nairobi time, for date inputs. */
function toDay(iso?: string) {
	if (!iso) return '';
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
}

const savedMessages = {
	save: 'Draft saved.',
	publish: 'Published — the article is now on the website.',
	unpublish: 'Unpublished — the article is now a draft and hidden from the website.',
} as const;

export type SavedIntent = keyof typeof savedMessages;

function initialInput(post: StoredPost | null, defaultAuthor?: Person): PostInput {
	return {
		id: post?.id,
		title: post?.title ?? '',
		slug: post?.slug ?? '',
		excerpt: post?.excerpt ?? '',
		body: post?.body ?? emptyDoc,
		mainImage: post?.mainImage,
		category: post?.category ?? '',
		tags: post?.tags ?? [],
		author: post ? post.author : defaultAuthor,
		reviewedBy: post?.reviewedBy,
		reviewedAt: toDay(post?.reviewedAt),
		publishedAt: toDay(post?.publishedAt),
		updatedAt: toDay(post?.updatedAt),
		featured: post?.featured ?? false,
		faqs: post?.faqs ?? [],
		sources: post?.sources ?? [],
		seo: post?.seo ?? {},
	};
}

const inputClass =
	'mt-1.5 block min-h-11 w-full rounded-xl border bg-white px-3.5 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none aria-[invalid=true]:border-[#a3311f]';

function Field({
	label,
	hint,
	error,
	children,
}: {
	label: string;
	hint?: ReactNode;
	error?: string;
	children: (ids: { id: string; describedBy?: string; invalid?: boolean }) => ReactNode;
}) {
	const id = useId();
	const hintId = `${id}-hint`;
	const errorId = `${id}-error`;
	const describedBy = [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined;
	return (
		<div>
			<label htmlFor={id} className='block text-sm font-medium'>
				{label}
			</label>
			{children({ id, describedBy, invalid: Boolean(error) })}
			{hint && (
				<p id={hintId} className='mt-1 text-xs text-ink-muted'>
					{hint}
				</p>
			)}
			{error && (
				<p id={errorId} className='mt-1 text-sm text-[#a3311f]'>
					{error}
				</p>
			)}
		</div>
	);
}

function Panel({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
	return (
		<details open={open} className='group rounded-card border border-line bg-white'>
			<summary className='flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden'>
				{title}
				<span aria-hidden='true' className='text-ink-muted transition-transform group-open:rotate-180'>
					▾
				</span>
			</summary>
			<div className='space-y-4 border-t border-line px-5 py-5'>{children}</div>
		</details>
	);
}

function Counter({ length, ideal, max }: { length: number; ideal: string; max: number }) {
	return (
		<span className={length > max ? 'text-[#a3311f]' : ''}>
			{length} characters · aim for {ideal}
		</span>
	);
}

function PersonFields({
	value,
	onChange,
	nameLabel,
}: {
	value?: Person;
	onChange: (p: Person | undefined) => void;
	nameLabel: string;
}) {
	const set = (patch: Partial<Person>) => {
		const next = { name: '', ...value, ...patch };
		onChange(next.name || next.role || next.credentials ? next : undefined);
	};
	return (
		<div className='space-y-3'>
			<Field label={nameLabel}>
				{({ id }) => <input id={id} value={value?.name ?? ''} onChange={(e) => set({ name: e.target.value })} className={`${inputClass} border-line`} />}
			</Field>
			<Field label='Role' hint='For example: Registered Nurse, Founder'>
				{({ id, describedBy }) => (
					<input id={id} aria-describedby={describedBy} value={value?.role ?? ''} onChange={(e) => set({ role: e.target.value })} className={`${inputClass} border-line`} />
				)}
			</Field>
			<Field label='Qualifications (optional)' hint='Only enter qualifications this person actually holds, e.g. RN, BScN.'>
				{({ id, describedBy }) => (
					<input
						id={id}
						aria-describedby={describedBy}
						value={value?.credentials ?? ''}
						onChange={(e) => set({ credentials: e.target.value })}
						className={`${inputClass} border-line`}
					/>
				)}
			</Field>
		</div>
	);
}

export function PostEditor({
	post,
	defaultAuthor,
	justSaved,
}: {
	post: StoredPost | null;
	defaultAuthor?: Person;
	/** Set right after a new article's first save, to confirm it on the edit page. */
	justSaved?: SavedIntent;
}) {
	const router = useRouter();
	const [input, setInput] = useState<PostInput>(() => initialInput(post, defaultAuthor));
	const [status, setStatus] = useState<StoredPost['status']>(post?.status ?? 'draft');
	const [slugTouched, setSlugTouched] = useState(Boolean(post));
	const [tagsText, setTagsText] = useState((post?.tags ?? []).join(', '));
	const [dirty, setDirty] = useState(false);
	const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(
		justSaved ? { tone: 'ok', text: savedMessages[justSaved] } : null,
	);
	const [fields, setFields] = useState<Partial<Record<string, string>>>({});
	const [imageBusy, setImageBusy] = useState(false);
	const [pending, startTransition] = useTransition();
	const bodyLabelId = useId();
	const bodyErrorId = useId();

	// Warn before leaving with unsaved changes.
	useEffect(() => {
		if (!dirty) return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		window.addEventListener('beforeunload', warn);
		return () => window.removeEventListener('beforeunload', warn);
	}, [dirty]);

	function update(patch: Partial<PostInput>) {
		setInput((prev) => ({ ...prev, ...patch }));
		setDirty(true);
	}

	function onTitle(title: string) {
		update(slugTouched ? { title } : { title, slug: slugify(title) });
	}

	function save(intent: 'save' | 'publish' | 'unpublish') {
		setMessage(null);
		startTransition(async () => {
			const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
			const result = await savePost({ ...input, tags }, intent).catch(() => ({
				ok: false as const,
				error: 'Could not reach the server. Check your connection and try again.',
			}));
			if (!result.ok) {
				setFields('fields' in result ? (result.fields ?? {}) : {});
				setMessage({ tone: 'error', text: result.error });
				return;
			}
			const saved = result.post;
			setFields({});
			setStatus(saved.status);
			setInput((prev) => ({ ...prev, id: saved.id, slug: saved.slug, publishedAt: toDay(saved.publishedAt) }));
			setSlugTouched(true);
			setDirty(false);
			setMessage({
				tone: 'ok',
				text: intent === 'publish' && status === 'published' ? 'Changes are live on the website.' : savedMessages[intent],
			});
			if (!post) router.replace(`/admin/posts/${saved.id}?saved=${intent}`);
			else router.refresh();
		});
	}

	function remove() {
		if (!post) return;
		if (!window.confirm(`Delete “${post.title}”? This can’t be undone.`)) return;
		startTransition(async () => {
			setDirty(false);
			await deletePost(post.id);
		});
	}

	async function onMainImage(file: File | undefined) {
		if (!file) return;
		setImageBusy(true);
		setFields((f) => ({ ...f, mainImage: undefined }));
		try {
			const src = await uploadPhoto(file);
			update({ mainImage: { src, alt: input.mainImage?.alt ?? '' } });
		} catch (error) {
			setFields((f) => ({ ...f, mainImage: error instanceof Error ? error.message : 'Upload failed.' }));
		} finally {
			setImageBusy(false);
		}
	}

	const seoTitle = input.seo.title || input.title;
	const seoDescription = input.seo.description || input.excerpt;
	const isPublished = status === 'published';

	return (
		<div className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
			<div className='flex flex-wrap items-center justify-between gap-3'>
				<Link href='/admin' className='text-sm text-olive-deep underline underline-offset-4'>
					← All articles
				</Link>
				<p className='flex items-center gap-2 text-sm'>
					<span
						className={`rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
							isPublished ? 'bg-olive-tint text-olive-deep' : 'bg-sun/30 text-ink'
						}`}
					>
						{isPublished ? 'Published' : 'Draft'}
					</span>
					{dirty && <span className='text-ink-muted'>Unsaved changes</span>}
				</p>
			</div>

			<div className='mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]'>
				{/* Writing */}
				<div className='space-y-6'>
					<h1 className='sr-only'>{post ? `Edit: ${post.title}` : 'New article'}</h1>
					<Field label='Title' error={fields.title}>
						{({ id, describedBy, invalid }) => (
							<input
								id={id}
								value={input.title}
								onChange={(e) => onTitle(e.target.value)}
								aria-describedby={describedBy}
								aria-invalid={invalid}
								placeholder='e.g. How to prepare your home for a loved one leaving hospital'
								className={`${inputClass} border-line font-display text-2xl sm:text-3xl`}
							/>
						)}
					</Field>

					<Field
						label='Web address'
						error={fields.slug}
						hint={
							<>
								{site.url}/blog/<strong>{input.slug || '…'}</strong>
								{isPublished && ' · Changing it keeps the old address working.'}
							</>
						}
					>
						{({ id, describedBy, invalid }) => (
							<input
								id={id}
								value={input.slug}
								onChange={(e) => {
									setSlugTouched(true);
									update({ slug: slugify(e.target.value) });
								}}
								aria-describedby={describedBy}
								aria-invalid={invalid}
								className={`${inputClass} border-line font-mono text-sm`}
							/>
						)}
					</Field>

					<Field
						label='Summary'
						error={fields.excerpt}
						hint={<Counter length={input.excerpt.length} ideal='1–2 sentences (under 200 characters)' max={300} />}
					>
						{({ id, describedBy, invalid }) => (
							<textarea
								id={id}
								rows={3}
								value={input.excerpt}
								onChange={(e) => update({ excerpt: e.target.value })}
								aria-describedby={describedBy}
								aria-invalid={invalid}
								placeholder='Shown on article cards and in Google results. What will the reader learn?'
								className={`${inputClass} border-line py-2.5`}
							/>
						)}
					</Field>

					<div>
						<p id={bodyLabelId} className='mb-1.5 text-sm font-medium'>
							Article
						</p>
						<RichTextEditor
							value={input.body}
							onChange={(body) => update({ body })}
							labelledBy={bodyLabelId}
							describedBy={fields.body ? bodyErrorId : undefined}
							invalid={Boolean(fields.body)}
						/>
						{fields.body && (
							<p id={bodyErrorId} className='mt-1 text-sm text-[#a3311f]'>
								{fields.body}
							</p>
						)}
					</div>

					<Panel title='Questions & answers (optional)' open={input.faqs.length > 0}>
						<p className='text-sm text-ink-muted'>
							Common questions with short, direct answers. They appear at the end of the article and help it show
							up in Google and AI answers.
						</p>
						{input.faqs.map((faq, i) => (
							<fieldset key={i} className='space-y-3 rounded-2xl bg-cream-soft p-4'>
								<legend className='sr-only'>Question {i + 1}</legend>
								<Field label={`Question ${i + 1}`}>
									{({ id }) => (
										<input
											id={id}
											value={faq.question}
											onChange={(e) =>
												update({ faqs: input.faqs.map((f, j) => (j === i ? { ...f, question: e.target.value } : f)) })
											}
											className={`${inputClass} border-line`}
										/>
									)}
								</Field>
								<Field label='Answer'>
									{({ id }) => (
										<textarea
											id={id}
											rows={3}
											value={faq.answer}
											onChange={(e) =>
												update({ faqs: input.faqs.map((f, j) => (j === i ? { ...f, answer: e.target.value } : f)) })
											}
											className={`${inputClass} border-line py-2.5`}
										/>
									)}
								</Field>
								<button
									type='button'
									onClick={() => update({ faqs: input.faqs.filter((_, j) => j !== i) })}
									className='text-sm text-[#a3311f] underline underline-offset-4'
								>
									Remove question {i + 1}
								</button>
							</fieldset>
						))}
						<button
							type='button'
							onClick={() => update({ faqs: [...input.faqs, { question: '', answer: '' }] })}
							className='min-h-10 rounded-pill border border-line px-4 text-sm hover:border-olive'
						>
							+ Add a question
						</button>
					</Panel>

					<Panel title='Sources (optional)' open={input.sources.length > 0}>
						<p className='text-sm text-ink-muted'>
							Reputable sources for any health information, such as the Ministry of Health or WHO.
						</p>
						{input.sources.map((src, i) => (
							<fieldset key={i} className='grid gap-3 rounded-2xl bg-cream-soft p-4 sm:grid-cols-2'>
								<legend className='sr-only'>Source {i + 1}</legend>
								<Field label={`Source ${i + 1} name`}>
									{({ id }) => (
										<input
											id={id}
											value={src.title}
											onChange={(e) =>
												update({ sources: input.sources.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)) })
											}
											className={`${inputClass} border-line`}
										/>
									)}
								</Field>
								<Field label='Web address (optional)'>
									{({ id }) => (
										<input
											id={id}
											type='url'
											value={src.url ?? ''}
											placeholder='https://'
											onChange={(e) =>
												update({ sources: input.sources.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)) })
											}
											className={`${inputClass} border-line`}
										/>
									)}
								</Field>
								<button
									type='button'
									onClick={() => update({ sources: input.sources.filter((_, j) => j !== i) })}
									className='justify-self-start text-sm text-[#a3311f] underline underline-offset-4'
								>
									Remove source {i + 1}
								</button>
							</fieldset>
						))}
						<button
							type='button'
							onClick={() => update({ sources: [...input.sources, { title: '', url: '' }] })}
							className='min-h-10 rounded-pill border border-line px-4 text-sm hover:border-olive'
						>
							+ Add a source
						</button>
					</Panel>
				</div>

				{/* Settings */}
				<aside className='space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pb-4'>
					<div className='rounded-card border border-line bg-white p-5'>
						<div className='flex flex-col gap-2'>
							<button
								type='button'
								onClick={() => save('publish')}
								disabled={pending || imageBusy}
								className='min-h-12 rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep disabled:opacity-60'
							>
								{pending ? 'Saving…' : isPublished ? 'Update live article' : 'Publish'}
							</button>
							{!isPublished && (
								<button
									type='button'
									onClick={() => save('save')}
									disabled={pending || imageBusy}
									className='min-h-11 rounded-pill border border-line px-6 font-medium hover:border-olive disabled:opacity-60'
								>
									Save draft
								</button>
							)}
							{post && (
								<Link
									href={`/admin/posts/${post.id}/preview`}
									target='_blank'
									className='inline-flex min-h-11 items-center justify-center rounded-pill border border-line px-6 font-medium hover:border-olive'
								>
									Preview<span className='sr-only'> (opens in a new tab, shows the last saved version)</span>
								</Link>
							)}
							{isPublished && (
								<a
									href={`/blog/${input.slug}`}
									target='_blank'
									rel='noopener noreferrer'
									className='text-center text-sm text-olive-deep underline underline-offset-4'
								>
									View on website<span className='sr-only'> (opens in a new tab)</span>
								</a>
							)}
						</div>
						<div aria-live='polite' className='empty:hidden'>
							{message && (
								<p
									className={`mt-4 rounded-xl p-3 text-sm ${
										message.tone === 'ok' ? 'bg-olive-tint text-olive-deep' : 'bg-[#fbe9e5] text-[#a3311f]'
									}`}
								>
									{message.text}
								</p>
							)}
						</div>
						{post && (
							<div className='mt-5 flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-sm'>
								{isPublished ? (
									<button type='button' onClick={() => save('unpublish')} disabled={pending} className='underline underline-offset-4'>
										Unpublish
									</button>
								) : (
									<span />
								)}
								<button type='button' onClick={remove} disabled={pending} className='text-[#a3311f] underline underline-offset-4'>
									Delete article
								</button>
							</div>
						)}
					</div>

					<Panel title='Featured image'>
						{input.mainImage ? (
							<div className='relative aspect-[16/9] overflow-hidden rounded-xl bg-cream'>
								<NextImage src={input.mainImage.src} alt='' fill sizes='300px' className='object-cover' />
							</div>
						) : (
							<p className='text-sm text-ink-muted'>Shown at the top of the article and on its card. A wide photo works best.</p>
						)}
						<Field label={input.mainImage ? 'Replace image' : 'Upload image'} hint='JPG, PNG or WebP. Large photos are resized automatically.'>
							{({ id, describedBy }) => (
								<input
									id={id}
									type='file'
									accept='image/jpeg,image/png,image/webp'
									aria-describedby={describedBy}
									onChange={(e) => onMainImage(e.target.files?.[0])}
									className='mt-1.5 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-olive file:px-3 file:py-2 file:text-white'
								/>
							)}
						</Field>
						{imageBusy && <p className='text-sm text-ink-muted'>Uploading…</p>}
						{input.mainImage && (
							<>
								<Field label='Image description' hint='What the photo shows, for people who cannot see it.' error={fields.mainImage}>
									{({ id, describedBy, invalid }) => (
										<input
											id={id}
											value={input.mainImage?.alt ?? ''}
											aria-describedby={describedBy}
											aria-invalid={invalid}
											onChange={(e) => update({ mainImage: input.mainImage && { ...input.mainImage, alt: e.target.value } })}
											className={`${inputClass} border-line`}
										/>
									)}
								</Field>
								<button
									type='button'
									onClick={() => update({ mainImage: undefined })}
									className='text-sm text-[#a3311f] underline underline-offset-4'
								>
									Remove image
								</button>
							</>
						)}
						{!input.mainImage && fields.mainImage && <p className='text-sm text-[#a3311f]'>{fields.mainImage}</p>}
					</Panel>

					<Panel title='Details'>
						<Field label='Category' error={fields.category}>
							{({ id, describedBy, invalid }) => (
								<select
									id={id}
									value={input.category}
									onChange={(e) => update({ category: e.target.value })}
									aria-describedby={describedBy}
									aria-invalid={invalid}
									className={`${inputClass} border-line`}
								>
									<option value=''>Choose a category…</option>
									{categories.map((c) => (
										<option key={c.slug} value={c.slug}>
											{c.title}
										</option>
									))}
								</select>
							)}
						</Field>
						<Field label='Tags' hint='Separate with commas, e.g. elderly care, Nairobi'>
							{({ id, describedBy }) => (
								<input
									id={id}
									value={tagsText}
									aria-describedby={describedBy}
									onChange={(e) => {
										setTagsText(e.target.value);
										setDirty(true);
									}}
									className={`${inputClass} border-line`}
								/>
							)}
						</Field>
						<Field label='Publication date' hint='Leave empty to use the day you publish.'>
							{({ id, describedBy }) => (
								<input
									id={id}
									type='date'
									value={input.publishedAt}
									aria-describedby={describedBy}
									onChange={(e) => update({ publishedAt: e.target.value })}
									className={`${inputClass} border-line`}
								/>
							)}
						</Field>
						<Field label='Last updated (optional)' hint='Set this when you make a meaningful change.'>
							{({ id, describedBy }) => (
								<input
									id={id}
									type='date'
									value={input.updatedAt ?? ''}
									aria-describedby={describedBy}
									onChange={(e) => update({ updatedAt: e.target.value })}
									className={`${inputClass} border-line`}
								/>
							)}
						</Field>
						<label className='flex items-start gap-3 text-sm'>
							<input
								type='checkbox'
								checked={input.featured}
								onChange={(e) => update({ featured: e.target.checked })}
								className='mt-0.5 h-5 w-5 accent-[var(--brand-olive)]'
							/>
							<span>
								<span className='font-medium'>Feature this article</span>
								<span className='block text-ink-muted'>The newest featured article is shown large at the top of the blog.</span>
							</span>
						</label>
					</Panel>

					<Panel title='Author & review' open={false}>
						<PersonFields nameLabel='Written by' value={input.author} onChange={(author) => update({ author })} />
						<div className='border-t border-line pt-4'>
							<p className='mb-3 text-sm text-ink-muted'>
								Only fill this in once a qualified professional has actually reviewed the article.
							</p>
							<PersonFields
								nameLabel='Reviewed by'
								value={input.reviewedBy}
								onChange={(reviewedBy) => update({ reviewedBy })}
							/>
							<div className='mt-3'>
								<Field label='Review date'>
									{({ id }) => (
										<input
											id={id}
											type='date'
											value={input.reviewedAt ?? ''}
											onChange={(e) => update({ reviewedAt: e.target.value })}
											className={`${inputClass} border-line`}
										/>
									)}
								</Field>
							</div>
						</div>
					</Panel>

					<Panel title='Google & sharing' open={false}>
						<div className='rounded-xl border border-line p-3' aria-label='Search result preview'>
							<p className='truncate text-xs text-ink-muted'>
								{site.url.replace(/^https?:\/\//, '')} › blog › {input.slug || '…'}
							</p>
							<p className='mt-0.5 line-clamp-2 text-[1.05rem] leading-snug text-[#1a0dab]'>
								{seoTitle || 'Article title'} | Ivorris Care
							</p>
							<p className='mt-0.5 line-clamp-3 text-xs text-ink-muted'>{seoDescription || 'Article summary'}</p>
						</div>
						<Field label='Search title (optional)' hint={<Counter length={(input.seo.title ?? '').length} ideal='under 60' max={70} />}>
							{({ id, describedBy }) => (
								<input
									id={id}
									value={input.seo.title ?? ''}
									placeholder={input.title}
									aria-describedby={describedBy}
									onChange={(e) => update({ seo: { ...input.seo, title: e.target.value } })}
									className={`${inputClass} border-line`}
								/>
							)}
						</Field>
						<Field
							label='Search description (optional)'
							hint={<Counter length={(input.seo.description ?? '').length} ideal='120–160' max={170} />}
						>
							{({ id, describedBy }) => (
								<textarea
									id={id}
									rows={3}
									value={input.seo.description ?? ''}
									placeholder={input.excerpt}
									aria-describedby={describedBy}
									onChange={(e) => update({ seo: { ...input.seo, description: e.target.value } })}
									className={`${inputClass} border-line py-2.5`}
								/>
							)}
						</Field>
						<label className='flex items-start gap-3 text-sm'>
							<input
								type='checkbox'
								checked={input.seo.noIndex === true}
								onChange={(e) => update({ seo: { ...input.seo, noIndex: e.target.checked } })}
								className='mt-0.5 h-5 w-5 accent-[var(--brand-olive)]'
							/>
							<span>
								<span className='font-medium'>Hide from search engines</span>
								<span className='block text-ink-muted'>The article stays on the website but asks Google not to list it.</span>
							</span>
						</label>
					</Panel>
				</aside>
			</div>
		</div>
	);
}
