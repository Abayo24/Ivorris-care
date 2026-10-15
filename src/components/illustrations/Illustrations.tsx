import type { ReactNode } from 'react';

/*
 * Brand illustrations, drawn in the Ivorris palette. All are decorative
 * (hidden from screen readers). Line colour follows `currentColor`, so set it
 * with a text colour class (e.g. text-olive). Lines marked `.draw` draw
 * themselves in as the illustration scrolls into view — see globals.css; with
 * reduced motion, or in browsers without scroll animations, they simply show.
 */

function Svg({ children, className = '', viewBox = '0 0 240 180' }: { children: ReactNode; className?: string; viewBox?: string }) {
	return (
		<svg
			viewBox={viewBox}
			className={`illustration ${className}`}
			fill='none'
			stroke='currentColor'
			strokeWidth={3}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden='true'
			focusable='false'
		>
			{children}
		</svg>
	);
}

/** Step 1 — Assess: clipboard with a checklist and a heart. */
export function AssessIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='96' r='72' className='fill-cream' stroke='none' />
			<rect x='78' y='34' width='84' height='112' rx='10' className='fill-white' />
			<rect x='100' y='26' width='40' height='18' rx='6' className='fill-sun' />
			<path className='draw' pathLength={1} d='M94 70l6 6 12-12M94 98l6 6 12-12' />
			<path className='draw' pathLength={1} d='M122 72h26M122 100h26M94 126h54' />
			<path
				className='fill-sun'
				stroke='none'
				d='M178 116c-4-9-18-8-18 3 0 9 18 19 18 19s18-10 18-19c0-11-14-12-18-3Z'
			/>
		</Svg>
	);
}

/** Step 2 — Connect: a person linked to the right people and resources. */
export function ConnectIllustration({ className }: { className?: string }) {
	const nodes: [number, number][] = [
		[52, 46],
		[188, 46],
		[36, 124],
		[204, 124],
		[120, 160],
	];
	return (
		<Svg className={className}>
			<circle cx='120' cy='92' r='74' className='fill-cream' stroke='none' />
			{nodes.map(([x, y]) => (
				<path key={`l${x}${y}`} className='draw' pathLength={1} d={`M120 92L${x} ${y}`} />
			))}
			{nodes.map(([x, y], i) => (
				<circle key={`n${x}${y}`} cx={x} cy={y} r='13' className={i % 2 ? 'fill-olive-tint' : 'fill-white'} />
			))}
			<circle cx='120' cy='92' r='26' className='fill-white' />
			<path
				className='fill-sun'
				stroke='none'
				d='M120 84c-5-10-20-9-20 3 0 10 20 21 20 21s20-11 20-21c0-12-15-13-20-3Z'
			/>
		</Svg>
	);
}

/** Step 3 — Coordinate: separate pieces fitting together into one path. */
export function CoordinateIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='92' r='72' className='fill-cream' stroke='none' />
			<path className='draw' pathLength={1} d='M40 140c30 0 30-40 60-40s30-40 60-40 28 22 40 22' />
			<circle cx='40' cy='140' r='10' className='fill-white' />
			<circle cx='100' cy='100' r='10' className='fill-olive-tint' />
			<circle cx='160' cy='60' r='10' className='fill-white' />
			<path d='M188 70l14-12 14 12v18h-28V70Z' className='fill-sun' />
			<path d='M198 88v-8h8v8' />
		</Svg>
	);
}

/** Step 4 — Follow up: calendar with a check and a friendly message. */
export function FollowUpIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='94' r='72' className='fill-cream' stroke='none' />
			<rect x='62' y='46' width='96' height='92' rx='10' className='fill-white' />
			<path d='M62 70h96' />
			<path d='M86 38v16M134 38v16' />
			<path className='draw' pathLength={1} d='M90 102l14 14 26-28' />
			<path d='M150 104h52a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8h-28l-14 12v-12h-10a8 8 0 0 1-8-8v-24a8 8 0 0 1 8-8Z' className='fill-sun' />
			<path d='M162 124h4M176 124h4M190 124h4' strokeWidth={4} />
		</Svg>
	);
}

/** Two chat bubbles and a phone — for conversation / contact moments. */
export function ChatIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='92' r='74' className='fill-cream' stroke='none' />
			<rect x='86' y='28' width='68' height='128' rx='14' className='fill-white' />
			<path d='M110 40h20' />
			<path d='M48 62h70a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10H70l-16 14v-14h-6a10 10 0 0 1-10-10V72a10 10 0 0 1 10-10Z' className='fill-olive-tint' />
			<path className='draw' pathLength={1} d='M56 80h46M56 92h30' />
			<path d='M120 110h70a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10h-6v14l-16-14h-48a10 10 0 0 1-10-10v-20a10 10 0 0 1 10-10Z' className='fill-sun' />
			<path className='draw' pathLength={1} d='M132 128h44M132 138h26' />
		</Svg>
	);
}

/** A home with a heart and a plant — for warm, empty or "coming soon" states. */
export function HomeCareIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='96' r='72' className='fill-cream' stroke='none' />
			<path d='M66 92l54-44 54 44v58H66V92Z' className='fill-white' />
			<path className='draw' pathLength={1} d='M54 100l66-56 66 56' />
			<rect x='106' y='112' width='28' height='38' rx='4' className='fill-olive-tint' />
			<path
				className='fill-sun'
				stroke='none'
				d='M120 82c-4-8-16-7-16 2 0 8 16 17 16 17s16-9 16-17c0-9-12-10-16-2Z'
			/>
			<path d='M186 150v-26M186 132c-10-2-14-10-12-18 8 0 14 6 12 18ZM186 128c8-4 14-12 12-20-8 2-12 10-12 20Z' />
			<path d='M40 150h160' />
		</Svg>
	);
}

/** A signpost — for "page not found". */
export function SignpostIllustration({ className }: { className?: string }) {
	return (
		<Svg className={className}>
			<circle cx='120' cy='94' r='72' className='fill-cream' stroke='none' />
			<path d='M120 44v112' />
			<path d='M120 56h56l14 14-14 14h-56V56Z' className='fill-sun' />
			<path d='M120 92H66L52 106l14 14h54V92Z' className='fill-olive-tint' />
			<path className='draw' pathLength={1} d='M84 156c10-8 62-8 72 0' />
		</Svg>
	);
}
