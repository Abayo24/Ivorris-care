import Link from 'next/link';

import { logout } from '@/app/admin/actions';
import { LogoMark } from '@/components/brand/Logo';
import { ArrowUpRight } from '@/components/ui/Icons';

/** Header for the article list and preview. The editor has its own minimal bar. */
export default function ShellLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<a
				href='#admin-main'
				className='sr-only z-50 rounded-pill bg-olive px-5 py-3 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
			>
				Skip to main content
			</a>
			<header className='sticky top-0 z-30 border-b border-line bg-white'>
				<div className='mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6'>
					<div className='flex items-center gap-2.5'>
						<Link href='/' aria-label='Ivorris Care — home page' className='flex items-center gap-2.5 text-olive'>
							<LogoMark className='h-7 w-auto' />
							<span className='font-display text-xl font-semibold'>Ivorris Care</span>
						</Link>
						<span className='hidden rounded-pill bg-olive-tint px-2.5 py-0.5 text-xs font-medium text-olive-deep sm:inline'>
							Dashboard
						</span>
					</div>
					<nav aria-label='Dashboard' className='flex items-center gap-1 text-sm'>
						<Link href='/admin' className='rounded-lg px-3 py-2 hover:bg-cream'>
							Articles
						</Link>
						<a
							href='/blog'
							target='_blank'
							rel='noopener noreferrer'
							className='hidden items-center gap-1 rounded-lg px-3 py-2 hover:bg-cream sm:inline-flex'
						>
							View blog <ArrowUpRight className='h-3.5 w-3.5' />
							<span className='sr-only'>(opens in a new tab)</span>
						</a>
						<form action={logout}>
							<button type='submit' className='rounded-lg px-3 py-2 text-ink-muted hover:bg-cream hover:text-ink'>
								Sign out
							</button>
						</form>
					</nav>
				</div>
			</header>
			<main id='admin-main' tabIndex={-1} className='outline-none'>
				{children}
			</main>
		</>
	);
}
