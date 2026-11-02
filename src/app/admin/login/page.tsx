import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/admin/LoginForm';
import { LogoMark } from '@/components/brand/Logo';
import { isAdminConfigured, isSignedIn } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage() {
	if (await isSignedIn()) redirect('/admin');
	const configured = isAdminConfigured();

	return (
		<main className='grid min-h-dvh place-items-center px-4 py-12'>
			<div className='w-full max-w-sm rounded-card border border-line bg-white p-8 shadow-[0_20px_60px_-30px_rgb(35_37_31/0.35)]'>
				<Link href='/' aria-label='Ivorris Care — home page' className='flex w-fit items-center gap-2.5 text-olive'>
					<LogoMark className='h-8 w-auto' />
					<span className='font-display text-2xl font-semibold'>Ivorris Care</span>
				</Link>
				<h1 className='mt-6 font-sans text-xl font-semibold'>Sign in to the dashboard</h1>
				{configured ? (
					<>
						<p className='mt-1 text-sm text-ink-muted'>Write and publish articles for the website.</p>
						<LoginForm />
					</>
				) : (
					<div role='note' className='mt-4 rounded-2xl bg-sun/15 p-4 text-sm text-ink'>
						<p className='font-medium'>The dashboard isn&apos;t set up yet.</p>
						<p className='mt-1 text-ink-muted'>
							Add an <code className='rounded bg-white px-1'>ADMIN_PASSWORD</code> (at least 12 characters) in
							Vercel → Project → Settings → Environment Variables, then redeploy. See docs/OWNER-GUIDE.md.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
