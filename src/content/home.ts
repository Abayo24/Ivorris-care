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
		body: 'A nurse-led assessment brings clarity.',
		href: '/services/care-needs-assessment',
		linkLabel: 'Care Needs Assessment',
		icon: 'compass',
	},
	{
		quote: 'My family member has just come home from hospital.',
		body: 'We help you understand the move home and what support may help.',
		href: '/services/post-discharge-nursing-assessment',
		linkLabel: 'Post-Discharge Nursing Assessment',
		icon: 'hospital',
	},
	{
		quote: 'We need nursing support at home.',
		body: 'Nurse-led care at home, within our professional scope.',
		href: '/services/home-nursing',
		linkLabel: 'Nurse-Led Home Nursing',
		icon: 'home',
	},
	{
		quote: 'I need help finding the right specialist or equipment.',
		body: 'We help you find the right people and resources.',
		href: '/connect-and-coordinate',
		linkLabel: 'Connect & Coordinate',
		icon: 'network',
	},
	{
		quote: "I'm caring for someone and need guidance.",
		body: "A nurse's guidance on care, safety and when to get more help.",
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
		body: 'We listen and work out what support may be appropriate.',
	},
	{
		key: 'connect',
		title: 'Connect',
		lead: 'Find the right people and resources.',
		body: 'We link you with the right professionals and services.',
	},
	{
		key: 'coordinate',
		title: 'Coordinate',
		lead: 'Bring the pieces together.',
		body: 'Where several kinds of support are involved, we help them fit together.',
	},
	{
		key: 'follow-up',
		title: 'Follow up',
		lead: 'Stay connected to the care journey.',
		body: 'Where appropriate, we check in on what comes next.',
	},
];

/** Reasons drawn only from the strategy document — no unverified claims. */
export const reasons = [
	{
		title: 'Nurse-led from the first conversation',
		body: 'Guided by someone who understands healthcare.',
		icon: 'stethoscope',
	},
	{
		title: "You don't need the answer first",
		body: "Start with what's going on — we'll help with the rest.",
		icon: 'ear',
	},
	{
		title: 'Clear about what we do — and don’t',
		body: 'Clear about what we provide and what we connect you to.',
		icon: 'shield',
	},
	{
		title: 'A growing network of support',
		body: 'A growing network of healthcare and support providers.',
		icon: 'network',
	},
] as const;

export const homeFaqs: Faq[] = [
	{
		question: 'How do I get a home nurse in Nairobi?',
		answer:
			"Tell us what's going on — message Ivorris on WhatsApp or use the contact form. The team will help you understand what support is appropriate. Ivorris provides nurse-led home nursing within its professional scope, and helps you connect with other support where needed.",
	},
	{
		question: 'How much does a home nurse cost in Nairobi?',
		answer:
			"It depends on the person's needs and the support involved, so there isn't a single price. Message the Ivorris team on WhatsApp and they'll explain the options for your situation.",
	},
	{
		question: 'Do you provide home-based care for elderly parents?',
		answer:
			'Ivorris helps families caring for elderly parents through nurse-led care needs assessments, home nursing and family care guidance. Where a caregiver or other support is needed, we help you find and connect with it.',
	},
	{
		question: 'Can you help after someone comes home from hospital or surgery?',
		answer:
			'Yes. Our post-discharge nursing assessment helps families understand the move home, identify nursing and care needs, and decide whether more support may help — including post-operative care at home.',
	},
	{
		question: 'Can I hire a hospital bed or wheelchair in Nairobi?',
		answer:
			'Yes. Ivorris leases medical equipment for home, including hospital beds, wheelchairs and oxygen concentrators, for short or long periods. Stock and prices are confirmed by the team.',
	},
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
