/**
 * Home page and shared content. Source: "Website Repositioning & Content
 * Direction" sections 3, 5 and 6.
 */
import type { Faq } from './services';

export type Situation = {
	quote: string;
	body: string;
	href: string;
	linkLabel: string;
	icon: 'compass' | 'hospital' | 'home' | 'network' | 'users';
};

export const situations: Situation[] = [
	{
		quote: "I'm not sure what kind of help my loved one needs.",
		body: "You've noticed things changing, but it's hard to tell what would actually help. A nurse-led assessment can bring clarity.",
		href: '/services/care-needs-assessment',
		linkLabel: 'Care Needs Assessment',
		icon: 'compass',
	},
	{
		quote: 'My family member has just come home from hospital.',
		body: 'The move home can raise lots of questions. We help you understand the transition and what support may be needed.',
		href: '/services/post-discharge-nursing-assessment',
		linkLabel: 'Post-Discharge Nursing Assessment',
		icon: 'hospital',
	},
	{
		quote: 'We need nursing support at home.',
		body: 'Professional, nurse-led care in familiar surroundings — within our professional scope.',
		href: '/services/home-nursing',
		linkLabel: 'Nurse-Led Home Nursing',
		icon: 'home',
	},
	{
		quote: 'I need help finding the right specialist or equipment.',
		body: 'When needs go beyond what we provide directly, we help you find and connect with appropriate people and resources.',
		href: '/connect-and-coordinate',
		linkLabel: 'Connect & Coordinate',
		icon: 'network',
	},
	{
		quote: "I'm caring for someone and need guidance.",
		body: 'Caring at home is a lot to carry. We offer a nurse’s perspective on care needs, safety and when to seek more support.',
		href: '/services/family-care-guidance',
		linkLabel: 'Family Care Guidance',
		icon: 'users',
	},
];

export const processSteps = [
	{
		key: 'assess',
		title: 'Assess',
		lead: "Understand what's going on.",
		body: 'We listen, ask the right questions and assess the situation to understand what kind of support may be appropriate.',
	},
	{
		key: 'connect',
		title: 'Connect',
		lead: 'Find the right people and resources.',
		body: 'We help connect individuals and families with relevant healthcare professionals, services and resources.',
	},
	{
		key: 'coordinate',
		title: 'Coordinate',
		lead: 'Bring the pieces together.',
		body: 'Where multiple forms of support are involved, we help make the pathway easier to navigate.',
	},
	{
		key: 'follow-up',
		title: 'Follow up',
		lead: 'Stay connected to the care journey.',
		body: 'Where appropriate, we check in, help families understand what comes next and identify whether further support may be needed.',
	},
];

/** Reasons drawn only from the strategy document — no unverified claims. */
export const reasons = [
	{
		title: 'Nurse-led from the first conversation',
		body: 'Ivorris combines nursing knowledge with practical care experience, so you are guided by someone who understands healthcare.',
		icon: 'stethoscope',
	},
	{
		title: "You don't need the answer first",
		body: "Start with what's going on. We'll help you understand your situation and what your next step could be.",
		icon: 'ear',
	},
	{
		title: 'Clear about what we do — and don’t',
		body: "We are open about which services we provide directly and when we're helping you connect with someone else.",
		icon: 'shield',
	},
	{
		title: 'A growing network of support',
		body: 'A growing network of healthcare and support providers helps us point you towards appropriate options.',
		icon: 'network',
	},
] as const;

export const homeFaqs: Faq[] = [
	{
		question: 'What is healthcare navigation?',
		answer:
			'Healthcare navigation means helping someone understand their health or care situation, what options exist, and how to reach the right support. Ivorris does this as a nurse-led service — we listen, help clarify needs, and guide individuals and families towards appropriate next steps.',
	},
	{
		question: 'What is care coordination?',
		answer:
			"Care coordination means bringing the different parts of someone's care together so the pathway is easier to follow — for example when a nurse, a physiotherapist and an equipment supplier are all involved. Ivorris helps families make sense of these pieces and connect with appropriate support.",
	},
	{
		question: 'Do I need to know what service I need before contacting Ivorris?',
		answer:
			"No. Many people get in touch with a simple \"I'm not sure what to do.\" Tell us what's going on and we'll help you understand what kind of support may be appropriate.",
	},
	{
		question: 'Is Ivorris a caregiver agency?',
		answer:
			'No. Ivorris is a nurse-led healthcare navigation and care coordination service. We provide some nursing services directly, and where someone needs caregivers or other professionals, we help them find and connect with appropriate support.',
	},
	{
		question: 'Which services does Ivorris provide directly?',
		answer:
			'We directly provide four nurse-led services: Care Needs Assessment, Post-Discharge Nursing Assessment, Nurse-Led Home Nursing and Family Care Guidance. Other support — such as specialists, therapists, equipment or diagnostics — is arranged by helping you connect with appropriate providers.',
	},
	{
		question: 'Where is Ivorris based?',
		answer:
			'Ivorris Care is based in Nairobi, Kenya. Get in touch to talk about your situation and whether we can help where you are.',
	},
];
