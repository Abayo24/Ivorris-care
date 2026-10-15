/**
 * Knowledge base for the free "Ask Ivorris" assistant. It runs entirely in
 * the visitor's browser: no AI service, no API key, no cost, and nothing the
 * visitor types is sent anywhere.
 *
 * Every answer uses only the Ivorris facts supplied by the owner (the
 * "Website Repositioning & Content Direction" document and verified details
 * from the previous website). To change what the assistant says, edit the
 * answers below. Page paths in answers (e.g. /services) become links.
 */
import { leaseTerms, rentToOwn } from './equipment';
import { site } from './site';

export type Topic = {
	id: string;
	/** Label shown on suggestion buttons. */
	label: string;
	/** Words or phrases that point to this topic (lower case). */
	keywords: string[];
	answer: string;
	/** Topics to suggest next. */
	next?: string[];
};

const phone = site.contact.phoneDisplay;

export const GREETING =
	"Hi, I'm the Ivorris assistant. Ask me how Ivorris works, or pick an option below — I'll help you find the right next step.";

/** Shown when no topic matches. */
export const UNKNOWN_ANSWER =
	"I'm sorry, I don't have that information. The Ivorris team can answer it — tap \"Continue on WhatsApp\" below.";

/**
 * Topics checked first, in this order, before normal matching: safety comes
 * before everything else.
 */
export const PRIORITY_TOPICS: Topic[] = [
	{
		id: 'emergency',
		label: 'Emergency',
		keywords: [
			'emergency', 'urgent', 'chest pain', 'not breathing', 'can\'t breathe', 'cant breathe', 'difficulty breathing',
			'trouble breathing', 'bleeding', 'unconscious', 'collapsed', 'collapse', 'fainted', 'stroke', 'seizure',
			'fitting', 'overdose', 'poison', 'suicide', 'suicidal', 'kill myself', 'self harm', 'self-harm', 'dying',
			'heart attack', 'ambulance',
		],
		answer:
			'If someone is seriously unwell, injured or in danger, please contact your local emergency services or go to the nearest hospital emergency department now. Ivorris is not an emergency service.',
	},
	{
		id: 'medical-advice',
		label: 'Medical advice',
		keywords: [
			'symptom', 'symptoms', 'diagnose', 'diagnosis', 'what is wrong', 'whats wrong', 'dose', 'dosage', 'how many tablets',
			'should i take', 'which medicine', 'what medicine', 'side effect', 'side effects', 'test results', 'blood results',
			'fever', 'rash', 'treatment for', 'cure',
		],
		answer:
			"I can't give medical advice, diagnose or recommend medication — a nurse or doctor needs to assess the person. If it's urgent, contact emergency services. Otherwise, the Ivorris team can talk it through with you on WhatsApp, or see /services/care-needs-assessment.",
		next: ['not-sure', 'contact'],
	},
	{
		id: 'not-in-facts',
		label: 'Prices and other details',
		keywords: [
			'price', 'prices', 'cost', 'costs', 'how much', 'fee', 'fees', 'charge', 'charges', 'paybill',
			'mpesa', 'm-pesa', 'insurance', 'nhif', 'sha', 'quote', 'opening hours', 'working hours', 'what time', 'weekend', 'sunday',
			'how long', 'how soon', 'waiting', 'available today', 'availability', 'staff', 'qualified', 'qualification',
			'qualifications', 'licensed', 'license', 'licence', 'registered', 'registration', 'certified', 'review', 'reviews',
			'discount', 'job', 'jobs', 'vacancy', 'career', 'careers', 'hiring',
		],
		answer:
			"I don't have that information here — prices, availability and details like these are confirmed by the Ivorris team. Tap \"Continue on WhatsApp\" below and they'll help.",
		next: ['about', 'contact'],
	},
];

// Ties go to the earlier topic: specific topics first, general ones last.
export const TOPICS: Topic[] = [
	{
		id: 'not-sure',
		label: "I'm not sure what help is needed",
		keywords: ['not sure', 'dont know', "don't know", 'no idea', 'confused', 'where to start', 'where do i start', 'not coping', 'struggling', 'mum', 'mom', 'mother', 'dad', 'father', 'parent', 'grandmother', 'grandfather', 'loved one', 'elderly', 'old', 'assessment', 'assess'],
		answer:
			"That's a good place to start. A Care Needs Assessment is a nurse-led home assessment that looks at the person's situation — things like mobility, daily activities, medication concerns, nutrition, safety and the caregiver situation — and helps you understand what may need to happen next. More at /services/care-needs-assessment.",
		next: ['hospital', 'family-guidance', 'contact'],
	},
	{
		id: 'hospital',
		label: 'Someone just came home from hospital',
		keywords: ['hospital', 'discharge', 'discharged', 'surgery', 'operation', 'came home', 'coming home', 'back home', 'recovering', 'recovery', 'admitted', 'illness'],
		answer:
			'Our Post-Discharge Nursing Assessment is for people returning home after hospitalisation, surgery, illness or another significant healthcare event. It helps families understand the transition home, identify nursing and care needs, and decide whether more support may help. More at /services/post-discharge-nursing-assessment.',
		next: ['home-nursing', 'equipment', 'contact'],
	},
	{
		id: 'home-nursing',
		label: 'Do you offer nursing at home?',
		keywords: ['nursing', 'nurse', 'home nursing', 'at home', 'home care', 'monitoring', 'nurse visit', 'home visit'],
		answer:
			"Yes. Nurse-Led Home Nursing is professional nursing support provided at home, within Ivorris' professional scope and competence. Depending on the person's needs, it may include nursing care, monitoring, education and support. More at /services/home-nursing.",
		next: ['family-guidance', 'connect', 'contact'],
	},
	{
		id: 'family-guidance',
		label: "I'm caring for someone at home",
		keywords: ['caring for', 'carer', 'caregiving', 'family', 'guidance', 'look after', 'looking after', 'take care of', 'support my', 'advice for family'],
		answer:
			'Family Care Guidance is for families caring for someone at home. A nurse helps you understand care needs, caregiver responsibilities, safety considerations, and when more professional support may help. More at /services/family-care-guidance.',
		next: ['connect', 'not-sure', 'contact'],
	},
	{
		id: 'connect',
		label: 'I need a specialist or another service',
		keywords: ['specialist', 'doctor', 'physio', 'physiotherapist', 'physiotherapy', 'occupational', 'therapist', 'nutrition', 'nutritionist', 'dietitian', 'diet', 'caregiver', 'caregivers', 'house help', 'diagnostic', 'lab', 'scan', 'x-ray', 'xray', 'pharmacy', 'chemist', 'connect', 'referral', 'refer'],
		answer:
			'Not every need requires a service from Ivorris directly. Where you need another professional or service, we help you find and connect with it — for example doctors and specialists, physiotherapists, occupational therapists, nutrition professionals, caregivers, medical equipment, diagnostic services and pharmacies. These are provided by others and depend on availability. More at /connect-and-coordinate.',
		next: ['equipment', 'how-it-works', 'contact'],
	},
	{
		id: 'equipment',
		label: 'Medical equipment',
		keywords: ['equipment', 'bed', 'hospital bed', 'wheelchair', 'oxygen', 'concentrator', 'walker', 'walking frame', 'crutch', 'crutches', 'cane', 'commode', 'shower chair', 'mattress', 'nebulizer', 'nebuliser', 'suction', 'cpap', 'bipap', 'monitor', 'glucometer', 'oximeter', 'thermometer', 'breast pump', 'tens', 'lease', 'leasing', 'rent', 'hire'],
		answer: `Ivorris leases medical equipment for home — hospital beds, mobility aids, oxygen equipment, monitoring devices, maternity & baby items, and rehab & physio equipment. Lease periods: ${leaseTerms.map((t) => `${t.label.toLowerCase()} (${t.period})`).join(', ')}. Equipment is delivered and set up, serviced during the lease, and collected when you're done. Stock and prices are confirmed by the team — see /equipment.`,
		next: ['rent-to-own', 'contact'],
	},
	{
		id: 'rent-to-own',
		label: 'Can I rent to own equipment?',
		keywords: ['rent to own', 'own', 'ownership', 'buy', 'purchase', 'keep the'],
		answer: `Yes, for selected mobility and recovery aids (${rentToOwn.items.join(', ').toLowerCase()}), your monthly lease payments can count towards ownership. Terms: ${rentToOwn.terms.map((t) => t.charAt(0).toLowerCase() + t.slice(1)).join('; ')}. See /equipment.`,
		next: ['equipment', 'contact'],
	},
	{
		id: 'how-it-works',
		label: 'How does Ivorris work?',
		keywords: ['how does it work', 'how it works', 'how do you work', 'process', 'steps', 'what happens', 'next step', 'how does ivorris work'],
		answer:
			'We work in four steps:\n1. Assess — we listen and understand what kind of support may be appropriate.\n2. Connect — we link you with relevant professionals, services and resources.\n3. Coordinate — where several kinds of support are involved, we help them fit together.\n4. Follow up — where appropriate, we check in on what comes next.',
		next: ['not-sure', 'contact'],
	},
	{
		id: 'contact',
		label: 'How do I contact Ivorris?',
		keywords: ['contact', 'phone', 'call', 'whatsapp', 'email', 'number', 'reach', 'talk to', 'speak to', 'get in touch', 'book', 'appointment'],
		answer: `You can WhatsApp or call ${phone}, or email ${site.contact.email}. You can also tap "Continue on WhatsApp" below, or use the form at /contact.`,
		next: ['about', 'location'],
	},
	{
		id: 'location',
		label: 'Where are you based?',
		keywords: ['where', 'located', 'location', 'address', 'nairobi', 'kenya', 'area', 'areas', 'based', 'come to', 'office'],
		answer: `Ivorris Care is based in ${site.contact.city}, ${site.contact.country}. To check whether we can help where you are, message the team on WhatsApp.`,
		next: ['contact', 'about'],
	},
	{
		id: 'emergency-service',
		label: 'Are you an emergency service?',
		keywords: ['emergency service', '24/7', '24 hours', 'night'],
		answer:
			'No — Ivorris is not an emergency service. If someone is seriously unwell, injured or in danger, contact your local emergency services or go to the nearest hospital emergency department.',
		next: ['about', 'contact'],
	},
	{
		id: 'caregiver-agency',
		label: 'Are you a caregiver agency?',
		keywords: ['agency', 'caregiver agency', 'nanny', 'domestic'],
		answer:
			'No. Ivorris is a nurse-led healthcare navigation and care coordination service. Where someone needs caregiver or home-care support, we can help you find and connect with appropriate options — see /connect-and-coordinate.',
		next: ['connect', 'home-nursing'],
	},
	{
		id: 'about',
		label: 'What does Ivorris do?',
		keywords: ['what does ivorris do', 'what is ivorris', 'who is ivorris', 'who are you', 'tell me about', 'navigation', 'coordination', 'what do you do', 'what do you offer'],
		answer:
			"Ivorris Care is a nurse-led healthcare navigation and care coordination service in Nairobi. We help individuals and families make sense of their healthcare and care needs, understand their options, and connect with the right support. You don't need to know what you need first — you can start by telling us what's going on.",
		next: ['services', 'how-it-works', 'not-sure'],
	},
	{
		id: 'services',
		label: 'Which services do you provide?',
		keywords: ['which services', 'what services', 'list of services', 'provide directly', 'nurse-led', 'nurse led', 'offerings'],
		answer:
			'Ivorris provides four nurse-led services directly:\n• Care Needs Assessment — /services/care-needs-assessment\n• Post-Discharge Nursing Assessment — /services/post-discharge-nursing-assessment\n• Nurse-Led Home Nursing — /services/home-nursing\n• Family Care Guidance — /services/family-care-guidance\nWhere you need someone else, we help you connect with them — see /connect-and-coordinate.',
		next: ['not-sure', 'connect', 'equipment'],
	},
	{
		id: 'hello',
		label: 'Hello',
		keywords: ['hi', 'hello', 'hey', 'habari', 'jambo', 'mambo', 'good morning', 'good afternoon', 'good evening'],
		answer: "Hello! Tell me what's going on, or choose one of the options below.",
		next: ['about', 'not-sure', 'hospital'],
	},
	{
		id: 'thanks',
		label: 'Thanks',
		keywords: ['thanks', 'thank you', 'asante', 'great', 'ok', 'okay'],
		answer: "You're welcome. When you're ready, the Ivorris team is a message away on WhatsApp.",
		next: ['contact'],
	},
];

export const STARTER_TOPICS = ['about', 'not-sure', 'hospital', 'equipment'];

const ALL = [...PRIORITY_TOPICS, ...TOPICS];
export const topicById = (id: string) => ALL.find((t) => t.id === id);

function normalise(text: string) {
	return ` ${text
		.toLowerCase()
		.replace(/[’']/g, "'")
		.replace(/[^a-z0-9'/+\- ]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()} `;
}

function score(text: string, topic: Topic) {
	let total = 0;
	for (const k of topic.keywords) {
		// Whole-word / whole-phrase match; longer phrases count for more.
		if (text.includes(` ${k} `)) total += k.includes(' ') ? 3 : 1;
	}
	return total;
}

/** Finds the answer for a visitor's message, using only the topics above. */
export function answerFor(message: string): Topic | null {
	const text = normalise(message);
	for (const topic of PRIORITY_TOPICS) if (score(text, topic) > 0) return topic;
	let best: Topic | null = null;
	let bestScore = 0;
	for (const topic of TOPICS) {
		const s = score(text, topic);
		if (s > bestScore) {
			best = topic;
			bestScore = s;
		}
	}
	return best;
}
