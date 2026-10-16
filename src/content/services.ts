/**
 * Nurse-led services provided DIRECTLY by Ivorris.
 * Source: "Website Repositioning & Content Direction", section 4.
 *
 * Wording stays within professional scope: no specific procedures, timings or
 * prices are promised. Review with the clinical lead before adding detail.
 */

import { photos } from './photos';

export type Faq = { question: string; answer: string };

export type Service = {
	slug: string;
	name: string;
	/** Short line for cards and menus. */
	summary: string;
	/** "Who it's for" sentence used as the card lead and page intro. */
	forSituation: string;
	/** Relatable quote from the visitor's point of view. */
	situationQuote: string;
	headline: string;
	intro: string;
	/** Plain-language definition, written to answer "What is …?" directly. */
	definition: { question: string; answer: string };
	whoFor: string[];
	involvesIntro: string;
	involves: string[];
	expect: { title: string; body: string }[];
	faqs: Faq[];
	/** Blog category slug used to surface related articles from the CMS. */
	relatedCategory: string;
	image: { src: string; alt: string };
	seo: { title: string; description: string };
};

const generalFaqs: Faq[] = [
	{
		question: 'What if I am not sure this is the right service?',
		answer:
			"That's completely fine. You don't need to know what you need before you contact us. Tell us what's going on and we'll help you work out what kind of support may be appropriate — even if it turns out to be something other than this service.",
	},
	{
		question: 'Is Ivorris an emergency service?',
		answer:
			'No. If someone is seriously unwell, injured or in danger, contact your local emergency services or go to the nearest hospital emergency department straight away.',
	},
];

export const services: Service[] = [
	{
		slug: 'care-needs-assessment',
		name: 'Care Needs Assessment',
		summary: 'A nurse-led look at the whole situation, so you can see what support may help.',
		forSituation: "For when someone isn't sure what kind of support they need.",
		situationQuote: "Mum isn't coping well at home. We don't know what she needs.",
		headline: 'Understand what support may help — before deciding on anything.',
		intro:
			"When someone you care about isn't coping as well as they used to, it can be hard to know what kind of help is right. A Care Needs Assessment gives you a clearer picture of the situation, so the next step is based on understanding rather than guesswork.",
		definition: {
			question: 'What is a care needs assessment?',
			answer:
				"A care needs assessment is a structured conversation and review, led by a nurse, that looks at a person's current situation at home and helps identify what type of support may be appropriate. The outcome is not simply an assessment — it is helping the individual or family understand what may need to happen next.",
		},
		whoFor: [
			"Families who have noticed a loved one finding everyday life harder, but don't know what kind of help is needed.",
			'Individuals who want an objective view of their own care needs.',
			'Anyone weighing up options such as home nursing, caregiver support or further professional review.',
		],
		involvesIntro:
			"Depending on the person's needs, and within professional scope, the assessment may consider:",
		involves: [
			'Functional status and mobility',
			'Basic activities of daily living',
			'Medication-related concerns',
			'Nutrition and hydration',
			'Skin or wound concerns',
			'Symptoms and vital signs, where appropriate',
			'The caregiver situation and home-care needs',
			'Safety and risk concerns at home',
			'Whether further professional review may be appropriate',
		],
		expect: [
			{
				title: 'A first conversation',
				body: "You tell us what's going on. We listen and ask questions to understand the situation.",
			},
			{
				title: 'A nurse-led assessment',
				body: "A nurse looks at the person's situation, usually at home, within professional scope.",
			},
			{
				title: 'A clear explanation',
				body: 'We talk you through what we found and what kind of support may be appropriate.',
			},
			{
				title: 'Your next step',
				body: 'If further support is needed — from Ivorris or someone else — we help you understand how to get it.',
			},
		],
		faqs: [
			{
				question: 'Does the person being assessed need to be present?',
				answer:
					"Usually, yes — the assessment looks at the person's own situation. Family members are welcome to be involved, and we'll talk with you about what works best when you first get in touch.",
			},
			{
				question: 'Will I get a diagnosis?',
				answer:
					"No. A care needs assessment isn't a medical diagnosis. It helps clarify care needs and whether further professional review — for example by a doctor — may be appropriate.",
			},
			...generalFaqs,
		],
		relatedCategory: 'understanding-care-needs',
		image: photos.careNeedsAssessment,
		seo: {
			title: 'Elderly Care Needs Assessment at Home, Nairobi',
			description:
				'Not sure what care an elderly parent or loved one needs? A nurse-led home assessment in Nairobi helps you understand their needs and the right next step.',
		},
	},
	{
		slug: 'post-discharge-nursing-assessment',
		name: 'Post-Discharge Nursing Assessment',
		summary: 'Support for the move home after a hospital stay, surgery or illness.',
		forSituation:
			'For people returning home after hospitalisation, surgery, illness or another significant healthcare event.',
		situationQuote: 'My loved one has just come home from hospital.',
		headline: 'Coming home from hospital — and knowing what comes next.',
		intro:
			'The days after leaving hospital can raise a lot of questions. A Post-Discharge Nursing Assessment helps you understand the transition home, identify nursing and care needs, and work out whether additional support may be appropriate.',
		definition: {
			question: 'What is a post-discharge nursing assessment?',
			answer:
				"A post-discharge nursing assessment is a nurse-led review of a person's situation after they return home from hospital, surgery or a significant illness. It helps families understand the transition home, identify nursing and care needs, and decide whether additional professional support or resources may be appropriate.",
		},
		whoFor: [
			'People who have recently been discharged from hospital.',
			'People recovering at home after surgery or a significant illness.',
			'Families who want to feel more confident about the first days and weeks at home.',
		],
		involvesIntro:
			"Within professional scope and depending on the person's situation, the assessment may look at:",
		involves: [
			'How the person is managing since coming home',
			'Nursing and care needs during recovery',
			'Mobility and safety around the home',
			'Medication-related concerns',
			'What family members are able to support with',
			'Whether further professional support or resources may be appropriate',
		],
		expect: [
			{
				title: 'Tell us about the discharge',
				body: 'Share what happened and any discharge information you are comfortable discussing.',
			},
			{
				title: 'A nurse-led review at home',
				body: "A nurse looks at the person's needs in their own environment.",
			},
			{
				title: 'Understanding the transition',
				body: 'We explain what we found and what may help over the coming days and weeks.',
			},
			{
				title: 'Connecting further support',
				body: 'Where more is needed, we help you find and coordinate it — and follow up where appropriate.',
			},
		],
		faqs: [
			{
				question: 'Does this replace the follow-up arranged by the hospital?',
				answer:
					"No. Always follow the advice and appointments given by the hospital and the person's doctor. This assessment helps you understand care needs at home alongside that advice.",
			},
			{
				question: 'When should we get in touch?',
				answer:
					"Whenever you have questions about the move home — before discharge, on the day, or once you're settled and realise you need more support.",
			},
			...generalFaqs,
		],
		relatedCategory: 'hospital-discharge-and-recovery',
		image: photos.postDischarge,
		seo: {
			title: 'Home Care After Hospital Discharge, Nairobi',
			description:
				'Coming home after hospital or surgery? A nurse-led post-discharge assessment helps families in Nairobi plan post-operative care at home and the right support.',
		},
	},
	{
		slug: 'home-nursing',
		name: 'Nurse-Led Home Nursing',
		summary: 'Professional nursing support provided at home, within our professional scope.',
		forSituation: 'For people who need professional nursing care in the comfort of home.',
		situationQuote: 'We need nursing support at home.',
		headline: 'Professional nursing support, at home.',
		intro:
			"Some people are best supported at home, in familiar surroundings. Ivorris provides nurse-led home nursing within our professional scope, competence and applicable requirements — shaped around the individual's needs.",
		definition: {
			question: 'What is nurse-led home nursing?',
			answer:
				"Nurse-led home nursing is professional nursing support delivered in a person's own home. Depending on the individual's needs, it may include appropriate nursing care, monitoring, education and support — provided within the nurse's professional scope and competence.",
		},
		whoFor: [
			'People living with ongoing health needs who would benefit from nursing support at home.',
			'People recovering at home who need professional nursing input.',
			'Families who want a nurse involved in their loved one’s care.',
		],
		involvesIntro: "Depending on the individual's needs, home nursing may include:",
		involves: [
			'Appropriate nursing care',
			'Monitoring',
			'Education for the individual and family',
			'Support and guidance between visits, where arranged',
		],
		expect: [
			{
				title: 'Talk to us first',
				body: "We start by understanding the person's situation and what they need.",
			},
			{
				title: 'Agree what is appropriate',
				body: 'We explain what nursing support we can provide within scope — and what may need someone else.',
			},
			{
				title: 'Nursing care at home',
				body: 'A nurse provides the agreed support in the home.',
			},
			{
				title: 'Review and follow up',
				body: 'Where appropriate, we check how things are going and whether needs have changed.',
			},
		],
		faqs: [
			{
				question: 'Which nursing procedures can you provide at home?',
				answer:
					"It depends on the person's needs and what is appropriate within our professional scope and competence. Tell us about the situation and we'll be clear about what we can provide — and help connect you with other professionals for anything outside our scope.",
			},
			{
				question: 'Do you also provide caregivers?',
				answer:
					'Ivorris is nurse-led. Where someone needs caregiver or home-care support, we can help you find and connect with appropriate options through Connect & Coordinate.',
			},
			...generalFaqs,
		],
		relatedCategory: 'home-nursing',
		image: photos.homeNursing,
		seo: {
			title: 'Home Nursing & Home-Based Care in Nairobi',
			description:
				'Nurse-led home nursing in Nairobi: professional nursing care, monitoring and education at home, within our professional scope. Talk to a nurse on WhatsApp.',
		},
	},
	{
		slug: 'family-care-guidance',
		name: 'Family Care Guidance',
		summary: 'Professional guidance for families caring for someone at home.',
		forSituation:
			'For families caring for someone at home who want professional guidance around their care situation.',
		situationQuote: "I'm caring for someone and need guidance.",
		headline: "You're doing your best. Let's make it a little clearer.",
		intro:
			"Caring for someone at home often means learning as you go. Family Care Guidance gives you a nurse's perspective on the care situation — what the person needs, what you can safely manage, and when more professional support might help.",
		definition: {
			question: 'What is family care guidance?',
			answer:
				'Family care guidance is professional, nurse-led support for families caring for someone at home. It helps families understand care needs, caregiver responsibilities and safety considerations, and recognise when additional professional support may be appropriate.',
		},
		whoFor: [
			'Family members who have become the main carer for a loved one.',
			'Families sharing care between several people who want a clear, common understanding.',
			'Carers who are feeling stretched and want to know what support exists.',
		],
		involvesIntro: 'Guidance may include helping your family understand:',
		involves: [
			"The person's care needs",
			'Caregiver responsibilities and what is realistic',
			'Safety considerations at home',
			'When additional professional support may be appropriate',
			'Where to find further resources',
		],
		expect: [
			{
				title: 'Share your situation',
				body: "Tell us who you're caring for and what feels difficult right now.",
			},
			{
				title: 'Nurse-led guidance',
				body: 'We help you understand the care situation and what may help.',
			},
			{
				title: 'Practical next steps',
				body: 'You leave with a clearer sense of what to do next and why.',
			},
			{
				title: 'Ongoing support, if needed',
				body: 'Where appropriate, we stay in touch and help connect further support.',
			},
		],
		faqs: [
			{
				question: 'Can several family members be involved?',
				answer:
					"Yes. It often helps when everyone involved in the care shares the same understanding. Let us know who you'd like to include when you get in touch.",
			},
			{
				question: 'Is this only for older relatives?',
				answer:
					'No. Family Care Guidance is for anyone caring for someone at home, whatever the reason for their care needs.',
			},
			...generalFaqs,
		],
		relatedCategory: 'family-caregiving',
		image: photos.familyGuidance,
		seo: {
			title: 'Guidance for Family Caregivers in Nairobi',
			description:
				'Caring for an elderly or bedridden loved one at home? Nurse-led guidance on care needs, safety and when to get more help, for families in Nairobi.',
		},
	},
];

export function getService(slug: string) {
	return services.find((s) => s.slug === slug);
}
