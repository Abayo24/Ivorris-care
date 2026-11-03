'use client';

import Image from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extensions';
import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

import type { RichTextNode } from '@/lib/blog/types';

import { uploadPhoto } from './imageUpload';

/*
 * The article writing area. It only offers what the website can show —
 * headings, paragraphs, bold, italic, lists, quotes, links, images and
 * dividers — and looks like the published article while you type.
 */

const inputClass =
	'block min-h-10 w-full rounded-lg border border-line bg-white px-3 text-sm focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none';

function ToolButton({
	label,
	onClick,
	active,
	disabled,
	children,
}: {
	label: string;
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	children: ReactNode;
}) {
	return (
		<button
			type='button'
			// Keep the cursor where it is in the article while clicking.
			onMouseDown={(e) => e.preventDefault()}
			onClick={onClick}
			disabled={disabled}
			aria-pressed={active}
			title={label}
			aria-label={label}
			className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm transition-colors disabled:opacity-40 ${
				active ? 'bg-olive text-white' : 'text-ink hover:bg-cream'
			}`}
		>
			{children}
		</button>
	);
}

const Divider = () => <span className='mx-1 h-6 w-px bg-line' aria-hidden='true' />;

function LinkForm({ editor, onDone }: { editor: Editor; onDone: () => void }) {
	const [href, setHref] = useState<string>(editor.getAttributes('link').href ?? '');
	const id = useId();
	function apply() {
		const value = href.trim();
		const chain = editor.chain().focus().extendMarkRange('link');
		if (!value) chain.unsetLink().run();
		else {
			const normalised = /^(https?:|mailto:|tel:|\/|#)/i.test(value) ? value : `https://${value}`;
			chain.setLink({ href: normalised }).run();
		}
		onDone();
	}
	return (
		<div className='flex flex-wrap items-end gap-2 border-t border-line bg-cream-soft p-3'>
			<div className='min-w-56 flex-1'>
				<label htmlFor={id} className='block text-xs font-medium'>
					Link address — a full web address, or a page on this site such as /services
				</label>
				<input
					id={id}
					autoFocus
					value={href}
					onChange={(e) => setHref(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							apply();
						}
						if (e.key === 'Escape') onDone();
					}}
					placeholder='https://'
					className={`mt-1 ${inputClass}`}
				/>
			</div>
			<button type='button' onClick={apply} className='min-h-10 rounded-lg bg-olive px-4 text-sm text-white hover:bg-olive-deep'>
				{href.trim() ? 'Apply link' : 'Remove link'}
			</button>
			<button type='button' onClick={onDone} className='min-h-10 rounded-lg px-3 text-sm hover:bg-cream'>
				Cancel
			</button>
		</div>
	);
}

function ImageForm({ editor, onDone }: { editor: Editor; onDone: () => void }) {
	const [src, setSrc] = useState('');
	const [alt, setAlt] = useState('');
	const [caption, setCaption] = useState('');
	const [status, setStatus] = useState<{ busy?: boolean; error?: string }>({});
	const fileId = useId();
	const altId = useId();
	const captionId = useId();

	async function onFile(file: File | undefined) {
		if (!file) return;
		setStatus({ busy: true });
		try {
			setSrc(await uploadPhoto(file));
			setStatus({});
		} catch (error) {
			setStatus({ error: error instanceof Error ? error.message : 'Upload failed.' });
		}
	}

	function insert() {
		if (!src) return setStatus({ error: 'Choose an image first.' });
		if (!alt.trim()) return setStatus({ error: 'Describe the image for people who cannot see it.' });
		editor.chain().focus().setImage({ src, alt: alt.trim(), title: caption.trim() || undefined }).run();
		onDone();
	}

	return (
		<div className='space-y-3 border-t border-line bg-cream-soft p-3'>
			<div>
				<label htmlFor={fileId} className='block text-xs font-medium'>
					Image (JPG, PNG or WebP)
				</label>
				<input
					id={fileId}
					type='file'
					accept='image/jpeg,image/png,image/webp'
					onChange={(e) => onFile(e.target.files?.[0])}
					className='mt-1 block text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-olive file:px-3 file:py-2 file:text-white'
				/>
				{status.busy && <p className='mt-1 text-xs text-ink-muted'>Uploading…</p>}
				{src && <p className='mt-1 text-xs text-olive-deep'>Image uploaded.</p>}
			</div>
			<div className='grid gap-3 sm:grid-cols-2'>
				<div>
					<label htmlFor={altId} className='block text-xs font-medium'>
						Description (required) — what the image shows
					</label>
					<input id={altId} value={alt} onChange={(e) => setAlt(e.target.value)} className={`mt-1 ${inputClass}`} />
				</div>
				<div>
					<label htmlFor={captionId} className='block text-xs font-medium'>
						Caption (optional) — shown under the image
					</label>
					<input
						id={captionId}
						value={caption}
						onChange={(e) => setCaption(e.target.value)}
						className={`mt-1 ${inputClass}`}
					/>
				</div>
			</div>
			{status.error && (
				<p role='alert' className='text-sm text-[#a3311f]'>
					{status.error}
				</p>
			)}
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={insert}
					disabled={status.busy}
					className='min-h-10 rounded-lg bg-olive px-4 text-sm text-white hover:bg-olive-deep disabled:opacity-50'
				>
					Insert image
				</button>
				<button type='button' onClick={onDone} className='min-h-10 rounded-lg px-3 text-sm hover:bg-cream'>
					Cancel
				</button>
			</div>
		</div>
	);
}

function Toolbar({ editor }: { editor: Editor }) {
	const [panel, setPanel] = useState<'link' | 'image' | null>(null);
	const s = useEditorState({
		editor,
		selector: ({ editor: e }) => ({
			h2: e.isActive('heading', { level: 2 }),
			h3: e.isActive('heading', { level: 3 }),
			bold: e.isActive('bold'),
			italic: e.isActive('italic'),
			bullet: e.isActive('bulletList'),
			ordered: e.isActive('orderedList'),
			quote: e.isActive('blockquote'),
			link: e.isActive('link'),
			canUndo: e.can().undo(),
			canRedo: e.can().redo(),
		}),
	});
	const run = (fn: (c: ReturnType<Editor['chain']>) => ReturnType<Editor['chain']>) => fn(editor.chain().focus()).run();

	return (
		<div className='sticky top-14 z-10 border-b border-line bg-white'>
			<div role='toolbar' aria-label='Formatting' className='mx-auto flex max-w-[728px] flex-wrap items-center gap-0.5 px-2 py-1.5 sm:px-4'>
				<ToolButton label='Heading' active={s.h2} onClick={() => run((c) => c.toggleHeading({ level: 2 }))}>
					<span className='font-semibold'>H2</span>
				</ToolButton>
				<ToolButton label='Subheading' active={s.h3} onClick={() => run((c) => c.toggleHeading({ level: 3 }))}>
					<span className='font-semibold'>H3</span>
				</ToolButton>
				<Divider />
				<ToolButton label='Bold' active={s.bold} onClick={() => run((c) => c.toggleBold())}>
					<strong>B</strong>
				</ToolButton>
				<ToolButton label='Italic' active={s.italic} onClick={() => run((c) => c.toggleItalic())}>
					<em className='font-serif'>I</em>
				</ToolButton>
				<ToolButton label='Link' active={s.link || panel === 'link'} onClick={() => setPanel(panel === 'link' ? null : 'link')}>
					<svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
						<path d='M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7' />
					</svg>
				</ToolButton>
				<Divider />
				<ToolButton label='Bullet list' active={s.bullet} onClick={() => run((c) => c.toggleBulletList())}>
					<svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
						<path d='M9 6h11M9 12h11M9 18h11' />
						<circle cx='4' cy='6' r='1' fill='currentColor' />
						<circle cx='4' cy='12' r='1' fill='currentColor' />
						<circle cx='4' cy='18' r='1' fill='currentColor' />
					</svg>
				</ToolButton>
				<ToolButton label='Numbered list' active={s.ordered} onClick={() => run((c) => c.toggleOrderedList())}>
					<span className='text-xs font-semibold'>1.</span>
				</ToolButton>
				<ToolButton label='Quote' active={s.quote} onClick={() => run((c) => c.toggleBlockquote())}>
					<span className='font-display text-xl leading-none'>&ldquo;</span>
				</ToolButton>
				<ToolButton label='Divider line' onClick={() => run((c) => c.setHorizontalRule())}>
					<span aria-hidden='true'>—</span>
				</ToolButton>
				<ToolButton label='Image' active={panel === 'image'} onClick={() => setPanel(panel === 'image' ? null : 'image')}>
					<svg viewBox='0 0 24 24' className='h-4 w-4' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
						<rect x='3' y='4' width='18' height='16' rx='2' />
						<circle cx='9' cy='10' r='2' />
						<path d='m21 16-5-5-9 9' />
					</svg>
				</ToolButton>
				<Divider />
				<ToolButton label='Undo' disabled={!s.canUndo} onClick={() => run((c) => c.undo())}>
					<span aria-hidden='true'>↶</span>
				</ToolButton>
				<ToolButton label='Redo' disabled={!s.canRedo} onClick={() => run((c) => c.redo())}>
					<span aria-hidden='true'>↷</span>
				</ToolButton>
			</div>
			{panel === 'link' && <LinkForm editor={editor} onDone={() => setPanel(null)} />}
			{panel === 'image' && <ImageForm editor={editor} onDone={() => setPanel(null)} />}
		</div>
	);
}

export function RichTextEditor({
	value,
	onChange,
	labelledBy,
	describedBy,
	invalid,
	header,
}: {
	value: RichTextNode;
	onChange: (doc: RichTextNode) => void;
	labelledBy: string;
	describedBy?: string;
	invalid?: boolean;
	/** Shown between the toolbar and the writing area (the title and subtitle). */
	header?: ReactNode;
}) {
	// Keep the latest onChange without recreating the editor.
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3, 4] },
				code: false,
				codeBlock: false,
				strike: false,
				underline: false,
				link: {
					openOnClick: false,
					autolink: true,
					protocols: ['mailto', 'tel'],
					HTMLAttributes: { rel: 'noopener noreferrer', target: null },
				},
			}),
			Image.configure({ allowBase64: false }),
			Placeholder.configure({ placeholder: 'Start writing…' }),
		],
		content: value,
		editorProps: {
			attributes: {
				class: 'prose-ivorris min-h-[50dvh] pb-32 focus:outline-none',
				role: 'textbox',
				'aria-multiline': 'true',
				'aria-labelledby': labelledBy,
				...(describedBy ? { 'aria-describedby': describedBy } : {}),
				...(invalid ? { 'aria-invalid': 'true' } : {}),
			},
		},
		// ProseMirror builds attribute objects without a prototype, which server
		// actions can't receive; a JSON round trip turns them into plain objects.
		onUpdate: ({ editor: e }) => onChangeRef.current(JSON.parse(JSON.stringify(e.getJSON())) as RichTextNode),
	});

	return (
		<>
			{editor ? <Toolbar editor={editor} /> : <div className='h-12 border-b border-line' />}
			<div className='mx-auto max-w-[728px] px-4 sm:px-6'>
				{header}
				<EditorContent editor={editor} className='rich-editor mt-6' />
			</div>
		</>
	);
}
