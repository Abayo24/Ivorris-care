import type { Faq } from '@/content/services';
import { Plus } from '@/components/ui/Icons';

/**
 * FAQ accordion built on native <details>/<summary>: keyboard operable and
 * readable by search engines and assistive technology without JavaScript.
 */
export function FaqList({ faqs, headingLevel = 3 }: { faqs: Faq[]; headingLevel?: 3 | 4 }) {
	const Heading = headingLevel === 3 ? 'h3' : 'h4';
	return (
		<div className='reveal divide-y divide-line rounded-card border border-line bg-surface'>
			{faqs.map((faq) => (
				<details key={faq.question} className='group px-5 sm:px-7'>
					<summary className='flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden'>
						<Heading className='font-sans text-base font-semibold text-ink sm:text-[1.05rem]'>
							{faq.question}
						</Heading>
						<span
							className='grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cream text-olive-deep transition-transform duration-200 group-open:rotate-45'
							aria-hidden='true'
						>
							<Plus className='h-4 w-4' />
						</span>
					</summary>
					<p className='-mt-1 max-w-3xl pb-6 text-ink-muted'>{faq.answer}</p>
				</details>
			))}
		</div>
	);
}
