'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { Logo } from '@/components/brand/Logo';
import { Close, Menu, Phone } from '@/components/ui/Icons';
import { ButtonLink } from '@/components/ui/primitives';
import { mainNav, primaryCta, site } from '@/content/site';

function isActive(pathname: string, href: string) {
	if (href.includes('#')) return false;
	return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

const mobileNav = [{ label: 'Home', href: '/' }, ...mainNav, { label: 'Contact', href: '/contact' }];

/** Pages whose first section is a dark photo, so the transparent header uses light text. */
const darkHeroPaths = new Set(['/']);

// Scroll position as an external store: no re-render on every scroll event,
// only when the page crosses the threshold.
function subscribeScroll(onChange: () => void) {
	window.addEventListener('scroll', onChange, { passive: true });
	return () => window.removeEventListener('scroll', onChange);
}
const isScrolled = () => window.scrollY > 12;
const isScrolledOnServer = () => false;

export function Header() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [lastPath, setLastPath] = useState(pathname);
	const toggleRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, isScrolledOnServer);
	// Transparent over the top of the page; solid once content scrolls underneath.
	const light = darkHeroPaths.has(pathname) && !scrolled;

	// Close the mobile menu whenever the route changes.
	if (pathname !== lastPath) {
		setLastPath(pathname);
		setOpen(false);
	}

	useEffect(() => {
		if (!open) return;
		const panel = panelRef.current;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		panel?.querySelector<HTMLElement>('a[href]')?.focus();

		const close = () => {
			setOpen(false);
			toggleRef.current?.focus();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') return close();
			// Keep keyboard focus inside the open menu.
			if (e.key === 'Tab' && panel) {
				const items = panel.querySelectorAll<HTMLElement>('a[href], button');
				const first = items[0];
				const last = items[items.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};
		// Close if the viewport grows to desktop size while open.
		const desktop = window.matchMedia('(min-width: 1024px)');
		const onResize = () => desktop.matches && setOpen(false);

		document.addEventListener('keydown', onKey);
		desktop.addEventListener('change', onResize);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener('keydown', onKey);
			desktop.removeEventListener('change', onResize);
		};
	}, [open]);

	return (
		<>
			<header
				className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
					scrolled ? 'bg-white shadow-[0_1px_0_var(--line),0_8px_24px_-16px_rgba(35,37,31,0.25)]' : 'bg-transparent'
				}`}
			>
				<div className='mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-10'>
					<Logo tone={light ? 'light' : 'dark'} />

					<nav aria-label='Main' className='hidden lg:block'>
						<ul className='flex items-center gap-1'>
							{mainNav.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											aria-current={active ? 'page' : undefined}
											className={`relative rounded-pill px-3 py-2 text-[0.94rem] whitespace-nowrap transition-colors xl:px-3.5 ${
												light
													? active
														? 'bg-white/15 font-medium text-white'
														: 'text-white/90 hover:bg-white/10 hover:text-white'
													: active
														? 'bg-olive-tint font-medium text-olive-deep'
														: 'text-ink hover:text-olive-deep'
											}`}
										>
											{item.label}
										</Link>
									</li>
								);
							})}
						</ul>
					</nav>

					<div className='hidden shrink-0 items-center gap-4 lg:flex'>
						<a
							href={site.contact.phoneHref}
							className={`hidden items-center gap-2 text-sm font-medium whitespace-nowrap xl:inline-flex ${
								light ? 'text-white hover:underline' : 'text-ink hover:text-olive-deep'
							}`}
						>
							<Phone className={`h-4 w-4 ${light ? 'text-sun' : 'text-olive'}`} />
							{site.contact.phoneDisplay}
						</a>
						<ButtonLink href={primaryCta.href} className='whitespace-nowrap'>
							{primaryCta.label}
						</ButtonLink>
					</div>

					<button
						ref={toggleRef}
						type='button'
						className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${
							light ? 'border-white/50 bg-black/20 text-white backdrop-blur-sm' : 'border-line bg-white text-ink'
						}`}
						aria-expanded={open}
						aria-controls='mobile-menu'
						onClick={() => setOpen(true)}
					>
						<span className='sr-only'>Open menu</span>
						<Menu className='h-5 w-5' />
					</button>
				</div>
			</header>

			{/*
			 * Full-screen menu rendered outside <header>: a fixed element nested in
			 * an element with filters/transforms is clipped to that element.
			 */}
			{open && (
				<div
					id='mobile-menu'
					ref={panelRef}
					role='dialog'
					aria-modal='true'
					aria-label='Site menu'
					className='fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white lg:hidden'
				>
					<div className='flex h-18 shrink-0 items-center justify-between border-b border-line px-4 sm:px-6'>
						<Logo />
						<button
							type='button'
							onClick={() => {
								setOpen(false);
								toggleRef.current?.focus();
							}}
							className='inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink'
						>
							<span className='sr-only'>Close menu</span>
							<Close className='h-5 w-5' />
						</button>
					</div>
					<nav aria-label='Mobile' className='flex-1 px-4 py-4 sm:px-6'>
						<ul className='divide-y divide-line'>
							{mobileNav.map((item) => {
								const active = isActive(pathname, item.href);
								return (
									<li key={item.href}>
										<Link
											href={item.href}
											onClick={() => setOpen(false)}
											aria-current={active ? 'page' : undefined}
											className={`flex items-center justify-between py-4 font-display text-2xl ${
												active ? 'text-olive-deep' : 'text-ink'
											}`}
										>
											{item.label}
											{active && <span className='h-2 w-2 rounded-full bg-sun' aria-hidden='true' />}
										</Link>
									</li>
								);
							})}
						</ul>
						<div className='mt-6 rounded-card bg-cream p-5'>
							<p className='font-display text-xl'>{primaryCta.heading}</p>
							<div className='mt-4 flex flex-col gap-3'>
								<ButtonLink href={primaryCta.href} onClick={() => setOpen(false)}>
									{primaryCta.label}
								</ButtonLink>
								<a
									href={site.contact.phoneHref}
									className='inline-flex min-h-12 items-center justify-center gap-2 rounded-pill border border-ink/20 bg-white font-medium'
								>
									<Phone className='h-4 w-4 text-olive' /> Call {site.contact.phoneDisplay}
								</a>
							</div>
						</div>
					</nav>
				</div>
			)}
		</>
	);
}
