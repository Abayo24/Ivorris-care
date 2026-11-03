'use client';

import NextImage from 'next/image';
import Link from 'next/link';
import { useEffect, useEffectEvent, useId, useRef, useState, useTransition, type ReactNode } from 'react';

import { deletePost, savePost, type PostInput, type SaveResult } from '@/app/admin/actions';
import { LogoMark } from '@/components/brand/Logo';
import { Close } from '@/components/ui/Icons';
import { categories } from '@/content/blog';
import { site } from '@/content/site';
import { slugify } from '@/lib/admin/slug';
import { emptyDoc } from '@/lib/blog/richText';
import type { Person, StoredPost } from '@/lib/blog/types';

import { uploadPhoto } from './imageUpload';
import { RichTextEditor } from './RichTextEditor';

/** Drafts save themselves this long after the last change. */
const AUTOSAVE_MS = 20000;

type Intent = 'save' | 'publish' | 'unpublish';

// Publishing refreshes the page, which reloads the editor for a brand-new
// article; this carries the confirmation across that reload.
let lastNotice: { id: string; text: string; at: number } | null = null;

/** ISO timestamp → YYYY-MM-DD in Nairobi time, for date inputs. */
function toDay(iso?: string) {
	if (!iso) return '';
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-CA', { timeZone: 'Africa/Nairobi' });
}

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

/** Title and subtitle fields grow with their text instead of scrolling. */
function grow(el: HTMLTextAreaElement | null) {
	if (!el) return;
	el.style.height = 'auto';
	el.style.height = `${el.scrollHeight}px`;
}

const inputClass =
	'mt-1.5 block min-h-11 w-full rounded-lg border border-line bg-white px-3.5 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none aria-[invalid=true]:border-[#a3311f]';

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

function Section({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
	return (
		<details open={open} className='group border-b border-line'>
			<summary className='flex min-h-13 cursor-pointer list-none items-center justify-between px-6 font-medium [&::-webkit-details-marker]:hidden'>
				{title}
				<span aria-hidden='true' className='text-ink-muted transition-transform group-open:rotate-180'>
					▾
				</span>
			</summary>
			<div className='space-y-4 px-6 pt-1 pb-6'>{children}</div>
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
				{({ id }) => <input id={id} value={value?.name ?? ''} onChange={(e) => set({ name: e.target.value })} className={inputClass} />}
			</Field>
			<Field label='Role' hint='For example: Registered Nurse, Founder'>
				{({ id, describedBy }) => (
					<input id={id} aria-describedby={describedBy} value={value?.role ?? ''} onChange={(e) => set({ role: e.target.value })} className={inputClass} />
				)}
			</Field>
			<Field label='Qualifications (optional)' hint='Only enter qualifications this person actually holds, e.g. RN, BScN.'>
				{({ id, describedBy }) => (
					<input
						id={id}
						aria-describedby={describedBy}
						value={value?.credentials ?? ''}
						onChange={(e) => set({ credentials: e.target.value })}
						className={inputClass}
					/>
				)}
			</Field>
		</div>
	);
}

export function PostEditor({ post, defaultAuthor }: { post: StoredPost | null; defaultAuthor?: Person }) {
	const [input, setInput] = useState<PostInput>(() => initialInput(post, defaultAuthor));
	const [status, setStatus] = useState<StoredPost['status']>(post?.status ?? 'draft');
	// The web address follows the title until it's edited by hand or the article goes live.
	const [slugTouched, setSlugTouched] = useState(Boolean(post && (post.status === 'published' || post.slug !== slugify(post.title))));
	const [tagsText, setTagsText] = useState((post?.tags ?? []).join(', '));
	const [dirty, setDirty] = useState(false);
	const [savedOnce, setSavedOnce] = useState(false);
	const [autosaving, setAutosaving] = useState(false);
	const [autosaveError, setAutosaveError] = useState('');
	const [notice, setNotice] = useState(() =>
		post && lastNotice?.id === post.id && Date.now() - lastNotice.at < 10000 ? lastNotice.text : '',
	);
	const [error, setError] = useState('');
	const [fields, setFields] = useState<Partial<Record<string, string>>>({});
	const [imageBusy, setImageBusy] = useState(false);
	const [pending, startTransition] = useTransition();
	const panelRef = useRef<HTMLDialogElement>(null);
	// Saves run one at a time, so a quick autosave and Publish can't create two copies of a new article.
	const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
	const savedId = useRef(post?.id);
	const revision = useRef(0);
	const bodyLabelId = useId();
	const bodyErrorId = useId();

	// Warn before leaving with unsaved changes. beforeunload covers closing or
	// reloading the tab; in-site links never fire it, so they're caught here
	// before Next.js handles them.
	useEffect(() => {
		if (!dirty) return;
		const warn = (e: BeforeUnloadEvent) => e.preventDefault();
		const onClick = (e: MouseEvent) => {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
			const link = (e.target as Element).closest?.('a[href]');
			// Links inside the article being written, or opening in a new tab, don't leave the page.
			if (!(link instanceof HTMLAnchorElement) || link.target === '_blank' || link.isContentEditable) return;
			if (link.pathname === location.pathname && link.search === location.search) return;
			if (window.confirm('You have unsaved changes. Leave this page without saving?')) return;
			e.preventDefault();
			e.stopPropagation();
		};
		window.addEventListener('beforeunload', warn);
		window.addEventListener('click', onClick, true);
		return () => {
			window.removeEventListener('beforeunload', warn);
			window.removeEventListener('click', onClick, true);
		};
	}, [dirty]);

	function update(patch: Partial<PostInput>) {
		revision.current += 1;
		setInput((prev) => ({ ...prev, ...patch }));
		setDirty(true);
	}

	function onTitle(title: string) {
		update(slugTouched ? { title } : { title, slug: slugify(title) });
	}

	/** Send the current article to the server, after any save already under way. */
	function send(intent: Intent) {
		const sentRevision = revision.current;
		const tags = tagsText.split(',').map((t) => t.trim()).filter(Boolean);
		const run = saveQueue.current.then(async (): Promise<SaveResult> => {
			const result = await savePost({ ...input, id: savedId.current, tags }, intent).catch(
				(): SaveResult => ({ ok: false, error: 'Could not reach the server. Check your connection and try again.' }),
			);
			if (result.ok) {
				const saved = result.post;
				if (!savedId.current) {
					savedId.current = saved.id;
					// Show the article's own address without reloading the editor mid-sentence.
					window.history.replaceState(null, '', `/admin/posts/${saved.id}`);
				}
				setStatus(saved.status);
				setInput((prev) => ({ ...prev, id: saved.id, publishedAt: saved.status === 'published' ? toDay(saved.publishedAt) : prev.publishedAt }));
				setSavedOnce(true);
				setAutosaveError('');
				if (revision.current === sentRevision) setDirty(false);
			}
			return result;
		});
		saveQueue.current = run;
		return run;
	}

	const autosave = useEffectEvent(async () => {
		setAutosaving(true);
		const result = await send('save');
		setAutosaving(false);
		if (!result.ok) setAutosaveError(result.error);
	});

	// Only drafts save themselves; a live article changes when the owner says so.
	useEffect(() => {
		if (!dirty || status !== 'draft' || !input.title.trim()) return;
		const timer = setTimeout(() => autosave(), AUTOSAVE_MS);
		return () => clearTimeout(timer);
	}, [dirty, status, input, tagsText]);

	function save(intent: Intent) {
		setError('');
		setNotice('');
		startTransition(async () => {
			const wasPublished = status === 'published';
			const result = await send(intent);
			if (!result.ok) {
				setFields(result.fields ?? {});
				setError(result.error);
				if (!panelRef.current?.open) panelRef.current?.showModal();
				return;
			}
			setFields({});
			if (intent === 'publish') setSlugTouched(true);
			const text =
				intent === 'publish'
					? wasPublished
						? 'Your changes are live on the website.'
						: 'Published — the article is now on the website.'
					: intent === 'unpublish'
						? 'Unpublished — the article is now a draft and hidden from the website.'
						: 'Draft saved.';
			lastNotice = { id: result.post.id, text, at: Date.now() };
			setNotice(text);
			panelRef.current?.close();
		});
	}

	function remove() {
		if (!input.id) return;
		if (!window.confirm(`Delete “${input.title}”? This can’t be undone.`)) return;
		const id = input.id;
		startTransition(async () => {
			setDirty(false);
			await deletePost(id);
		});
	}

	async function onMainImage(file: File | undefined) {
		if (!file) return;
		setImageBusy(true);
		setFields((f) => ({ ...f, mainImage: undefined }));
		try {
			const src = await uploadPhoto(file);
			update({ mainImage: { src, alt: input.mainImage?.alt ?? '' } });
		} catch (e) {
			setFields((f) => ({ ...f, mainImage: e instanceof Error ? e.message : 'Upload failed.' }));
		} finally {
			setImageBusy(false);
		}
	}

	const isPublished = status === 'published';
	const seoTitle = input.seo.title || input.title;
	const seoDescription = input.seo.description || input.excerpt;
	const problems = Object.values(fields).filter(Boolean);
	const saveState = autosaving
		? 'Saving…'
		: autosaveError
			? `Not saved: ${autosaveError}`
			: dirty
				? isPublished
					? 'Changes not live yet'
					: 'Unsaved changes'
				: savedOnce
					? 'Saved'
					: isPublished
						? 'Published'
						: 'Draft';

	return (
		<div className='bg-white'>
			{/* Top bar */}
			<header className='sticky top-0 z-20 border-b border-line bg-white'>
				<div className='mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6'>
					<div className='flex min-w-0 items-center gap-3'>
						<Link href='/' aria-label='Ivorris Care — home page' className='shrink-0 text-olive'>
							<LogoMark className='h-6 w-auto' />
						</Link>
						<Link href='/admin' className='shrink-0 text-sm text-ink-muted hover:text-ink'>
							← Articles
						</Link>
						<p role='status' className={`truncate text-sm ${autosaveError ? 'text-[#a3311f]' : 'text-ink-muted'}`} title={saveState}>
							<span aria-hidden='true' className='mr-3 text-line'>
								|
							</span>
							{saveState}
						</p>
					</div>
					<div className='flex shrink-0 items-center gap-1 sm:gap-2'>
						{input.id && (
							<Link
								href={`/admin/posts/${input.id}/preview`}
								target='_blank'
								className='hidden min-h-9 items-center rounded-pill px-3 text-sm hover:bg-cream-soft sm:inline-flex'
							>
								Preview<span className='sr-only'> (opens in a new tab, shows the last saved version)</span>
							</Link>
						)}
						{isPublished ? (
							<>
								<button
									type='button'
									onClick={() => panelRef.current?.showModal()}
									className='min-h-9 rounded-pill px-3 text-sm hover:bg-cream-soft'
								>
									Settings
								</button>
								<button
									type='button'
									onClick={() => save('publish')}
									disabled={pending || imageBusy}
									className='min-h-9 rounded-pill bg-olive px-4 text-sm font-medium text-white hover:bg-olive-deep disabled:opacity-60'
								>
									{pending ? 'Saving…' : 'Update'}
								</button>
							</>
						) : (
							<button
								type='button'
								onClick={() => panelRef.current?.showModal()}
								className='min-h-9 rounded-pill bg-olive px-4 text-sm font-medium text-white hover:bg-olive-deep'
							>
								Continue
							</button>
						)}
					</div>
				</div>
			</header>

			{notice && (
				<div role='status' className='flex flex-wrap items-center justify-center gap-x-3 bg-olive-tint px-4 py-2 text-center text-sm text-olive-deep'>
					{notice}
					{isPublished && (
						<a href={`/blog/${input.slug}`} target='_blank' rel='noopener noreferrer' className='font-medium underline underline-offset-4'>
							View on website<span className='sr-only'> (opens in a new tab)</span>
						</a>
					)}
				</div>
			)}

			{/* Writing */}
			<main>
				<h1 className='sr-only'>{post ? `Edit: ${post.title}` : 'New article'}</h1>
				<p id={bodyLabelId} className='sr-only'>
					Article
				</p>
				<RichTextEditor
					value={input.body}
					onChange={(body) => update({ body })}
					labelledBy={bodyLabelId}
					describedBy={fields.body ? bodyErrorId : undefined}
					invalid={Boolean(fields.body)}
					header={
						<div className='pt-10'>
							<label htmlFor='post-title' className='sr-only'>
								Title
							</label>
							<textarea
								id='post-title'
								ref={grow}
								rows={1}
								value={input.title}
								maxLength={140}
								onChange={(e) => {
									onTitle(e.target.value);
									grow(e.target);
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										document.getElementById('post-subtitle')?.focus();
									}
								}}
								aria-invalid={Boolean(fields.title)}
								placeholder='Title'
								className='block w-full resize-none overflow-hidden bg-transparent font-display text-[2.6rem] leading-[1.08] font-medium text-ink placeholder:text-ink-muted/60 focus:outline-none sm:text-[3.25rem]'
							/>
							{fields.title && <p className='mt-1 text-sm text-[#a3311f]'>{fields.title}</p>}
							<label htmlFor='post-subtitle' className='sr-only'>
								Subtitle
							</label>
							<textarea
								id='post-subtitle'
								ref={grow}
								rows={1}
								value={input.excerpt}
								maxLength={300}
								onChange={(e) => {
									update({ excerpt: e.target.value });
									grow(e.target);
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										document.querySelector<HTMLElement>('.ProseMirror')?.focus();
									}
								}}
								aria-invalid={Boolean(fields.excerpt)}
								placeholder='Add a subtitle…'
								className='mt-3 block w-full resize-none overflow-hidden bg-transparent text-xl leading-snug text-ink-muted placeholder:text-ink-muted/60 focus:outline-none sm:text-[1.4rem]'
							/>
							{fields.excerpt && <p className='mt-1 text-sm text-[#a3311f]'>{fields.excerpt}</p>}
							<button
								type='button'
								onClick={() => panelRef.current?.showModal()}
								className='mt-4 inline-flex min-h-9 items-center gap-2 rounded-pill bg-cream-soft px-3 text-sm text-ink-muted hover:text-ink'
							>
								{input.author?.name ? `By ${input.author.name}` : 'Add the author'}
							</button>
							{fields.body && (
								<p id={bodyErrorId} className='mt-4 text-sm text-[#a3311f]'>
									{fields.body}
								</p>
							)}
						</div>
					}
				/>
			</main>

			{/* Everything that isn't the writing */}
			<dialog
				ref={panelRef}
				aria-labelledby='publish-heading'
				className='m-0 ml-auto h-dvh max-h-none w-full max-w-[460px] bg-white text-ink backdrop:bg-black/40'
			>
				<div className='flex h-full flex-col'>
					<div className='flex items-center justify-between border-b border-line px-6 py-4'>
						<h2 id='publish-heading' className='text-2xl'>
							{isPublished ? 'Article settings' : 'Ready to publish?'}
						</h2>
						<button
							type='button'
							onClick={() => panelRef.current?.close()}
							aria-label='Close and keep writing'
							className='grid h-10 w-10 place-items-center rounded-full hover:bg-cream-soft'
						>
							<Close className='h-5 w-5' />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto'>
						{error && (
							<div role='alert' className='border-b border-line bg-[#fbe9e5] px-6 py-4 text-sm text-[#a3311f]'>
								<p className='font-medium'>{error}</p>
								{problems.length > 0 && (
									<ul className='mt-1 list-disc pl-5'>
										{problems.map((p) => (
											<li key={p}>{p}</li>
										))}
									</ul>
								)}
							</div>
						)}

						<Section title='Featured image' open>
							{input.mainImage ? (
								<div className='relative aspect-[16/9] overflow-hidden rounded-lg bg-cream'>
									<NextImage src={input.mainImage.src} alt='' fill sizes='400px' className='object-cover' />
								</div>
							) : (
								<p className='text-sm text-ink-muted'>Shown at the top of the article and on the blog. A wide photo works best.</p>
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
												className={inputClass}
											/>
										)}
									</Field>
									<button type='button' onClick={() => update({ mainImage: undefined })} className='text-sm text-[#a3311f] underline underline-offset-4'>
										Remove image
									</button>
								</>
							)}
							{!input.mainImage && fields.mainImage && <p className='text-sm text-[#a3311f]'>{fields.mainImage}</p>}
						</Section>

						<Section title='Details' open>
							<Field label='Category' error={fields.category}>
								{({ id, describedBy, invalid }) => (
									<select
										id={id}
										value={input.category}
										onChange={(e) => update({ category: e.target.value })}
										aria-describedby={describedBy}
										aria-invalid={invalid}
										className={inputClass}
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
											revision.current += 1;
											setTagsText(e.target.value);
											setDirty(true);
										}}
										className={inputClass}
									/>
								)}
							</Field>
							<Field
								label='Web address'
								error={fields.slug}
								hint={
									<span className='break-all'>
										{site.url}/blog/<strong>{input.slug || '…'}</strong>
										{isPublished && ' · Changing it keeps the old address working.'}
									</span>
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
										className={`${inputClass} font-mono text-sm`}
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
										className={inputClass}
									/>
								)}
							</Field>
							{isPublished && (
								<Field label='Last updated (optional)' hint='Set this when you make a meaningful change.'>
									{({ id, describedBy }) => (
										<input
											id={id}
											type='date'
											value={input.updatedAt ?? ''}
											aria-describedby={describedBy}
											onChange={(e) => update({ updatedAt: e.target.value })}
											className={inputClass}
										/>
									)}
								</Field>
							)}
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
						</Section>

						<Section title='Author & review' open={!input.author?.name}>
							<PersonFields nameLabel='Written by' value={input.author} onChange={(author) => update({ author })} />
							<div className='border-t border-line pt-4'>
								<p className='mb-3 text-sm text-ink-muted'>Only fill this in once a qualified professional has actually reviewed the article.</p>
								<PersonFields nameLabel='Reviewed by' value={input.reviewedBy} onChange={(reviewedBy) => update({ reviewedBy })} />
								<div className='mt-3'>
									<Field label='Review date'>
										{({ id }) => (
											<input
												id={id}
												type='date'
												value={input.reviewedAt ?? ''}
												onChange={(e) => update({ reviewedAt: e.target.value })}
												className={inputClass}
											/>
										)}
									</Field>
								</div>
							</div>
						</Section>

						<Section title='Questions & answers (optional)' open={input.faqs.length > 0}>
							<p className='text-sm text-ink-muted'>
								Common questions with short, direct answers. They appear at the end of the article and help it show up in Google and AI answers.
							</p>
							{input.faqs.map((faq, i) => (
								<fieldset key={i} className='space-y-3 rounded-lg bg-cream-soft p-4'>
									<legend className='sr-only'>Question {i + 1}</legend>
									<Field label={`Question ${i + 1}`}>
										{({ id }) => (
											<input
												id={id}
												value={faq.question}
												onChange={(e) => update({ faqs: input.faqs.map((f, j) => (j === i ? { ...f, question: e.target.value } : f)) })}
												className={inputClass}
											/>
										)}
									</Field>
									<Field label='Answer'>
										{({ id }) => (
											<textarea
												id={id}
												rows={3}
												value={faq.answer}
												onChange={(e) => update({ faqs: input.faqs.map((f, j) => (j === i ? { ...f, answer: e.target.value } : f)) })}
												className={`${inputClass} py-2.5`}
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
						</Section>

						<Section title='Sources (optional)' open={input.sources.length > 0}>
							<p className='text-sm text-ink-muted'>Reputable sources for any health information, such as the Ministry of Health or WHO.</p>
							{input.sources.map((src, i) => (
								<fieldset key={i} className='space-y-3 rounded-lg bg-cream-soft p-4'>
									<legend className='sr-only'>Source {i + 1}</legend>
									<Field label={`Source ${i + 1} name`}>
										{({ id }) => (
											<input
												id={id}
												value={src.title}
												onChange={(e) => update({ sources: input.sources.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)) })}
												className={inputClass}
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
												onChange={(e) => update({ sources: input.sources.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)) })}
												className={inputClass}
											/>
										)}
									</Field>
									<button
										type='button'
										onClick={() => update({ sources: input.sources.filter((_, j) => j !== i) })}
										className='text-sm text-[#a3311f] underline underline-offset-4'
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
						</Section>

						<Section title='Google & sharing (optional)'>
							<div className='rounded-lg border border-line p-3'>
								<p className='text-xs font-medium text-ink-muted'>Preview in Google</p>
								<p className='mt-2 truncate text-xs text-ink-muted'>
									{site.url.replace(/^https?:\/\//, '')} › blog › {input.slug || '…'}
								</p>
								<p className='mt-0.5 line-clamp-2 text-[1.05rem] leading-snug text-[#1a0dab]'>{seoTitle || 'Article title'} | Ivorris Care</p>
								<p className='mt-0.5 line-clamp-3 text-xs text-ink-muted'>{seoDescription || 'Article subtitle'}</p>
							</div>
							<Field label='Search title' hint={<Counter length={(input.seo.title ?? '').length} ideal='under 60' max={70} />}>
								{({ id, describedBy }) => (
									<input
										id={id}
										value={input.seo.title ?? ''}
										placeholder={input.title}
										aria-describedby={describedBy}
										onChange={(e) => update({ seo: { ...input.seo, title: e.target.value } })}
										className={inputClass}
									/>
								)}
							</Field>
							<Field label='Search description' hint={<Counter length={(input.seo.description ?? '').length} ideal='120–160' max={170} />}>
								{({ id, describedBy }) => (
									<textarea
										id={id}
										rows={3}
										value={input.seo.description ?? ''}
										placeholder={input.excerpt}
										aria-describedby={describedBy}
										onChange={(e) => update({ seo: { ...input.seo, description: e.target.value } })}
										className={`${inputClass} py-2.5`}
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
						</Section>

						{input.id && (
							<div className='flex flex-wrap justify-between gap-2 px-6 py-5 text-sm'>
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

					<div className='flex gap-2 border-t border-line p-4'>
						<button
							type='button'
							onClick={() => save('publish')}
							disabled={pending || imageBusy}
							className='min-h-12 flex-1 rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep disabled:opacity-60'
						>
							{pending ? 'Saving…' : isPublished ? 'Update' : 'Publish now'}
						</button>
						{!isPublished && (
							<button
								type='button'
								onClick={() => save('save')}
								disabled={pending || imageBusy}
								className='min-h-12 rounded-pill border border-line px-5 font-medium hover:border-olive disabled:opacity-60'
							>
								Save draft
							</button>
						)}
					</div>
				</div>
			</dialog>
		</div>
	);
}
