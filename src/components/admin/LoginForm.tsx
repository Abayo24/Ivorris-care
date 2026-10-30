'use client';

import { useActionState, useState } from 'react';

import { login, type LoginState } from '@/app/admin/actions';

export function LoginForm() {
	const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
	const [show, setShow] = useState(false);

	return (
		<form action={action} className='mt-6 space-y-4'>
			<div>
				<label htmlFor='password' className='block text-sm font-medium'>
					Password
				</label>
				<div className='relative mt-1.5'>
					<input
						id='password'
						name='password'
						type={show ? 'text' : 'password'}
						autoComplete='current-password'
						required
						aria-invalid={state.error ? true : undefined}
						aria-describedby={state.error ? 'login-error' : undefined}
						className='block min-h-12 w-full rounded-xl border border-line bg-white px-4 pr-20 text-base focus:border-olive focus:ring-2 focus:ring-olive/30 focus:outline-none'
					/>
					<button
						type='button'
						onClick={() => setShow((s) => !s)}
						aria-pressed={show}
						className='absolute top-1/2 right-2 -translate-y-1/2 rounded-lg px-2.5 py-1.5 text-sm text-olive-deep hover:bg-cream'
					>
						{show ? 'Hide' : 'Show'}
					</button>
				</div>
			</div>
			{state.error && (
				<p id='login-error' role='alert' className='text-sm text-[#a3311f]'>
					{state.error}
				</p>
			)}
			<button
				type='submit'
				disabled={pending}
				className='inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-olive px-6 font-medium text-white hover:bg-olive-deep disabled:opacity-60'
			>
				{pending ? 'Signing in…' : 'Sign in'}
			</button>
		</form>
	);
}
