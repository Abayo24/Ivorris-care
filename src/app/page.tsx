'use client';

import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SETUP INSTRUCTIONS
//
// 1. Copy tailwind.config.ts into your project root (extends colors, fonts,
//    animations, backgroundImage with brand tokens).
//
// 2. Add to app/layout.tsx <head>:
//    <link rel="preconnect" href="https://fonts.googleapis.com" />
//    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
//
// 3. Add to globals.css:
//    html { scroll-behavior: smooth; }
//    body { font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

interface Service {
	num: string;
	title: string;
	desc: string;
	icon: React.ReactNode;
}
interface Package {
	tier: string;
	name: string;
	variant:
		| 'basic'
		| 'standard'
		| 'premium'
		| 'platinum'
		| 'antenatal'
		| 'postnatal'
		| 'womens';
	badge?: string;
	desc: string;
	features: string[];
	team: string;
}
interface PayOpt {
	title: string;
	desc: string;
	icon: React.ReactNode;
}
interface ChatMsg {
	role: 'bot' | 'user';
	text: string;
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const HeartIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.009 4.007 1 6.5 1c1.888 0 3.7 1.028 4.5 2.5C11.8 2.028 13.612 1 15.5 1 17.993 1 21 3.01 21 7.191c0 4.105-5.37 8.863-11 14.402z' />
	</svg>
);
const PhoneIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		className={c}
	>
		<path d='M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.28-1.28a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z' />
	</svg>
);
const ArrowRight = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2}
		className={c}
	>
		<path d='M5 12h14M12 5l7 7-7 7' />
	</svg>
);
const SendIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={2.5}
		className={c}
	>
		<path d='M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z' />
	</svg>
);
const ShieldIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
	</svg>
);
const ActivityIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M22 12h-4l-3 9L9 3l-3 9H2' />
	</svg>
);
const UsersIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
		<circle cx='9' cy='7' r='4' />
		<path d='M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' />
	</svg>
);
const ClockIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<circle cx='12' cy='12' r='10' />
		<polyline points='12,6 12,12 16,14' />
	</svg>
);
const GridIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<rect x='3' y='3' width='18' height='18' rx='2' />
		<path d='M3 9h18M9 21V9' />
	</svg>
);
const PlusHeartIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z' />
		<path d='M12 8v8M8 12h8' />
	</svg>
);
const SmileIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<circle cx='12' cy='12' r='10' />
		<path d='M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01' />
	</svg>
);
const CalendarIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<rect x='3' y='4' width='18' height='18' rx='2' />
		<path d='M16 2v4M8 2v4M3 10h18' />
	</svg>
);
const DollarIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' />
	</svg>
);
const ContractIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<path d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.07-.16-2.101-.382-3.016z' />
	</svg>
);
const MonitorIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<rect x='2' y='3' width='20' height='14' rx='2' />
		<path d='M8 21h8M12 17v4' />
	</svg>
);
const InfoIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<circle cx='12' cy='12' r='10' />
		<path d='M12 16v-4M12 8h.01' />
	</svg>
);
const BabyIcon = ({ c = '' }: { c?: string }) => (
	<svg
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth={1.5}
		className={c}
	>
		<circle cx='12' cy='6' r='4' />
		<path d='M6 22v-2a6 6 0 0112 0v2' />
	</svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES: Service[] = [
	{
		num: '01',
		title: 'Elderly Care',
		icon: <HeartIcon c='w-5 h-5' />,
		desc: 'Compassionate daily support for seniors — grooming, mobility assistance, medication reminders, and emotional companionship.',
	},
	{
		num: '02',
		title: 'Physiotherapy',
		icon: <ActivityIcon c='w-5 h-5' />,
		desc: 'Skilled physiotherapists for rehabilitation, mobility recovery, and movement therapy in the comfort of your home.',
	},
	{
		num: '03',
		title: 'Wound Care',
		icon: <GridIcon c='w-5 h-5' />,
		desc: 'Professional wound dressing and advanced wound management, including post-surgical care and pressure sore treatment.',
	},
	{
		num: '04',
		title: 'Medication Administration',
		icon: <ActivityIcon c='w-5 h-5' />,
		desc: 'Safe oral and injectable medication administration by qualified nurses, with detailed documentation and monitoring.',
	},
	{
		num: '05',
		title: 'Palliative Care',
		icon: <SmileIcon c='w-5 h-5' />,
		desc: 'Dignified, compassionate end-of-life support providing comfort, pain management, and family guidance.',
	},
	{
		num: '06',
		title: 'Post-Operative Care',
		icon: <PlusHeartIcon c='w-5 h-5' />,
		desc: 'Expert post-surgical monitoring, dressing care, incision management, and recovery support at home.',
	},
	{
		num: '07',
		title: 'Ante & Post-natal',
		icon: <BabyIcon c='w-5 h-5' />,
		desc: 'Full maternal support from pregnancy through birth recovery — midwives, monitoring, and mental wellness programs.',
	},
	{
		num: '08',
		title: 'Dietitian & Nutrition',
		icon: <InfoIcon c='w-5 h-5' />,
		desc: 'Expert nutritionist consults for recovery, chronic condition management, pregnancy nutrition, and healthy ageing.',
	},
];

const PACKAGES: Package[] = [
	{
		tier: 'Tier 1',
		name: 'Basic Care',
		variant: 'basic',
		desc: 'Ideal for individuals needing light, non-medical support and companionship.',
		features: [
			'Grooming & personal hygiene',
			'Mobility & safe transfers',
			'Light meal preparation',
			'Medication reminders',
			'Companionship & emotional support',
			'Light housekeeping',
		],
		team: 'Nurse Assistants + Nurse visits',
	},
	{
		tier: 'Tier 2',
		name: 'Standard Care',
		variant: 'standard',
		desc: 'Routine support with added health and hygiene care. Includes all Basic features plus:',
		features: [
			'Toileting & continence care',
			'Vital checks (BP, glucose)',
			'Basic wound dressing',
			'Post-surgical care',
			'Escort to appointments',
			'Daily family reports',
		],
		team: 'Nurse Assistants + Nurse visits',
	},
	{
		tier: 'Tier 3',
		name: 'Premium Care',
		variant: 'premium',
		badge: 'Popular',
		desc: 'Complex or full-time care needs. Includes all Standard features plus:',
		features: [
			'Tube feeding assistance',
			'Catheter & stoma care',
			'Bed-bound mobility support',
			'Medication administration',
			'Detailed documentation',
			'24/7 nurse support (phone)',
		],
		team: 'Registered Nurses + Nurse Assistants',
	},
	{
		tier: 'Tier 4',
		name: 'Platinum Care',
		variant: 'platinum',
		badge: 'Elite',
		desc: 'Advanced nursing with personalized professional oversight. Includes all Premium features plus:',
		features: [
			'Incontinence & colostomy care',
			'Oral & injectable medications',
			'Fall prevention & risk mgmt',
			'Doctor coordination',
			'Priority nurse availability',
			'Advanced wound & IV care',
		],
		team: 'Registered Nurses + Nurse Assistants',
	},
	{
		tier: 'Maternal',
		name: 'Ante-natal Care',
		variant: 'antenatal',
		desc: 'Supporting you through a healthy pregnancy journey.',
		features: [
			'Regular maternal check-ups with nurse/midwife',
			'Monitoring of BP, weight & fetal growth',
			'Nutrition & exercise guidance for pregnancy',
			'Childbirth preparation & warning signs education',
			'Access to 24/7 maternity advice line',
			'Documented reports shared with your Doctor',
			'Mental health wellness programs',
		],
		team: 'Midwives + Nurses',
	},
	{
		tier: 'Maternal',
		name: 'Post-natal Care',
		variant: 'postnatal',
		desc: 'Gentle care for mother and baby after birth.',
		features: [
			'Home visits for mother & newborn wellness',
			'Support with breastfeeding & lactation',
			'Guidance on newborn care (bathing, feeding, sleeping)',
			'Monitoring post-birth healing & emotional well-being',
			'Postnatal exercise & nutrition advice',
			'Documented reports shared with your Doctor',
			'Mental health wellness programs',
		],
		team: 'Midwives + Nurses',
	},
	{
		tier: "Women's Health",
		name: 'Reproductive Health',
		variant: 'womens',
		badge: 'New',
		desc: 'Empowering choices for your health and future.',
		features: [
			'Contraceptive counselling & options',
			'Reproductive health screenings (STI checks)',
			'Menstrual health support & education',
			'Fertility awareness sessions',
			'Hormonal health & menopause support',
		],
		team: 'Midwives + Nurses',
	},
];

const PAY_OPTS: PayOpt[] = [
	{
		title: 'Daily Billing',
		icon: <MonitorIcon c='w-6 h-6' />,
		desc: 'Pay only for the days of care received. Perfect for short-term or trial arrangements.',
	},
	{
		title: 'Biweekly Billing',
		icon: <CalendarIcon c='w-6 h-6' />,
		desc: 'Fortnightly invoicing for easier household budget management with predictable costs.',
	},
	{
		title: 'Monthly Billing',
		icon: <DollarIcon c='w-6 h-6' />,
		desc: 'A single monthly invoice — ideal for ongoing care arrangements and family planning.',
	},
	{
		title: 'Long-Term Contract',
		icon: <ContractIcon c='w-6 h-6' />,
		desc: 'Best value for extended care needs. Locked-in rates with priority scheduling and dedicated care teams.',
	},
];

const BOT_RESPONSES = [
	'Our registered nurses can be with you within 24–48 hours of booking. Shall I walk you through our packages?',
	'Our Premium and Platinum packages include 24/7 nurse phone support. Would you like more details?',
	'We serve all areas across Nairobi. To confirm availability call +254 705 819 115.',
	'Our Platinum Care package includes IV monitoring and injection administration by registered nurses. Would you like to speak with our clinical team?',
];

// ─── Scroll Reveal ────────────────────────────────────────────────────────────

function useReveal() {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) {
					setVisible(true);
					obs.disconnect();
				}
			},
			{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
		);
		obs.observe(el);
		return () => obs.disconnect();
	}, []);
	return { ref, visible };
}

function Reveal({
	children,
	className = '',
	delay = 0,
}: {
	children: React.ReactNode;
	className?: string;
	delay?: number;
}) {
	const { ref, visible } = useReveal();
	// Map numeric delay to Tailwind delay classes
	const delayMap: Record<number, string> = {
		0: '',
		100: 'delay-100',
		200: 'delay-200',
		300: 'delay-300',
		400: 'delay-400',
	};
	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${delayMap[delay] ?? ''} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'} ${className}`}
		>
			{children}
		</div>
	);
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────

const Eyebrow = ({
	children,
	light = false,
}: {
	children: React.ReactNode;
	light?: boolean;
}) => (
	<span
		className={`block text-[0.7rem] tracking-[0.18em] uppercase mb-3 ${light ? 'text-[#D4B483]' : 'text-[#B8965A]'}`}
	>
		{children}
	</span>
);

const Heading = ({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<h2
		className={`font-serif text-4xl md:text-[3.5rem] font-light leading-[1.1] ${className}`}
	>
		{children}
	</h2>
);

const Forest = ({ children }: { children: React.ReactNode }) => (
	<em className='not-italic italic text-[#2C3B2D]'>{children}</em>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	useEffect(() => {
		const h = () => setScrolled(window.scrollY > 60);
		window.addEventListener('scroll', h, { passive: true });
		return () => window.removeEventListener('scroll', h);
	}, []);

	const links = [
		{ href: '#services', label: 'Services' },
		{ href: '#packages', label: 'Packages' },
		{ href: '#why-us', label: 'About' },
		{ href: '#ai-assistant', label: 'AI Health' },
		{ href: '#contact', label: 'Contact' },
	];

	return (
		<nav
			className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 bg-[#FDFAF6]/95 backdrop-blur-md border-b border-[#2C3B2D]/[0.08] transition-all duration-300 ${scrolled ? 'h-16 shadow-lg' : 'h-20'}`}
		>
			{/* Logo */}
			<a href='#' className='flex items-center gap-2.5 no-underline'>
				<img
					src='/logos.png' // replace with your actual image path
					alt='Ivorris Care Logo'
					className='w-40 h-40 object-contain'
				/>

				{/* <span className='font-serif text-xl font-semibold tracking-wide text-[#2C3B2D]'>
					Ivorris Care
				</span> */}
			</a>

			{/* Desktop */}
			<ul className='hidden md:flex items-center gap-10 list-none'>
				{links.map((l) => (
					<li key={l.href}> 
						<a
							href={l.href}
							className='relative group text-sm tracking-wide text-[#4A5E4C] hover:text-[#2C3B2D] transition-colors duration-300 no-underline'
						>
							{l.label}
							<span className='absolute -bottom-1 inset-x-0 h-px bg-[#B8965A] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left' />
						</a>
					</li>
				))}
				<li>
					<a
						href='tel:+254705819115'
						className='px-5 py-2.5 text-sm font-medium tracking-wide bg-[#2C3B2D] text-[#F7F3ED] rounded-sm hover:-translate-y-0.5 transition-all duration-300 block'
					>
						Book Care
					</a>
				</li>
			</ul>

			{/* Hamburger */}
			<button
				className='md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer'
				onClick={() => setOpen(!open)}
				aria-label='Toggle menu'
			>
				<span className='block w-5 h-px bg-[#2C3B2D]' />
				<span className='block w-5 h-px bg-[#2C3B2D]' />
				<span className='block w-5 h-px bg-[#2C3B2D]' />
			</button>

			{/* Mobile menu */}
			{open && (
				<div className='absolute top-full inset-x-0 py-4 px-8 flex flex-col gap-4 md:hidden bg-[#FDFAF6]/98 border-b border-[#2C3B2D]/10'>
					{links.map((l) => (
						<a
							key={l.href}
							href={l.href}
							className='text-sm py-2 text-[#4A5E4C] no-underline'
							onClick={() => setOpen(false)}
						>
							{l.label}
						</a>
					))}
					<a
						href='tel:+254705819115'
						className='text-sm font-medium py-2.5 text-center mt-2 bg-[#2C3B2D] text-[#F7F3ED] rounded-sm'
					>
						Book Care
					</a>
				</div>
			)}
		</nav>
	);
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
	const [on, setOn] = useState(false);
	useEffect(() => {
		const t = setTimeout(() => setOn(true), 50);
		return () => clearTimeout(t);
	}, []);

	// Stagger helpers
	const up = (ms: number) =>
		`transition-all duration-700 ease-out ${on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`;
	const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

	return (
		<section className='min-h-screen grid md:grid-cols-2 pt-20 relative overflow-hidden bg-[#FDFAF6]'>
			{/* Blush diagonal background */}
			<div className='absolute top-0 right-0 bottom-0 w-full md:w-[55%] hidden md:block bg-[#F2E8DE] [clip-path:polygon(8%_0,100%_0,100%_100%,0%_100%)] -z-0' />

			{/* Left column */}
			<div className='relative z-10 flex flex-col justify-center px-8 md:px-16 py-20 md:py-24'>
				{/* Eyebrow */}
				<div
					className={`flex items-center gap-3 mb-8 ${up(200)}`}
					style={delay(200)}
				>
					<div className='w-10 h-px bg-[#B8965A]' />
					<span className='text-xs tracking-[0.15em] uppercase font-medium text-[#B8965A]'>
						Nairobi, Kenya — Home Healthcare
					</span>
				</div>

				{/* H1 */}
				<h1
					className={`font-serif text-5xl md:text-6xl lg:text-[5.5rem] font-light leading-[1.05] text-[#1E2820] mb-6 ${up(350)}`}
					style={delay(350)}
				>
					Where{' '}
					<em className='not-italic italic font-medium text-[#2C3B2D]'>
						Healing
					</em>
					<br />
					Meets the Comfort
					<br />
					of Home.
				</h1>

				{/* Subhead */}
				<p
					className={`text-lg leading-relaxed font-light text-[#4A5E4C] max-w-md mb-10 ${up(500)}`}
					style={delay(500)}
				>
					Expert nursing, physiotherapy, elderly care, and specialist
					health services — delivered with compassion to your
					doorstep.
				</p>

				{/* CTAs */}
				<div
					className={`flex flex-wrap items-center gap-6 ${up(650)}`}
					style={delay(650)}
				>
					<a
						href='tel:+254705819115'
						className='inline-flex items-center gap-2 px-7 py-4 text-sm font-medium tracking-wide bg-[#2C3B2D] text-[#F7F3ED] border border-[#2C3B2D] rounded-sm hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300'
					>
						<PhoneIcon c='w-4 h-4' />
						Call +254 705 819 115
					</a>
					<a
						href='#packages'
						className='inline-flex items-center gap-2 text-sm font-medium text-[#2C3B2D] border-b border-[#A8BFA9] pb-0.5 hover:text-[#B8965A] hover:border-[#B8965A] transition-all duration-300 group'
					>
						View Packages
						<ArrowRight c='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
					</a>
				</div>

				{/* Stats */}
				<div
					className={`flex gap-10 mt-14 pt-10 border-t border-[#2C3B2D]/[0.12] ${up(800)}`}
					style={delay(800)}
				>
					{[
						['10+', 'Services Offered'],
						['4', 'Care Packages'],
						['24/7', 'Nurse Support'],
					].map(([n, l]) => (
						<div key={l}>
							<div className='font-serif text-4xl font-light leading-none mb-1 text-[#2C3B2D]'>
								{n}
							</div>
							<div className='text-xs uppercase tracking-[0.06em] text-[#7A8E7C]'>
								{l}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Right — image mosaic */}
			<div
				className={`relative hidden md:block transition-opacity duration-[1200ms] ${on ? 'opacity-100' : 'opacity-0'}`}
				style={delay(400)}
			>
				<div className='absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px'>
					{' '}
					{[
						'/care1.jpg',
						'/care2.jpg',
						'/care0.jpg',
						'/care.jpg',
					].map((src, i) => (
						<div key={i} className='overflow-hidden relative'>
							{' '}
							<div
								className='w-full h-full bg-cover bg-center'
								style={{ backgroundImage: `url(${src})` }}
							/>{' '}
							<div className='absolute inset-0 bg-gradient-to-br from-[#2C3B2D]/15 to-transparent' />{' '}
						</div>
					))}{' '}
				</div>

				{/* Floating trust badge */}
				<div className='absolute bottom-8 -left-6 z-10 flex items-center gap-4 px-5 py-4 bg-[#FDFAF6] rounded-[4px] shadow-2xl min-w-[220px] animate-[float_4s_ease-in-out_infinite]'>
					<div className='w-11 h-11 rounded-full bg-gradient-to-br from-[#2C3B2D] to-[#6B8A6E] flex items-center justify-center flex-shrink-0'>
						<ShieldIcon c='w-5 h-5 text-[#F7F3ED]' />
					</div>
					<div>
						<div className='text-sm font-medium text-[#1E2820]'>
							Trusted Care
						</div>
						<div className='text-xs text-[#7A8E7C]'>
							Registered nurses & midwives
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// ─── ABOUT STRIP ──────────────────────────────────────────────────────────────

function AboutStrip() {
	return (
		<section
			id='why-us'
			className='relative overflow-hidden py-20 px-8 md:px-16 grid md:grid-cols-[1fr_2fr] gap-16 items-center bg-[#2C3B2D]'
		>
			<div className='absolute top-0 right-0 w-80 h-80 rounded-full bg-[#6B8A6E]/10 translate-x-[30%] -translate-y-[30%] pointer-events-none' />

			{/* Ghost text */}
			<div className='font-serif text-[clamp(3rem,6vw,5rem)] font-light text-[#F7F3ED]/[0.12] leading-none select-none'>
				Care
				<br />
				<em className='not-italic italic text-[#B8965A]/40'>with</em>
				<br />
				Love
			</div>

			<Reveal>
				<Eyebrow light>Our Mission</Eyebrow>
				<h2 className='font-serif text-[clamp(1.75rem,3vw,2.75rem)] font-light text-[#F7F3ED] leading-[1.3] mb-6'>
					Quality healthcare should come with comfort, dignity, and a
					personal touch.
				</h2>
				<p className='text-base leading-relaxed font-light text-[#F7F3ED]/70 max-w-xl'>
					At Ivorris Care, we bring expert nursing and caregiving
					services right to your doorstep — so you and your loved ones
					can heal, recover, or age gracefully in the warmth of your
					home.
				</p>
				<div className='flex flex-wrap gap-8 mt-8'>
					{[
						['Dignity', 'Respectful care always'],
						['Expertise', 'Registered professionals'],
						['Comfort', 'Care in your own home'],
					].map(([t, s]) => (
						<div key={t} className='flex items-start gap-2.5'>
							<div className='w-1.5 h-1.5 rounded-full bg-[#B8965A] mt-1.5 flex-shrink-0' />
							<div>
								<div className='text-sm font-medium text-[#F7F3ED]'>
									{t}
								</div>
								<div className='text-xs font-light text-[#F7F3ED]/55'>
									{s}
								</div>
							</div>
						</div>
					))}
				</div>
			</Reveal>
		</section>
	);
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

function Services() {
	return (
		<section id='services' className='py-24 px-8 md:px-16 bg-[#FDFAF6]'>
			<div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14'>
				<div className='text-[#1E2820]'>
					<Eyebrow>What We Offer</Eyebrow>
					<Heading>
						Comprehensive <Forest>Care</Forest>
						<br />
						at Your Doorstep
					</Heading>
				</div>
				<a
					href='#packages'
					className='text-sm font-medium uppercase tracking-wide text-[#2C3B2D] border-b border-[#2C3B2D]/25 pb-0.5 hover:text-[#B8965A] hover:border-[#B8965A] transition-all duration-300 whitespace-nowrap self-start md:self-auto'
				>
					See Packages →
				</a>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#2C3B2D]/[0.06]'>
				{SERVICES.map((s, i) => (
					<Reveal
						key={s.title}
						delay={(i % 4) * 100}
						className='group relative p-10 bg-[#FDFAF6] cursor-pointer overflow-hidden'
					>
						{/* Bottom accent */}
						<div className='absolute bottom-0 inset-x-0 h-0.5 bg-[#2C3B2D] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300' />
						{/* Number */}
						<span className='absolute top-8 right-8 text-xs tracking-wide text-[#7A8E7C] font-serif'>
							{s.num}
						</span>
						{/* Icon box */}
						<div className='w-12 h-12 flex items-center justify-center mb-6 bg-[#F7F3ED] border border-[#2C3B2D]/10 rounded-[4px] text-[#2C3B2D] group-hover:bg-[#2C3B2D] group-hover:text-[#F7F3ED] group-hover:border-[#2C3B2D] transition-all duration-300'>
							{s.icon}
						</div>
						<h3 className='font-serif text-[1.35rem] font-medium text-[#1E2820] leading-[1.25] mb-3'>
							{s.title}
						</h3>
						<p className='text-sm leading-relaxed font-light text-[#4A5E4C]'>
							{s.desc}
						</p>
						<div className='mt-6 text-xl text-[#A8BFA9] group-hover:translate-x-1 group-hover:text-[#2C3B2D] transition-all duration-300'>
							→
						</div>
					</Reveal>
				))}
			</div>
		</section>
	);
}

// ─── PACKAGES ─────────────────────────────────────────────────────────────────

const PKG_HDR: Record<Package['variant'], string> = {
	basic: 'bg-[#FDFAF6]',
	standard: 'bg-[#E8F0E9]',
	premium: 'bg-[#2C3B2D]',
	platinum: 'bg-[#1E2820]',
	antenatal: 'bg-[#EDE8F5]',
	postnatal: 'bg-[#F5EAE8]',
	womens: 'bg-[#FCEEF5]',
};
const PKG_TIER: Record<Package['variant'], string> = {
	basic: 'text-[#7A8E7C]',
	standard: 'text-[#7A8E7C]',
	premium: 'text-[#A8BFA9]',
	platinum: 'text-[#D4B483]',
	antenatal: 'text-[#7A6E8A]',
	postnatal: 'text-[#8A6E6A]',
	womens: 'text-[#8A6A7A]',
};
const PKG_NAME: Record<Package['variant'], string> = {
	basic: 'text-[#1E2820]',
	standard: 'text-[#1E2820]',
	premium: 'text-[#F7F3ED]',
	platinum: 'text-[#F7F3ED]',
	antenatal: 'text-[#2D2040]',
	postnatal: 'text-[#2D1A18]',
	womens: 'text-[#2D1828]',
};
const PKG_BADGE: Record<string, string> = {
	Popular: 'bg-[#B8965A]/20 text-[#D4B483]',
	Elite: 'bg-[#B8965A] text-[#1E2820] font-semibold',
	New: 'bg-[#C4826A]/20 text-[#C4826A] font-semibold',
};
const PKG_CTA: Record<Package['variant'], string> = {
	basic: 'bg-[#2C3B2D] text-[#F7F3ED]',
	standard: 'bg-[#2C3B2D] text-[#F7F3ED]',
	premium: 'bg-[#2C3B2D] text-[#F7F3ED]',
	platinum: 'bg-[#B8965A] text-[#1E2820]',
	antenatal: 'bg-[#6B5A8A] text-[#F7F3ED]',
	postnatal: 'bg-[#8A5A56] text-[#F7F3ED]',
	womens: 'bg-[#C4826A] text-[#F7F3ED]',
};

function Packages() {
	const corePackages = PACKAGES.filter((p) =>
		['basic', 'standard', 'premium', 'platinum'].includes(p.variant),
	);
	const maternalPackages = PACKAGES.filter((p) =>
		['antenatal', 'postnatal', 'womens'].includes(p.variant),
	);

	const PackageCard = ({ pkg, i }: { pkg: Package; i: number }) => (
		<Reveal
			key={pkg.name}
			delay={(i % 4) * 100}
			className='overflow-hidden rounded-sm shadow-[0_2px_8px_rgba(44,59,45,0.06)] hover:-translate-y-2 transition-all duration-300 cursor-pointer'
		>
			{/* Header */}
			<div className={`relative px-7 pt-7 pb-6 ${PKG_HDR[pkg.variant]}`}>
				{pkg.badge && (
					<div
						className={`absolute top-5 right-5 px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-sm ${PKG_BADGE[pkg.badge]}`}
					>
						{pkg.badge}
					</div>
				)}
				<span
					className={`block text-[10px] tracking-[0.2em] uppercase mb-1.5 ${PKG_TIER[pkg.variant]}`}
				>
					{pkg.tier}
				</span>
				<div
					className={`font-serif text-[1.75rem] font-medium leading-[1.1] ${PKG_NAME[pkg.variant]}`}
				>
					{pkg.name}
				</div>
			</div>
			{/* Body */}
			<div className='px-7 pt-6 pb-7 bg-[#FDFAF6]'>
				<p className='text-xs leading-relaxed font-light text-[#7A8E7C] mb-4'>
					{pkg.desc}
				</p>
				<ul className='space-y-0'>
					{pkg.features.map((f) => (
						<li
							key={f}
							className='flex items-start gap-2 text-xs leading-relaxed text-[#4A5E4C] py-1.5 border-b border-[#2C3B2D]/[0.06]'
						>
							<span className='text-[#6B8A6E] flex-shrink-0 mt-0.5'>
								✓
							</span>
							{f}
						</li>
					))}
				</ul>
				<p className='text-[11px] text-[#7A8E7C] mt-4 mb-5'>
					Team: {pkg.team}
				</p>
				<a
					href='tel:+254705819115'
					className={`block text-center py-3.5 text-xs font-medium tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity duration-300 ${PKG_CTA[pkg.variant]}`}
				>
					Book {pkg.name}
				</a>
			</div>
		</Reveal>
	);

	return (
		<section id='packages' className='py-24 px-8 md:px-16 bg-[#F7F3ED]'>
			<div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14'>
				<div className='text-[#1E2820]'>
					<Eyebrow>Flexible Plans</Eyebrow>
					<Heading>
						Our Care <Forest>Packages</Forest>
					</Heading>
				</div>
				<a
					href='mailto:carewithivorris@gmail.com'
					className='text-sm font-medium uppercase tracking-wide text-[#2C3B2D] border-b border-[#2C3B2D]/25 pb-0.5 hover:text-[#B8965A] hover:border-[#B8965A] transition-all duration-300 whitespace-nowrap self-start md:self-auto'
				>
					Custom Quote →
				</a>
			</div>

			{/* Core Care Packages — 4 columns */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
				{corePackages.map((pkg, i) => (
					<PackageCard key={pkg.name} pkg={pkg} i={i} />
				))}
			</div>

			{/* Maternal & Women's Health — divider + 3 columns */}
			<div className='flex items-center gap-4 my-10'>
				<div className='flex-1 h-px bg-[#2C3B2D]/10' />
				<span className='text-xs tracking-[0.18em] uppercase text-[#B8965A] whitespace-nowrap px-2'>
					Maternal & Women&apos;s Health
				</span>
				<div className='flex-1 h-px bg-[#2C3B2D]/10' />
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{maternalPackages.map((pkg, i) => (
					<PackageCard key={pkg.name} pkg={pkg} i={i} />
				))}
			</div>
		</section>
	);
}

// ─── WHY US ───────────────────────────────────────────────────────────────────

const WHY = [
	{
		Icon: ShieldIcon,
		title: 'Verified & Registered Professionals',
		desc: 'Every nurse, midwife, and physiotherapist is fully registered, verified, and insured — providing you peace of mind.',
	},
	{
		Icon: PhoneIcon,
		title: 'Daily Family Communication',
		desc: 'Detailed daily reports shared with families and coordinated directly with your doctors and specialists.',
	},
	{
		Icon: ClockIcon,
		title: 'Flexible Scheduling & Payment',
		desc: "Daily, biweekly, monthly, or long-term contracts. We work around your family's schedule and budget.",
	},
	{
		Icon: UsersIcon,
		title: 'Multidisciplinary Team',
		desc: 'Nurses, midwives, physiotherapists, nutritionists, and occupational therapists working together for holistic care.',
	},
];

function WhyUs() {
	return (
		<section className='py-24 px-8 md:px-16 grid md:grid-cols-2 gap-20 items-center bg-[#FDFAF6]'>
			{/* Visual */}
			<Reveal className='relative h-[480px] hidden md:block'>
				<div className='absolute top-10 left-10 right-0 bottom-0 rounded-sm bg-gradient-to-br from-[#8FAE91] via-[#6B8A6E] to-[#3D5240]' />
				<div className='absolute top-0 left-0 right-10 bottom-10 rounded-sm overflow-hidden flex items-center justify-center'>
					{' '}
					<img
						src='/report.jpg'
						alt='Background'
						className='absolute inset-0 w-full h-full object-cover'
					/>{' '}
					<div className='absolute inset-0 bg-black/20' />{' '}
				</div>
				<div className='absolute bottom-0 right-0 z-10 p-5 rounded-sm shadow-2xl bg-[#FDFAF6] w-[190px] animate-[float_5s_ease-in-out_1s_infinite]'>
					<p className='text-xs text-[#7A8E7C] mb-1'>
						Family reports sent
					</p>
					<div className='font-serif text-[2.5rem] font-light text-[#2C3B2D] leading-none'>
						Daily
					</div>
				</div>
			</Reveal>

			{/* Content */}
			<div className='text-[#1E2820]'>
				<Eyebrow>Why Ivorris Care</Eyebrow>
				<Heading className='mb-10'>
					Care you can <Forest>trust</Forest>
					<br />
					in every visit
				</Heading>
				<div className='space-y-7'>
					{WHY.map(({ Icon, title, desc }, i) => (
						<Reveal
							key={title}
							delay={i * 100}
							className='flex gap-5'
						>
							<div className='w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-sm bg-[#F2E8DE] border border-[#B8965A]/20 text-[#2C3B2D]'>
								<Icon c='w-5 h-5' />
							</div>
							<div>
								<h4 className='font-serif text-[1.2rem] font-medium text-[#1E2820] mb-1.5'>
									{title}
								</h4>
								<p className='text-sm leading-relaxed font-light text-[#4A5E4C]'>
									{desc}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── AI ASSISTANT ─────────────────────────────────────────────────────────────

function AIAssistant() {
	const [msgs, setMsgs] = useState<ChatMsg[]>([
		{
			role: 'bot',
			text: "Hello! I'm your Ivorris Health Assistant. How can I help you today? You can ask about symptoms, care packages, or book an appointment.",
		},
		{
			role: 'user',
			text: 'My mother is recovering from surgery. What care do you recommend?',
		},
		{
			role: 'bot',
			text: "For post-surgical recovery, I'd recommend our Standard or Premium Care Package. Our registered nurses provide wound dressing, vital monitoring, and mobility support. Would you like me to connect you with our clinical team?",
		},
	]);
	const [val, setVal] = useState('');
	const [idx, setIdx] = useState(0);
	const bottom = useRef<HTMLDivElement>(null);
	useEffect(() => {
		bottom.current?.scrollIntoView({ behavior: 'smooth' });
	}, [msgs]);

	const send = () => {
		if (!val.trim()) return;
		setMsgs((p) => [...p, { role: 'user', text: val.trim() }]);
		setVal('');
		setTimeout(() => {
			setMsgs((p) => [
				...p,
				{
					role: 'bot',
					text: BOT_RESPONSES[idx % BOT_RESPONSES.length],
				},
			]);
			setIdx((n) => n + 1);
		}, 900);
	};

	return (
		<section
			id='ai-assistant'
			className='relative py-24 px-8 md:px-16 grid md:grid-cols-2 gap-16 items-center overflow-hidden bg-[#2C3B2D]'
		>
			<div className='absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#6B8A6E]/[0.07] translate-x-[30%] -translate-y-[30%] pointer-events-none' />

			{/* Content */}
			<div>
				<Eyebrow light>AI-Powered Health</Eyebrow>
				<h2 className='font-serif text-[clamp(2rem,3.5vw,3rem)] font-light text-[#F7F3ED] leading-[1.2] mb-5'>
					Your 24/7 Virtual
					<br />
					Health Assistant
				</h2>
				<p className='text-base leading-relaxed font-light text-[#F7F3ED]/65 mb-8'>
					Get instant guidance on symptoms, care queries, and triage
					support — any time of day.
				</p>
				<div className='space-y-3'>
					{[
						'Symptom checking & initial triage',
						'24/7 maternity advice line support',
						'Medication reminder scheduling',
						'Care package recommendation engine',
					].map((f) => (
						<div
							key={f}
							className='flex items-center gap-4 px-5 py-3.5 rounded-sm bg-white/[0.04] border border-white/[0.08]'
						>
							<div className='w-2 h-2 rounded-full bg-[#B8965A] flex-shrink-0' />
							<span className='text-sm text-[#F7F3ED]/75'>
								{f}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Chat */}
			<div className='rounded-lg overflow-hidden border border-white/10'>
				<div className='flex items-center gap-3 px-6 py-4 bg-white/[0.05] border-b border-white/[0.08]'>
					<div className='w-2 h-2 rounded-full bg-green-500' />
					<span className='text-sm font-medium text-[#F7F3ED]/80'>
						Ivorris Health Assistant — Online
					</span>
				</div>

				<div className='flex flex-col gap-4 p-6 overflow-y-auto min-h-[280px] max-h-[320px]'>
					{msgs.map((m, i) => (
						<div
							key={i}
							className={`max-w-[80%] ${m.role === 'user' ? 'self-end' : 'self-start'}`}
						>
							<div
								className={`px-4 py-3 text-sm leading-relaxed rounded-md ${m.role === 'bot' ? 'bg-white/10 text-[#F7F3ED]/85 rounded-bl-[2px]' : 'bg-[#B8965A] text-[#1E2820] rounded-br-[2px]'}`}
							>
								{m.text}
							</div>
							<div
								className={`text-[10px] mt-1 text-[#F7F3ED]/30 ${m.role === 'user' ? 'text-right' : ''}`}
							>
								Just now
							</div>
						</div>
					))}
					<div ref={bottom} />
				</div>

				<div className='flex gap-3 items-center px-5 py-4 border-t border-white/[0.08]'>
					<input
						value={val}
						onChange={(e) => setVal(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && send()}
						placeholder='Ask about symptoms or care...'
						className='flex-1 px-3.5 py-2.5 text-sm font-sans rounded-sm outline-none bg-white/[0.06] border border-white/[0.12] text-[#F7F3ED]/85 placeholder:text-[#F7F3ED]/30 focus:border-[#B8965A] transition-all duration-300'
					/>
					<button
						onClick={send}
						aria-label='Send'
						className='w-9 h-9 rounded-sm bg-[#B8965A] flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform duration-300'
					>
						<SendIcon c='w-4 h-4 text-[#1E2820]' />
					</button>
				</div>
			</div>
		</section>
	);
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────

function Payment() {
	return (
		<section className='py-24 px-8 md:px-16 bg-[#F7F3ED]'>
			<div className='mb-14 text-[#1E2820]'>
				<Eyebrow>Flexible Billing</Eyebrow>
				<Heading>
					Payment <Forest>Options</Forest>
					<br />
					That Work for You
				</Heading>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
				{PAY_OPTS.map((o, i) => (
					<Reveal
						key={o.title}
						delay={i * 100}
						className='group relative p-10 text-center bg-[#FDFAF6] border border-[#2C3B2D]/[0.08] rounded-sm cursor-pointer overflow-hidden hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300'
					>
						{/* Hover bg overlay */}
						<div className='absolute inset-0 bg-[#2C3B2D] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 rounded-sm' />
						{/* Icon */}
						<div className='w-16 h-16 rounded-full bg-[#F2E8DE] flex items-center justify-center mx-auto mb-6 text-[#2C3B2D] group-hover:bg-white/10 group-hover:text-[#F7F3ED] transition-all duration-300'>
							{o.icon}
						</div>
						<h3 className='font-serif text-[1.4rem] font-medium text-[#1E2820] mb-3 group-hover:text-[#F7F3ED] transition-colors duration-300'>
							{o.title}
						</h3>
						<p className='text-sm leading-relaxed font-light text-[#7A8E7C] group-hover:text-[#F7F3ED]/65 transition-colors duration-300'>
							{o.desc}
						</p>
					</Reveal>
				))}
			</div>
		</section>
	);
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

const REVIEWS = [
	{
		name: 'Grace M.',
		loc: 'Westlands, Nairobi',
		avatar: 'bg-gradient-to-br from-[#A8BFA9] to-[#2C3B2D]',
		text: "The team from Ivorris Care has been an absolute blessing. My mother's recovery after her hip surgery was so much smoother with their daily visits. Professional, gentle, and truly caring.",
	},
	{
		name: 'David O.',
		loc: 'Karen, Nairobi',
		avatar: 'bg-gradient-to-br from-[#C4B4A0] to-[#B8965A]',
		text: "We used the antenatal package for my wife's second pregnancy. The midwife visits, the daily reports, and the mental wellness support made a world of difference. Highly recommended.",
	},
];

function Testimonials() {
	return (
		<section className='py-24 px-8 md:px-16 bg-[#FDFAF6]'>
			<div className='max-w-3xl mx-auto'>
				<div className='text-center text-[#1E2820]'>
					<Eyebrow>From Our Families</Eyebrow>
					<Heading className='mb-14'>
						Stories of <Forest>Healing</Forest>
					</Heading>
				</div>
				<div className='grid md:grid-cols-2 gap-8'>
					{REVIEWS.map((r, i) => (
						<Reveal
							key={r.name}
							delay={i * 150}
							className='p-8 rounded-sm border border-[#2C3B2D]/10 hover:shadow-lg hover:border-[#B8965A]/25 transition-all duration-300 cursor-default'
						>
							<div className='text-yellow-500 tracking-widest text-sm mb-3'>
								★★★★★
							</div>
							<div className='font-serif text-5xl text-[#B8965A]/25 leading-none mb-4'>
								&quot;
							</div>
							<p className='text-base leading-relaxed font-light italic text-[#4A5E4C] mb-6'>
								{r.text}
							</p>
							<div className='flex items-center gap-3'>
								<div
									className={`w-10 h-10 rounded-full flex-shrink-0 ${r.avatar}`}
								/>
								<div>
									<div className='text-sm font-medium text-[#1E2820]'>
										{r.name}
									</div>
									<div className='text-xs text-[#7A8E7C]'>
										{r.loc}
									</div>
								</div>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
	return (
		<section
			id='contact'
			className='relative py-32 px-8 md:px-16 text-center overflow-hidden bg-[#F2E8DE]'
		>
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(184,150,90,0.07),transparent_60%)] pointer-events-none' />

			<Eyebrow>Get Started Today</Eyebrow>
			<h2 className='font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.1] text-[#1E2820] mb-6'>
				Ready to bring{' '}
				<em className='not-italic italic text-[#2C3B2D]'>
					expert care
				</em>
				<br />
				into your home?
			</h2>
			<p className='text-base leading-relaxed font-light text-[#4A5E4C] mx-auto mb-12 max-w-md'>
				Contact our team to discuss your needs, and we&apos;ll recommend
				the ideal care package for your loved one.
			</p>

			<div className='flex flex-wrap items-center justify-center gap-6 mb-14'>
				<a
					href='tel:+254705819115'
					className='inline-flex items-center gap-2.5 px-8 py-4 text-sm font-medium tracking-wide bg-[#2C3B2D] text-[#F7F3ED] rounded-sm hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300'
				>
					<PhoneIcon c='w-4 h-4' />
					Call Us Now
				</a>
				<a
					href='mailto:carewithivorris@gmail.com'
					className='inline-flex items-center gap-2 text-sm font-medium text-[#2C3B2D] border-b border-[#2C3B2D]/30 pb-0.5 hover:text-[#B8965A] hover:border-[#B8965A] transition-all duration-300 group'
				>
					Email Our Team
					<ArrowRight c='w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
				</a>
			</div>

			<div className='flex flex-wrap items-center justify-center gap-12 pt-10 border-t border-[#2C3B2D]/[0.12]'>
				{[
					{
						icon: '📞',
						label: '+254 705 819 115',
						href: 'tel:+254705819115',
					},
					{
						icon: '✉️',
						label: 'carewithivorris@gmail.com',
						href: 'mailto:carewithivorris@gmail.com',
					},
					{
						icon: '📍',
						label: 'Nairobi, Kenya',
						href: 'https://maps.google.com/?q=Nairobi,Kenya',
					},
				].map(({ icon, label, href }) => (
					<div key={label} className='flex items-center gap-2.5'>
						<span>{icon}</span>
						<a
							href={href}
							target={
								href.startsWith('http') ? '_blank' : undefined
							}
							rel='noopener noreferrer'
							className='text-sm text-[#4A5E4C] hover:text-[#2C3B2D] no-underline transition-colors duration-300'
						>
							{label}
						</a>
					</div>
				))}
			</div>
		</section>
	);
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
	const cols = [
		{
			title: 'Services',
			links: [
				'Elderly Care',
				'Wound Care',
				'Physiotherapy',
				'Palliative Care',
				'Post-Operative Care',
			],
		},
		{
			title: 'Packages',
			links: [
				'Basic Care',
				'Standard Care',
				'Premium Care',
				'Platinum Care',
				'Ante-natal & Post-natal',
			],
		},
		{
			title: 'Contact',
			links: [
				'+254 705 819 115',
				'carewithivorris@gmail.com',
				'Nairobi, Kenya',
			],
		},
	];
	return (
		<>
			<footer className='px-8 md:px-16 py-16 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 bg-[#1E2820]'>
				<div>
					<a
						href='#'
						className='flex items-center gap-2.5 no-underline mb-5'
					>
						<div className='w-8 h-8 rounded-full bg-[#2C3B2D] flex items-center justify-center'>
							<HeartIcon c='w-4 h-4 text-[#F7F3ED]' />
						</div>
						<span className='font-serif text-[1.25rem] font-medium text-[#F7F3ED]'>
							Ivorris Care
						</span>
					</a>
					<p className='text-sm leading-relaxed font-light text-[#F7F3ED]/40 max-w-xs'>
						Where Healing Meets the Comfort of Home. Premium home
						healthcare in Nairobi, Kenya — delivered with love.
					</p>
				</div>
				{cols.map(({ title, links }) => (
					<div key={title}>
						<h5 className='text-[11px] tracking-[0.15em] uppercase text-[#F7F3ED]/30 mb-5'>
							{title}
						</h5>
						<ul className='space-y-2.5 list-none'>
							{links.map((l) => (
								<li key={l}>
									<a
										href='#'
										className='text-sm text-[#F7F3ED]/50 no-underline hover:text-[#D4B483] transition-colors duration-300'
									>
										{l}
									</a>
								</li>
							))}
						</ul>
					</div>
				))}
			</footer>
			<div className='px-8 md:px-16 py-5 flex flex-col md:flex-row items-center justify-between gap-2 bg-[#1E2820] border-t border-white/[0.05]'>
				<p className='text-xs text-[#F7F3ED]/25'>
					© 2026 Ivorris Care. All rights reserved. We Offer Care with
					Love.
				</p>
				<p className='text-xs text-[#F7F3ED]/25'>
					Privacy Policy · Terms of Service
				</p>
			</div>
		</>
	);
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function IvorrisCare() {
	return (
		<div className='bg-[#FDFAF6] font-sans overflow-x-hidden'>
			<Navbar />
			<Hero />
			<AboutStrip />
			<Services />
			<Packages />
			<WhyUs />
			<AIAssistant />
			<Payment />
			<Testimonials />
			<CTA />
			<Footer />
		</div>
	);
}
