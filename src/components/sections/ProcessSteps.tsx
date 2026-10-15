import { processSteps } from '@/content/home';

/** The four-step Ivorris approach: Assess → Connect → Coordinate → Follow up. */
export function ProcessSteps() {
	return (
		<ol className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			{processSteps.map((step, i) => (
				<li
					key={step.key}
					className='group flex flex-col rounded-card border border-line bg-surface p-6 transition-colors duration-300 hover:border-olive hover:bg-olive focus-within:bg-olive sm:p-7'
				>
					<span
						className='font-display text-5xl leading-none text-olive transition-colors group-hover:text-sun'
						aria-hidden='true'
					>
						{String(i + 1).padStart(2, '0')}
					</span>
					<h3 className='mt-10 font-sans text-sm font-semibold tracking-[0.12em] text-ink uppercase transition-colors group-hover:text-white'>
						<span className='sr-only'>Step {i + 1}: </span>
						{step.title}
					</h3>
					<p className='mt-2 font-display text-xl leading-snug text-ink transition-colors group-hover:text-white'>
						{step.lead}
					</p>
					<p className='mt-3 text-[0.95rem] text-ink-muted transition-colors group-hover:text-cream/90'>
						{step.body}
					</p>
				</li>
			))}
		</ol>
	);
}
