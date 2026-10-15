import {
	AssessIllustration,
	ConnectIllustration,
	CoordinateIllustration,
	FollowUpIllustration,
} from '@/components/illustrations/Illustrations';
import { processSteps } from '@/content/home';

const illustrations = [AssessIllustration, ConnectIllustration, CoordinateIllustration, FollowUpIllustration];

/** The four-step Ivorris approach: Assess → Connect → Coordinate → Follow up. */
export function ProcessSteps() {
	return (
		<ol className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			{processSteps.map((step, i) => {
				const Illustration = illustrations[i];
				return (
					<li
						key={step.key}
						className='reveal group flex flex-col rounded-card border border-line bg-surface p-6 transition-colors duration-300 hover:border-olive hover:bg-olive focus-within:bg-olive sm:p-7'
					>
						<Illustration className='h-28 w-auto self-start text-olive transition-colors group-hover:text-olive-deep' />
						<span
							className='mt-5 font-display text-4xl leading-none text-olive transition-colors group-hover:text-sun'
							aria-hidden='true'
						>
							{String(i + 1).padStart(2, '0')}
						</span>
						<h3 className='mt-4 font-sans text-sm font-semibold tracking-[0.12em] text-ink uppercase transition-colors group-hover:text-white'>
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
				);
			})}
		</ol>
	);
}
