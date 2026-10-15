/**
 * Illustrated avatar for the assistant's voice: a friendly Asian woman nurse.
 * A drawing, not a photo of a real staff member. Decorative.
 */
export function NurseAvatar({ speaking = false, className = '' }: { speaking?: boolean; className?: string }) {
	return (
		<span className={`relative inline-grid shrink-0 place-items-center ${className}`} aria-hidden='true'>
			{/* Soft glow while speaking (still, if reduced motion is preferred). */}
			<span className={`avatar-glow absolute inset-0 rounded-full ${speaking ? 'is-speaking' : ''}`} />
			<svg viewBox='0 0 64 64' className='relative h-full w-full'>
				<circle cx='32' cy='32' r='32' fill='#EBE5DF' />
				{/* Hair back and bun */}
				<circle cx='32' cy='12' r='7' fill='#1f1a17' />
				<path d='M14 30c0-12 8-19 18-19s18 7 18 19v12H14V30Z' fill='#1f1a17' />
				{/* Scrubs */}
				<path d='M10 64c1-11 10-17 22-17s21 6 22 17H10Z' fill='#596042' />
				<path d='M26 47l6 7 6-7' fill='none' stroke='#EBE5DF' strokeWidth='2' strokeLinejoin='round' />
				{/* Neck and face */}
				<path d='M27 40h10v8a5 5 0 0 1-10 0v-8Z' fill='#e2b48c' />
				<ellipse cx='32' cy='31' rx='11.5' ry='13' fill='#ecc39b' />
				{/* Fringe */}
				<path d='M20.5 28c2-8 7-12 12.5-12 4 0 9 3 10.5 9-5-1-10-4-12-7-2 5-6 8-11 10Z' fill='#1f1a17' />
				{/* Eyes, cheeks and a warm smile */}
				<path d='M26 32c1.2-1.2 2.8-1.2 4 0M34 32c1.2-1.2 2.8-1.2 4 0' fill='none' stroke='#1f1a17' strokeWidth='1.6' strokeLinecap='round' />
				<circle cx='25.5' cy='36' r='2' fill='#e89b8a' opacity='0.55' />
				<circle cx='38.5' cy='36' r='2' fill='#e89b8a' opacity='0.55' />
				<path d='M28.5 38c2 2 5 2 7 0' fill='none' stroke='#9b4a3a' strokeWidth='1.6' strokeLinecap='round' />
			</svg>
		</span>
	);
}
