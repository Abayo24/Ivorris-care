import type { SVGProps } from 'react';

/* Lightweight stroke icons (24×24). Decorative by default — pass aria-label to expose one. */

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
	return (
		<svg
			viewBox='0 0 24 24'
			width='1em'
			height='1em'
			fill='none'
			stroke='currentColor'
			strokeWidth={1.75}
			strokeLinecap='round'
			strokeLinejoin='round'
			aria-hidden={props['aria-label'] ? undefined : true}
			focusable='false'
			{...props}
		>
			{children}
		</svg>
	);
}

export const ArrowRight = (p: IconProps) => (
	<Icon {...p}>
		<path d='M5 12h14M13 6l6 6-6 6' />
	</Icon>
);
export const ArrowUpRight = (p: IconProps) => (
	<Icon {...p}>
		<path d='M7 17 17 7M8 7h9v9' />
	</Icon>
);
export const Phone = (p: IconProps) => (
	<Icon {...p}>
		<path d='M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z' />
	</Icon>
);
export const Mail = (p: IconProps) => (
	<Icon {...p}>
		<rect x='2' y='4' width='20' height='16' rx='2' />
		<path d='m22 7-10 6L2 7' />
	</Icon>
);
export const Chat = (p: IconProps) => (
	<Icon {...p}>
		<path d='M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5Z' />
	</Icon>
);
export const MapPin = (p: IconProps) => (
	<Icon {...p}>
		<path d='M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z' />
		<circle cx='12' cy='10' r='3' />
	</Icon>
);
export const Menu = (p: IconProps) => (
	<Icon {...p}>
		<path d='M4 7h16M4 12h16M4 17h16' />
	</Icon>
);
export const Close = (p: IconProps) => (
	<Icon {...p}>
		<path d='M6 6l12 12M18 6 6 18' />
	</Icon>
);
export const Check = (p: IconProps) => (
	<Icon {...p}>
		<path d='m5 12 4.5 4.5L19 7' />
	</Icon>
);
export const Plus = (p: IconProps) => (
	<Icon {...p}>
		<path d='M12 5v14M5 12h14' />
	</Icon>
);
export const Search = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='11' cy='11' r='7' />
		<path d='m20 20-3.5-3.5' />
	</Icon>
);
export const Compass = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='12' cy='12' r='9' />
		<path d='m15.5 8.5-2 5-5 2 2-5 5-2Z' />
	</Icon>
);
export const Stethoscope = (p: IconProps) => (
	<Icon {...p}>
		<path d='M5 3v5a5 5 0 0 0 10 0V3' />
		<path d='M10 13v2a5 5 0 0 0 10 0v-2' />
		<circle cx='20' cy='11' r='2' />
	</Icon>
);
export const HomeHeart = (p: IconProps) => (
	<Icon {...p}>
		<path d='M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5Z' />
		<path d='M12 17s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8Z' />
	</Icon>
);
export const ClipboardHeart = (p: IconProps) => (
	<Icon {...p}>
		<rect x='5' y='4' width='14' height='17' rx='2' />
		<path d='M9 4V3h6v1' />
		<path d='M12 16s-3-1.8-3-3.8a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8c0 2-3 3.8-3 3.8Z' />
	</Icon>
);
export const Hospital = (p: IconProps) => (
	<Icon {...p}>
		<path d='M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16' />
		<path d='M12 7v6M9 10h6M2 21h20M10 21v-4h4v4' />
	</Icon>
);
export const Users = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='9' cy='8' r='3.5' />
		<path d='M2.5 20a6.5 6.5 0 0 1 13 0' />
		<path d='M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5' />
	</Icon>
);
export const Activity = (p: IconProps) => (
	<Icon {...p}>
		<path d='M3 12h4l3-8 4 16 3-8h4' />
	</Icon>
);
export const HandHelping = (p: IconProps) => (
	<Icon {...p}>
		<path d='M11 12h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14' />
		<path d='m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.8-2.8l-4.2 3.9' />
		<path d='m2 13 6 6' />
	</Icon>
);
export const Apple = (p: IconProps) => (
	<Icon {...p}>
		<path d='M12 7c-1.5-1-5-1.5-6.5 1.5S5 16 7.5 19c1.4 1.7 3 1.5 4.5.8 1.5.7 3.1.9 4.5-.8 2.5-3 3.5-7.5 2-10.5S13.5 6 12 7Z' />
		<path d='M12 7c0-2 1-3.5 3-4' />
	</Icon>
);
export const Wheelchair = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='10' cy='4' r='1.5' />
		<path d='M10 7v6h6l3 6' />
		<path d='M7 10.5a6 6 0 1 0 8.5 7' />
	</Icon>
);
export const Microscope = (p: IconProps) => (
	<Icon {...p}>
		<path d='M6 18h8M3 22h18M14 22a7 7 0 1 0 0-14' />
		<path d='M9 14h2M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z' />
		<path d='M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3' />
	</Icon>
);
export const Pill = (p: IconProps) => (
	<Icon {...p}>
		<path d='m10.5 20.5 10-10a5 5 0 0 0-7-7l-10 10a5 5 0 0 0 7 7Z' />
		<path d='m8.5 8.5 7 7' />
	</Icon>
);
export const Network = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='12' cy='5' r='2.5' />
		<circle cx='5' cy='19' r='2.5' />
		<circle cx='19' cy='19' r='2.5' />
		<path d='M12 7.5v4M12 11.5l-5.5 5.5M12 11.5l5.5 5.5' />
	</Icon>
);
export const ShieldCheck = (p: IconProps) => (
	<Icon {...p}>
		<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z' />
		<path d='m9 12 2 2 4-4' />
	</Icon>
);
export const Ear = (p: IconProps) => (
	<Icon {...p}>
		<path d='M6 8.5a6 6 0 1 1 12 0c0 3.5-3 4.5-3 7.5a3.5 3.5 0 0 1-6.5 1.8' />
		<path d='M15 8.5a3 3 0 1 0-6 0' />
	</Icon>
);
export const Calendar = (p: IconProps) => (
	<Icon {...p}>
		<rect x='3' y='5' width='18' height='16' rx='2' />
		<path d='M16 3v4M8 3v4M3 11h18' />
	</Icon>
);
export const Clock = (p: IconProps) => (
	<Icon {...p}>
		<circle cx='12' cy='12' r='9' />
		<path d='M12 7v5l3 2' />
	</Icon>
);
